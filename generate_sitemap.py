import os
from datetime import datetime, timezone

# ===== 설정 부분 =====
# 깃허브 페이지에서 실제로 접속하는 기본 주소
BASE_URL = "https://l22yh.github.io/apthaja-site"

# HTML 파일들을 찾을 시작 위치 (보통 리포지토리 루트)
ROOT_DIR = "."

# sitemap에서 제외할 폴더들 (원하면 수정 가능)
EXCLUDE_DIRS = {
    ".git",
    ".github",
    "node_modules",
    "assets",
    "img",
    "images",
    "static",
}

# sitemap에서 제외할 파일들
EXCLUDE_FILES = {
    "404.html",
}


def iter_html_files(root: str):
    """ROOT_DIR 아래의 html 파일들을 재귀적으로 찾아서 상대경로로 yield"""
    for dirpath, dirnames, filenames in os.walk(root):
        # 제외할 폴더 제거
        dirnames[:] = [
            d for d in dirnames
            if d not in EXCLUDE_DIRS and not d.startswith(".")
        ]

        for filename in filenames:
            if not filename.endswith(".html"):
                continue
            if filename in EXCLUDE_FILES:
                continue

            full_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(full_path, root)
            rel_path = rel_path.replace(os.sep, "/")
            yield rel_path


def make_url(rel_path: str) -> str:
    """index.html 처리 포함해서 실제 접속 가능한 URL 생성"""
    # 루트 index.html → BASE_URL/
    if rel_path == "index.html":
        return BASE_URL + "/"

    # 폴더/index.html → BASE_URL/폴더/
    if rel_path.endswith("/index.html"):
        return BASE_URL + "/" + rel_path[: -len("index.html")]

    # 그 외 → BASE_URL/상대경로
    return f"{BASE_URL}/{rel_path}"


def get_lastmod(path: str) -> str:
    """파일 수정시간을 ISO8601 형식 문자열로 반환"""
    ts = os.path.getmtime(path)
    dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    # 예: 2025-12-24T10:23:45+0000
    return dt.strftime("%Y-%m-%dT%H:%M:%S%z")


def main():
    entries = []

    for rel_path in iter_html_files(ROOT_DIR):
        full_path = os.path.join(ROOT_DIR, rel_path)
        url = make_url(rel_path)
        lastmod = get_lastmod(full_path)
        entries.append((url, lastmod))

    # URL 기준으로 정렬 (보기 좋게)
    entries.sort(key=lambda x: x[0])

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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

    print(f"sitemap.xml 생성 완료! 총 {len(entries)}개 URL")


if __name__ == "__main__":
    main()
