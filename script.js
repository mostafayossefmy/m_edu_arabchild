document.addEventListener('DOMContentLoaded', function () {
    // هذا هو بداية الكتلة البرمجية الخاصة بالدالة
    
    // تهيئة نظام التمرير لصور الأنشطة التعليمية
    initializeActivitiesCarousel();

    // تهيئة القوائم المنسدلة للأيقونات
    initializeIconDropdowns();

    // تهيئة وظيفة البحث
    initializeSearchFunctionality();

    // تهيئة تحريك الشخصيات
    initializeCharacterAnimations();

    // تهيئة تأثيرات التمرير عند ظهور الأقسام
    initializeScrollEffects();

    // تهيئة الميزات المتجاوبة (إعادة ضبط الكاروسيل عند تغيير حجم النافذة)
    initializeResponsiveFeatures();

    console.log('تم تحميل الموقع التعليمي بنجاح مع جميع التحديثات!');

    // *** الكود الجديد لتشغيل الموسيقى تلقائياً (الآن داخل الدالة) ***
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // لضبط مستوى الصوت (0.0 إلى 1.0)
        backgroundMusic.play().catch(error => {
            console.log("تشغيل الموسيقى تم منعه بواسطة المتصفح. قد يحتاج المستخدم للتفاعل مع الصفحة أولاً.");
        });
    }

    // هذه هي نهاية الكتلة البرمجية للدالة
});



// متغيرات لنظام تمرير صور الأنشطة التعليمية (الصف الأول)
let activitiesCurrentSlide = 0; // الشريحة الحالية
let activitiesTotalSlides = 0; // العدد الكلي للشرائح
let activitiesSlideFullWidth = 0; // العرض الكامل للشريحة الواحدة بما في ذلك الهامش

// تعريف عدد الشرائح المرئية لكل حجم شاشة
const ACTIVITIES_VISIBLE_SLIDES_DESKTOP = 3;
const ACTIVITIES_VISIBLE_SLIDES_TABLET = 2;
const ACTIVITIES_VISIBLE_SLIDES_MOBILE = 1;

let activitiesVisibleSlides = ACTIVITIES_VISIBLE_SLIDES_DESKTOP; // المتغير الذي سيحدد العدد الحالي بناءً على حجم الشاشة

// وظيفة تهيئة نظام تمرير صور الأنشطة التعليمية
function initializeActivitiesCarousel() {
    const carousel = document.getElementById('activitiesCarousel'); // حاوية الصور
    const prevBtn = document.getElementById('activitiesPrevBtn'); // زر السابق (السهم اليمين في HTML، لكن سيحرك لليسار "التالي")
    const nextBtn = document.getElementById('activitiesNextBtn'); // زر التالي (السهم اليسار في HTML، لكن سيحرك لليمين "السابق")
    const slides = carousel.querySelectorAll('.carousel-image-container'); // جميع الصور

    if (!carousel || !prevBtn || !nextBtn || slides.length === 0) {
        console.warn('عناصر الكاروسيل غير موجودة أو عدد الشرائح صفر. يرجى التحقق من HTML.');
        return;
    }

    activitiesTotalSlides = slides.length; // تحديث العدد الكلي للشرائح

    // تحديث إعدادات الكاروسيل عند التحميل وعند تغيير حجم النافذة
    updateActivitiesCarouselSettings();
    updateActivitiesCarouselPosition();
    updateActivitiesCarouselButtons();

    // مستمع لزر "السابق" (prevBtn): هذا هو السهم الموجود على **اليسار** في التصميم.
    // وظيفته هي تحريك الصور **لليمين**، أي جلب الصور "السابقة" أو إظهار `photo4` ثم `photo3` وهكذا.
    // لكن بما أن الصور تُرص من اليسار لليمين، وزيادة `activitiesCurrentSlide` تحركها لليسار،
    // فنحن هنا نتحرك "للأمام" في التسلسل (photo1 -> photo2 -> photo3 -> photo4).
    // هذا يعني أننا نزيد `activitiesCurrentSlide` (أي نتحرك صورة واحدة لليسار).
    prevBtn.addEventListener('click', () => { // السهم اللي في اليسار هو اللي بيحرك للصور التالية
        // نتحرك للأمام (إلى اليسار) بزيادة الشريحة الحالية
        // الحد الأقصى هو (إجمالي الشرائح - عدد الشرائح المرئية)
        // هذا يضمن ألا نذهب أبعد من اللازم وأن تظهر 3 صور كاملة في النهاية
        activitiesCurrentSlide = Math.min(activitiesCurrentSlide + 1, activitiesTotalSlides - activitiesVisibleSlides);
        updateActivitiesCarouselPosition();
        updateActivitiesCarouselButtons();
    });

    // مستمع لزر "التالي" (nextBtn): هذا هو السهم الموجود على **اليمين** في التصميم.
    // وظيفته هي تحريك الصور **لليسار**، أي جلب الصور "التالية" أو إظهار `photo1` ثم `photo2` وهكذا.
    // هذا يعني أننا نُقلل `activitiesCurrentSlide` (أي نتحرك صورة واحدة لليمين).
    nextBtn.addEventListener('click', () => { // السهم اللي في اليمين هو اللي بيرجع للصور اللي فاتت
        // نتحرك للخلف (إلى اليمين) بإنقاص الشريحة الحالية
        // الحد الأدنى هو 0
        activitiesCurrentSlide = Math.max(activitiesCurrentSlide - 1, 0);
        updateActivitiesCarouselPosition();
        updateActivitiesCarouselButtons();
    });


    // إعادة ضبط الكاروسيل عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        updateActivitiesCarouselSettings();
        updateActivitiesCarouselPosition();
        updateActivitiesCarouselButtons();
    });
}

