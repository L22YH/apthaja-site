// nav, footer를 각 html파일에 넣고 페이지마다 가져오는 방식을 위한 js코드
// nav, footer를 가져오기 위해서는 해당 html 페이지에 아래 코드를 넣어야함.

/* =========================
<script src="layout.js"></script>   // script중 제일 위에 둬야함.
   ========================= */

   

async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  el.innerHTML = await res.text();
}

(async () => {
  try {
    await loadPartial("#site-nav", "./nav.html");
    await loadPartial("#site-footer", "./footer.html");

    // ✅ nav/footer 삽입 완료 알림 (responsive_nav.js가 이걸 듣고 초기화)
    document.dispatchEvent(new Event("partials:loaded"));
  } catch (e) {
    console.error("[layout.js] nav/footer 로드 실패:", e);
  }
})();
