// تعريف المتغيرات لعناصر الشاشات المختلفة
const splashScreen = document.getElementById('splash-screen');
const startGameButton = document.getElementById('start-game-button');
const logoAnimation = document.getElementById('logo-animation'); // **جديد: جلب عنصر الشعار**

const selectionScreen = document.getElementById('selection-screen');
const levelDisplayText = document.getElementById('level-display');
const selectionMaxCountDisplay = document.getElementById('selection-max-count-display');
const maxSelectionText = document.getElementById('max-selection-text');
const lettersGrid = document.querySelector('.letters-grid');
const startActivityButton = document.getElementById('start-activity-button');
const selectedCountDisplay = document.getElementById('selected-count');

const gameScreen = document.getElementById('game-screen');
const bubbleArea = document.querySelector('.bubble-area');
const scoreDisplay = document.getElementById('score');
const targetLetterDisplay = document.getElementById('target-letter');
const progressBar = document.querySelector('.progress-bar');

const levelEndScreen = document.getElementById('level-end-screen');
const playAgainButton = document.getElementById('play-again-button');
const nextLevelButton = document.getElementById('next-level-button');

// عناصر شاشة اختيار المستويات
const levelSelectionMenu = document.getElementById('level-selection-menu');
const levelOptionsContainer = document.getElementById('level-options');

// قائمة جميع الحروف العربية بالترتيب المطلوب
const allLettersOrdered = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي';
let selectedLetters = [];
let currentLevel = 1;

// تعريفات المستويات
const levels = {
    1: {
        maxSelection: 5,
        maxCollectedBubbles: 5,
        selectionColorClass: 'level-color-1-bg',
        levelTextColorClass: 'level-color-1',
        levelName: 'المستوى الأول'
    },
    2: {
        maxSelection: 7,
        maxCollectedBubbles: 7,
        selectionColorClass: 'level-color-2-bg',
        levelTextColorClass: 'level-color-2',
        levelName: 'المستوى الثاني'
    },
    3: {
        maxSelection: 8,
        maxCollectedBubbles: 8,
        selectionColorClass: 'level-color-3-bg',
        levelTextColorClass: 'level-color-3',
        levelName: 'المستوى الثالث'
    }
};
const maxGameLevel = Object.keys(levels).length;

let score = 0;
let collectedBubblesCount = 0;
let targetLetter = '';
let gameInterval;
const bubbleCreationRate = 700;