// وظيفة تحديث إعدادات تمرير صور الأنشطة التعليمية (الصف الأول)
function updateActivitiesCarouselSettings() {
    const carousel = document.getElementById('activitiesCarousel');
    const firstSlide = carousel.querySelector('.carousel-image-container');
    if (!firstSlide) {
        console.warn('لم يتم العثور على أول شريحة في الكاروسيل.');
        return;
    }

    // حساب العرض الكامل للشريحة (العرض الفعلي + الهامش الأيمن)
    const slideComputedStyle = window.getComputedStyle(firstSlide);
    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0; // الحصول على قيمة الـ gap
    // عرض الشريحة الواحدة + قيمة الـ gap بين الشرائح
    activitiesSlideFullWidth = firstSlide.offsetWidth + gap;

    // تحديد عدد الشرائح المرئية بناءً على عرض النافذة
    if (window.innerWidth >= 1024) {
        activitiesVisibleSlides = ACTIVITIES_VISIBLE_SLIDES_DESKTOP;
    } else if (window.innerWidth >= 768) {
        activitiesVisibleSlides = ACTIVITIES_VISIBLE_SLIDES_TABLET;
    } else {
        activitiesVisibleSlides = ACTIVITIES_VISIBLE_SLIDES_MOBILE;
    }

    // تعديل الشريحة الحالية إذا تجاوزت الحدود بعد تغيير حجم النافذة
    // هذا يمنع وجود شريحة جزئية عند تغيير الحجم
    activitiesCurrentSlide = Math.min(activitiesCurrentSlide, activitiesTotalSlides - activitiesVisibleSlides);
    activitiesCurrentSlide = Math.max(activitiesCurrentSlide, 0);
}

// وظيفة تحديث موضع تمرير صور الأنشطة التعليمية (الصف الأول)
function updateActivitiesCarouselPosition() {
    const carousel = document.getElementById('activitiesCarousel');
    if (!carousel) return;

    // بما أن الـ flex-direction: row; فالصور تُرص من اليسار لليمين (photo1, photo2, photo3...).
    // ولكن نظرًا لأن الـ carousel-container نفسه `flex-direction: row-reverse;`
    // وهذا يعني أن الرابر (image-carousel-wrapper) والسهمين عكسوا ترتيبهم.
    // والـ `justify-content: flex-end;` على الـ `.image-carousel` يجعل `photo1` في أقصى اليمين.
    // للتحرك لليسار (Next في المنطق العربي)، الصورة الأولى (photo1) يجب أن تختفي.
    // هذا يعني أننا نحتاج إلى `translateX` بقيمة سالبة لـ `activitiesCurrentSlide`
    // (حيث أن 0 تعني الصورة الأولى في أقصى اليمين، 1 تعني أن الصورة الأولى اختفت وphoto4 ظهرت)
    const translateValue = -activitiesCurrentSlide * activitiesSlideFullWidth;
    carousel.style.transform = `translateX(${translateValue}px)`;
    carousel.style.transition = 'transform 0.5s ease-in-out';
}

// وظيفة تحديث حالة أزرار تمرير صور الأنشطة التعليمية (الصف الأول)
function updateActivitiesCarouselButtons() {
    const prevBtn = document.getElementById('activitiesPrevBtn'); // السهم الأيسر (للتالي)
    const nextBtn = document.getElementById('activitiesNextBtn'); // السهم الأيمن (للسابق)

    if (!prevBtn || !nextBtn) return;

    // زر "السابق" (السهم الأيسر) يعطل إذا وصلنا إلى نهاية الشرائح المرئية
    const maxSlideIndex = activitiesTotalSlides - activitiesVisibleSlides;
    prevBtn.disabled = (activitiesCurrentSlide >= maxSlideIndex);
    prevBtn.style.opacity = (activitiesCurrentSlide >= maxSlideIndex) ? '0.5' : '1';
    prevBtn.style.cursor = (activitiesCurrentSlide >= maxSlideIndex) ? 'not-allowed' : 'pointer';

    // زر "التالي" (السهم الأيمن) يعطل إذا كانت الشريحة الحالية هي الأولى
    nextBtn.disabled = (activitiesCurrentSlide === 0);
    nextBtn.style.opacity = (activitiesCurrentSlide === 0) ? '0.5' : '1';
    nextBtn.style.cursor = (activitiesCurrentSlide === 0) ? 'not-allowed' : 'pointer';
}

