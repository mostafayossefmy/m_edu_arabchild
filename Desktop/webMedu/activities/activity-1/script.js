// ==========================
// ملف: script.js
// ==========================

// التقاط عناصر الصفحة
const container = document.getElementById('gameContainer');
const playArea = document.getElementById('playArea');
const startMessage = document.getElementById('startMessage');
const bravoText = document.getElementById('bravoText');
const errorText = document.getElementById('errorText');
const nextButton = document.getElementById('nextButton');
const helpIcons = document.getElementById('helpIcons');
const helpModeBtn = document.getElementById('helpMode');
const noHelpBtn = document.getElementById('noHelpMode');
const balloonsLayer = document.getElementById('balloonsLayer');

// الأصوات
const clickSound = document.getElementById('clickSound');
const clapSound = document.getElementById('clapSound');
const wrongSound = document.getElementById('wrongSound');

// متغيرات التحكم
const iconsCount = 10;        // عدد الأرقام المطلوب ترتيبها
let currentNumber = 1;         // الرقم المطلوب الحالي
let helpMode = false;     // وضع المساعدة
let correctRow = null;      // صف الأرقام الصحيحة فوق المربع

// عند تحميل الصفحة
window.addEventListener('load', () => {
  // إخفاء ما يجب إخفاؤه
  bravoText.classList.add('hidden');
  errorText.classList.add('hidden');
  nextButton.classList.add('hidden');
  helpIcons.classList.add('hidden');

  // إنشاء صف الأرقام الصحيحة فوق المربع
  correctRow = document.createElement('div');
  correctRow.id = 'correctRow';
  correctRow.style.position = 'absolute';

  // تحديد موقع الصف الصحيح فوق المربع
  const playRect = playArea.getBoundingClientRect(); // الحصول على إحداثيات المربع بدقة
  correctRow.style.top = `${playRect.top - 70}px`;   // 70px فوق المربع
  correctRow.style.left = `${playRect.left + playRect.width/2}px`;
  correctRow.style.width = `${playRect.width}px`;


  correctRow.style.height = '60px';
  correctRow.style.display = 'flex';
  correctRow.style.justifyContent = 'flex'; // الأرقام تظهر من اليمين لليسار
  correctRow.style.alignItems = 'center';
  correctRow.style.gap = '10px';


  container.appendChild(correctRow);

  // إظهار رسالة البداية لثوانٍ
  startMessage.classList.remove('hidden');
  setTimeout(() => {
    startMessage.classList.add('hidden');
    startGameRound();
  }, 3000);
});

// بدء جولة جديدة
function startGameRound() {
  currentNumber = 1;
  nextButton.classList.add('hidden');
  helpIcons.classList.add('hidden');

  // إزالة الأرقام داخل المربع
  playArea.querySelectorAll('.icon').forEach(i => i.remove());
  // إزالة أي أرقام في الصف الصحيح
  correctRow.innerHTML = '';

  createIconsInsideBox();
  if (helpMode) highlightCurrentNumber();
}

// إنشاء الأرقام داخل المربع
function createIconsInsideBox() {
  const iconSize = 54;
  const gap = 6;
  const positions = [];

  for (let i = 1; i <= iconsCount; i++) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = i.toString();

    const maxX = playArea.clientWidth - iconSize - gap;
    const maxY = playArea.clientHeight - iconSize - gap;

    let x, y, overlaps;
    do {
      overlaps = false;
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      for (const p of positions) {
        if (Math.abs(p.x - x) < iconSize + gap && Math.abs(p.y - y) < iconSize + gap) {
          overlaps = true; break;
        }
      }
    } while (overlaps);

    positions.push({ x, y });
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;

    // عند الضغط على الرقم
    icon.addEventListener('click', () => {
      const value = parseInt(icon.textContent, 10);
      if (value === currentNumber) {
        safePlay(clickSound);

        // نقل الرقم إلى الصف الصحيح بدل إزالته
        icon.style.position = 'relative';
        icon.style.left = '';
        icon.style.top = '';
        icon.style.transform = '';
        icon.style.cursor = 'default';
        icon.classList.remove('highlight');
        correctRow.appendChild(icon);

        currentNumber++;
        if (helpMode) highlightCurrentNumber();

        if (currentNumber > iconsCount) {
          onRoundComplete();
        }
      } else {
        showErrorOnce();
      }
    });

    playArea.appendChild(icon);
  }
}

// إبراز الرقم المطلوب
function highlightCurrentNumber() {
  playArea.querySelectorAll('.icon').forEach(i => i.classList.remove('highlight'));
  const target = Array.from(playArea.querySelectorAll('.icon'))
    .find(i => parseInt(i.textContent, 10) === currentNumber);
  if (target) target.classList.add('highlight');
}

// عند اكتمال الجولة
function onRoundComplete() {
  safePlay(clapSound);
  showBalloons(28);

  // إخفاء الأرقام بعد البرافوو
  showBravoForSeconds(3000, () => {
    correctRow.innerHTML = ''; // إزالة كل الأرقام
    nextButton.classList.remove('hidden');
  });
}

// برافوو لثوانٍ
function showBravoForSeconds(ms, done) {
  bravoText.classList.remove('hidden');
  setTimeout(() => {
    bravoText.classList.add('hidden');
    if (typeof done === 'function') done();
  }, ms);
}

// رسالة الخطأ
let errorTimeout = null;
function showErrorOnce() {
  safePlay(wrongSound);
  errorText.classList.remove('hidden');
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => errorText.classList.add('hidden'), 1000);
}

// البالونات
function showBalloons(count) {
  balloonsLayer.innerHTML = '';
  const shapes = ['🎈', '🌟', '❤️', '😄', '🎉'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    b.style.left = `${Math.random() * 100}%`;
    const dur = 3 + Math.random() * 2;
    b.style.animationDuration = `${dur}s`;
    balloonsLayer.appendChild(b);
    setTimeout(() => b.remove(), (dur + 0.3) * 1000);
  }
}

// الأزرار
nextButton.addEventListener('click', () => {
  nextButton.classList.add('hidden');
  helpIcons.classList.remove('hidden');
});
helpModeBtn.addEventListener('click', () => {
  helpMode = true;
  helpIcons.classList.add('hidden');
  startGameRound();
});
noHelpBtn.addEventListener('click', () => {
  helpMode = false;
  helpIcons.classList.add('hidden');
  startGameRound();
});

// تشغيل الصوت
function safePlay(audioEl) {
  if (!audioEl) return;
  try { audioEl.currentTime = 0; audioEl.play(); } catch (e) { }
}
