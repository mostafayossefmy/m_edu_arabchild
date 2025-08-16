// جلب العناصر الأساسية من HTML
const splashScreen = document.getElementById('splashScreen'); // شاشة الافتتاحية
const buttonsContainer = document.getElementById('buttonsContainer'); // حاوية زر البدء وزر الإعدادات
const startButton = document.getElementById('startButton'); // زر البدء نفسه
const settingsButton = document.getElementById('settingsButton'); // زر الإعدادات

const settingsScreen = document.getElementById('settingsScreen');
const selectionCountDisplay = document.getElementById('selectionCount');
const alphabetContainer = document.getElementById('alphabetContainer');
const confirmSelectionButton = document.getElementById('confirmSelectionButton');

const gameScreen = document.getElementById('gameScreen'); // شاشة اللعبة الرئيسية
const wheelContainer = document.getElementById('wheelContainer'); // حاوية عجلة الحروف
const spinnerArrow = document.getElementById('spinnerArrow'); // سهم الدوران
const displayScreen = document.getElementById('displayScreen'); // شاشة عرض الكلمة والصورة
const displayImage = document.getElementById('displayImage'); // عنصر الصورة في شاشة العرض
const displayText = document.getElementById('displayText'); // عنصر النص في شاشة العرض

// تعريف جميع الحروف الأبجدية المتاحة (بيانات كاملة)
const fullAlphabetData = [
    { letter: 'أ', sound: 'a.mp3', word: 'أسد', image: 'lion.png' },
    { letter: 'ب', sound: 'b.mp3', word: 'بطة', image: 'duck.png' },
    { letter: 'ت', sound: 't.mp3', word: 'تفاح', image: 'apple.png' },
    { letter: 'ث', sound: 'th.mp3', word: 'ثعلب', image: 'fox.png' },
    { letter: 'ج', sound: 'j.mp3', word: 'جمل', image: 'camel.png' },
    { letter: 'ح', sound: 'h.mp3', word: 'حصان', image: 'horse.png' },
    { letter: 'خ', sound: 'kh.mp3', word: 'خروف', image: 'sheep.png' },
    { letter: 'د', sound: 'd.mp3', word: 'ديك', image: 'roster.png' },
    { letter: 'ذ', sound: 'dh.mp3', word: 'ذرة', image: 'corn.png' },
    { letter: 'ر', sound: 'r.mp3', word: 'رجل', image: 'man.png' },
    { letter: 'ز', sound: 'z.mp3', word: 'زرافة', image: 'giraffe.png' },
    { letter: 'س', sound: 's.mp3', word: 'سمكة', image: 'fish.png' },
    { letter: 'ش', sound: 'sh.mp3', word: 'شجرة', image: 'tree.png' },
    { letter: 'ص', sound: 'sa.mp3', word: 'صقر', image: 'falcon.png' },
    { letter: 'ض', sound: 'da.mp3', word: 'ضفدع', image: 'frog.png' },
    { letter: 'ط', sound: 'ta.mp3', word: 'طاووس', image: 'peacock.png' },
    { letter: 'ظ', sound: 'za.mp3', word: 'ظرف', image: 'envelope.png' },
    { letter: 'ع', sound: 'aa.mp3', word: 'عنب', image: 'grap.png' },
    { letter: 'غ', sound: 'gh.mp3', word: 'غزال', image: 'gazelle.png' },
    { letter: 'ف', sound: 'f.mp3', word: 'فراشة', image: 'butterfly.png' },
    { letter: 'ق', sound: 'qa.mp3', word: 'قلم', image: 'pen.png' },
    { letter: 'ك', sound: 'ka.mp3', word: 'كلب', image: 'dog.png' },
    { letter: 'ل', sound: 'l.mp3', word: 'ليمون', image: 'limon.png' },
    { letter: 'م', sound: 'm.mp3', word: 'معزة', image: 'goat.png' },
    { letter: 'ن', sound: 'n.mp3', word: 'نمر', image: 'tiger.png' },
    { letter: 'ه', sound: 'ha.mp3', word: 'هدية', image: 'gift.png' },
    { letter: 'و', sound: 'w.mp3', word: 'ولد', image: 'boy.png' },
    { letter: 'ي', sound: 'y.mp3', word: 'يد', image: 'hand.png' }
];

