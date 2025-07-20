export function initSlider(sliderId, sliderContainerId, config = {}) {
  const {
    autoplay = false,
    interval = 3000,
  } = config;

  const slider = document.getElementById(sliderId);
  const sliderContainer = document.getElementById(sliderContainerId);
  if (!slider) return;

  const view = slider.querySelector('.slider-view');
  const slides = slider.querySelectorAll('.slider-view-slide');
  const thumbs = sliderContainer.querySelectorAll('.thumbs span, .thumbs i');
  const currentSlideText = sliderContainer.querySelector('#current-slide');
  const prevBtn = sliderContainer.querySelector('#slider-prev');
  const nextBtn = sliderContainer.querySelector('#slider-next');

  let current = 0;
  const total = slides.length;

  function getSlideWidth() {
    return slides[0]?.offsetWidth || 0;
  }

  function updateSlider(index) {
    current = (index + total) % total;
    const slideWidth = getSlideWidth();
    const offset = -current * slideWidth;
    view.style.transform = `translateX(${offset}px)`;

    thumbs.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    if (currentSlideText) {
      currentSlideText.textContent = String(current + 1).padStart(2, '0');
    }
  }

  prevBtn?.addEventListener('click', () => updateSlider(current - 1));
  nextBtn?.addEventListener('click', () => updateSlider(current + 1));

  thumbs.forEach(dot => {
    dot.addEventListener('click', () => {
      updateSlider(Number(dot.dataset.index));
    });
  });

  updateSlider(current);

  // Autoplay
  if (autoplay) {
    setInterval(() => {
      updateSlider(current + 1);
    }, interval);
  }

  // Recalculate on resize
  window.addEventListener('resize', () => updateSlider(current));

  // --- Touch & Mouse Swipe Support ---
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const threshold = 50;

  // Start drag
  function startDrag(x) {
    startX = x;
    currentX = x;
    isDragging = true;
    console.log('drag-on')
  }

  // Move drag
  function moveDrag(x) {
    if (!isDragging) return;
    currentX = x;
  }

  // End drag
  function endDrag() {
    if (!isDragging) return;
    const delta = currentX - startX;

    if (delta > threshold) {
      updateSlider(current - 1);
    } else if (delta < -threshold) {
      updateSlider(current + 1);
    }

    isDragging = false;
    startX = 0;
    currentX = 0;
  }

  // Touch events
  slider.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  slider.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
  slider.addEventListener('touchend', endDrag);

  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // left click only
    startDrag(e.clientX);
    e.preventDefault();
  });

  slider.addEventListener('mousemove', (e) => {
    if (e.buttons !== 1) return;
    moveDrag(e.clientX);
  });

  slider.addEventListener('mouseup', endDrag);
  slider.addEventListener('mouseleave', () => {
    if (isDragging) endDrag();
  });
}
