// ===============================
// 1. 상단 이미지 슬라이더 (PC/모바일 완전 분리)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const sliderTrack = document.querySelector(".slider-track");
  const items = sliderTrack ? Array.from(sliderTrack.querySelectorAll(".image-item")) : [];

  if (!sliderTrack || items.length === 0) return;

  // 화면 크기 체크 (최초 + 리사이즈)
  const isMobile = () => window.innerWidth <= 768;

  // --------------------------------------
  //  PC MODE (물 흐르듯이 계속 흐르는 방식)
  // --------------------------------------
  const startPcFlow = () => {
    if (sliderTrack.dataset.mode === "pc") return; // 중복 실행 방지
    sliderTrack.dataset.mode = "pc";

    sliderTrack.style.transition = "none"; // PC는 transition 안 씀

    // 모바일 슬라이드 setInterval이 있었다면 정지
    if (window.mobileTimer) {
      clearInterval(window.mobileTimer);
      window.mobileTimer = null;
    }

    // 복제 1번만
    if (!sliderTrack.dataset.cloned) {
      items.forEach((el) => sliderTrack.appendChild(el.cloneNode(true)));
      sliderTrack.dataset.cloned = "1";
    }

    const gap = (() => {
      const styles = window.getComputedStyle(sliderTrack);
      return parseFloat(styles.columnGap || styles.gap || "0");
    })();

    const getTotalWidth = () =>
      items.reduce((sum, el) => sum + el.getBoundingClientRect().width + gap, 0);

    let totalWidth = getTotalWidth();
    let pos = 0;
    let last = null;
    const speed = 40; // PC 흐르는 속도(px/sec)

    const pcLoop = (ts) => {
      if (isMobile()) return; // 모바일로 전환되면 즉시 정지

      if (!last) last = ts;
      const dt = ts - last;
      last = ts;

      pos -= (speed * dt) / 1000;

      if (-pos >= totalWidth) pos += totalWidth;

      sliderTrack.style.transform = `translateX(${pos}px)`;
      window.pcRaf = requestAnimationFrame(pcLoop);
    };

    window.pcRaf = requestAnimationFrame(pcLoop);

    window.addEventListener("resize", () => {
      if (!isMobile()) {
        totalWidth = getTotalWidth();
      }
    });
  };

  // --------------------------------------
  //  MOBILE MODE (1장씩 슬라이드)
  // --------------------------------------
  const startMobileSlide = () => {
    if (sliderTrack.dataset.mode === "mobile") return; // 중복 실행 방지
    sliderTrack.dataset.mode = "mobile";

    // PC rAF 실행 중이면 종료
    if (window.pcRaf) {
      cancelAnimationFrame(window.pcRaf);
      window.pcRaf = null;
    }

    sliderTrack.style.transition = "transform 300ms ease-in-out";

    const mobileItems = Array.from(sliderTrack.querySelectorAll(".image-item"));
    let index = 0;

    const calcWidth = () => {
      const first = sliderTrack.querySelector(".image-item");
      if (!first) return 0;

      const gap = parseFloat(getComputedStyle(sliderTrack).gap || 0);
      return first.getBoundingClientRect().width + gap;
    };

    let slideWidth = calcWidth();

    const go = () => {
      slideWidth = calcWidth();
      index++;
      sliderTrack.style.transition = "transform 300ms ease-in-out";
      sliderTrack.style.transform = `translateX(-${index * slideWidth}px)`;

      if (index >= mobileItems.length) {
        setTimeout(() => {
          sliderTrack.style.transition = "none";
          index = 0;
          sliderTrack.style.transform = `translateX(0px)`;
        }, 300);
      }
    };

    if (window.mobileTimer) clearInterval(window.mobileTimer);
    window.mobileTimer = setInterval(go, 1600);

    window.addEventListener("resize", () => {
      if (isMobile()) {
        slideWidth = calcWidth();
      }
    });
  };

  // --------------------------------------
  // 초기 실행 + 리사이즈 대응
  // --------------------------------------
  const initMode = () => {
    if (isMobile()) startMobileSlide();
    else startPcFlow();
  };

  initMode();

  window.addEventListener("resize", () => {
    const mobile = isMobile();
    if (mobile && sliderTrack.dataset.mode !== "mobile") {
      startMobileSlide();
    }
    if (!mobile && sliderTrack.dataset.mode !== "pc") {
      startPcFlow();
    }
  });
});


// ===============================
// 2. 실적 카드: Intersection Observer로 페이드 인
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const performanceContents = document.querySelectorAll(".performance-content");
  if (!performanceContents.length) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 0.1}s`;
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  performanceContents.forEach((el) => observer.observe(el));
});


// ===============================
// 3. 실적 카드: 휠로 가로 스크롤 (PC용)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".perfomance-vertical");
  if (!wrap) return;

  wrap.addEventListener(
    "wheel",
    (e) => {
      const maxScroll = wrap.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        wrap.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false }
  );
});
