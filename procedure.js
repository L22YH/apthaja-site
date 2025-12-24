document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const button = card.querySelector('.card-button');
        button.addEventListener('click', () => {
            // 현재 카드가 이미 활성화되어 있다면 아무 것도 하지 않음
            if (card.classList.contains('active')) {
                return;
            }

            // 모든 카드의 활성 상태를 제거
            cards.forEach(c => c.classList.remove('active'));

            // 클릭된 카드를 활성화
            card.classList.add('active');
        });
    });
});
