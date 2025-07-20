// scripts/video-controls.js

export function initVideoControls() {
  const videos = document.querySelectorAll('.video');

  const setIcon = (button, iconId) => {
    const use = button.querySelector('use');
    if (use) {
      use.setAttribute('href', `#${iconId}`);
    }
  };

  // Sync volume settings across all video players
  const applyVolumeToAll = (volume) => {
    localStorage.setItem('videoVolume', volume);
    videos.forEach(videoBlock => {
      const video = videoBlock.querySelector('video');
      const volumeRange = videoBlock.querySelector('.volume');
      const volumeIndicator = videoBlock.querySelector('.volume-indicator');
      const muteBtn = videoBlock.querySelector('[data-action="mute"]');

      video.volume = volume;
      video.muted = volume === 0;

      if (volumeRange) volumeRange.value = volume;
      if (volumeIndicator) volumeIndicator.textContent = `${Math.round(volume * 100)}%`;
      if (muteBtn) setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');
    });
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

    // Load and apply saved volume
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume !== null) {
      applyVolumeToAll(parseFloat(savedVolume));
    }

    // Toggle play/pause via button
    toggleBtn.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });

    // Toggle play/pause on video click
    video.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });

    // Update icon on play
    video.addEventListener('play', () => {
      setIcon(toggleBtn, 'icon-pause');
      if (video.muted && video.volume > 0) video.muted = false;
    });

    // Update icon on pause
    video.addEventListener('pause', () => {
      setIcon(toggleBtn, 'icon-play');
    });

    // Mute/unmute
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      setIcon(muteBtn, video.muted ? 'icon-mute' : 'icon-volume');
    });

    // Volume change event
    volumeRange.addEventListener('input', () => {
      const vol = parseFloat(volumeRange.value);
      applyVolumeToAll(vol);
    });

    // Sync timeline
    video.addEventListener('timeupdate', () => {
      if (!timeline.max || timeline.max === '0') timeline.max = video.duration;
      timeline.value = video.currentTime;
    });

    timeline.addEventListener('input', () => {
      video.currentTime = timeline.value;
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  });
}
