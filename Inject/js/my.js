







// ===============================侧边栏倒计时开始======================================
// 在const config里面可修改目标日期和添加目标
const CountdownTimer = (() => {
    const config = {
        targetDate: "2026-02-17",
        targetName: "春节",
        units: {
            day: { text: "今日", unit: "小时" },
            week: { text: "本周", unit: "天" },
            month: { text: "本月", unit: "天" },
            year: { text: "本年", unit: "天" }
        }
    };
    
    const calculators = {
        day: () => {
            const hours = new Date().getHours();
            return {
                remaining: 24 - hours,
                percentage: (hours / 24) * 100
            };
        },
        week: () => {
            const day = new Date().getDay();
            const passed = day === 0 ? 6 : day - 1;
            return {
                remaining: 6 - passed,
                percentage: ((passed + 1) / 7) * 100
            };
        },
        month: () => {
            const now = new Date();
            const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const passed = now.getDate() - 1;
            return {
                remaining: total - passed,
                percentage: (passed / total) * 100
            };
        },
        year: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const total = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0);
            const passed = Math.floor((now - start) / 86400000);
            return {
                remaining: total - passed,
                percentage: (passed / total) * 100
            };
        }
    };

    function updateCountdown() {
        const elements = ['eventName', 'eventDate', 'daysUntil', 'countRight']
            .map(id => document.getElementById(id));

        if (elements.some(el => !el)) return;

        const [eventName, eventDate, daysUntil, countRight] = elements;
        const now = new Date();
        const target = new Date(config.targetDate);

        eventName.textContent = config.targetName;
        eventDate.textContent = config.targetDate;
        daysUntil.textContent = Math.round((target - now.setHours(0,0,0,0)) / 86400000);

        countRight.innerHTML = Object.entries(config.units)
            .map(([key, {text, unit}]) => {
                const {remaining, percentage} = calculators[key]();
                return `
                    <div class="cd-count-item">
                        <div class="cd-item-name">${text}</div>
                        <div class="cd-item-progress">
                            <div class="cd-progress-bar" style="width: ${percentage}%; opacity: ${percentage/100}"></div>
                            <span class="cd-percentage ${percentage >= 46 ? 'cd-many' : ''}">${percentage.toFixed(2)}%</span>
                            <span class="cd-remaining ${percentage >= 60 ? 'cd-many' : ''}">
                                <span class="cd-tip">还剩</span>${remaining}<span class="cd-tip">${unit}</span>
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
    }

    function injectStyles() {
        const styles = `
            .card-countdown .item-content {
                display: flex;
            }
            .cd-count-left {
                position: relative;
                display: flex;
                flex-direction: column;
                margin-right: 0.8rem;
                line-height: 1.5;
                align-items: center;
                justify-content: center;
            }
            .cd-count-left .cd-text {
                font-size: 14px;
            }
            .cd-count-left .cd-name {
                font-weight: bold;
                font-size: 18px;
            }
            .cd-count-left .cd-time {
                font-size: 30px;
                font-weight: bold;
                color: var(--anzhiyu-main);
            }
            .cd-count-left .cd-date {
                font-size: 12px;
                opacity: 0.6;
            }
            .cd-count-left::after {
                content: "";
                position: absolute;
                right: -0.8rem;
                width: 2px;
                height: 80%;
                background-color: var(--anzhiyu-main);
                opacity: 0.5;
            }
            .cd-count-right {
                flex: 1;
                margin-left: .8rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .cd-count-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 24px;
            }
            .cd-item-name {
                font-size: 14px;
                margin-right: 0.8rem;
                white-space: nowrap;
            }
            .cd-item-progress {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                width: 100%;
                border-radius: 8px;
                background-color: var(--anzhiyu-background);
                overflow: hidden;
            }
            .cd-progress-bar {
                height: 100%;
                border-radius: 8px;
                background-color: var(--anzhiyu-main);
            }
            .cd-percentage,
            .cd-remaining {
                position: absolute;
                font-size: 12px;
                margin: 0 6px;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            .cd-many {
                color: #fff;
            }
            .cd-remaining {
                opacity: 0;
                transform: translateX(10px);
            }
            .card-countdown .item-content:hover .cd-remaining {
                transform: translateX(0);
                opacity: 1;
            }
            .card-countdown .item-content:hover .cd-percentage {
                transform: translateX(-10px);
                opacity: 0;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    let timer;
    const start = () => {
        injectStyles();
        updateCountdown();
        timer = setInterval(updateCountdown, 600000);
    };

    ['pjax:complete', 'DOMContentLoaded'].forEach(event => document.addEventListener(event, start));
    document.addEventListener('pjax:send', () => timer && clearInterval(timer));

    return { start, stop: () => timer && clearInterval(timer) };
})();

// ===============================侧边栏倒计时结束======================================














// ===========================显示FPS功能开始================================
// 有对应的CSS
if (window.localStorage.getItem("fpson") == undefined || window.localStorage.getItem("fpson") == "1") {
  var rAF = function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }();
  var frame = 0;
  var allFrameCount = 0;
  var lastTime = Date.now();
  var lastFameTime = Date.now();
  var loop = function () {
    var now = Date.now();
    var fs = (now - lastFameTime);
    var fps = Math.round(1000 / fs);

    lastFameTime = now;
    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
    allFrameCount++;
    frame++;

    if (now > 1000 + lastTime) {
      var fps = Math.round((frame * 1000) / (now - lastTime));
      if (fps <= 5) {
        var kd = `<span style="color:#bd0000">卡成ppt🤢</span>`
      } else if (fps <= 15) {
        var kd = `<span style="color:red">电竞级帧率😖</span>`
      } else if (fps <= 25) {
        var kd = `<span style="color:orange">有点难受😨</span>`
      } else if (fps < 35) {
        var kd = `<span style="color:#9338e6">不太流畅🙄</span>`
      } else if (fps <= 45) {
        var kd = `<span style="color:#08b7e4">还不错哦😁</span>`
      } else {
        var kd = `<span style="color:#39c5bb">十分流畅🤣</span>`
      }
      document.getElementById("fps").innerHTML = `FPS:${fps} ${kd}`;
      frame = 0;
      lastTime = now;
    };

    rAF(loop);
  }

  loop();
} else {
  document.getElementById("fps").style = "display:none!important"
}

// ===========================显示FPS功能开始===========================================



















// ===========================顶部卡片修改为音乐播放器开始================================
(function() {
    // --- Anzhiyu 自定义音乐播放器 ---
    // --- 主要配置 ---
    const anzhiyuPlayerConfig = {
        apiBaseUrl: "https://api.qcxz.ink/",
        defaultPlaylistId: "13246971912",//"7526297568",
        defaultServer: "netease",
        defaultCoverArt: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        placeholderId: "custom-music-player-placeholder",
        playerUniquePrefix: "anzhiyuCustomPlayer",
        persistentPlayerContainerId: 'anzhiyu-persistent-player-container',
        initializationFlag: '__anzhiyuPlayerInitialized'
    };

    const pfx = anzhiyuPlayerConfig.playerUniquePrefix;

    let anzhiyuPlayerState = {
        playlist: [],
        currentTrackIndex: 0,
        audioElement: null,
        playerDOM: null,
        songTitleElement: null,
        artistNameElement: null,
        playlistContainerElement: null,
        coverArtImgElement: null,
    };

    async function anzhiyuPlayerFetchPlaylist(playlistId = anzhiyuPlayerConfig.defaultPlaylistId, server = anzhiyuPlayerConfig.defaultServer) {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState) return;
        const { songTitleElement, artistNameElement, coverArtImgElement, playlistContainerElement } = globalState;

        if (songTitleElement) songTitleElement.textContent = "正在加载歌单...";
        if (artistNameElement) artistNameElement.textContent = "";
        if (coverArtImgElement) coverArtImgElement.src = anzhiyuPlayerConfig.defaultCoverArt;
        if (playlistContainerElement) playlistContainerElement.innerHTML = `<div class="${pfx}-playlist-item">正在加载...</div>`;

        try {
            const response = await fetch(`${anzhiyuPlayerConfig.apiBaseUrl}?server=${server}&type=playlist&id=${playlistId}`);
            if (!response.ok) throw new Error(`HTTP 请求错误! 状态: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                globalState.playlist = data;
                if (typeof anzhiyuPlayerPopulatePlaylistDisplay === "function") anzhiyuPlayerPopulatePlaylistDisplay();
                if (typeof anzhiyuPlayerLoadTrack === "function") anzhiyuPlayerLoadTrack(0);
            } else {
                globalState.playlist = [];
                if (songTitleElement) songTitleElement.textContent = "歌单为空";
                if (playlistContainerElement) playlistContainerElement.innerHTML = `<div class="${pfx}-playlist-item">歌单为空</div>`;
            }
        } catch (error) {
            if (songTitleElement) songTitleElement.textContent = "歌单加载失败";
            globalState.playlist = [];
            if (playlistContainerElement) playlistContainerElement.innerHTML = `<div class="${pfx}-playlist-item">加载失败</div>`;
        }
    }

    function anzhiyuPlayerLoadTrack(index, playImmediately = false) {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState) return;
        const { playlist, audioElement, songTitleElement, artistNameElement, coverArtImgElement } = globalState;

        if (!playlist || playlist.length === 0) {
            return;
        }
        if (index >= 0 && index < playlist.length) {
            globalState.currentTrackIndex = index;
            const track = playlist[index];

            if (songTitleElement) songTitleElement.textContent = track.name || "未知歌曲";
            if (artistNameElement) artistNameElement.textContent = track.artist || "未知艺术家";
            if (coverArtImgElement) coverArtImgElement.src = track.pic || anzhiyuPlayerConfig.defaultCoverArt;

            if (audioElement) {
                const wasPlaying = !audioElement.paused && audioElement.currentTime > 0;
                const currentSrc = audioElement.currentSrc;
                const newSrc = new URL(track.url, window.location.href).href;

                if (currentSrc !== newSrc) {
                    audioElement.src = newSrc;
                    if (playImmediately || wasPlaying) {
                        audioElement.load();
                        const playPromise = audioElement.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {});
                        }
                    }
                } else if (playImmediately && audioElement.paused) {
                    const playPromise = audioElement.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {});
                    }
                }
            }
            if(typeof anzhiyuPlayerUpdatePlaylistActiveItem === "function") anzhiyuPlayerUpdatePlaylistActiveItem();
        }
    }

    function anzhiyuPlayerNextSong() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState) return;
        const { playlist } = globalState;

        if (!playlist || playlist.length === 0) return;
        let newIndex = (globalState.currentTrackIndex + 1) % playlist.length;
        if (typeof anzhiyuPlayerLoadTrack === "function") anzhiyuPlayerLoadTrack(newIndex, true);
    }

    function anzhiyuPlayerPopulatePlaylistDisplay() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState) return;
        const { playlistContainerElement, playlist } = globalState;

        if (!playlistContainerElement || !playlist || playlist.length === 0) {
            if(playlistContainerElement) playlistContainerElement.innerHTML = `<div class="${pfx}-playlist-item">歌单为空</div>`;
            return;
        }
        playlistContainerElement.innerHTML = '';

        playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `${pfx}-playlist-item`;
            item.dataset.index = index;

            const trackNumber = document.createElement('span');
            trackNumber.className = `${pfx}-playlist-item-number`;
            trackNumber.textContent = (index + 1).toString().padStart(2, '0');

            const trackInfo = document.createElement('span');
            trackInfo.className = `${pfx}-playlist-item-info`;
            trackInfo.textContent = `${track.name || '未知歌曲'} - ${track.artist || '未知艺术家'}`;
            trackInfo.title = `${track.name || '未知歌曲'} - ${track.artist || '未知艺术家'}`;

            item.appendChild(trackNumber);
            item.appendChild(trackInfo);

            item.addEventListener('click', () => {
                if (typeof anzhiyuPlayerLoadTrack === "function") {
                    anzhiyuPlayerLoadTrack(index, true);
                }
            });
            playlistContainerElement.appendChild(item);
        });
        anzhiyuPlayerUpdatePlaylistActiveItem();
    }

    function anzhiyuPlayerUpdatePlaylistActiveItem() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState) return;
        const { playlistContainerElement, currentTrackIndex } = globalState;

        if (!playlistContainerElement) return;
        const items = playlistContainerElement.querySelectorAll(`.${pfx}-playlist-item`);

        items.forEach((item, index) => {
            if (index === currentTrackIndex) {
                item.classList.add(`${pfx}-playlist-item-active`);
            } else {
                item.classList.remove(`${pfx}-playlist-item-active`);
            }
        });
    }

    function initializeGlobalPlayer() {
        if (window[anzhiyuPlayerConfig.initializationFlag]) {
            return;
        }

        let persistentContainer = document.getElementById(anzhiyuPlayerConfig.persistentPlayerContainerId);
        if (!persistentContainer) {
            persistentContainer = document.createElement('div');
            persistentContainer.id = anzhiyuPlayerConfig.persistentPlayerContainerId;
            persistentContainer.style.display = 'none'; 
            document.body.appendChild(persistentContainer);
        }

        let audioElement = document.getElementById(`${pfx}-audio-element`);
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = `${pfx}-audio-element`;
            audioElement.controls = true;
        }
        anzhiyuPlayerState.audioElement = audioElement; 


        let playerUIDiv = document.querySelector(`.${pfx}-player-container-v3`); 
        if (!playerUIDiv) { 
             playerUIDiv = persistentContainer.querySelector(`.${pfx}-player-container-v3`);
             if (!playerUIDiv) {
                playerUIDiv = document.createElement('div');
                playerUIDiv.className = `${pfx}-player-container-v3`;
                playerUIDiv.innerHTML = `
                    <div class="${pfx}-left-column">
                        <div id="${pfx}-cover-art-wrapper" class="${pfx}-cover-art-wrapper">
                            <img id="${pfx}-cover-art-img" src="${anzhiyuPlayerConfig.defaultCoverArt}" alt="专辑封面">
                        </div>
                        <div class="${pfx}-song-info-left">
                            <h2 id="${pfx}-song-title" style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></h2>
                            <p id="${pfx}-artist-name" style="width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></p>
                        </div>
                    </div>
                    <div class="${pfx}-right-column">
                        <div id="${pfx}-playlist-container" class="${pfx}-playlist-container">
                            <div class="${pfx}-playlist-item">正在加载...</div>
                        </div>
                        <div class="${pfx}-controls-area">
                            </div>
                    </div>
                `;
             }
        }
        anzhiyuPlayerState.playerDOM = playerUIDiv; 

        const controlsArea = playerUIDiv.querySelector(`.${pfx}-controls-area`);
        if (controlsArea) {
            if (audioElement.parentNode !== controlsArea) { 
                 controlsArea.appendChild(audioElement);
            }
        } else {
            if (audioElement.parentNode !== playerUIDiv) { 
                playerUIDiv.appendChild(audioElement);
            }
        }
        
        if (playerUIDiv.parentNode !== persistentContainer) {
            persistentContainer.appendChild(playerUIDiv);
        }


        anzhiyuPlayerState.songTitleElement = playerUIDiv.querySelector(`#${pfx}-song-title`);
        anzhiyuPlayerState.artistNameElement = playerUIDiv.querySelector(`#${pfx}-artist-name`);
        anzhiyuPlayerState.playlistContainerElement = playerUIDiv.querySelector(`#${pfx}-playlist-container`);
        anzhiyuPlayerState.coverArtImgElement = playerUIDiv.querySelector(`#${pfx}-cover-art-img`);

        if (!document.getElementById(`${pfx}-styles-v3`)) {
            const playerCSS = `
                #${anzhiyuPlayerConfig.persistentPlayerContainerId} { display: none; }
                .${pfx}-player-container-v3 { display: flex; height: 100%; box-sizing: border-box; padding: 15px; background-color: var(--anzhiyu-card-bg, white); box-shadow: var(--anzhiyu-shadow-border, 0 0 10px rgba(0,0,0,0.1)); border-radius: var(--anzhiyu-border-radius, 12px); color: var(--anzhiyu-fontcolor, black); gap: 20px; }
                .${pfx}-left-column { flex: 0 0 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .${pfx}-cover-art-wrapper { width: 170px; height: 170px; border-radius: 50%; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.25); margin-bottom: 15px; background-color: #e0e0e0; }
                #${pfx}-cover-art-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease-out; }
                #${pfx}-cover-art-img.rotating { animation: ${pfx}-rotate 15s linear infinite; }
                @keyframes ${pfx}-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .${pfx}-song-info-left { text-align: center; width: 100%; padding: 0 5px; }
                #${pfx}-song-title { font-size: 1.1em; margin: 0 0 4px 0; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--anzhiyu-fontcolor, black); display: block; max-width: 150px; }
                #${pfx}-artist-name { font-size: 0.85em; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--anzhiyu-second-fontcolor, gray); display: block; max-width: 150px; }
                .${pfx}-right-column { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .${pfx}-playlist-container { height: 200px; overflow-y: auto; border: 1px solid var(--anzhiyu-gray-c, #ddd); padding: 5px; border-radius: var(--anzhiyu-border-radius-small, 8px); background-color: var(--anzhiyu-background, #f9f9f9); margin-bottom: 10px; }
                .${pfx}-playlist-item { display: flex; align-items: center; padding: 6px 8px; margin-bottom: 3px; cursor: pointer; border-radius: 6px; transition: background-color 0.2s ease-in-out; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .${pfx}-playlist-item:hover { background-color: var(--anzhiyu-gray-a, #eee); }
                .${pfx}-playlist-item-active { background-color: var(--anzhiyu-theme-op, rgba(255, 102, 102, 0.15)); color: var(--anzhiyu-theme, #ff6666); font-weight: bold; }
                .${pfx}-playlist-item-number { font-size: 0.8em; color: var(--anzhiyu-third-fontcolor, #999); margin-right: 8px; min-width: 20px; text-align: right; }
                .${pfx}-playlist-item-active .${pfx}-playlist-item-number { color: var(--anzhiyu-theme, #ff6666); }
                .${pfx}-playlist-item-info { font-size: 0.9em; overflow: hidden; text-overflow: ellipsis; color: var(--anzhiyu-second-fontcolor, #555); }
                .${pfx}-playlist-item-active .${pfx}-playlist-item-info { color: var(--anzhiyu-theme, #ff6666); }
                .${pfx}-controls-area { margin-top: auto; } /* audio 控件将在此区域显示 */
                #${pfx}-audio-element { width: 100%; border-radius: 8px; display: block; }
                #${pfx}-audio-element::-webkit-media-controls-panel { background-color: var(--anzhiyu-card-bg, #f0f0f0); border-radius: 8px; }
                #${pfx}-audio-element::-webkit-media-controls-play-button { filter: invert(var(--anzhiyu-darkmode-invert-Molar, 0)); }
                @media (max-width: 768px) { .${pfx}-player-container-v3 { flex-direction: column; padding: 10px; gap: 10px; } .${pfx}-left-column { flex-basis: auto; width: 100%; padding-top: 5px; align-items: center; justify-content: flex-start; } .${pfx}-cover-art-wrapper { width: 130px; height: 130px; margin-bottom: 10px; } .${pfx}-right-column { width: 100%; } .${pfx}-playlist-container { font-size: 0.85em; height: 150px; } #${pfx}-song-title { font-size: 1em; } #${pfx}-artist-name { font-size: 0.75em; } }
                @media (max-width: 991px) { #home_top { display: none !important; } }
            `;
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = `${pfx}-styles-v3`;
            styleElement.textContent = playerCSS;
            document.head.appendChild(styleElement);
        }

        if (anzhiyuPlayerState.audioElement) {
            const audioEl = anzhiyuPlayerState.audioElement;
            audioEl.removeEventListener('ended', anzhiyuPlayerNextSong);
            audioEl.removeEventListener('play', handlePlayEvent);
            audioEl.removeEventListener('playing', handlePlayEvent);
            audioEl.removeEventListener('pause', handlePauseEvent);

            audioEl.addEventListener('ended', anzhiyuPlayerNextSong);
            audioEl.addEventListener('play', handlePlayEvent);
            audioEl.addEventListener('playing', handlePlayEvent);
            audioEl.addEventListener('pause', handlePauseEvent);
        }

        window[anzhiyuPlayerConfig.initializationFlag] = anzhiyuPlayerState;
        anzhiyuPlayerFetchPlaylist();
    }

    function handlePlayEvent() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (globalState && globalState.coverArtImgElement) {
            globalState.coverArtImgElement.classList.add('rotating');
        }
    }
    function handlePauseEvent() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (globalState && globalState.coverArtImgElement) {
            globalState.coverArtImgElement.classList.remove('rotating');
        }
    }

    function mountPlayerUI() {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];
        if (!globalState || !globalState.playerDOM) {
            return;
        }

        const placeholder = document.getElementById(anzhiyuPlayerConfig.placeholderId);
        const playerDOM = globalState.playerDOM;
        const persistentContainer = document.getElementById(anzhiyuPlayerConfig.persistentPlayerContainerId);

        if (!persistentContainer) {
            return;
        }

        if (placeholder) {
            if (playerDOM.parentNode !== placeholder) {
                placeholder.appendChild(playerDOM);
            }
        } else {
            if (playerDOM.parentNode !== persistentContainer) {
                persistentContainer.appendChild(playerDOM);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!window[anzhiyuPlayerConfig.initializationFlag]) {
            initializeGlobalPlayer();
        } else {
            anzhiyuPlayerState = window[anzhiyuPlayerConfig.initializationFlag];
            if (anzhiyuPlayerState.playerDOM) {
                anzhiyuPlayerState.songTitleElement = anzhiyuPlayerState.playerDOM.querySelector(`#${pfx}-song-title`);
                anzhiyuPlayerState.artistNameElement = anzhiyuPlayerState.playerDOM.querySelector(`#${pfx}-artist-name`);
                anzhiyuPlayerState.playlistContainerElement = anzhiyuPlayerState.playerDOM.querySelector(`#${pfx}-playlist-container`);
                anzhiyuPlayerState.coverArtImgElement = anzhiyuPlayerState.playerDOM.querySelector(`#${pfx}-cover-art-img`);
                const audioElementInDOM = anzhiyuPlayerState.playerDOM.querySelector(`#${pfx}-audio-element`);
                if (audioElementInDOM) {
                    anzhiyuPlayerState.audioElement = audioElementInDOM;
                } else {
                }

            } else {
            }
        }
        mountPlayerUI();
    });

    document.addEventListener('pjax:complete', () => {
        const globalState = window[anzhiyuPlayerConfig.initializationFlag];

        if (!globalState || !globalState.audioElement || !globalState.playerDOM) {

             if (typeof anzhiyuPlayerUpdatePlaylistActiveItem === "function") {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => { 
                        anzhiyuPlayerUpdatePlaylistActiveItem();
                    });
                });
            }
            return;
        }

        let musicWasPlayingBeforePjax = !globalState.audioElement.paused;

        requestAnimationFrame(() => {
            mountPlayerUI();
            const currentPath = window.location.pathname;

            if (currentPath.startsWith('/music')) {
                if (!globalState.audioElement.paused) {
                    globalState.audioElement.pause();
                }
            } else {
                if (musicWasPlayingBeforePjax && globalState.audioElement.paused) {
                    const playPromise = globalState.audioElement.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                        });
                    }
                } else if (musicWasPlayingBeforePjax && !globalState.audioElement.paused) {
                }
            }

            if (typeof anzhiyuPlayerUpdatePlaylistActiveItem === "function") {
                requestAnimationFrame(() => { 
                    anzhiyuPlayerUpdatePlaylistActiveItem();
                });
            }
        });
    });

})();

// ===========================顶部卡片修改为音乐播放器几结束================================