// وظيفة تهيئة القوائم المنسدلة للأيقونات (القائمة العلوية)
function initializeIconDropdowns() {
    const navIconItems = document.querySelectorAll('.nav-icon-item');

    navIconItems.forEach(item => {
        const button = item.querySelector('.nav-icon-btn');
        const dropdown = item.querySelector('.dropdown-menu');

        if (button && dropdown) {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // منع انتشار الحدث

                document.querySelectorAll('.dropdown-menu.active').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                dropdown.classList.toggle('active');
            });
        }
    });

    document.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown-menu.active').forEach(dropdown => {
            if (!event.target.closest('.nav-icon-item')) {
                dropdown.classList.remove('active');
            }
        });
    });
}

// وظيفة تهيئة وظائف البحث
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', function () {
        performSearch();
    });

    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.boxShadow = '0 4px 20px rgba(74, 144, 226, 0.3)';
        this.parentElement.style.transition = 'all 0.3s ease';
    });

    searchInput.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
        this.parentElement.style.boxShadow = 'none';
    });
}

// وظيفة تنفيذ البحث (محاكاة)
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        showNotification('يرجى إدخال كلمة للبحث', 'warning');
        return;
    }

    showNotification(`جاري البحث عن: ${searchTerm}`, 'info');

    const searchButton = document.querySelector('.search-button');
    searchButton.style.transform = 'scale(0.95)';
    searchButton.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        searchButton.style.transform = 'scale(1)';
        showNotification(`تم العثور على نتائج للبحث: ${searchTerm}`, 'success');

        const resultsSection = document.querySelector('.activities-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

// وظيفة تهيئة تحريك الشخصيات
function initializeCharacterAnimations() {
    const characters = document.querySelectorAll('.character');

    characters.forEach((character, index) => {
        // التأكد من تطبيق translate فقط على المحور Y لأن X يُحدد بـ left/right
        setInterval(() => {
            if (Math.random() > 0.7) {
                character.style.transform = `scale(1.1) rotate(${Math.random() * 10 - 5}deg) translateY(-50%)`;
                character.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

                setTimeout(() => {
                    character.style.transform = `scale(1) rotate(0deg) translateY(-50%)`;
                }, 500);
            }
        }, 3000 + (index * 1000));

        character.addEventListener('click', function () {
            this.style.transform = `scale(1.3) rotate(15deg) translateY(-50%)`;
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

            setTimeout(() => {
                this.style.transform = `scale(1) rotate(0deg) translateY(-50%)`;
                this.style.transition = 'all 0.3s ease';
            }, 600);

            const messages = [
                'مرحباً! أنا سمكة لطيفة أحب السباحة!',
                'أهلاً! أنا قندس مجتهد أحب بناء السدود!',
                'مرحباً بك! أنا خنفساء صغيرة ولطيفة!',
                'أهلاً وسهلاً! أنا حلزون أتحرك ببطء وحكمة!'
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showNotification(randomMessage, 'info');
        });

        character.addEventListener('mouseenter', function () {
            this.style.transform = `scale(1.2) rotate(5deg) translateY(-50%)`;
            this.style.transition = 'all 0.3s ease';
        });

        character.addEventListener('mouseleave', function () {
            this.style.transform = `scale(1) rotate(0deg) translateY(-50%)`;
        });
    });

    const ladybug = document.querySelector('.ladybug');
    if (ladybug) {
        setInterval(() => {
            ladybug.style.transform = 'rotate(360deg)';
            ladybug.style.transition = 'transform 1s ease-in-out';
            setTimeout(() => {
                ladybug.style.transform = 'rotate(0deg)';
            }, 1000);
        }, 5000);
    }
}

// وظيفة تهيئة تأثيرات التمرير
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            } else {
                // يمكنك إعادة إخفاء العنصر إذا خرج عن مجال الرؤية
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.activities-section, .services-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });

    const cards = document.querySelectorAll('.carousel-image-container, .fixed-image-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// وظيفة تهيئة الميزات المتجاوبة
function initializeResponsiveFeatures() {
    window.addEventListener('resize', function () {
        updateActivitiesCarouselSettings();
        updateActivitiesCarouselPosition();
        updateActivitiesCarouselButtons();
    });

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        const carousel = document.getElementById('activitiesCarousel');
        if (carousel) {
            carousel.style.scrollBehavior = 'smooth';
        }
    }
}

// وظيفة إظهار الإشعارات المحدثة
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        info: '💡',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };

    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || '💡'}</span>
        <span class="notification-text">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 4000);
}

// وظيفة إغلاق الإشعار
function closeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}