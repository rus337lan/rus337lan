// === Speed Test ===
const downloadValue = document.getElementById('downloadValue');
const uploadValue = document.getElementById('uploadValue');
const downloadFill = document.getElementById('downloadFill');
const uploadFill = document.getElementById('uploadFill');
const speedBtn = document.getElementById('speedTestBtn');

function runSpeedTest() {
    speedBtn.disabled = true;
    speedBtn.textContent = '⏳ Тестируем...';
    downloadValue.textContent = '0 Mbps';
    uploadValue.textContent = '0 Mbps';
    downloadFill.style.width = '0%';
    uploadFill.style.width = '0%';

    const downTarget = Math.floor(Math.random() * 400) + 100;
    const upTarget = Math.floor(Math.random() * 200) + 50;

    let down = 0;
    const downInterval = setInterval(() => {
        down += Math.floor(downTarget / 20) + 1;
        if (down >= downTarget) { down = downTarget; clearInterval(downInterval); }
        downloadValue.textContent = down + ' Mbps';
        downloadFill.style.width = Math.min((down / downTarget) * 100, 100) + '%';
    }, 80);

    let up = 0;
    const upInterval = setInterval(() => {
        up += Math.floor(upTarget / 18) + 1;
        if (up >= upTarget) { up = upTarget; clearInterval(upInterval); }
        uploadValue.textContent = up + ' Mbps';
        uploadFill.style.width = Math.min((up / upTarget) * 100, 100) + '%';
    }, 90);

    setTimeout(() => {
        speedBtn.disabled = false;
        speedBtn.textContent = '▶ Запустить тест';
    }, 2500);
}
speedBtn.addEventListener('click', runSpeedTest);

// === Network Scanner ===
const scannerGrid = document.getElementById('scannerGrid');
const scanBtn = document.getElementById('scanBtn');
const scanStatus = document.getElementById('scanStatus');
const dots = [];
for (let i = 0; i < 36; i++) {
    const dot = document.createElement('div');
    dot.className = 'scanner-dot';
    scannerGrid.appendChild(dot);
    dots.push(dot);
}
let scanning = false;

function resetScanner() {
    dots.forEach(d => d.className = 'scanner-dot');
    scanStatus.textContent = 'Ожидание';
}

function runScan() {
    if (scanning) return;
    scanning = true;
    scanBtn.disabled = true;
    scanStatus.textContent = '🔍 Сканирование...';
    resetScanner();

    let step = 0;
    const totalSteps = 30;
    const interval = setInterval(() => {
        if (step >= totalSteps) {
            clearInterval(interval);
            const foundCount = Math.floor(Math.random() * 12) + 8;
            const shuffled = dots.map((_, idx) => idx).sort(() => Math.random() - 0.5);
            for (let i = 0; i < foundCount && i < shuffled.length; i++) {
                dots[shuffled[i]].className = 'scanner-dot found';
            }
            scanStatus.textContent = `✅ Найдено ${foundCount} устройств`;
            scanning = false;
            scanBtn.disabled = false;
            return;
        }
        let idx;
        do { idx = Math.floor(Math.random() * dots.length); } while (dots[idx].classList.contains('active'));
        dots[idx].className = 'scanner-dot active';
        setTimeout(() => {
            if (dots[idx].classList.contains('active')) dots[idx].className = 'scanner-dot';
        }, 300);
        step++;
    }, 120);
}
scanBtn.addEventListener('click', runScan);
resetScanner();

// === Terminal ===
const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
const terminalBtn = document.getElementById('terminalBtn');

function appendTerminal(text, type = '') {
    const line = document.createElement('div');
    line.innerHTML = text;
    if (type) line.className = type;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function executeCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    appendTerminal(`<span class="prompt">$</span> ${trimmed}`);
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();

    setTimeout(() => {
        if (command === 'ping') {
            const target = parts[1] || '127.0.0.1';
            const delay = Math.floor(Math.random() * 40) + 5;
            appendTerminal(`Ответ от ${target}: время=${delay}мс TTL=64`, 'success');
            appendTerminal('Статистика: отправлено=4, получено=4, потеряно=0%', '');
        } else if (command === 'traceroute') {
            const target = parts[1] || 'google.com';
            const hops = Math.floor(Math.random() * 8) + 5;
            let result = `Трассировка к ${target}<br>`;
            for (let i = 1; i <= hops; i++) {
                const time = Math.floor(Math.random() * 30) + 2;
                const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                result += `  ${i}  ${ip}  ${time}ms  ${time+Math.floor(Math.random()*10)}ms  ${time+Math.floor(Math.random()*20)}ms<br>`;
            }
            appendTerminal(result, 'success');
        } else if (command === 'ipconfig' || command === 'ifconfig') {
            appendTerminal(`
                Ethernet adapter Ethernet:<br>
                IPv4-адрес: 192.168.1.${Math.floor(Math.random()*254)+1}<br>
                Маска подсети: 255.255.255.0<br>
                Основной шлюз: 192.168.1.1<br>
                DNS-сервер: 8.8.8.8
            `, 'success');
        } else if (command === 'help') {
            appendTerminal(`
                Доступные команды:<br>
                ping [ip/domain] — проверка связи<br>
                traceroute [ip/domain] — маршрут<br>
                ipconfig / ifconfig — настройки сети<br>
                help — справка
            `, '');
        } else {
            appendTerminal(`Ошибка: команда не распознана. Введите 'help'`, 'error');
        }
    }, 300 + Math.random() * 400);
}

terminalBtn.addEventListener('click', () => {
    const cmd = terminalInput.value;
    if (!cmd.trim()) return;
    executeCommand(cmd);
    terminalInput.value = '';
});
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') terminalBtn.click();
});
appendTerminal('Добро пожаловать в терминал инженера! Введите help для списка команд.', '');