// scripts/video-controls.js
import setupAutoHideControls from './setupAutoHideControls.js';

export function initVideoControls() {
  const videos = document.querySelectorAll('.video');

  const setIcon = (button, iconId) => {
    const use = button.querySelector('use');
    if (use) {
      use.setAttribute('href', `#${iconId}`);
    }
  };

  const updateRangeFill = (range) => {
    const min = parseFloat(range.min || 0);
    const max = parseFloat(range.max || 1);
    const val = parseFloat(range.value);
    const percent = ((val - min) / (max - min)) * 100;
    range.style.background = `linear-gradient(to right, var(--dark-red) ${percent}%, var(--silver) ${percent}%)`;
  };

  videos.forEach(videoBlock => {
    const video = videoBlock.querySelector('video');
    const controls = videoBlock.querySelector('.controls');
    const toggleBtn = controls.querySelector('[data-action="toggle-play"]');
    const muteBtn = controls.querySelector('[data-action="mute"]');
    const volumeRange = controls.querySelector('.volume');
    const volumeIndicator = controls.querySelector('.volume-indicator');
    const timeline = controls.querySelector('.timeline');
    const fullscreenBtn = controls.querySelector('[data-action="fullscreen"]');

    // Parse and validate saved volume
    let saved = parseFloat(localStorage.getItem('videoVolume'));
    let initialVolume = Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.5;

    // Apply volume
    video.volume = initialVolume;
    video.muted = initialVolume === 0;
    if (volumeRange) {
      volumeRange.value = initialVolume.toFixed(2);
      updateRangeFill(volumeRange);
    }
    if (volumeIndicator) volumeIndicator.textContent = `${Math.round(initialVolume * 100)}%`;
    if (muteBtn) setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');

    // Set initial timeline fill if possible
    if (timeline) {
      timeline.value = 0;
      updateRangeFill(timeline);
    }

    // Play/pause
    toggleBtn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    video.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });

    video.addEventListener('play', () => {
      setIcon(toggleBtn, 'icon-pause');
      if (video.muted && video.volume > 0) video.muted = false;
      videoBlock.dataset.paused = "false";
    });

    video.addEventListener('pause', () => {
      setIcon(toggleBtn, 'icon-play');
      videoBlock.dataset.paused = "true";
    });

    // Mute/unmute
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');
    });

    // Volume change
    volumeRange.addEventListener('input', () => {
      let vol = parseFloat(volumeRange.value);
      if (!Number.isFinite(vol)) vol = 0.5;
      vol = Math.min(Math.max(vol, 0), 1);

      video.volume = vol;
      video.muted = vol === 0;
      localStorage.setItem('videoVolume', vol.toFixed(2));

      updateRangeFill(volumeRange);

      if (volumeIndicator) {
        volumeIndicator.textContent = `${Math.round(vol * 100)}%`;

        // Position indicator using % (excluding 30px left/right margins)
        const container = volumeRange.closest('.volume-container');
        const containerWidth = container.offsetWidth;
        const usableWidth = containerWidth - 60; // exclude 30px left & right

        const percentX = vol; // volume is 0–1
        const offsetX = 15 + usableWidth * percentX;

        const percentLeft = (offsetX / containerWidth) * 100;
        volumeIndicator.style.left = `${percentLeft}%`;

        volumeIndicator.classList.add('visible');
        clearTimeout(volumeIndicator._hideTimeout);
        volumeIndicator._hideTimeout = setTimeout(() => {
          volumeIndicator.classList.remove('visible');
        }, 1000);
      }

      if (muteBtn) {
        setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');
      }
    });

    // Accessibility (focus/blur)
    volumeRange.addEventListener('focus', () => {
      volumeIndicator?.classList.add('visible');
    });
    volumeRange.addEventListener('blur', () => {
      volumeIndicator?.classList.remove('visible');
    });

    // Timeline sync
    video.addEventListener('timeupdate', () => {
      if (!timeline.max || timeline.max === '0') timeline.max = video.duration;
      timeline.value = video.currentTime;
      updateRangeFill(timeline);
    });

    timeline.addEventListener('input', () => {
      video.currentTime = timeline.value;
      updateRangeFill(timeline);
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });

    // Auto-hide UI logic
    setupAutoHideControls(videoBlock);
  });
}
