const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused = false;
try {
  motionPaused = localStorage.getItem('motion') === 'paused';
} catch (e) {}
const motionBtn = document.querySelector('.motion-btn');
const setPaused = (paused) => {
  motionPaused = paused;
  document.documentElement.classList.toggle('paused', paused);
  motionBtn.setAttribute('aria-pressed', String(paused));
  motionBtn.setAttribute('aria-label', paused ? 'Play animations' : 'Pause animations');
  try {
    localStorage.setItem('motion', paused ? 'paused' : 'playing');
  } catch (e) {}
};
setPaused(motionPaused);
const isStill = () => reducedMotion || motionPaused;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Header + scroll progress + experience rail
const header = document.querySelector('.header');
const progress = document.querySelector('.progress');
const jobs = document.querySelector('.jobs');
const jobItems = [...document.querySelectorAll('.job')];
let scrollTicking = false;
const onScroll = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', window.scrollY > 8);
    progress.style.setProperty('--scroll', max > 0 ? window.scrollY / max : 0);

    const trigger = window.innerHeight * 0.6;
    const rect = jobs.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));
    jobs.style.setProperty('--p', p);
    jobItems.forEach((job) => {
      job.classList.toggle('lit', job.getBoundingClientRect().top + 40 < trigger);
    });
    scrollTicking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// Rotating hero word: one pass, then it settles on "trust."
const rotator = document.querySelector('.rotator');
const words = ['rely on.', 'love.', 'trust.'];
const swapWord = (word) => {
  rotator.classList.add('out');
  setTimeout(() => {
    rotator.textContent = word;
    rotator.classList.remove('out');
    rotator.classList.add('in');
    void rotator.offsetWidth;
    rotator.classList.remove('in');
  }, 350);
};
words.forEach((word, i) => {
  setTimeout(
    () => {
      if (!isStill()) swapWord(word);
    },
    2000 + i * 1500,
  );
});

// Typed Swift snippet
const code = [
  ['kw', 'struct '],
  ['ty', 'SarahTully'],
  ['', ': '],
  ['ty', 'TechLead'],
  ['', ' {\n'],
  ['kw', '  let '],
  ['pr', 'experience'],
  ['', ' = '],
  ['nu', '15'],
  ['', '.years\n'],
  ['kw', '  let '],
  ['pr', 'platforms'],
  ['', ' = [.iOS, .visionOS, .web]\n'],
  ['kw', '  let '],
  ['pr', 'ai'],
  ['', ' = [.agents, .llms, .ml, .mcp]\n'],
  ['kw', '  let '],
  ['pr', 'focus'],
  ['', ' = '],
  ['st', '"Healthcare · SaMD"'],
  ['', '\n'],
  ['kw', '  var '],
  ['pr', 'team'],
  ['', ' = '],
  ['ty', 'Team'],
  ['', '(engineers: '],
  ['nu', '11'],
  ['', ')\n\n'],
  ['cm', '  // intention + craft\n'],
  ['kw', '  func '],
  ['pr', 'build'],
  ['', '() '],
  ['kw', 'async'],
  ['', ' -> '],
  ['ty', 'Software'],
  ['', ' {\n'],
  ['kw', '    let '],
  ['pr', 'plan'],
  ['', ' = '],
  ['kw', 'await '],
  ['pr', 'agents'],
  ['', '.plan(with: team)\n'],
  ['kw', '    await '],
  ['pr', 'ship'],
  ['', '(plan, .reliable, .accessible)\n'],
  ['', '  }\n}'],
];
const typed = document.querySelector('.typed');
const toast = document.querySelector('.toast');
const makeSpan = (cls) => {
  const span = document.createElement('span');
  if (cls) span.className = 'tk-' + cls;
  typed.appendChild(span);
  return span;
};
const finishTyping = () => {
  typed.textContent = '';
  code.forEach(([cls, text]) => (makeSpan(cls).textContent = text));
  toast.classList.add('show');
};
if (isStill()) {
  finishTyping();
} else {
  let seg = 0;
  let ch = 0;
  let span = null;
  const typeNext = () => {
    if (motionPaused) return finishTyping();
    if (seg >= code.length) {
      setTimeout(() => toast.classList.add('show'), 300);
      return;
    }
    const [cls, text] = code[seg];
    if (!span) span = makeSpan(cls);
    const char = text[ch++];
    span.textContent += char;
    if (ch >= text.length) {
      seg++;
      ch = 0;
      span = null;
    }
    setTimeout(typeNext, char === '\n' ? 90 : 10 + Math.random() * 22);
  };
  setTimeout(typeNext, 900);
}

