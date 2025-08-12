// عناصر HTML
const container = document.getElementById('gameContainer');
const bravoText = document.getElementById('bravoText');
const nextButton = document.getElementById('nextButton');
const clickSound = document.getElementById('clickSound');
const clapSound = document.getElementById('clapSound');

// عناصر إضافية لرسالة الخطأ
const errorText = document.getElementById('errorText');

let iconsCount = 10;
let currentNumber = 1; // الرقم الذي يجب الضغط عليه الآن

// إنشاء الأيقونات بشكل عشوائي
function createIcons() {
    // إزالة الأيقونات القديمة
    container.querySelectorAll('.icon').forEach(icon => icon.remove());

    for (let i = 1; i <= iconsCount; i++) {
        const icon = document.createElement('div');
        icon.classList.add('icon');
        icon.textContent = i;

        // تحديد موقع عشوائي
        const x = Math.random() * (container.offsetWidth - 50);
        const y = Math.random() * (container.offsetHeight - 50);

        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;

        // حدث الضغط
        icon.addEventListener('click', () => {
            if (parseInt(icon.textContent) === currentNumber) {
                clickSound.play(); // صوت صحيح
                showBravo(); // عرض "برافوو"
                icon.remove(); // حذف الرقم
                currentNumber++; // ننتقل للرقم التالي

                if (currentNumber > 10) {
                    clapSound.play(); // صوت التصفيق
                    showNextButton();
                }
            } else {
                showError(); // رسالة خطأ
            }
        });

        container.appendChild(icon);
    }
}

// عرض كلمة "برافوو"
function showBravo() {
    bravoText.style.display = 'block';
    errorText.style.display = 'none';
    setTimeout(() => {
        bravoText.style.display = 'none';
    }, 500);
}

// عرض رسالة خطأ
function showError() {
    errorText.style.display = 'block';
    bravoText.style.display = 'none';
    setTimeout(() => {
        errorText.style.display = 'none';
    }, 1000);
}

// إظهار زر "التالي"
function showNextButton() {
    nextButton.style.display = 'block';
}

// إعادة النشاط
nextButton.addEventListener('click', () => {
    currentNumber = 1;
    iconsCount = 10;
    nextButton.style.display = 'none';
    createIcons();
});

// بدء اللعبة
createIcons();