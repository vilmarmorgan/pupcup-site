"""Block a commit that would put a secret into a CODE repo.

CANONICAL COPY. This file is the source; `tools/scan-secrets.py` in each code
repo is a copy of it, installed by 99-Meta/install-hooks.sh. If this changes,
re-run that script so the copies change with it. Two copies that drift is how
the steps rule went wrong in November, and the fix there was the same: name
which one is canonical and update both together.

SIBLING OF, NOT THE SAME AS, 99-Meta/scan-secrets.py. That one guards the
vault, where no email address, phone number or street address may appear at
all. A code repo is different: playpupcup.com has a contact address on it by
design, and a scanner that blocks the site's own footer is a scanner that
gets bypassed within a week and then ignored forever. So the credential
patterns are kept and widened, and the PII shapes that are legitimate in
public web copy are dropped. What is kept from that side is the small set
nothing in a repo ever has a reason to hold: card numbers, routing numbers
and an EIN.

STAGED CONTENT, NOT THE WORKING TREE. The vault scanner walks the whole
directory because the vault IS its content. A code repo has build output,
caches and ignored files that are not going anywhere, and walking them makes
the scan slow enough to skip. What matters is what is about to enter history,
so that is what this reads.

Exit 0 clean, 1 hits, 2 could not read git. Code 2 is deliberate and is
inherited from histscan.py, which once printed CLEAN for a repo it had failed
to read. A check that cannot fail is worse than no check.
"""
import re, subprocess, sys

def git(*a):
    return subprocess.run(["git"] + list(a), capture_output=True,
                          text=True, errors="replace")

PATTERNS = [
 # ---- credentials. A hit here is a stop-everything. -----------------------
 ("private key block", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
 ("AWS access key",    re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
 ("GitHub token",      re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b")),
 ("GitHub fine PAT",   re.compile(r"\bgithub_pat_[A-Za-z0-9_]{50,}\b")),
 ("OpenAI-style key",  re.compile(r"\bsk-[A-Za-z0-9]{32,}\b")),
 ("OpenAI project key",re.compile(r"\bsk-proj-[A-Za-z0-9_-]{32,}")),
 ("Anthropic key",     re.compile(r"\bsk-ant-[A-Za-z0-9_-]{32,}")),
 ("Google API key",    re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
 ("Slack token",       re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b")),
 ("Stripe key",        re.compile(r"\b[sr]k_(?:live|test)_[A-Za-z0-9]{20,}\b")),
 ("Resend key",        re.compile(r"\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{20,}\b")),
 ("Twilio SID",        re.compile(r"\bAC[0-9a-fA-F]{32}\b")),
 ("Sendgrid key",      re.compile(r"\bSG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}")),
 ("JWT",               re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}")),

 # ---- Supabase. The publishable key is MEANT to ship; the other two are
 # the whole ballgame. sb_secret_ bypasses RLS, and so does a key whose JWT
 # role claim reads service_role. Neither has any business in a repo.
 ("Supabase secret key", re.compile(r"\bsb_secret_[A-Za-z0-9_-]{10,}")),
 ("service_role as a value",
  re.compile(r"(?i)[\"']?service_role[\"']?\s*[:=]\s*[\"'][^\"']{8,}[\"']")),

 # ---- the shape that caused the post Vilmar sent on 20 Nov 2026. Anything
 # on a frontend-exposed prefix is compiled INTO the bundle by design, so a
 # secret-sounding name on one is a key published on purpose.
 ("frontend-exposed secret",
  re.compile(r"\b(?:VITE_|NEXT_PUBLIC_|REACT_APP_|EXPO_PUBLIC_|PUBLIC_)[A-Z0-9_]*"
             r"(?:SECRET|PRIVATE|SERVICE_ROLE|PASSWORD)[A-Z0-9_]*")),

 # ---- an assignment that looks like a credential. Deliberately requires a
 # value with some entropy, so `const apiKey = process.env.API_KEY` and
 # `password: ""` both pass and only a literal is caught.
 ("assigned secret",
  re.compile(r"(?i)\b(?:api[_-]?key|secret|passwd|password|auth[_-]?token|"
             r"access[_-]?token|client[_-]?secret|private[_-]?key)\s*[:=]\s*"
             r"[\"'][A-Za-z0-9/_+=-]{16,}[\"']")),

 # ---- kept from the vault scanner because no repo ever needs these. ------
 ("card number",   re.compile(r"\b(?:4\d{3}|5[1-5]\d{2}|3[47]\d{2}|6011)[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b")),
 ("routing/acct",  re.compile(r"(?i)\b(?:routing|account)\s*(?:number|no\.?|#)\s*[:=]?\s*\d{9,17}\b")),
 ("EIN",           re.compile(r"(?i)\bEIN\b[^\n]{0,20}\b\d{2}-\d{7}\b")),
]

# A line this scanner itself wrote, or a line that is visibly teaching the
# shape rather than carrying one. There is no file allowlist on purpose: the
# moment a path can be excused, the excuse becomes the hiding place.
TEACHING = re.compile(r"re\.compile\(|EXAMPLE_ONLY|<REDACTED|xxxxxxxx|"
                      r"your[_-]?key[_-]?here|YOUR_[A-Z_]+_HERE")

def staged_files():
    r = git("diff", "--cached", "--name-only", "--diff-filter=ACMR")
    if r.returncode != 0:
        print("scan-secrets: could not list staged files:", r.stderr.strip())
        sys.exit(2)
    return [f for f in r.stdout.split("\n") if f.strip()]

def main():
    if git("rev-parse", "--git-dir").returncode != 0:
        print("scan-secrets: not a git repository"); sys.exit(2)
    files = staged_files()
    if not files:
        print("CLEAN — nothing staged."); return 0
    hits, read = [], 0
    for f in files:
        blob = git("show", ":" + f)
        if blob.returncode != 0:
            continue                      # deleted, or a submodule pointer
        read += 1
        for ln, line in enumerate(blob.stdout.split("\n"), 1):
            if len(line) > 4000 or TEACHING.search(line):
                continue
            for name, rx in PATTERNS:
                m = rx.search(line)
                if m:
                    s, e = m.span()
                    shown = line[:s] + "<<REDACTED %d chars>>" % (e - s) + line[e:]
                    hits.append((f, ln, name, shown.strip()[:160]))
    if hits:
        print("\n  *** %d POSSIBLE SECRET(S) IN THE STAGED CHANGE ***\n" % len(hits))
        for f, ln, name, shown in hits:
            print("    %s" % name)
            print("      %s:%s" % (f, ln))
            print("      %s\n" % shown)
        return 1
    print("CLEAN — %d staged file(s) read, none matched." % read)
    return 0

if __name__ == "__main__":
    sys.exit(main())
