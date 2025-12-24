// responsive_nav.js
// 공통 네비게이션(PC + 모바일) 동작

function initResponsiveNav() {
  // nav.html 안의 <nav> 찾기
  const nav =
    document.querySelector(".site-nav") ||
    document.getElementById("siteNav");

  if (!nav) return;

  // 중복 초기화 방지
  if (nav.dataset.inited === "1") return;
  nav.dataset.inited = "1";

  const toggleBtn = nav.querySelector(".nav-toggle");
  const overlay = nav.querySelector(".nav-overlay");
  const parents = nav.querySelectorAll(".nav-has-children");
  const links = nav.querySelectorAll(".nav-menu a.nav-link");

  const isOpen = () => nav.classList.contains("is-open");

  const openNav = () => {
    nav.classList.add("is-open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    if (overlay) overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    if (overlay) overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    parents.forEach((p) => p.classList.remove("is-open"));
  };

  // 햄버거 토글
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (isOpen()) closeNav();
      else openNav();
    });
  }

  // 오버레이 클릭 시 닫기
  if (overlay) {
    overlay.addEventListener("click", closeNav);
  }

  // 모바일 드롭다운(부모 메뉴) 토글
  parents.forEach((li) => {
    const btn = li.querySelector(".nav-parent");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      // 모바일에서만 아코디언
      if (!window.matchMedia("(max-width: 1023px)").matches) return;
      e.preventDefault();

      const alreadyOpen = li.classList.contains("is-open");
      parents.forEach((p) => p.classList.remove("is-open"));
      if (!alreadyOpen) li.classList.add("is-open");
    });
  });

  // 링크 클릭 시 모바일 메뉴 닫기
  links.forEach((a) => {
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1023px)").matches && isOpen()) {
        closeNav();
      }
    });
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      closeNav();
    }
  });

  // 화면이 넓어지면 강제로 닫기
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", () => {
    if (mq.matches && isOpen()) closeNav();
  });

  // 현재 페이지 하이라이트
  const current = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const file = href.split("#")[0];
    if (file && current === file) {
      a.classList.add("is-active");
    }
  });
}

// partials 로드 이후
document.addEventListener("partials:loaded", initResponsiveNav);
// 혹시 이미 nav가 있을 수도 있으니 한 번 더
document.addEventListener("DOMContentLoaded", initResponsiveNav);