// كائنات الصوت
const popSound = new Audio('sounds/pop.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const selectionSound = new Audio('sounds/select.mp3');
const startLevelSound = new Audio('sounds/start_level.mp3');
const levelCompleteSound = new Audio('sounds/level_complete.mp3');

const speechSynth = window.speechSynthesis;

// --- وظائف التحكم في الشاشات ---
function showScreen(screenToShow) {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    screenToShow.classList.add('active-screen');
}

// --- وظائف شاشة الافتتاحية ---
// **تعديل هنا:** بدء الرسوم المتحركة للشعار أولاً
function startSplashScreenAnimation() {
    logoAnimation.classList.remove('hidden'); // إظهار الشعار
    logoAnimation.classList.add('active'); // بدء الرسوم المتحركة

    // بعد انتهاء الرسوم المتحركة للشعار (2 ثانية كما في CSS)
    setTimeout(() => {
        startGameButton.classList.remove('hidden'); // إظهار زر البداية
    }, 2000); // 2000ms = 2 ثانية، نفس مدة الأنميشن
}


startGameButton.addEventListener('click', () => {
    selectionSound.currentTime = 0;
    selectionSound.play();
    resetFullGame();
    showScreen(selectionScreen);
    updateSelectionScreenForLevel();
});

// --- وظائف شاشة اختيار الحروف ---
function updateSelectionScreenForLevel() {
    const currentLevelSettings = levels[currentLevel];
    if (!currentLevelSettings) {
        alert('لقد أكملت جميع المستويات! يمكنك اختيار مستوى للعب مرة أخرى.');
        showScreen(levelSelectionMenu);
        showLevelSelectionMenu();
        return;
    }

    selectionMaxCountDisplay.textContent = currentLevelSettings.maxSelection + ' حروف';
    levelDisplayText.textContent = `(${currentLevelSettings.levelName})`;
    levelDisplayText.classList.remove('level-color-1', 'level-color-2', 'level-color-3');
    levelDisplayText.classList.add(currentLevelSettings.levelTextColorClass);
    maxSelectionText.textContent = currentLevelSettings.maxSelection;

    updateSelectionCount();

    populateLettersForSelection();
    document.querySelectorAll('.letter-selection-circle').forEach(circle => {
        circle.classList.remove('selected', 'level-color-1-bg', 'level-color-2-bg', 'level-color-3-bg');
        if (selectedLetters.includes(circle.dataset.letter)) {
            circle.classList.add('selected', levels[currentLevel].selectionColorClass);
        }
    });
}

function populateLettersForSelection() {
    lettersGrid.innerHTML = '';
    allLettersOrdered.split('').forEach(letter => {
        const circle = document.createElement('div');
        circle.classList.add('letter-selection-circle');
        circle.textContent = letter;
        circle.dataset.letter = letter;

        if (selectedLetters.includes(letter)) {
            circle.classList.add('selected', levels[currentLevel].selectionColorClass);
        }

        circle.addEventListener('click', () => {
            toggleLetterSelection(circle, letter);
        });
        lettersGrid.appendChild(circle);
    });
}

function toggleLetterSelection(circle, letter) {
    const currentMaxSelection = levels[currentLevel].maxSelection;
    const selectionColorClass = levels[currentLevel].selectionColorClass;

    if (circle.classList.contains('selected')) {
        circle.classList.remove('selected', selectionColorClass);
        selectedLetters = selectedLetters.filter(l => l !== letter);
    } else {
        if (selectedLetters.length < currentMaxSelection) {
            circle.classList.add('selected', selectionColorClass);
            selectedLetters.push(letter);
            selectionSound.currentTime = 0;
            selectionSound.play();
        } else {
            console.log(`لا يمكن اختيار أكثر من ${currentMaxSelection} حروف.`);
            wrongSound.currentTime = 0;
            wrongSound.play();
        }
    }
    updateSelectionCount();
}

function updateSelectionCount() {
    selectedCountDisplay.textContent = selectedLetters.length;
    const currentMaxSelection = levels[currentLevel].maxSelection;
    if (selectedLetters.length === currentMaxSelection) {
        startActivityButton.classList.remove('hidden');
    } else {
        startActivityButton.classList.add('hidden');
    }
}

startActivityButton.addEventListener('click', () => {
    startLevelSound.currentTime = 0;
    startLevelSound.play();
    showScreen(gameScreen);
    startGame();
});

// --- وظائف اللعبة الرئيسية ---
function getRandomLetter() {
    if (Math.random() < 0.7 && selectedLetters.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedLetters.length);
        return selectedLetters[randomIndex];
    } else {
        const allPossibleLetters = allLettersOrdered.split('');
        const randomIndex = Math.floor(Math.random() * allPossibleLetters.length);
        return allPossibleLetters[randomIndex];
    }
}

function speakLetter(letter) {
    if (!speechSynth) {
        console.warn('Web Speech API غير مدعوم في هذا المتصفح.');
        return;
    }
    speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    speechSynth.speak(utterance);
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const letter = getRandomLetter();
    bubble.textContent = letter;

    const leftPosition = Math.random() * (bubbleArea.offsetWidth - 80);
    bubble.style.left = `${leftPosition}px`;
    bubble.style.bottom = '-100px';

    const duration = Math.random() * 4 + 4;
    bubble.style.animation = `floatUp ${duration}s linear forwards`;

    bubble.addEventListener('click', () => {
        handleBubbleClick(bubble, letter);
    });

    bubbleArea.appendChild(bubble);

    bubble.addEventListener('animationend', () => {
        bubble.remove();
    });
}

function handleBubbleClick(bubble, letter) {
    speakLetter(letter);

    if (letter === targetLetter) {
        score++;
        scoreDisplay.textContent = score;
        bubble.classList.add('popped');

        popSound.currentTime = 0;
        popSound.play();

        const collectedBubble = document.createElement('div');
        collectedBubble.classList.add('collected-bubble');
        collectedBubble.textContent = letter;
        progressBar.appendChild(collectedBubble);
        collectedBubblesCount++;

        if (collectedBubblesCount >= levels[currentLevel].maxCollectedBubbles) {
            clearInterval(gameInterval);
            gameInterval = null;
            document.querySelectorAll('.bubble-area .bubble').forEach(b => b.remove());

            setTimeout(showRewardAnimation, 500);
            setTimeout(showLevelEndScreen, 5500);
            levelCompleteSound.currentTime = 0;
            levelCompleteSound.play();
        } else {
            setTimeout(() => {
                setNewTargetLetter();
                bubble.remove();
            }, 300);
        }

    } else {
        bubble.classList.add('wrong');
        wrongSound.currentTime = 0;
        wrongSound.play();

        setTimeout(() => {
            bubble.classList.remove('wrong');
        }, 500);
    }
}

