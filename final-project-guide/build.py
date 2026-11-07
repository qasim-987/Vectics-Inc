#!/usr/bin/env python3
"""
Assembles the final guide from parts/*.md.

Any line containing only  {{path/to/file}}  is replaced with a fenced code block
holding the real, tested file from the reference project. This keeps the guide and
the code that was actually built/tested from drifting apart.

Usage:  python3 build.py --source /path/to/reference-project
"""
import argparse
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).parent
PARTS = HERE / "parts"

LANG = {
    ".js": "js",
    ".jsx": "jsx",
    ".css": "css",
    ".json": "json",
    ".html": "html",
    ".md": "md",
    ".yml": "yaml",
    ".txt": "",
}


def render(text: str, source: pathlib.Path) -> str:
    pattern = re.compile(r"^\{\{([^}]+)\}\}$", re.MULTILINE)

    def replace(match):
        rel = match.group(1).strip()
        path = source / rel
        if not path.exists():
            sys.exit(f"missing source file: {path}")
        body = path.read_text().rstrip("\n")
        lang = LANG.get(path.suffix, "")
        return f"```{lang}\n{body}\n```"

    return pattern.sub(replace, text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    args = parser.parse_args()
    source = pathlib.Path(args.source).resolve()

    chunks = []
    for part in sorted(PARTS.glob("*.md")):
        chunks.append(render(part.read_text(), source))

    out = HERE / "Final-Project-Guide.md"
    out.write_text("\n\n".join(chunks))
    words = len(re.findall(r"\w+", out.read_text()))
    print(f"wrote {out} ({len(out.read_text().splitlines())} lines, ~{words} words)")


if __name__ == "__main__":
    main()
