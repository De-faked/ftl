from pathlib import Path
import re, sys

roots = [Path("src"), Path("components"), Path("App.tsx")]

files = []
for r in roots:
    if r.is_file() and r.suffix in [".ts", ".tsx"]:
        files.append(r)
    elif r.is_dir():
        files += [p for p in r.rglob("*") if p.suffix in [".ts", ".tsx"]]

# Only catch likely user-facing text (not types, not internal constants)
TEXT_NODE = re.compile(r">([^<>{}]*[\u0600-\u06FFA-Za-z][^<>{}]*)<")
ATTR = re.compile(r"""\b(placeholder|aria-label|title|alt)\s*=\s*["']([^"']*[\u0600-\u06FFA-Za-z][^"']*)["']""")

ignore_paths = [
    "utils/translations.ts",
    "docs/",
    "scripts/",
]
ignore_line_contains = [
    "className=",
    "import ",
    "from '",
    'from "',
    "Promise",
    "setAuthMode(",
]

hits = []
for f in files:
    rel = str(f)
    if any(rel.startswith(p) or (p in rel) for p in ignore_paths):
        continue
    lines = f.read_text(encoding="utf-8", errors="ignore").splitlines()
    for i, line in enumerate(lines, start=1):
        if any(tok in line for tok in ignore_line_contains):
            continue

        # JSX text between tags (real UI)
        for m in TEXT_NODE.finditer(line):
            s = " ".join(m.group(1).split())
            # ignore obvious code fragments
            if any(x in s for x in ["&&", "=>", "React.", "ChangeEvent", "Function", "{", "}", "0 &&"]):
                continue
            if len(s) >= 3:
                hits.append((rel, i, "TEXT", s))

        # Common UI attributes
        for m in ATTR.finditer(line):
            s = " ".join(m.group(2).split())
            if len(s) >= 3:
                hits.append((rel, i, m.group(1), s))

out = Path("docs/i18n/ui-strings-audit.md")
out.write_text(
    "# UI Strings Audit (must be 0 findings)\n\n"
    + "\n".join([f"- `{p}:{ln}` **{k}** → {s}" for (p, ln, k, s) in hits])
    + ("\n" if hits else "\n\n✅ No findings.\n"),
    encoding="utf-8",
)

print(f"Wrote {out} (findings: {len(hits)})")
sys.exit(1 if hits else 0)