function setNewTargetLetter() {
    if (selectedLetters.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedLetters.length);
        targetLetter = selectedLetters[randomIndex];
    } else {
        targetLetter = allLettersOrdered[Math.floor(Math.random() * allLettersOrdered.length)];
    }

    targetLetterDisplay.textContent = targetLetter;
    speakLetter(targetLetter);

    targetLetterDisplay.style.color = '#0000FF';
    setTimeout(() => {
        targetLetterDisplay.style.color = '#0000FF';
    }, 1000);
}

function showRewardAnimation() {
    const rewardContainer = document.createElement('div');
    rewardContainer.classList.add('reward-animation');
    document.body.appendChild(rewardContainer);

    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('reward-balloon');
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        balloon.style.animationDuration = `${Math.random() * 3 + 3}s`;
        balloon.style.animationDelay = `${Math.random() * 1}s`;
        rewardContainer.appendChild(balloon);
    }

    setTimeout(() => {
        rewardContainer.remove();
        progressBar.innerHTML = '';
        collectedBubblesCount = 0;
    }, 5000);
}

function showLevelEndScreen() {
    showScreen(levelEndScreen);
    if (currentLevel === maxGameLevel) {
        nextLevelButton.textContent = 'المستويات';
        nextLevelButton.removeEventListener('click', nextLevel);
        nextLevelButton.addEventListener('click', showLevelSelectionMenu);
    } else {
        nextLevelButton.textContent = 'مستوى أعلى';
        nextLevelButton.removeEventListener('click', showLevelSelectionMenu);
        nextLevelButton.addEventListener('click', nextLevel);
    }
}

// --- وظائف أزرار شاشة نهاية المستوى ---
playAgainButton.addEventListener('click', () => {
    selectionSound.currentTime = 0;
    selectionSound.play();
    resetCurrentLevelProgress();
    showScreen(gameScreen);
    startGame();
});

function nextLevel() {
    selectionSound.currentTime = 0;
    selectionSound.play();
    currentLevel++;
    resetCurrentLevelProgress();
    updateSelectionScreenForLevel();
    showScreen(selectionScreen);
}
nextLevelButton.removeEventListener('click', showLevelSelectionMenu);
nextLevelButton.addEventListener('click', nextLevel);

// --- وظائف شاشة اختيار المستويات ---
function showLevelSelectionMenu() {
    showScreen(levelSelectionMenu);
    levelOptionsContainer.innerHTML = '';

    for (let levelNum = 1; levelNum <= maxGameLevel; levelNum++) {
        const levelData = levels[levelNum];
        const levelButton = document.createElement('button');
        levelButton.classList.add('action-button', 'level-option-button', `level-color-${levelNum}-btn`);
        levelButton.textContent = levelData.levelName;
        levelButton.dataset.level = levelNum;

        levelButton.addEventListener('click', (event) => {
            selectionSound.currentTime = 0;
            selectionSound.play();
            const chosenLevel = parseInt(event.target.dataset.level);
            currentLevel = chosenLevel;
            resetCurrentLevelProgress();
            updateSelectionScreenForLevel();
            showScreen(selectionScreen);
        });
        levelOptionsContainer.appendChild(levelButton);
    }
}

// وظيفة لبدء اللعبة
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    progressBar.innerHTML = '';
    collectedBubblesCount = 0;
    setNewTargetLetter();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(createBubble, bubbleCreationRate);
}

// وظيفة لإعادة تعيين التقدم والنقاط والحروف المجمعة للمستوى الحالي
function resetCurrentLevelProgress() {
    selectedLetters = [];
    score = 0;
    progressBar.innerHTML = '';
    collectedBubblesCount = 0;
    if (currentLevel < maxGameLevel) {
        nextLevelButton.removeEventListener('click', showLevelSelectionMenu);
        nextLevelButton.addEventListener('click', nextLevel);
        nextLevelButton.textContent = 'مستوى أعلى';
    }
}

// وظيفة معدلة: لإعادة تعيين اللعبة بالكامل (عند بدء لعبة جديدة من شاشة البداية)
function resetFullGame() {
    currentLevel = 1;
    resetCurrentLevelProgress();
}

// **تعديل هنا:** بدء اللعبة بتحميل شاشة الافتتاحية ثم بدء الرسوم المتحركة للشعار
document.addEventListener('DOMContentLoaded', () => {
    showScreen(splashScreen);
    startSplashScreenAnimation(); // **استدعاء الدالة الجديدة لبدء أنميشن الشعار**
});