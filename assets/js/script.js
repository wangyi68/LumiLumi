document.addEventListener('DOMContentLoaded', () => {
    // Utility: Log messages with timestamp in Shanghai timezone
    const log = (message) => {
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
        console.log(`[App | ${timestamp}] ${message}`);
    };

    log('Initializing application');

    // DOM elements
    const elements = {
        video: document.getElementById('myVideo'),
        terminal: document.getElementById('terminal'),
        terminalText: document.getElementById('terminal-text'),
        closeButton: document.getElementById('close-button'),
        blurredBox: document.getElementById('blurred-box'),
        musicControls: document.getElementById('music-controls'),
        videoBackground: document.getElementById('video-background')
    };

    // Get current date and time in Asia/Shanghai timezone
    const currentDateTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) + ' +08';

    // Terminal display lines with dynamic date/time
    const terminalLines = [
        'User: WangYi',
        'IP: Loading...',
        `System: Loading...`,
        'Bio Loaded',
        `Date: ${currentDateTime}`,
        'Press Enter To Continue'
    ];
    let currentLineIndex = 0;

    // ASCII art for terminal intro
    const asciiArt = `
    ⡟⠛⠻⠛⠻⣿⣿⡿⠛⠉⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⡇⠐⡀⠂⢁⠟⢁⣠⣶⣿⡄⢹⣿⣿⣿⣿⣿⠿⠿⠛⣉⣉⡄⢹
    ⣿⣦⣄⡕⠁⣴⣿⣿⣿⡿⢋⣀⣤⡤⢀⠄⣤⣶⣾⣿⣿⣿⡇⠀
    ⣿⣿⡟⢠⣾⣿⣿⣿⣿⠁⢆⣾⣿⡁⢎⣾⣿⣿⣿⣿⣿⣿⡇⢠
    ⡿⠟⢠⣿⠟⠻⣿⣿⣿⣿⣾⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⠃⣸
    ⡆⢻⣿⡿⠖⠀⠈⢻⣿⢻⣿⣿⣿⣷⣟⠿⠟⠛⠙⢿⣿⣿⠀⣿
    ⢁⣾⣿⣇⣤⣴⣾⣿⣿⣮⣭⣬⣭⣾⣧⢄⠀⠒⢶⣿⣿⣿⠧⠘
    ⠀⣿⠛⠡⠂⠀⡀⠈⠙⠟⠉⠉⠀⠀⢍⠺⣷⣦⣾⣿⣿⣿⣦⡉
    ⣧⠘⣈⣤⡀⠁⠄⡈⠄⡀⠂⠌⢐⣀⣀⠱⠘⣟⡿⣿⣿⣶⠉⣴
    ⡟⢰⣿⣿⣿⠀⠚⠄⠠⠐⢀⠂⣿⣿⣿⣿⣶⣬⡺⣹⢲⡞⠆⢹
    ⡇⢸⣿⣿⣟⠀⠀⠂⠁⠀⣂⠀⠹⣿⢿⣿⣿⣿⣿⣷⣭⡀⢴⣿
    ⣷⡌⠻⡿⠋⠄⠀⠀⠀⠐⠀⠃⠀⠙⢷⣿⣿⣿⣿⣾⣿⣿⣦⡙
    `;

    // Initialize video background
    const setupVideo = () => {
        log('Setting up video background');
        elements.video.preload = 'auto';
        elements.video.pause();

        const videoOverlay = document.createElement('div');
        videoOverlay.id = 'video-overlay';
        elements.videoBackground.appendChild(videoOverlay);
        videoOverlay.style.display = 'block';
    };

    // Detect operating system
    const detectOS = () => {
        const ua = navigator.userAgent;
        if (/Windows/.test(ua)) return 'Windows';
        if (/Macintosh/.test(ua)) return 'macOS';
        if (/Linux/.test(ua)) return 'Linux';
        if (/Android/.test(ua)) return 'Android';
        if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
        return 'Unknown';
    };

    // Fetch IP with fallback
    const fetchIP = async () => {
        log('Fetching IP from primary API (ipify.org)');
        const tryFetchIP = async (url, apiName) => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const data = await res.json();
                return data.ip;
            } catch (error) {
                log(`Failed to fetch IP from ${apiName}: ${error.message}`);
                return null;
            }
        };

        let ip = await tryFetchIP('https://api.ipify.org?format=json', 'ipify.org');
        if (!ip) {
            log('Retrying with fallback API (ipapi.co)');
            ip = await tryFetchIP('https://ipapi.co/json/', 'ipapi.co');
        }

        terminalLines[1] = ip ? `IP: ${ip}` : 'IP: Unable to fetch';
        log(`IP Fetch Result: ${terminalLines[1]}`);
    };

    // Typing animation for terminal
    const typeWriter = () => {
        const text = currentLineIndex === 0 ? asciiArt : terminalLines[currentLineIndex - 1];
        let charIndex = 0;
        const speed = currentLineIndex === 0 ? 10 : 40;
        log(`Starting typing animation for line ${currentLineIndex}: ${text.substring(0, 20)}...`);

        if (currentLineIndex === 0) {
            elements.terminalText.style.transform = 'scale(1)';
            elements.terminalText.style.opacity = '1';
        }

        const typeChar = () => {
            if (charIndex < text.length) {
                elements.terminalText.textContent += text.charAt(charIndex++);
                setTimeout(typeChar, speed);
            } else {
                elements.terminalText.textContent += '\n';
                log(`Finished typing line ${currentLineIndex}`);
                if (++currentLineIndex <= terminalLines.length) {
                    requestAnimationFrame(typeWriter);
                } else {
                    log('Typing animation completed, enabling user actions');
                    enableUserActions();
                }
            }
        };
        typeChar();
    };

    // Enable user interactions (Enter key, click, close button)
    const enableUserActions = () => {
        const startVideo = () => {
            log('Starting video playback - User interaction detected');
            elements.terminal.style.display = 'none';
            elements.video.play();
            elements.blurredBox.style.display = 'block';
            elements.musicControls.style.display = 'flex';
            document.body.classList.add('video-normal');
            window.MusicPlayer?.start();
            log('Video started, UI updated, MusicPlayer started');
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                log('Enter key pressed');
                startVideo();
            }
        }, { once: true });

        elements.terminal.addEventListener('click', () => {
            log('Terminal clicked');
            startVideo();
        }, { once: true });

        elements.closeButton.addEventListener('click', () => {
            log('Close button clicked');
            startVideo();
        }, { once: true });
    };

    // Center terminal on screen
    const centerTerminal = () => {
        elements.terminal.style.position = 'absolute';
        elements.terminal.style.left = `${(window.innerWidth - elements.terminal.offsetWidth) / 2}px`;
        elements.terminal.style.top = `${(window.innerHeight - elements.terminal.offsetHeight) / 2}px`;
        log(`Terminal centered: left=${elements.terminal.style.left}, top=${elements.terminal.style.top}`);
    };

    // Initialize application
    const initialize = () => {
        log('Initializing terminal styles and OS detection');
        terminalLines[2] = `System: ${detectOS()}`;
        log(`Detected OS: ${terminalLines[2]}`);

        elements.terminalText.style.textAlign = 'center';
        elements.terminalText.style.opacity = '0';
        elements.terminalText.style.transform = 'scale(0.8)';
        elements.terminalText.style.transition = 'all 1.2s ease-out';

        setupVideo();
        centerTerminal();
        window.addEventListener('resize', () => {
            log('Window resized, recentering terminal');
            centerTerminal();
        });

        fetchIP().then(() => typeWriter());
    };

    // Start the application
    initialize();
});