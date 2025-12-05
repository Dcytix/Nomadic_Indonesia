const gameElements = document.querySelectorAll('[data-id="game"]');

gameElements.forEach(g => g.addEventListener('mouseover', () => {
  const audio = new Audio('assets/menusfx.mp3');
  audio.volume = 0.1;
  audio.play();
  g.classList.add('is-active');
  gameElements.forEach(x => { if (x !== g) x.classList.remove('is-active'); });
}));

(function() {
  const loader = document.getElementById('loader');
  const bar = loader && loader.querySelector('.progress-bar');
  const txt = document.getElementById('destination-text');

  document.addEventListener('click', e => {
    const btn = e.target.closest('.explore-button');
    if (!btn) return;
    const href = btn.getAttribute('href');
    if (!href) return;
    e.preventDefault();

    const name = btn.dataset.destination || btn.closest('.game')?.querySelector('.logo')?.alt || href.split('/').pop() || 'destination';
    if (txt) txt.textContent = `Loading ${name}...`;
    if (loader) loader.classList.add('show');

    if (bar) {
      bar.style.background = '#ffffff';
      bar.style.transition = 'width 900ms linear';
      bar.getBoundingClientRect();
      bar.style.width = '100%';

      const done = () => window.location.href = href;
      const onEnd = () => { bar.removeEventListener('transitionend', onEnd); done(); };
      bar.addEventListener('transitionend', onEnd);
      setTimeout(() => { bar.removeEventListener('transitionend', onEnd); done(); }, 1100);
    } else {
      setTimeout(() => window.location.href = href, );
    }
  });
})();