// هذا هو الوضع الافتراضي للحروف التي ستظهر عند بدء النشاط لأول مرة
let defaultLetters = [
    { letter: 'أ', sound: 'a.mp3', word: 'أسد', image: 'lion.png' },
    { letter: 'ب', sound: 'b.mp3', word: 'بطة', image: 'duck.png' },
    { letter: 'ت', sound: 't.mp3', word: 'تفاح', image: 'apple.png' },
    { letter: 'و', sound: 'w.mp3', word: 'ولد', 'image': 'boy.png' },
    { letter: 'د', sound: 'd.mp3', word: 'ديك', image: 'roster.png' },
    { letter: 'م', sound: 'm.mp3', word: 'معزة', image: 'goat.png' },
    { letter: 'ل', sound: 'l.mp3', word: 'ليمون', image: 'limon.png' },
    { letter: 'ن', sound: 'n.mp3', word: 'نمر', image: 'tiger.png' },
    { letter: 'ف', sound: 'f.mp3', word: 'فراشة', image: 'butterfly.png' },
    { letter: 'ش', sound: 'sh.mp3', word: 'شجرة', image: 'tree.png' },
    { letter: 'ر', sound: 'r.mp3', word: 'رجل', image: 'man.png' },
    { letter: 'ع', sound: 'aa.mp3', word: 'عنب', image: 'grap.png' }
];

let lettersData = [...defaultLetters]; // في البداية، الحروف هي الحروف الافتراضية

const MAX_LETTERS = 12;
let selectedLetters = []; // لتخزين الحروف التي يختارها المستخدم مؤقتًا من شاشة الإعدادات

let numLetters = lettersData.length;
let anglePerLetter = 360 / numLetters;

let isSpinning = false;
let currentActiveLetter = null;
let firstSpinDone = false;
let totalArrowRotation = 0;

const startingAngleForLetters = 90;
const arrowStopOffsetAngle = 180;

// --- وظائف الصوت ---
function playSound(fileName) {
    const audio = new Audio(`sounds/${fileName}`);
    audio.play();
}

// --- وظيفة إنشاء دوائر الحروف على العجلة ---
function createLetterCircles() {
    wheelContainer.innerHTML = '';
    numLetters = lettersData.length;
    anglePerLetter = 360 / numLetters;

    if (numLetters === 0) {
        console.warn("لا توجد حروف مختارة للعجلة. الرجاء اختيار الحروف من الإعدادات.");
        speakText("الرجاء اختيار الحروف من الإعدادات أولاً.");
        displaySettingsScreen(); // عرض شاشة الإعدادات إذا لم توجد حروف
        return;
    }

    lettersData.forEach((data, index) => {
        const circle = document.createElement('div');
        circle.classList.add('letter-circle');
        circle.textContent = data.letter;
        circle.dataset.index = index;

        const radius = 200;
        const angle = (index * anglePerLetter) + startingAngleForLetters;
        const rad = angle * Math.PI / 180;

        const circleX = radius * Math.cos(rad);
        const circleY = radius * Math.sin(rad);

        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
        wheelContainer.appendChild(circle);

        circle.addEventListener('click', () => {
            if (!isSpinning && currentActiveLetter === data.letter) {
                displayLetterInfo(data);
            }
        });
    });
}

