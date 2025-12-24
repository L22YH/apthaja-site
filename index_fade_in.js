document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container-1");

    function revealOnScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (!document.querySelector(".container-1")) return;

        const containerPosition = container.offsetTop;

        if (scrollPosition > containerPosition + 100) {
            container.classList.add("show");
        }
    }

    // 스크롤할 때마다 확인
    window.addEventListener("scroll", revealOnScroll);

    // 페이지 로드 후에도 확인 (이미 화면에 있다면 바로 표시)
    revealOnScroll();
});



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reserveForm");
  const head = document.getElementById("phoneHead");
  const mid  = document.getElementById("phoneMid");
  const tail = document.getElementById("phoneTail");
  const hiddenPhone = document.getElementById("phoneFull");
  const agree = document.getElementById("agreePrivacy");
  const submitBtn = document.getElementById("reserveSubmitBtn");
  const resultEl = document.getElementById("formResult");

  if (!form || !head || !mid || !tail || !hiddenPhone || !agree || !submitBtn) {
    console.warn("reserveForm 또는 관련 요소를 찾을 수 없습니다.");
    return;
  }

  // ☎ 전화번호 숫자만 입력 + 자동 합치기
  const cleanNumber = (value) => value.replace(/\D/g, "");

  const syncPhone = () => {
    mid.value  = cleanNumber(mid.value).slice(0, 4);
    tail.value = cleanNumber(tail.value).slice(0, 4);
    hiddenPhone.value = `${head.value}-${mid.value}-${tail.value}`;
  };

  ["input", "change"].forEach(evt => {
    mid.addEventListener(evt, syncPhone);
    tail.addEventListener(evt, syncPhone);
    head.addEventListener(evt, syncPhone);
  });

  // ✅ 개인정보 동의 체크 여부에 따라 버튼 활성/비활성
  const syncSubmitButton = () => {
    submitBtn.disabled = !agree.checked;
  };

  agree.addEventListener("change", syncSubmitButton);
  // 로딩 시 초기 상태 반영
  syncSubmitButton();

  // ✅ 폼 전송 처리 (이미 구글 Apps Script 연동돼 있다면 이 부분은 참고용)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultEl.textContent = "";
    
    // 개인정보 동의 최종 체크
    if (!agree.checked) {
      resultEl.textContent = "개인정보 수집 및 이용에 동의해 주세요.";
      resultEl.style.color = "#ffb4a0";
      return;
    }

    // 전화번호 한 번 더 정제
    syncPhone();

    // 여기서부터는 네가 기존에 쓰던 fetch 코드가 있으면 그걸 사용해도 되고,
    // 이미 잘 동작 중이면 이 부분은 무시해도 됨.
    // (중복 전송 방지하려면 실제 전송 코드는 한 군데만 남겨두기!)

    // 예시로만 남겨둘게:
    /*
    try {
      submitBtn.disabled = true;
      const formData = new FormData(form);
      const plainData = Object.fromEntries(formData.entries());

      const res = await fetch("<<여기에 웹앱 URL>>", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plainData,
          user_agent: navigator.userAgent,
          referrer: location.href
        }),
      });

      const json = await res.json();
      if (json.ok) {
        resultEl.textContent = "정상적으로 접수되었습니다. 빠르게 연락드리겠습니다.";
        resultEl.style.color = "#bbf7d0"; // 연두색
        form.reset();
        syncPhone();
        syncSubmitButton();
      } else {
        resultEl.textContent = "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        resultEl.style.color = "#fecaca";
      }
    } catch (err) {
      console.error(err);
      resultEl.textContent = "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      resultEl.style.color = "#fecaca";
    } finally {
      submitBtn.disabled = !agree.checked;
    }
    */
  });
});
