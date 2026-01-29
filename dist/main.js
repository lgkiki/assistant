const { invoke } = window.__TAURI__.tauri;
const { listen } = window.__TAURI__.event;
const { message } = window.__TAURI__.dialog;

let updateInterval = null;
const CIRCUMFERENCE = 565.48; // 2 * PI * 90

// DOM 元素
const timerDisplay = document.getElementById('timerDisplay');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const progressBar = document.getElementById('progressBar');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');
const statusText = statusEl.querySelector('.status-text');
const presetButtons = document.querySelectorAll('.preset-btn');

// 初始化
async function init() {
    await updateDisplay();
    setupEventListeners();
    listenToTimerFinished();
}

// 设置事件监听器
function setupEventListeners() {
    startBtn.addEventListener('click', handleStart);
    pauseBtn.addEventListener('click', handlePause);
    resetBtn.addEventListener('click', handleReset);

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            handlePreset(minutes);
        });
    });
}

// 监听计时器完成事件
function listenToTimerFinished() {
    listen('timer-finished', () => {
        handleTimerFinished();
    });
}

// 处理开始
async function handleStart() {
    try {
        await invoke('start_timer');
        await updateDisplay();
        startUpdateLoop();
        updateButtonStates(true, false);
        updateStatus('running', '运行中...');
    } catch (error) {
        console.error('启动失败:', error);
    }
}

// 处理暂停
async function handlePause() {
    try {
        await invoke('pause_timer');
        await updateDisplay();
        stopUpdateLoop();
        updateButtonStates(false, true);
        updateStatus('paused', '已暂停');
    } catch (error) {
        console.error('暂停失败:', error);
    }
}

// 处理重置
async function handleReset() {
    try {
        await invoke('reset_timer');
        await updateDisplay();
        stopUpdateLoop();
        updateButtonStates(false, false);
        updateStatus('ready', '准备就绪');
    } catch (error) {
        console.error('重置失败:', error);
    }
}

// 处理预设时间
async function handlePreset(minutes) {
    try {
        const seconds = minutes * 60;
        await invoke('set_time', { seconds });
        await updateDisplay();
        updateStatus('ready', '时间已设置');
    } catch (error) {
        console.error('设置时间失败:', error);
    }
}

// 处理计时器完成
function handleTimerFinished() {
    stopUpdateLoop();
    updateButtonStates(false, false);
    updateStatus('finished', '时间到！');

    // 显示提醒对话框
    if (window.__TAURI__) {
        message('时间到了！该休息一下了。', {
            title: '番茄钟提醒',
            kind: 'info'
        });
    }

    // 播放提示音（如果浏览器支持）
    playNotificationSound();
}

// 播放通知音
function playNotificationSound() {
    // 创建一个简单的提示音
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// 更新显示
async function updateDisplay() {
    try {
        const state = await invoke('get_state');
        const totalSeconds = state.total_seconds;
        const remainingSeconds = state.remaining_seconds;

        // 计算显示的时间
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;

        minutesEl.textContent = String(mins).padStart(2, '0');
        secondsEl.textContent = String(secs).padStart(2, '0');

        // 更新进度条
        const progress = (totalSeconds - remainingSeconds) / totalSeconds;
        const offset = CIRCUMFERENCE * (1 - progress);
        progressBar.style.strokeDashoffset = offset;

        // 更新按钮状态
        if (state.is_running && !state.is_paused) {
            updateButtonStates(true, false);
            updateStatus('running', '运行中...');
        } else if (state.is_paused) {
            updateButtonStates(false, true);
            updateStatus('paused', '已暂停');
        } else if (remainingSeconds === 0) {
            updateButtonStates(false, false);
            updateStatus('finished', '时间到！');
        }

    } catch (error) {
        console.error('更新显示失败:', error);
    }
}

// 更新按钮状态
function updateButtonStates(isRunning, isPaused) {
    if (isRunning && !isPaused) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    } else if (isPaused) {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
    }
}

// 更新状态显示
function updateStatus(type, text) {
    statusEl.className = 'status';
    if (type !== 'ready') {
        statusEl.classList.add(type);
    }
    statusText.textContent = text;
}

// 启动更新循环
function startUpdateLoop() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    updateInterval = setInterval(() => {
        updateDisplay();
    }, 100);
}

// 停止更新循环
function stopUpdateLoop() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// 初始化应用
init();
