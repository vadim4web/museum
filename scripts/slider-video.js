let activeIndex = 0;
let videos = [];

export function initVideoSlider() {
  const videoTiles = document.getElementById('video-tiles');
  videos = Array.from(videoTiles.querySelectorAll('.video'));
  const navDots = Array.from(document.querySelectorAll('#video-navigation span'));
  const prevBtn = document.getElementById('video-prev');
  const nextBtn = document.getElementById('video-next');

  function clearVideoClasses() {
    videos.forEach(video => {
      video.classList.forEach(cls => {
        if (/video-\d/.test(cls)) video.classList.remove(cls);
      });
    });
  }

  function pauseAllVideos() {
    videos.forEach(v => {
      const videoEl = v.querySelector('video');
      if (!videoEl.paused) videoEl.pause();
    });
  }

  function updateLayout() {
    clearVideoClasses();
    for (let i = 0; i < videos.length; i++) {
      const realIndex = (activeIndex + i) % videos.length;
      videos[realIndex].classList.add(`video-${i}`);
    }
    updatePagination();
  }

  function updatePagination() {
    navDots.forEach(dot => dot.classList.remove('active'));
    navDots[activeIndex].classList.add('active');
  }

  function choose(index) {
    pauseAllVideos(); // ensure only visible video is playing
    activeIndex = (index + videos.length) % videos.length;
    updateLayout();
  }

  function next() {
    choose(activeIndex + 1);
  }

  function prev() {
    choose(activeIndex - 1);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      choose(index);
    });
  });

  videos.forEach((videoEl, index) => {
    videoEl.addEventListener('click', () => {
      const offset = (index - activeIndex + videos.length) % videos.length;
      if (offset !== 0) {
        choose(index);
      }
    });
  });

  updateLayout();
}
