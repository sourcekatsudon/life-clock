class LifeClock {
    constructor() {
        this.canvas = document.getElementById('clockCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 20;
        
        // 設定のデフォルト値
        this.config = {
            birthDate: new Date('1988-11-18'),
            lifeExpectancy: 70,
            theme: 'cool',
            displayMode: 'calendar'
        };
        
        // テーマ設定
        this.themes = {
            cool: {
                clockFace: '#2c3e50',
                clockBorder: '#34495e',
                hourHand: '#e74c3c',
                minuteHand: '#3498db',
                secondHand: '#f39c12',
                numbers: '#ecf0f1',
                markings: '#bdc3c7'
            },
            retro: {
                clockFace: '#8B4513',
                clockBorder: '#D2691E',
                hourHand: '#CD853F',
                minuteHand: '#DEB887',
                secondHand: '#F4A460',
                numbers: '#f4e4c1',
                markings: '#deb887'
            },
            simple: {
                clockFace: '#ffffff',
                clockBorder: '#dee2e6',
                hourHand: '#495057',
                minuteHand: '#6c757d',
                secondHand: '#dc3545',
                numbers: '#212529',
                markings: '#adb5bd'
            },
            bright: {
                clockFace: '#fff8dc',
                clockBorder: '#ffd700',
                hourHand: '#ff6347',
                minuteHand: '#32cd32',
                secondHand: '#ff1493',
                numbers: '#2c3e50',
                markings: '#ff8c00'
            },
            soft: {
                clockFace: '#fff0f5',
                clockBorder: '#ffb6c1',
                hourHand: '#dda0dd',
                minuteHand: '#98fb98',
                secondHand: '#ffc0cb',
                numbers: '#8b4513',
                markings: '#f0e68c'
            }
        };
        
        this.loadSettings();
        this.setupEventListeners();
        this.updateClock();
        
        // 1秒ごとに更新
        setInterval(() => this.updateClock(), 1000);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('lifeClockSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.config.birthDate = new Date(settings.birthDate);
            this.config.lifeExpectancy = settings.lifeExpectancy;
            this.config.theme = settings.theme || 'cool';
            this.config.displayMode = settings.displayMode || 'calendar';
        }
        
        // フォームに設定を反映
        document.getElementById('birthDate').value = this.config.birthDate.toISOString().split('T')[0];
        document.getElementById('lifeExpectancy').value = this.config.lifeExpectancy;
        document.getElementById('theme').value = this.config.theme;
        document.getElementById('displayMode').value = this.config.displayMode;
        
        // テーマを適用
        this.applyTheme();
    }
    
    saveSettings() {
        const birthDate = document.getElementById('birthDate').value;
        const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
        const theme = document.getElementById('theme').value;
        const displayMode = document.getElementById('displayMode').value;
        
        this.config.birthDate = new Date(birthDate);
        this.config.lifeExpectancy = lifeExpectancy;
        this.config.theme = theme;
        this.config.displayMode = displayMode;
        
        localStorage.setItem('lifeClockSettings', JSON.stringify({
            birthDate: birthDate,
            lifeExpectancy: lifeExpectancy,
            theme: theme,
            displayMode: displayMode
        }));
        
        // テーマを適用
        this.applyTheme();
        
        // 設定パネルを閉じる
        document.getElementById('settingsPanel').classList.remove('show');
    }
    
    setupEventListeners() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        const saveBtn = document.getElementById('saveSettings');
        
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('show');
        });
        
        saveBtn.addEventListener('click', () => {
            this.saveSettings();
        });
        
        // パネル外をクリックした時に閉じる
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
                settingsPanel.classList.remove('show');
            }
        });
    }
    
    updateClock() {
        const now = new Date();
        
        // 時計を描画
        this.drawClock(now);
        
        // デジタル情報を更新
        this.updateDigitalInfo(now);
        
        // AM/PM インジケーターを更新
        this.updateAmPmIndicator(now);
    }
    
    drawClock(now) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 時計の外枠と背景
        this.drawClockFace();
        
        // 針を描画
        this.drawHands(now);
        
        // 中心の円
        this.drawCenter();
    }
    
    drawClockFace() {
        const theme = this.themes[this.config.theme];
        
        // 外側の影
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius + 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fill();
        
        // メインの時計面
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = theme.clockFace;
        this.ctx.fill();
        this.ctx.strokeStyle = theme.clockBorder;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 目盛りと数字を描画
        this.drawMarkings();
    }
    
    drawMarkings() {
        const theme = this.themes[this.config.theme];
        
        this.ctx.font = 'bold 16px Inter';
        this.ctx.fillStyle = theme.numbers;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = this.centerX + (this.radius - 30) * Math.cos(angle);
            const y = this.centerY + (this.radius - 30) * Math.sin(angle);
            
            this.ctx.fillText(i.toString(), x, y);
        }
        
        // 目盛り線
        for (let i = 0; i < 60; i++) {
            const angle = i * 6 * Math.PI / 180;
            const isHour = i % 5 === 0;
            const lineLength = isHour ? 15 : 8;
            const lineWidth = isHour ? 2 : 1;
            
            const x1 = this.centerX + (this.radius - lineLength) * Math.cos(angle);
            const y1 = this.centerY + (this.radius - lineLength) * Math.sin(angle);
            const x2 = this.centerX + this.radius * Math.cos(angle);
            const y2 = this.centerY + this.radius * Math.sin(angle);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = isHour ? theme.markings : theme.markings + '80';
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
    }
    
    drawHands(now) {
        const theme = this.themes[this.config.theme];
        
        if (this.config.displayMode === 'calendar') {
            // カレンダー式（現在のロジック）
            // 秒針（1日で1周）
            const totalSecondsInDay = 24 * 60 * 60;
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const secondAngle = (currentSeconds / totalSecondsInDay) * 2 * Math.PI - Math.PI / 2;
            this.drawHand(secondAngle, this.radius - 30, theme.secondHand, 2);
            
            // 短針（年齢に対応、寿命で2周）- 短針は短いので年齢を表す
            const age = this.calculateAge(now);
            const ageProgress = age / this.config.lifeExpectancy;
            const ageAngle = (ageProgress * 4 * Math.PI) - Math.PI / 2; // 2周するため4π
            this.drawHand(ageAngle, this.radius - 80, theme.hourHand, 6);
            
            // 長針（月に対応、1年で1周）- 長針は長いので月を表す
            const monthProgress = (now.getMonth() + 1.0 + now.getDate() / this.getDaysInMonth(now.getFullYear(), now.getMonth())) / 12;
            const monthAngle = monthProgress * 2 * Math.PI - Math.PI / 2;
            this.drawHand(monthAngle, this.radius - 60, theme.minuteHand, 4);
        } else {
            // 単純式（寿命を24時間に換算）
            const age = this.calculateAge(now);
            const ageProgress = age / this.config.lifeExpectancy;
            const totalMinutes = ageProgress * 24 * 60; // 寿命を24時間（1440分）に換算
            const totalSeconds = totalMinutes * 60; // 秒数に換算
            
            // 短針（12時間で1周 → 寿命の半分で1周）
            const hourAngle = (ageProgress * 4 * Math.PI) - Math.PI / 2; // 2周するため4π
            this.drawHand(hourAngle, this.radius - 80, theme.hourHand, 6);
            
            // 長針（60分で1周 → 60分の1の速度）
            const minuteAngle = (totalMinutes % 60) / 60 * 2 * Math.PI - Math.PI / 2;
            this.drawHand(minuteAngle, this.radius - 60, theme.minuteHand, 4);
            
            // 秒針（60秒で1周）
            const secondAngle = (totalSeconds % 60) / 60 * 2 * Math.PI - Math.PI / 2;
            this.drawHand(secondAngle, this.radius - 30, theme.secondHand, 2);
        }
    }
    
    drawHand(angle, length, color, width) {
        const x = this.centerX + length * Math.cos(angle);
        const y = this.centerY + length * Math.sin(angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }
    
    drawCenter() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
    }
    
    updateDigitalInfo(now) {
        // 現在の日時
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long'
        };
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        };
        
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('ja-JP', dateOptions);
        document.getElementById('currentTime').textContent = 
            now.toLocaleTimeString('ja-JP', timeOptions);
        
        // 年齢計算
        const age = this.calculateAge(now);
        const ageYears = Math.floor(age);
        const ageMonths = Math.floor((age - ageYears) * 12);
        const ageDays = Math.floor(((age - ageYears) * 12 - ageMonths) * 30);
        
        document.getElementById('currentAge').textContent = 
            `${ageYears}年${ageMonths}ヶ月${ageDays}日`;
        
        // 残り時間計算
        const lifeEndDate = new Date(this.config.birthDate);
        lifeEndDate.setFullYear(lifeEndDate.getFullYear() + this.config.lifeExpectancy);
        
        const remaining = lifeEndDate - now;
        const remainingYears = Math.floor(remaining / (1000 * 60 * 60 * 24 * 365.25));
        const remainingMonths = Math.floor((remaining % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const remainingDays = Math.floor((remaining % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        
        document.getElementById('remainingTime').textContent = 
            `${remainingYears}年${remainingMonths}ヶ月${remainingDays}日`;
        
        // 残り週数計算
        const remainingWeeks = Math.floor(remaining / (1000 * 60 * 60 * 24 * 7));
        document.getElementById('remainingWeeks').textContent = `${remainingWeeks}週`;
        
        // 人生の進捗
        const lifeProgress = (age / this.config.lifeExpectancy) * 100;
        document.getElementById('lifeProgress').style.width = `${Math.min(lifeProgress, 100)}%`;
        document.getElementById('progressText').textContent = `${lifeProgress.toFixed(1)}%`;
        
        // 時計の説明を更新
        this.updateClockDescription();
    }
    
    updateAmPmIndicator(now) {
        const age = this.calculateAge(now);
        const isAm = age < (this.config.lifeExpectancy / 2);
        const indicator = document.getElementById('amPmIndicator');
        
        indicator.textContent = isAm ? 'AM' : 'PM';
        indicator.className = `am-pm-indicator ${isAm ? 'am' : 'pm'}`;
    }
    
    calculateAge(now) {
        const diffTime = now - this.config.birthDate;
        return diffTime / (1000 * 60 * 60 * 24 * 365.25);
    }
    
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    updateClockDescription() {
        const description = document.getElementById('clockDescription');
        if (this.config.displayMode === 'calendar') {
            description.textContent = '長針=日月 短針=人生 秒針=時刻';
        } else {
            description.textContent = '長針=分 短針=時 秒針=秒';
        }
    }
    
    applyTheme() {
        // bodyのクラスをリセット
        document.body.className = '';
        // 新しいテーマクラスを追加
        document.body.classList.add(`theme-${this.config.theme}`);
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new LifeClock();
});