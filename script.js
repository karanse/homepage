// Interactive mosaic background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext("2d");
const PALETTE = ['#c0542e','#3a9ac4','#d4b87a','#6b8a4e','#d98fa0'];
const GAP = 28, RADIUS = 3, REPEL = 80;

let dots = [], mouse = { x: -999, y: -999 }, scrollY = 0;

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight;
  createDots();
}

const createDots = () => {
  dots = [];
  for (let x = GAP; x < canvas.width; x += GAP) {
    for (let y = GAP; y < canvas.height; y += GAP) {
      dots.push({
        ox: x,
        oy: y,
        x,
        y,
        r: RADIUS,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        phase: Math.random() * Math.PI * 2
      });
    }
  }
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() / 1000;
  dots.forEach(d => {
    const wave = Math.sin(t * 0.8 + d.phase + scrollY * 0.003) * 3;
    let tx = d.ox, ty = d.oy + wave;
    const dx = mouse.x - d.ox, dy = (mouse.y + scrollY) - d.oy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPEL) {
      const force = (1 - dist / REPEL) * 15;
      tx -= (dx / dist) * force;
      ty -= (dy / dist) * force;
    }
    d.x += (tx - d.x) * 0.1;
    d.y += (ty - d.y) * 0.1;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(d.x, d.y - scrollY, d.r, 0, Math.PI * 2);
    ctx.fill();
  });
}
requestAnimationFrame(animate);

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY
});
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// Scroll reveal
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.15 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

resize();
animate();
