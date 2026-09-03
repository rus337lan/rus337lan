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

// ==========================================================
// ===== НОВЫЕ ВИДЖЕТЫ =====
// ==========================================================

// 1. Пинг-тестер
const pingBtn = document.getElementById('pingBtn');
const pingResult = document.getElementById('pingResult');

pingBtn.addEventListener('click', () => {
    pingBtn.disabled = true;
    pingBtn.textContent = '⏳ Пингуем...';
    pingResult.textContent = 'Отправка запроса...';
    const delay = Math.floor(Math.random() * 120) + 10; // 10-130 мс
    const loss = Math.random() > 0.85; // 15% потеря
    setTimeout(() => {
        if (loss) {
            pingResult.innerHTML = '❌ <span style="color:#f87171;">Превышен интервал ожидания</span>';
        } else {
            pingResult.innerHTML = `✅ Ответ от 8.8.8.8: время = <strong style="color:#4ade80;">${delay} мс</strong>`;
        }
        pingBtn.disabled = false;
        pingBtn.textContent = '🏓 Пинговать';
    }, 600 + Math.random() * 400);
});

// 2. Генератор IP
const ipOutput = document.getElementById('ipOutput');
const generateIpBtn = document.getElementById('generateIpBtn');

generateIpBtn.addEventListener('click', () => {
    const octets = [];
    for (let i = 0; i < 4; i++) {
        octets.push(Math.floor(Math.random() * 255));
    }
    ipOutput.value = octets.join('.');
});

// 3. Статус сети (переключатель)
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const toggleStatusBtn = document.getElementById('toggleStatusBtn');
let isOnline = true;

toggleStatusBtn.addEventListener('click', () => {
    isOnline = !isOnline;
    if (isOnline) {
        statusIndicator.style.background = '#4ade80';
        statusIndicator.style.boxShadow = '0 0 20px rgba(74,222,128,0.5)';
        statusText.textContent = 'Online';
        statusText.style.color = '#4ade80';
        toggleStatusBtn.textContent = 'Переключить';
    } else {
        statusIndicator.style.background = '#f87171';
        statusIndicator.style.boxShadow = '0 0 20px rgba(248,113,113,0.5)';
        statusText.textContent = 'Offline';
        statusText.style.color = '#f87171';
        toggleStatusBtn.textContent = 'Восстановить';
    }
});

// 4. Калькулятор подсети
const subnetIp = document.getElementById('subnetIp');
const subnetMask = document.getElementById('subnetMask');
const calcSubnetBtn = document.getElementById('calcSubnetBtn');
const subnetResult = document.getElementById('subnetResult');

function ipToNumber(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}
function numberToIp(num) {
    return [(num >> 24) & 255, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.');
}
function getMaskBits(mask) {
    const num = ipToNumber(mask);
    let bits = 0;
    for (let i = 31; i >= 0; i--) {
        if ((num >> i) & 1) bits++;
        else break;
    }
    return bits;
}

calcSubnetBtn.addEventListener('click', () => {
    const ipStr = subnetIp.value.trim();
    const maskStr = subnetMask.value.trim();
    try {
        const ipNum = ipToNumber(ipStr);
        const maskNum = ipToNumber(maskStr);
        const network = ipNum & maskNum;
        const broadcast = network | (~maskNum);
        const hosts = Math.pow(2, 32 - getMaskBits(maskStr)) - 2;
        subnetResult.innerHTML = `
            Адрес сети: <strong>${numberToIp(network)}</strong> |
            Broadcast: <strong>${numberToIp(broadcast)}</strong> |
            Хостов: <strong>${hosts}</strong>
        `;
    } catch (e) {
        subnetResult.textContent = '❌ Некорректный IP или маска';
    }
});

// 5. Симулятор обрыва связи
const breakBtn = document.getElementById('breakBtn');
const breakStatus = document.getElementById('breakStatus');
let broken = false;

breakBtn.addEventListener('click', () => {
    if (broken) return;
    broken = true;
    breakBtn.disabled = true;
    breakStatus.textContent = '💥 Связь потеряна!';
    breakStatus.style.color = '#f87171';
    // Имитация восстановления через 3-5 секунд
    const timeout = 3000 + Math.random() * 2000;
    setTimeout(() => {
        broken = false;
        breakBtn.disabled = false;
        breakStatus.textContent = '✅ Связь восстановлена';
        breakStatus.style.color = '#4ade80';
        setTimeout(() => {
            breakStatus.textContent = 'Связь есть';
            breakStatus.style.color = '#4ade80';
        }, 1500);
    }, timeout);
});