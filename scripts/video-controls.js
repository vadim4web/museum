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

    // Restore saved volume and mute state
    let savedVolume = parseFloat(localStorage.getItem('videoVolume'));
    let savedMuted = localStorage.getItem('videoMuted') === 'true';

    let initialVolume = Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1 ? savedVolume : 0.5;

    video.volume = initialVolume;
    video.muted = savedMuted || initialVolume === 0;

    if (volumeRange) {
      volumeRange.value = initialVolume.toFixed(2);
      updateRangeFill(volumeRange);
    }

    if (volumeIndicator) {
      volumeIndicator.textContent = `${Math.round(initialVolume * 100)}%`;
    }

    if (muteBtn) {
      setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');
    }

    // Set timeline fill to 0
    if (timeline) {
      timeline.value = 0;
      updateRangeFill(timeline);
    }

    // Play/pause logic
    toggleBtn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    video.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });

    video.addEventListener('play', () => {
      setIcon(toggleBtn, 'icon-pause');
      if (video.muted && video.volume > 0) {
        video.muted = false;
      }
      videoBlock.dataset.paused = "false";
    });

    video.addEventListener('pause', () => {
      setIcon(toggleBtn, 'icon-play');
      videoBlock.dataset.paused = "true";
    });

    // Mute/unmute toggle
    muteBtn.addEventListener('click', () => {
      if (video.muted || video.volume === 0) {
        // Restore previous or default volume
        let restoredVolume = parseFloat(localStorage.getItem('videoVolume')) || 0.5;
        restoredVolume = Math.min(Math.max(restoredVolume, 0.01), 1);
        video.volume = restoredVolume;
        video.muted = false;

        volumeRange.value = restoredVolume.toFixed(2);
        updateRangeFill(volumeRange);

        if (volumeIndicator) {
          volumeIndicator.textContent = `${Math.round(restoredVolume * 100)}%`;
        }

        localStorage.setItem('videoVolume', restoredVolume.toFixed(2));
        localStorage.setItem('videoMuted', 'false');
        setIcon(muteBtn, 'icon-volume');
      } else {
        // Mute and set volume to 0
        video.volume = 0;
        video.muted = true;

        volumeRange.value = '0';
        updateRangeFill(volumeRange);

        if (volumeIndicator) {
          volumeIndicator.textContent = `0%`;
        }

        localStorage.setItem('videoVolume', '0');
        localStorage.setItem('videoMuted', 'true');
        setIcon(muteBtn, 'icon-mute');
      }
    });

    // Volume input handler
    volumeRange.addEventListener('input', () => {
      let vol = parseFloat(volumeRange.value);
      if (!Number.isFinite(vol)) vol = 0.5;
      vol = Math.min(Math.max(vol, 0), 1);

      video.volume = vol;
      video.muted = vol === 0;

      localStorage.setItem('videoVolume', vol.toFixed(2));
      localStorage.setItem('videoMuted', video.muted.toString());

      updateRangeFill(volumeRange);

      if (volumeIndicator) {
        volumeIndicator.textContent = `${Math.round(vol * 100)}%`;

        const container = volumeRange.closest('.volume-container');
        const containerWidth = container.offsetWidth;
        const usableWidth = containerWidth - 60;
        const offsetX = 15 + usableWidth * vol;
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

    // Accessibility
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

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });

    // Auto-hide controls
    setupAutoHideControls(videoBlock);
  });
}