// Code window tilt
const codeWin = document.querySelector('.code');
const hero = document.querySelector('.hero');
if (finePointer && !reducedMotion) {
  hero.addEventListener('pointermove', (e) => {
    const r = codeWin.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    codeWin.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
    codeWin.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
  });
}

// Embers drifting up through the lamplight
const landing = document.querySelector('.landing');
const landingStage = document.querySelector('.landing-stage');
const canvas = document.querySelector('.embers');
const ctx = canvas.getContext('2d');
const mouse = { x: -9999, y: -9999 };
const sprite = document.createElement('canvas');
sprite.width = sprite.height = 32;
const sctx = sprite.getContext('2d');
const glow = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
glow.addColorStop(0, 'rgba(255, 214, 150, 1)');
glow.addColorStop(0.25, 'rgba(255, 160, 70, 0.6)');
glow.addColorStop(1, 'rgba(255, 120, 40, 0)');
sctx.fillStyle = glow;
sctx.fillRect(0, 0, 32, 32);
let embers = [];
let width = 0;
let height = 0;
let landingVisible = true;
const spawn = (anywhere) => ({
  x: Math.random() * width,
  y: anywhere ? Math.random() * height : height + 10,
  size: 4 + Math.random() * 10,
  speed: 0.15 + Math.random() * 0.45,
  sway: Math.random() * Math.PI * 2,
  twinkle: 0.5 + Math.random() * 2,
});
const resize = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = landing.clientWidth;
  height = landing.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  embers = Array.from({ length: width < 640 ? 32 : 64 }, () => spawn(true));
};
const draw = (t) => {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  const time = t / 1000;
  for (const e of embers) {
    if (!isStill()) {
      e.y -= e.speed;
      e.x += Math.sin(time * 0.6 + e.sway) * 0.25;
      const dx = e.x - mouse.x;
      const dy = e.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 130 && dist > 0) {
        e.x += (dx / dist) * (130 - dist) * 0.04;
        e.y += (dy / dist) * (130 - dist) * 0.04;
      }
      if (e.y < -20) Object.assign(e, spawn(false));
    }
    // fade out toward the top so embers die in the dark
    const life = Math.min(1, e.y / (height * 0.5));
    ctx.globalAlpha = Math.max(0, life * (0.35 + 0.35 * Math.sin(time * e.twinkle + e.sway)));
    ctx.drawImage(sprite, e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
  }
  ctx.globalAlpha = 1;
  if (landingVisible && !isStill()) requestAnimationFrame(draw);
};
resize();
window.addEventListener('resize', resize);
landing.addEventListener('pointermove', (e) => {
  const r = landing.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
landing.addEventListener('pointerleave', () => {
  mouse.x = mouse.y = -9999;
});
new IntersectionObserver(([entry]) => {
  const was = landingVisible;
  landingVisible = entry.isIntersecting;
  if (landingVisible && !was && !isStill()) requestAnimationFrame(draw);
}).observe(landing);
requestAnimationFrame(draw);

// Gentle parallax on the landing photo
window.addEventListener(
  'scroll',
  () => {
    if (isStill() || window.scrollY > landing.offsetHeight) return;
    landingStage.style.setProperty('--py', window.scrollY * 0.35 + 'px');
  },
  { passive: true },
);

motionBtn.addEventListener('click', () => {
  setPaused(!motionPaused);
  if (!motionPaused) requestAnimationFrame(draw);
});

// Spotlight cards
const grid = document.querySelector('.grid');
const cards = [...grid.querySelectorAll('.card')];
grid.addEventListener('pointermove', (e) => {
  cards.forEach((card) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// Magnetic buttons
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
  });
}

// Marquee rows (duplicated for a seamless loop)
document.querySelectorAll('.marquee-row').forEach((row) => {
  const items = row.dataset.items.split(',');
  [...items, ...items].forEach((item, i) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = item;
    if (i >= items.length) chip.setAttribute('aria-hidden', 'true');
    else chip.setAttribute('role', 'listitem');
    row.appendChild(chip);
  });
});

// Count-up stats
const countUp = (el) => {
  const target = Number(el.dataset.count);
  if (reducedMotion) {
    el.textContent = target;
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / 1400);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Agent run: steps tick through once when the card scrolls into view
const agentSteps = [...document.querySelectorAll('.agent-step')];
const runAgent = () => {
  if (isStill()) {
    agentSteps.forEach((step) => step.classList.add('done'));
    return;
  }
  agentSteps.forEach((step, i) => {
    setTimeout(() => step.classList.add('running'), i * 900);
    setTimeout(() => step.classList.replace('running', 'done'), i * 900 + 700);
  });
};
new IntersectionObserver(
  ([entry], obs) => {
    if (!entry.isIntersecting) return;
    runAgent();
    obs.disconnect();
  },
  { threshold: 0.4 },
).observe(document.querySelector('.agent-run'));

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Off the clock: a photo grid that grows with however many photos exist.
// photos/photos.json is written by the nightly Google Drive sync (scripts/sync_photos.py),
// so the site itself never talks to Google.
const PHOTOS = {
  manifestUrl: 'photos/photos.json',
  pageSize: 12,
};

const loadFromManifest = async () => {
  const res = await fetch(PHOTOS.manifestUrl, { cache: 'no-cache' });
  if (!res.ok) throw new Error('No manifest');
  return (await res.json()).map((p) => ({ full: p.src, ...p }));
};

// Preview artwork: sunset landscapes drawn as SVG, standing in for real photos
const previewPhotos = () => {
  const palettes = [
    ['#2a1b2e', '#c4553a', '#f2a65a', '#1a1412'],
    ['#1d2433', '#8a4f6b', '#f0b37e', '#151a22'],
    ['#25301f', '#7f8f5a', '#e9c27a', '#141a12'],
    ['#2b2220', '#b35d3d', '#f6c48a', '#18120f'],
    ['#1f2a33', '#4f7a8a', '#e8b07a', '#121a1f'],
    ['#30231c', '#d27a45', '#ffd29a', '#1c140f'],
  ];
  const ratios = [
    [3, 2],
    [2, 3],
    [4, 3],
    [1, 1],
    [16, 9],
    [3, 4],
    [3, 2],
    [2, 3],
    [4, 5],
    [21, 9],
  ];
  const subjects = [
    'Mountain lake at dusk',
    'Ridgeline at golden hour',
    'Forest trail',
    'Valley sunrise',
    'Alpine evening',
    'Coastal cliffs',
  ];
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 30 }, (_, i) => {
    const [rw, rh] = ratios[i % ratios.length];
    const w = 600;
    const h = Math.round((w * rh) / rw);
    const [top, mid, glow, ground] = palettes[i % palettes.length];
    const ridge = (base, amp, step) => {
      let d = `M0 ${h}`;
      for (let x = 0; x <= w + step; x += step) d += ` L${x} ${base - rand() * amp}`;
      return d + ` L${w} ${h} Z`;
    };
    const sunY = h * (0.22 + rand() * 0.16);
    const sunX = w * (0.25 + rand() * 0.5);
    const sunR = 18 + rand() * 26;
    let ripples = '';
    for (let k = 0; k < 7; k++) {
      const y = h * (0.66 + k * 0.045);
      const len = 40 + rand() * 120;
      ripples += `<line x1='${sunX - len / 2}' x2='${sunX + len / 2}' y1='${y}' y2='${y}'/>`;
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
      <defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${top}'/><stop offset='.4' stop-color='${mid}'/><stop offset='.62' stop-color='${glow}'/></linearGradient><linearGradient id='l' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${glow}' stop-opacity='.55'/><stop offset='.5' stop-color='${mid}' stop-opacity='.5'/><stop offset='1' stop-color='${ground}'/></linearGradient></defs>
      <rect width='${w}' height='${h}' fill='url(#s)'/>
      <circle cx='${sunX}' cy='${sunY}' r='${sunR}' fill='#ffe3b0' opacity='.85'/>
      <path d='${ridge(h * 0.5, h * 0.2, 40)}' fill='${ground}' opacity='.5'/>
      <path d='${ridge(h * 0.58, h * 0.14, 26)}' fill='${ground}' opacity='.8'/>
      <rect y='${h * 0.62}' width='${w}' height='${h * 0.38}' fill='url(#l)'/>
      <circle cx='${sunX}' cy='${h * 1.24 - sunY}' r='${sunR * 0.9}' fill='#ffe3b0' opacity='.18'/>
      <g stroke='#ffe3b0' stroke-opacity='.18'>${ripples}</g>
      <rect y='${h * 0.62}' width='${w}' height='2' fill='${ground}'/>
    </svg>`;
    const src = 'data:image/svg+xml,' + encodeURIComponent(svg);
    return { src, full: src, w, h, alt: subjects[i % subjects.length] + ' (preview artwork)' };
  });
};

const photoGrid = document.querySelector('.photo-grid');
const moreBtn = document.querySelector('.photos-more button');
const photosCount = document.querySelector('.photos-count');
const photosNote = document.querySelector('.photos-note');
let allPhotos = [];
let shownCount = 0;

// Masonry: each photo keeps its shape and drops into the shortest column.
// Very wide panoramas span two columns when there are three or more.
const layoutPhotos = () => {
  const width = photoGrid.clientWidth;
  const cols = width >= 1000 ? 4 : width >= 700 ? 3 : 2;
  const gap = width < 560 ? 8 : 12;
  const colW = (width - gap * (cols - 1)) / cols;
  const heights = new Array(cols).fill(0);
  [...photoGrid.children].forEach((li) => {
    const ratio = Number(li.dataset.ratio);
    const place = (span) => {
      let col = 0;
      let top = Infinity;
      for (let c = 0; c <= cols - span; c++) {
        const t = Math.max(...heights.slice(c, c + span));
        if (t < top - 1) {
          top = t;
          col = c;
        }
      }
      const gapLeft = heights.slice(col, col + span).reduce((sum, hgt) => sum + (top - hgt), 0);
      return { span, col, top, gapLeft };
    };
    // a panorama only spans two columns when that leaves no visible hole
    let spot = place(1);
    if (ratio >= 1.7 && cols >= 3) {
      const wide = place(2);
      if (wide.gapLeft < colW * 0.12) spot = wide;
    }
    const { span, col: best, top: bestTop } = spot;
    const w = colW * span + gap * (span - 1);
    const h = Math.round(w / ratio);
    Object.assign(li.style, {
      left: best * (colW + gap) + 'px',
      top: bestTop + 'px',
      width: w + 'px',
      height: h + 'px',
    });
    for (let c = best; c < best + span; c++) heights[c] = bestTop + h + gap;
  });
  photoGrid.style.height = Math.max(0, Math.max(...heights) - gap) + 'px';
};
let lastGridWidth = 0;
new ResizeObserver(() => {
  if (photoGrid.clientWidth !== lastGridWidth) {
    lastGridWidth = photoGrid.clientWidth;
    layoutPhotos();
  }
}).observe(photoGrid);

const renderMore = () => {
  const next = allPhotos.slice(shownCount, shownCount + PHOTOS.pageSize);
  next.forEach((p, k) => {
    const i = shownCount + k;
    const li = document.createElement('li');
    li.className = 'photo';
    li.dataset.ratio = (p.w / p.h).toFixed(4);
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt || 'Photo by Sarah Tully';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = p.w;
    img.height = p.h;
    img.addEventListener('load', () => li.classList.add('loaded'), { once: true });
    img.addEventListener(
      'error',
      () => {
        li.remove();
        layoutPhotos();
      },
      { once: true },
    );
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'View larger: ' + img.alt);
    btn.addEventListener('click', () => openLightbox(i, btn));
    fig.append(img);
    if (p.alt) {
      const cap = document.createElement('figcaption');
      cap.textContent = p.alt;
      cap.setAttribute('aria-hidden', 'true');
      fig.append(cap);
    }
    li.append(fig, btn);
    photoGrid.append(li);
    setTimeout(() => li.classList.add('shown'), isStill() ? 0 : k * 60);
    if (img.complete) li.classList.add('loaded');
  });
  shownCount += next.length;
  layoutPhotos();
  moreBtn.hidden = shownCount >= allPhotos.length;
  photosCount.textContent = `Showing ${shownCount} of ${allPhotos.length} photos`;
};
moreBtn.addEventListener('click', () => {
  const firstNew = shownCount;
  renderMore();
  photoGrid.children[firstNew]?.querySelector('button').focus();
});

// Lightbox with keyboard and button navigation
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lightbox-caption');
const lbCount = lightbox.querySelector('.lightbox-count');
let lbIndex = 0;
let lbReturn = null;
const showLightbox = (i) => {
  lbIndex = (i + allPhotos.length) % allPhotos.length;
  const p = allPhotos[lbIndex];
  lbImg.src = p.full || p.src;
  lbImg.alt = p.alt || 'Photo by Sarah Tully';
  lbCaption.textContent = p.alt || '';
  lbCount.textContent = `${lbIndex + 1} / ${allPhotos.length}`;
};
const openLightbox = (i, from) => {
  lbReturn = from;
  showLightbox(i);
  lightbox.showModal();
};
lightbox.addEventListener('click', (e) => {
  const step = e.target.closest('[data-step]');
  if (step) showLightbox(lbIndex + Number(step.dataset.step));
  else if (e.target.closest('[data-close]') || e.target === lightbox) lightbox.close();
});
lightbox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
  if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
});
let touchX = null;
lightbox.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
lightbox.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
});
lightbox.addEventListener('close', () => lbReturn?.focus());

(async () => {
  try {
    allPhotos = await loadFromManifest();
  } catch (e) {
    allPhotos = [];
  }
  if (!allPhotos.length) {
    // Preview art only when reviewing locally (or with ?preview-photos); on the live site an
    // empty album hides the section until the first sync brings photos in.
    const previewing =
      location.protocol === 'file:' || new URLSearchParams(location.search).has('preview-photos');
    if (!previewing) {
      document.querySelector('#off-the-clock').hidden = true;
      document.querySelector('.nav a[href="#off-the-clock"]').hidden = true;
      const i = commands.findIndex((c) => c.href === '#off-the-clock');
      if (i > -1) commands.splice(i, 1);
      return;
    }
    allPhotos = previewPhotos();
    photosNote.textContent = 'Preview artwork. Your synced photos appear here.';
    photosNote.hidden = false;
  }
  photoGrid.setAttribute('aria-busy', 'false');
  renderMore();
})();

// Command palette
const palette = document.querySelector('.palette');
const paletteInput = palette.querySelector('input');
const paletteList = palette.querySelector('ul');
const commands = [
  { label: 'About', hint: 'section', href: '#about' },
  { label: 'Expertise', hint: 'section', href: '#expertise' },
  { label: 'Experience', hint: 'section', href: '#experience' },
  { label: 'Contact', hint: 'section', href: '#contact' },
  {
    label: 'LinkedIn',
    hint: 'external ↗',
    href: 'http://www.linkedin.com/in/satully',
    external: true,
  },
  { label: 'Off the clock (photos)', hint: 'section', href: '#off-the-clock' },
  { label: 'Back to top', hint: 'section', href: '#top' },
];
let filtered = commands;
let active = 0;
const go = (c) => {
  palette.close();
  if (c.external) window.open(c.href, '_blank', 'noopener');
  else {
    const target = document.querySelector(c.href);
    target.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth' });
    const heading = target.querySelector('h2') || target;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
};
const renderPalette = () => {
  const q = paletteInput.value.trim().toLowerCase();
  filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
  active = Math.min(active, Math.max(0, filtered.length - 1));
  paletteList.innerHTML = '';
  filtered.forEach((c, i) => {
    const li = document.createElement('li');
    li.id = 'palette-opt-' + i;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(i === active));
    li.textContent = c.label;
    const hint = document.createElement('span');
    hint.textContent = c.hint;
    hint.setAttribute('aria-hidden', 'true');
    li.appendChild(hint);
    li.addEventListener('click', () => go(c));
    li.addEventListener('pointerenter', () => {
      active = i;
      renderPalette();
    });
    paletteList.appendChild(li);
  });
  if (filtered.length) paletteInput.setAttribute('aria-activedescendant', 'palette-opt-' + active);
  else paletteInput.removeAttribute('aria-activedescendant');
};
const openPalette = () => {
  paletteInput.value = '';
  active = 0;
  renderPalette();
  palette.showModal();
  paletteInput.focus();
};
document
  .querySelectorAll('[data-open-palette]')
  .forEach((b) => b.addEventListener('click', openPalette));
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    palette.open ? palette.close() : openPalette();
  }
});
paletteInput.addEventListener('input', () => {
  active = 0;
  renderPalette();
});
paletteInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const n = filtered.length;
    if (!n) return;
    active = (active + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
    renderPalette();
  } else if (e.key === 'Enter' && filtered[active]) {
    go(filtered[active]);
  }
});
palette.addEventListener('click', (e) => {
  if (e.target === palette) palette.close();
});
if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
  document.querySelectorAll('.kbd-key').forEach((k) => (k.textContent = 'Ctrl '));
  document.querySelector('.footer kbd').textContent = 'Ctrl K';
}
