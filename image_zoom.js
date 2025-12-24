// image_zoom.js
document.addEventListener("DOMContentLoaded", () => {
  // 확대 대상 이미지들
  const zoomables = document.querySelectorAll(".zoomable-img");
  if (!zoomables.length) return; // 이 페이지에 확대 이미지 없으면 종료

  // 모달 요소를 동적으로 생성
  const overlay = document.createElement("div");
  overlay.className = "img-modal-overlay";
  overlay.innerHTML = `
    <div class="img-modal-content">
      <button class="img-modal-close" aria-label="이미지 닫기">&times;</button>
      <img src="" alt="확대 이미지" />
    </div>
  `;
  document.body.appendChild(overlay);

  const modalImg = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".img-modal-close");

  // 모달 열기
  const openModal = (src, alt) => {
    modalImg.src = src;
    modalImg.alt = alt || "확대 이미지";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden"; // 배경 스크롤 방지
  };

  // 모달 닫기
  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = ""; // 원래대로
  };

  // 이미지 클릭 이벤트 연결
  zoomables.forEach((img) => {
    img.style.cursor = "zoom-in"; // 마우스에 확대 느낌
    img.addEventListener("click", () => {
      const src = img.getAttribute("data-full") || img.src;
      const alt = img.alt || "";
      openModal(src, alt);
    });
  });

  // 닫기 버튼
  closeBtn.addEventListener("click", closeModal);

  // 오버레이 바깥 영역 클릭해도 닫히게
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal();
    }
  });
});
