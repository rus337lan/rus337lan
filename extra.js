// === Генератор пароля Wi-Fi ===
const passOutput = document.getElementById('passwordOutput');
const genPassBtn = document.getElementById('generatePassBtn');
genPassBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    passOutput.value = password;
});

// === Конвертер скорости ===
const speedInput = document.getElementById('speedInput');
const convertedSpeed = document.getElementById('convertedSpeed');
speedInput.addEventListener('input', () => {
    const mbps = parseFloat(speedInput.value) || 0;
    convertedSpeed.textContent = (mbps / 8).toFixed(1);
});

// === Визуализатор сети (canvas) ===
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 150;

const nodes = [];
for (let i = 0; i < 20; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 3 + Math.random() * 4,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        color: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`
    });
}

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // lines
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - dist/80)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    // nodes
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        // двигаем
        n.x += n.dx;
        n.y += n.dy;
        if (n.x < 0 || n.x > canvas.width) n.dx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.dy *= -1;
    });
    requestAnimationFrame(drawNetwork);
}
drawNetwork();

// === Калькулятор стоимости ===
const speedSelect = document.getElementById('speedSelect');
const wifiSetup = document.getElementById('wifiSetup');
const vpnSetup = document.getElementById('vpnSetup');
const cloudPBX = document.getElementById('cloudPBX');
const totalPrice = document.getElementById('totalPrice');

function calcPrice() {
    let base = parseInt(speedSelect.value);
    let price = 0;
    if (base === 100) price = 800;
    else if (base === 300) price = 1200;
    else if (base === 500) price = 1800;
    else if (base === 1000) price = 2800;
    if (wifiSetup.checked) price += 500;
    if (vpnSetup.checked) price += 800;
    if (cloudPBX.checked) price += 1500;
    totalPrice.textContent = price;
}
[speedSelect, wifiSetup, vpnSetup, cloudPBX].forEach(el => {
    el.addEventListener('change', calcPrice);
});
calcPrice();

// === Фильтр проектов ===
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// === Анимация навыков при скролле ===
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.skill-fill');
            const skill = parseInt(entry.target.dataset.skill) || 0;
            fill.style.width = skill + '%';
        }
    });
}, { threshold: 0.4 });
skillItems.forEach(el => skillObserver.observe(el));