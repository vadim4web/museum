export default function setupAutoHideControls(videoBlock) {
  const controls = videoBlock.querySelector('.controls');
  let hideTimeout;

  const showControls = () => {
    controls.classList.add('visible');
    controls.classList.remove('hidden');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideControls, 2000);
  };

  const hideControls = () => {
    controls.classList.remove('visible');
    controls.classList.add('hidden');
  };

  const startWatchingMouse = () => {
    videoBlock.addEventListener('mousemove', showControls);
    // Optional: also show on keyboard focus or click
    videoBlock.addEventListener('click', showControls);
    videoBlock.addEventListener('keydown', showControls);
  };

  const stopWatchingMouse = () => {
    videoBlock.removeEventListener('mousemove', showControls);
    videoBlock.removeEventListener('click', showControls);
    videoBlock.removeEventListener('keydown', showControls);
    controls.classList.remove('visible', 'hidden');
    clearTimeout(hideTimeout);
  };

  const observer = new MutationObserver(() => {
    const isActive = videoBlock.classList.contains('video-0');
    if (isActive) {
      showControls();           // Ensure controls are shown initially
      startWatchingMouse();     // Start watching for activity
    } else {
      stopWatchingMouse();      // Clean up listeners and state
    }
  });

  // Start with check in case .video-0 is already applied
  if (videoBlock.classList.contains('video-0')) {
    showControls();
    startWatchingMouse();
  }

  observer.observe(videoBlock, {
    attributes: true,
    attributeFilter: ['class']
  });
}
