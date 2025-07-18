// scripts/underline-animation.js

export function initUnderlineAnimation(selector = '.visual-item') {
  const items = document.querySelectorAll(selector);

  items.forEach(item => {
    const h3 = item.querySelector('h3');
    if (!h3) return;

    item.addEventListener('mouseenter', () => {
      h3.classList.remove('out');
      void h3.offsetWidth; // force reflow
      h3.classList.add('in');
    });

    item.addEventListener('mouseleave', () => {
      h3.classList.remove('in');
      void h3.offsetWidth; // force reflow again
      h3.classList.add('out');
    });
  });
}
