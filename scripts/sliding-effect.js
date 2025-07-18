// scripts/sliding-effect.js
export function initSlidingEffect(pictureSelector = '.picture', slidingSelector = '#sliding') {
  const pictures = document.querySelectorAll(pictureSelector);

  pictures.forEach(picture => {
    const sliding = picture.querySelector(slidingSelector);
    if (!sliding) return;

    // Update width on mousemove
    picture.addEventListener('mousemove', (e) => {
      const rect = picture.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const widthPercent = (offsetX / rect.width) * 100;

      // Limit between 0% and 100%
      const clampedWidth = Math.min(100, Math.max(0, widthPercent));
      sliding.style.transition = 'none'; // disable transition while moving
      sliding.style.width = `${clampedWidth}%`;
    });

    // Reset width on mouseleave
    picture.addEventListener('mouseleave', () => {
      sliding.style.transition = 'width 0.3s ease';
      sliding.style.width = '62%';
    });
  });
}
