// ============================================================
// interactive.js — интерактивные виджеты
// Speed Test, Network Scanner, Audio Player + Visualizer
// ============================================================

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

// ============================================================
// === АУДИОПЛЕЕР С ВИЗУАЛИЗАЦИЕЙ (Web Audio API) ===
// ============================================================

const audio = document.getElementById('audioPlayer');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 100);

let audioContext = null;
let analyser = null;
let source = null;
let animationId = null;
let isPlaying = false;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

function drawVisualizer() {
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#00d4ff');
    gradient.addColorStop(0.5, '#4a7cf7');
    gradient.addColorStop(1, '#a855f7');

    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const barHeight = percent * height * 0.9;

        ctx.shadowColor = 'rgba(0, 212, 255, 0.3)';
        ctx.shadowBlur = 10;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

        ctx.shadowBlur = 20;

        if (barHeight > 5) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(x, height - barHeight, barWidth - 1, 3);
        }

        x += barWidth + 1;
    }

    if (isPlaying) {
        animationId = requestAnimationFrame(drawVisualizer);
    }
}

function startVisualization() {
    if (animationId) cancelAnimationFrame(animationId);
    isPlaying = true;
    canvas.classList.add('active');
    drawVisualizer();
}

function stopVisualization() {
    isPlaying = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    canvas.classList.remove('active');
}

function playTrack(src) {
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audio.src = src;
    audio.load();
    audio.play()
        .then(() => {
            startVisualization();
        })
        .catch(err => {
            console.warn('Автовоспроизведение заблокировано, ожидаем клик');
        });
}

const playlistBtns = document.querySelectorAll('.playlist-btn');
playlistBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        playlistBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        playTrack(this.dataset.src);
    });
});

audio.addEventListener('pause', () => {
    stopVisualization();
});

audio.addEventListener('ended', () => {
    stopVisualization();
});

audio.addEventListener('play', () => {
    if (!isPlaying) {
        startVisualization();
    }
});

window.addEventListener('load', () => {
    const firstBtn = document.querySelector('.playlist-btn.active');
    if (firstBtn) {
        audio.src = firstBtn.dataset.src;
        audio.load();
    }
    drawEmptyVisualizer();
});

function drawEmptyVisualizer() {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎵 Нажмите на трек, чтобы начать', width/2, height/2);
}