import markup from './index.html?raw';
import './style.css';
import {Bitrix24Ready, hostReactAppReady, vimeoAutoPlay} from "./utils.js";
document.body.insertAdjacentHTML('beforeend', markup);

//hostReactAppReady().then(()=> {
//
//})
vimeoAutoPlay()
Bitrix24Ready().then(() => {
    // Убедимся, что событие добавляется только если его еще нет
    if (!location.origin.includes('backoffice')) {
        const button = document.querySelector('.b24-form-click-btn')
        if (button && !button.dataset.eventBound) {
            // Проверяем флаг
            button.dataset.eventBound = 'true' // Устанавливаем флаг
            button.addEventListener('click', () => {
                ym(96674199, 'reachGoal', 'fill', {
                    page: location.pathname,
                })
            })
        }
    }
})




  const videoContainer = document.querySelector(".vimeo-video-box");

  // Карта соответствий видео и размеров экрана
  const videoMap = [
    { query: "(min-width: 1280px)", id: "1052281927" },
    { query: "(min-width: 1024px)", id: "1052281942" },
    { query: "(min-width: 768px)", id: "1052281959" },
    { query: "(min-width: 428px)", id: "1052281862" },
    { query: "(max-width: 427px)", id: "1052281899" } // Самый маленький размер
  ];

  // Функция для поиска подходящего видео ID
  function getVideoId() {
    for (const entry of videoMap) {
      if (window.matchMedia(entry.query).matches) {
        return entry.id;
      }
    }
    return videoMap[videoMap.length - 1].id; // По умолчанию самое маленькое видео
  }

  // Функция загрузки плеера Vimeo
  function loadVimeoPlayer(videoId) {
    videoContainer.innerHTML = `
      <iframe src="https://player.vimeo.com/video/${videoId}"
        width="100%" height="400"
        frameborder="0" allow="autoplay; fullscreen" allowfullscreen>
      </iframe>
    `;
  }

  // Загружаем начальное видео
  let currentVideoId = getVideoId();
  loadVimeoPlayer(currentVideoId);

  // Добавляем слушателей на `matchMedia`
  videoMap.forEach(entry => {
    const mediaQuery = window.matchMedia(entry.query);
    mediaQuery.addEventListener("change", () => {
      const newVideoId = getVideoId();
      if (newVideoId !== currentVideoId) {
        currentVideoId = newVideoId;
        loadVimeoPlayer(currentVideoId);
      }
    });
  });



