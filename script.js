// =========================================
// eNTITE 07 — script.js
// =========================================

/* ---------- Navbar scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Intersection Observer: cards ---------- */
const observerOpts = { threshold: 0.15 };
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      cardObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.card').forEach(card => cardObserver.observe(card));

/* ---------- Neural Net SVG (procedural) ---------- */
function buildNeuralNet() {
  const container = document.getElementById('neuralNet');
  if (!container) return;

  const W = 320, H = 320;
  const layers = [
    { nodes: 3, x: 50  },
    { nodes: 4, x: 140 },
    { nodes: 4, x: 230 },
    { nodes: 2, x: 310 },
  ];
  const nodeR = 6;

  // Compute node positions
  layers.forEach(layer => {
    const step = H / (layer.nodes + 1);
    layer.positions = Array.from({ length: layer.nodes }, (_, i) => ({
      x: layer.x,
      y: step * (i + 1),
    }));
  });

  // Build SVG
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);

  // Edges
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].positions.forEach(src => {
      layers[l + 1].positions.forEach(dst => {
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', src.x); line.setAttribute('y1', src.y);
        line.setAttribute('x2', dst.x); line.setAttribute('y2', dst.y);
        line.setAttribute('stroke', 'rgba(123,94,167,0.18)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
      });
    });
  }

  // Animated pulses along edges
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].positions.forEach((src, si) => {
      layers[l + 1].positions.forEach((dst, di) => {
        if (Math.random() > 0.5) return; // only some edges get pulses
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('r', '2.5');
        circle.setAttribute('fill', '#3dd6b5');
        circle.setAttribute('opacity', '0.8');

        const animX = document.createElementNS(ns, 'animate');
        animX.setAttribute('attributeName', 'cx');
        animX.setAttribute('values', `${src.x};${dst.x}`);
        const dur = (1.4 + Math.random() * 1.6).toFixed(1) + 's';
        animX.setAttribute('dur', dur);
        animX.setAttribute('repeatCount', 'indefinite');
        animX.setAttribute('begin', (Math.random() * 2).toFixed(1) + 's');

        const animY = document.createElementNS(ns, 'animate');
        animY.setAttribute('attributeName', 'cy');
        animY.setAttribute('values', `${src.y};${dst.y}`);
        animY.setAttribute('dur', dur);
        animY.setAttribute('repeatCount', 'indefinite');
        animY.setAttribute('begin', animX.getAttribute('begin'));

        circle.appendChild(animX);
        circle.appendChild(animY);
        svg.appendChild(circle);
      });
    });
  }

  // Nodes
  layers.forEach((layer, li) => {
    layer.positions.forEach(pos => {
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', nodeR);
      const isInput  = li === 0;
      const isOutput = li === layers.length - 1;
      circle.setAttribute('fill', isOutput ? '#7b5ea7' : isInput ? '#3dd6b5' : '#4fa3e0');
      circle.setAttribute('opacity', '0.85');
      svg.appendChild(circle);
    });
  });

  container.appendChild(svg);
}

buildNeuralNet();

/* ---------- Typewriter Effect ---------- */
const phrases = [
  'building AI agents that actually work...',
  'researching neural network architectures...',
  'shipping websites that don\'t look generic...',
  'expanding into C++ territory...',
  'pushing intelligence forward, one model at a time.',
];

let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
let pause = false;
const typeEl = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];

  if (!deleting) {
    charIdx++;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      pause = true;
      setTimeout(() => { pause = false; deleting = true; type(); }, 2200);
      return;
    }
  } else {
    charIdx--;
    typeEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  const speed = deleting ? 30 : 55;
  setTimeout(type, speed);
}

// Start typewriter after page load
window.addEventListener('load', () => setTimeout(type, 800));

/* ---------- Smooth hover glow on contact button ---------- */
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
  contactBtn.addEventListener('mousemove', (e) => {
    const rect = contactBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    contactBtn.style.background = `
      radial-gradient(circle at ${x}px ${y}px, #a78be0, #4fa3e0, #7b5ea7)
    `;
  });
  contactBtn.addEventListener('mouseleave', () => {
    contactBtn.style.background = '';
  });
}
