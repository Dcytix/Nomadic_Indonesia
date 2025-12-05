const initLoader = () => {
  const [loader, intro] = ['#loader', '#intro'].map(s => document.querySelector(s));
  const introContent = intro.querySelector('.intro-content');
  
  setTimeout(() => {
    [loader, intro].forEach((el, i) => el.classList[i ? 'add' : 'add']('fade-out', 'active'));
    introContent.style.animation = 'none';
    introContent.offsetHeight;
    introContent.style.animation = 'fadeInUp 2s ease forwards';
  }, 2000);
};

const initNavigation = () => {
  document.getElementById('start-btn').addEventListener('click', () => {
    ['#intro', '#Main1'].forEach((id, i) => document.querySelector(id).classList[i ? 'add' : 'remove']('active'));
    document.querySelector('.progress-bar').style.width = '100%';
    
    setTimeout(() => {
      ['#Main1', window.location.href = './MainStory/menu/menu.html'].forEach((id, i) => document.querySelector(id).classList[i ? 'add' : 'remove']('active'));
    }, 2000);//durasi progres bar
  });
};


const initCursorTrail = () => {
  const svg = document.getElementById('cursor-trail');
  if (!svg) return;

  const path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
  let points = [], lastMove = Date.now(), active = true;

  const updatePath = () => path.setAttribute('d', points.length ? 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ') : '');

  setInterval(() => {
    if (!active || Date.now() - lastMove <= 50 || !points.length) return;
    points.shift();
    updatePath();
  }, 50);

  document.addEventListener('mousemove', e => {
    if (!active) return;
    lastMove = Date.now();
    points.push({ x: e.clientX, y: e.clientY });
    if (points.length > 15) points.shift();
    updatePath();
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    active = false;
    points = [];
    updatePath();
  }, { once: true });
};

const initParallax = () => {
  document.querySelector('#intro').addEventListener('mousemove', e => {
    const [centerX, centerY] = [window.innerWidth / 2, window.innerHeight / 2];
    document.querySelectorAll('[data-speed]').forEach(layer => {
      const speed = layer.getAttribute('data-speed');
      layer.style.transform = `translate3d(${(e.clientX - centerX) * speed / 25}px, ${(e.clientY - centerY) * speed / 25}px, 0)`;
    });
  });
};

window.addEventListener("load", initLoader);
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCursorTrail();
  initParallax();
  initRisingSquares();
});

// kotak2
function initRisingSquares() {
  const canvas = document.getElementById('rising-squares');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#b0b0b0ff', '#868686ff', '#5c5c5cff'];
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const squares = Array.from({ length: 10 }, () => spawnSquare());
  let last = performance.now();

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnSquare() {
    const size = Math.round(rand(6, 28));
    return {
      x: rand(0, width - size),
      y: height + size + rand(0, 80),
      size,
      speed: rand(30, 220),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  (function animate(now) {
    const dt = Math.max(0, (now - last) / 1000);
    last = now;

    if (squares.length < 40 && Math.random() < 0.5) squares.push(spawnSquare());

    ctx.clearRect(0, 0, width, height);
    const fadeY = height * 0.6;

    squares.forEach((s, i) => {
      s.y -= s.speed * dt;
      const alpha = s.y <= fadeY ? Math.max(0, s.y / fadeY) : 1;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(Math.round(s.x), Math.round(s.y - s.size), s.size, s.size);
      
      if (s.y + s.size < 0 || alpha <= 0) squares[i] = spawnSquare();
    });

    requestAnimationFrame(animate);
  })(performance.now());
}