// --- وظيفة بدء الدوران الدوري للسهم ---
function spinWheel() {
    if (isSpinning) return;
    if (lettersData.length === 0) {
        speakText("الرجاء اختيار الحروف من الإعدادات أولاً.");
        displaySettingsScreen(); // توجيه المستخدم لشاشة الإعدادات إذا لم تكن هناك حروف
        return;
    }

    isSpinning = true;
    currentActiveLetter = null;

    const previouslyActive = document.querySelector('.letter-circle.active');
    if (previouslyActive) {
        previouslyActive.classList.remove('active');
    }

    let targetLetterIndex;
    if (!firstSpinDone) {
        targetLetterIndex = 0;
        firstSpinDone = true;
    } else {
        targetLetterIndex = Math.floor(Math.random() * numLetters);
    }

    const stoppedLetterData = lettersData[targetLetterIndex];
    const targetStopAngle = (targetLetterIndex * anglePerLetter) + arrowStopOffsetAngle;
    const correctionOffset = 0;
    const finalTargetAngleInSingleRotation = targetStopAngle + correctionOffset;

    let currentAngleNormalized = totalArrowRotation % 360;
    if (currentAngleNormalized < 0) currentAngleNormalized += 360;

    let angleToGo = finalTargetAngleInSingleRotation - currentAngleNormalized;

    if (angleToGo <= 0) {
        angleToGo += 360;
    }

    const extraTurns = 1;
    let finalRotation = totalArrowRotation + angleToGo + (extraTurns * 360);

    spinnerArrow.style.transition = `transform 4s cubic-bezier(0.3, 0.7, 0.7, 0.9)`;
    spinnerArrow.style.transform = `translate(-50%, -100%) rotate(${finalRotation}deg)`;

    totalArrowRotation = finalRotation;

    setTimeout(() => {
        isSpinning = false;

        const allLetterCircles = document.querySelectorAll('.letter-circle');
        allLetterCircles.forEach(circle => {
            if (parseInt(circle.dataset.index) === targetLetterIndex) {
                circle.classList.add('active');
                currentActiveLetter = circle.textContent;
            } else {
                circle.classList.remove('active');
            }
        });

        setTimeout(() => {
            speakText(`اضغط على حرف ${stoppedLetterData.letter}`);
        }, 500);

    }, 4000);
}

// وظيفة لعرض معلومات الحرف (الكلمة والصورة)
function displayLetterInfo(data) {
    displayImage.src = `images/${data.image}`;
    displayImage.alt = data.word;
    displayText.textContent = data.word;
    displayScreen.classList.remove('hidden');
    playSound(data.sound);
}

// وظيفة لقراءة النص باستخدام Web Speech API
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        speechSynthesis.speak(utterance);
    } else {
        console.warn("Web Speech API غير مدعومة في متصفحك.");
    }
}

// *** وظيفة للعودة إلى شاشة عجلة الحروف (بعد عرض الكلمة والصورة) ***
function returnToGameScreen() {
    displayScreen.classList.add('hidden'); // إخفاء شاشة عرض الكلمة والصورة
    gameScreen.classList.remove('hidden'); // إظهار شاشة عجلة الحروف

    // إعادة تعيين حالة الدوران للحرف التالي
    isSpinning = false;
    currentActiveLetter = null;
    // لا نعيد تعيين firstSpinDone هنا لأننا نريد استمرار اللعب
    // ولا نعيد تعيين totalArrowRotation هنا لأن العجلة ستستمر من مكانها
}


// --- وظائف شاشة الإعدادات ---

// وظيفة لإنشاء جميع حروف الأبجدية في شاشة الإعدادات
function createAlphabetSelection() {
    alphabetContainer.innerHTML = ''; // تنظيف الحاوية
    // عند الدخول لشاشة الإعدادات، يتم تهيئة selectedLetters بناءً على lettersData الحالية (المستخدمة في اللعبة)
    selectedLetters = [...lettersData];
    updateSelectionCount();

    // تأكد من حالة زر التأكيد عند إعادة تهيئة الشاشة
    if (selectedLetters.length === MAX_LETTERS) {
        confirmSelectionButton.classList.remove('hidden');
        confirmSelectionButton.disabled = false;
    } else {
        confirmSelectionButton.classList.add('hidden');
        confirmSelectionButton.disabled = true;
    }

    fullAlphabetData.forEach(data => {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('alphabet-letter');
        letterDiv.textContent = data.letter;
        letterDiv.dataset.letter = data.letter;
        letterDiv.dataset.sound = data.sound;
        letterDiv.dataset.word = data.word;
        letterDiv.dataset.image = data.image;

        // إذا كان الحرف مختارًا مسبقًا، أضف له كلاس 'selected'
        if (selectedLetters.some(l => l.letter === data.letter)) {
            letterDiv.classList.add('selected');
        }

        letterDiv.addEventListener('click', () => {
            toggleLetterSelection(letterDiv, data);
        });
        alphabetContainer.appendChild(letterDiv);
    });
}

