// === Гамбургер ===
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
});

// === Тема ===
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    currentTheme = newTheme;
});

// === Fade-up анимация ===
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
fadeElements.forEach(el => observer.observe(el));

// === Шапка при скролле ===
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    header.style.background = currentScroll > 80
        ? 'rgba(11, 13, 21, 0.85)'
        : 'rgba(11, 13, 21, 0.72)';
});

// === Кнопка наверх ===
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Модалки ===
const modalData = {
    about1: {
        icon: '📡',
        title: 'Опыт 7+ лет в телекоме',
        description: 'За плечами — более 7 лет работы в сфере связи. Начинал с поддержки абонентов, затем углубился в проектирование сетей и управление инфраструктурой. Сегодня я ведущий специалист, который знает, как сделать интернет быстрым и стабильным даже в самых сложных условиях.',
        details: [
            'Работа с магистральными каналами до 10 Гбит/с',
            'Опыт внедрения GPON и Ethernet-решений',
            'Управление проектами подключения жилых комплексов',
            'Сертификация Cisco CCNA (в процессе)'
        ]
    },
    about2: {
        icon: '🚀',
        title: 'Цифровая трансформация бизнеса',
        description: 'Помогаю компаниям перейти на современные стандарты связи: от замены устаревшего оборудования до внедрения комплексных IoT-решений. Моя цель — повысить эффективность бизнеса через цифровые технологии.',
        details: [
            'Аудит ИТ-инфраструктуры и разработка дорожной карты',
            'Внедрение облачных АТС и видеоконференций',
            'Настройка корпоративных VPN и защищённых каналов',
            'Оптимизация затрат на связь до 30%'
        ]
    },
    service1: {
        icon: '🌐',
        title: 'Подключение интернета',
        description: 'Предлагаю полный цикл подключения к интернету: от выбора тарифа до финальной настройки оборудования. Работаю с технологиями GPON, FTTH, а также с выделенными линиями для бизнеса.',
        details: [
            'Индивидуальный подбор тарифа под ваши задачи',
            'Бесплатный выезд инженера для диагностики',
            'Настройка роутера и Wi-Fi сети',
            'Гарантия стабильного соединения 24/7'
        ],
        action: 'Выбрать тариф'
    },
    service2: {
        icon: '🛠️',
        title: 'Настройка сетей',
        description: 'Профессиональная настройка сетевого оборудования любой сложности. Обеспечу безопасность, высокую производительность и бесшовный роуминг для вашего офиса или дома.',
        details: [
            'Настройка маршрутизаторов и межсетевых экранов',
            'Организация Wi-Fi покрытия с бесшовным роумингом',
            'Внедрение VPN для удалённых сотрудников',
            'Мониторинг и устранение неполадок'
        ],
        action: 'Заказать настройку'
    },
    service3: {
        icon: '📊',
        title: 'Аудит и оптимизация',
        description: 'Проведу комплексный аудит вашей сетевой инфраструктуры, выявлю узкие места и предложу решения для повышения скорости, надёжности и безопасности.',
        details: [
            'Анализ загрузки каналов и оборудования',
            'Тестирование качества связи и задержек',
            'Рекомендации по модернизации с расчётом окупаемости',
            'План поэтапного улучшения сети'
        ],
        action: 'Заказать аудит'
    },
    service4: {
        icon: '☁️',
        title: 'Облачные сервисы',
        description: 'Внедряю облачные решения от Ufanet: виртуальные АТС, системы видеонаблюдения, умный дом и другие сервисы для комфортной и безопасной жизни.',
        details: [
            'Настройка облачной АТС для бизнеса',
            'Видеонаблюдение с удалённым доступом',
            'Умный дом: управление светом, климатом, безопасностью',
            'Интеграция с существующими системами'
        ],
        action: 'Подробнее о сервисах'
    }
};

const overlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.getElementById('modalClose');

function openModal(id) {
    const data = modalData[id];
    if (!data) return;
    let detailsHtml = '';
    if (data.details && data.details.length) {
        detailsHtml = `
            <div class="modal-details">
                <h4>Что входит</h4>
                <ul>
                    ${data.details.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    let actionHtml = '';
    if (data.action) {
        actionHtml = `
            <a href="#contact" class="modal-action" onclick="closeModal()">
                ${data.action} →
            </a>
        `;
    }
    modalContent.innerHTML = `
        <span class="modal-icon">${data.icon}</span>
        <h2>${data.title}</h2>
        <p class="modal-desc">${data.description}</p>
        ${detailsHtml}
        ${actionHtml}
    `;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('click', () => {
        const modalId = card.dataset.modal;
        if (modalId && modalData[modalId]) {
            openModal(modalId);
        }
    });
});

// === Карусель отзывов ===
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentSlide = 0;
const cards = track.querySelectorAll('.testimonial-card');
let visibleCount = window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1;
const totalSlides = Math.ceil(cards.length / visibleCount);

function updateCarousel() {
    const width = cards[0].offsetWidth + 20; // card width + gap
    track.style.transform = `translateX(-${currentSlide * visibleCount * width}px)`;
}
window.addEventListener('resize', () => {
    visibleCount = window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    updateCarousel();
});
nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) currentSlide++;
    else currentSlide = 0;
    updateCarousel();
});
prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) currentSlide--;
    else currentSlide = totalSlides - 1;
    updateCarousel();
});
setTimeout(updateCarousel, 100); // ждём рендера

// === Анимация счётчиков ===
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const increment = Math.ceil(target / 60);
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(interval);
                } else {
                    el.textContent = current;
                }
            }, 25);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
statNumbers.forEach(el => statObserver.observe(el));