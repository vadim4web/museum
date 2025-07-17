export function initSlider(sliderId, sliderContainerId, config = {}) {
  const {
    slideWidth = 1000,
    autoplay = false,
    interval = 3000,
  } = config;

  const slider = document.getElementById(sliderId);
  const sliderContainer = document.getElementById(sliderContainerId);
  if (!slider) return;

  const view = slider.querySelector('.slider-view');
  const slides = slider.querySelectorAll('.slider-view-slide');
  const thumbs = sliderContainer.querySelectorAll('.thumbs span');
  const currentSlideText = sliderContainer.querySelector('#current-slide');
  const prevBtn = sliderContainer.querySelector('#slider-prev');
  const nextBtn = sliderContainer.querySelector('#slider-next');

  let current = 0;
  const total = slides.length;

  function updateSlider(index) {
    current = (index + total) % total;

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
}