// وظيفة للتعامل مع اختيار الحرف
function toggleLetterSelection(letterDiv, data) {
    const letterIndex = selectedLetters.findIndex(l => l.letter === data.letter);

    if (letterIndex > -1) {
        selectedLetters.splice(letterIndex, 1);
        letterDiv.classList.remove('selected');
    } else {
        if (selectedLetters.length < MAX_LETTERS) {
            selectedLetters.push(data);
            letterDiv.classList.add('selected');
        } else {
            speakText(`لقد اخترت بالفعل ${MAX_LETTERS} حروف.`);
        }
    }
    updateSelectionCount();
}

// وظيفة لتحديث عداد الحروف المختارة وحالة زر التأكيد
function updateSelectionCount() {
    selectionCountDisplay.textContent = `اختر ${selectedLetters.length} من ${MAX_LETTERS} حرفًا`;
    if (selectedLetters.length === MAX_LETTERS) {
        confirmSelectionButton.classList.remove('hidden');
        confirmSelectionButton.disabled = false;
        speakText("أكملت اختيار الحروف! اضغط تأكيد.");
    } else {
        confirmSelectionButton.classList.add('hidden');
        confirmSelectionButton.disabled = true;
    }
}


// --- الأحداث الأولية عند تحميل الصفحة ---

// 1. إظهار حاوية الأزرار بعد 5 ثوانٍ من شاشة الافتتاحية
setTimeout(() => {
    buttonsContainer.classList.remove('hidden');
}, 5000);

// 2. عند الضغط على زر البدء
startButton.addEventListener('click', () => {
    // إخفاء الشاشة الافتتاحية والأزرار
    splashScreen.classList.add('hidden');
    buttonsContainer.classList.add('hidden');

    // إظهار شاشة اللعبة
    gameScreen.classList.remove('hidden');
    createLetterCircles(); // ستقوم بإنشاء الحروف بناءً على lettersData الحالية (الافتراضية أو المختارة)
});

// عند الضغط على زر الإعدادات
settingsButton.addEventListener('click', () => {
    displaySettingsScreen();
});

// وظيفة عرض شاشة الإعدادات
function displaySettingsScreen() {
    splashScreen.classList.add('hidden');
    buttonsContainer.classList.add('hidden');
    gameScreen.classList.add('hidden');
    displayScreen.classList.add('hidden');

    settingsScreen.classList.remove('hidden'); // إظهار شاشة الإعدادات
    createAlphabetSelection(); // تهيئة شاشة اختيار الحروف
}

// عند الضغط على زر تأكيد الاختيار
confirmSelectionButton.addEventListener('click', () => {
    if (selectedLetters.length === MAX_LETTERS) {
        lettersData = [...selectedLetters]; // تحديث lettersData بالحروف المختارة
        speakText("تم حفظ اختيار الحروف. يمكنك الآن بدء اللعب.");
        // بعد التأكيد، نعود إلى شاشة البداية لتظهر الأزرار مرة أخرى، وهذا هو السلوك المطلوب عند الضغط على التأكيد
        splashScreen.classList.remove('hidden');
        buttonsContainer.classList.remove('hidden');
        settingsScreen.classList.add('hidden'); // إخفاء شاشة الإعدادات
        // لا نبدأ اللعبة تلقائيًا، بل نترك المستخدم يضغط على "ابدأ"
    } else {
        speakText(`الرجاء اختيار ${MAX_LETTERS} حروف للمتابعة.`);
    }
});


// 3. عند الضغط على سهم الدوران
spinnerArrow.addEventListener('click', spinWheel);

// 4. عند الضغط على شاشة عرض الكلمة والصورة (للعودة إلى عجلة الحروف)
displayScreen.addEventListener('click', () => {
    returnToGameScreen(); // استدعاء الدالة الجديدة للعودة لشاشة عجلة الحروف
});