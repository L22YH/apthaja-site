import os
from datetime import datetime, timezone

BASE_URL = "https://l22yh.github.io/apthaja-site"
ROOT_DIR = "."

EXCLUDE_DIRS = {".git", ".github", "node_modules", "assets"}
EXCLUDE_FILES = {"404.html"}


def iter_html_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")]
        for filename in filenames:
            if filename.endswith(".html") and filename not in EXCLUDE_FILES:
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root).replace(os.sep, "/")
                yield rel_path


def make_url(rel_path: str) -> str:
    if rel_path == "index.html":
        return BASE_URL + "/"
    if rel_path.endswith("/index.html"):
        return BASE_URL + "/" + rel_path[:-10]
    return f"{BASE_URL}/{rel_path}"


def get_lastmod(path: str) -> str:
    ts = os.path.getmtime(path)
    dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S%z")


def main():
    entries = []
    for rel_path in iter_html_files(ROOT_DIR):
        full_path = os.path.join(ROOT_DIR, rel_path)
        entries.append((make_url(rel_path), get_lastmod(full_path)))

    entries.sort(key=lambda x: x[0])

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    for url, lastmod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{url}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("    <changefreq>weekly</changefreq>")
        lines.append("    <priority>0.8</priority>")
        lines.append("  </url>")

    lines.append("</urlset>")

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("sitemap.xml updated!")


if __name__ == "__main__":
    main()
