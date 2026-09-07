/* ================= VIDEO AUDIO INTEGRATION ================= */
const bgVideo = document.getElementById('bgHogwartsVideo');
let isAudioActive = false;

function startVideoAudio() {
  if (bgVideo) {
    bgVideo.muted = false;
    bgVideo.volume = 0.8;
    bgVideo.play().catch(() => {});
    isAudioActive = true;
    updateAudioHUD(true);
  }
}

function toggleVideoAudio() {
  if (!bgVideo) return;
  if (isAudioActive) {
    bgVideo.muted = true;
    isAudioActive = false;
    updateAudioHUD(false);
  } else {
    bgVideo.muted = false;
    bgVideo.play().catch(() => {});
    isAudioActive = true;
    updateAudioHUD(true);
  }
}

function updateAudioHUD(isOn) {
  const text = document.getElementById('musicText');
  const icon = document.getElementById('soundIcon');
  if (isOn) {
    text.innerText = 'Soundtrack: On';
    icon.innerHTML = '&#127926;';
  } else {
    text.innerText = 'Soundtrack: Muted';
    icon.innerHTML = '&#128263;';
  }
}

/* ================= PROCEDURAL SPARKLE CHIME ON CLICKS ================= */
class MagicSparkFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  playSparkle() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    const freqs = [1567.98, 1760.00, 2093.00, 2349.32, 2793.83];
    
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.04);

      gain.gain.setValueAtTime(0.04, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.6);
    });
  }

  playPatronusCrescendo() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const now = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.08, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.4);
    });
  }
}

const fx = new MagicSparkFX();

/* ================= LUMOS / NOX THEME TOGGLE ================= */
function toggleLumos() {
  fx.playSparkle();
  const isLumos = document.body.classList.toggle('theme-lumos');
  document.body.classList.toggle('theme-nox', !isLumos);
  document.getElementById('lumosText').innerText = isLumos ? 'Nox' : 'Lumos';
  document.getElementById('lumosIcon').innerHTML = isLumos ? '&#127769;' : '&#127775;';
}

/* ================= CONTINUOUS PARALLAX VIDEO SCROLL ================= */
(function initVideoParallax() {
  const videoEl = document.getElementById('bgHogwartsVideo');

  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;

    const travelVh = -progress * 130;
    videoEl.style.transform = `translateY(${travelVh}vh)`;
  }, { passive: true });
})();

/* ================= CATCH THE GOLDEN SNITCH ================= */
function catchSnitch() {
  fx.playSparkle();

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.5 },
    colors: ['#ffd666', '#d4af37']
  });

  document.getElementById('snitchCard').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('snitchCard').style.display = 'none';
    const scrollScene = document.getElementById('scrollScene');
    scrollScene.style.display = 'flex';
    gsap.from(scrollScene, { scale: 0.7, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' });
  }, 400);
}

/* ================= UNROLL SCROLL & READ TIMER ================= */
let autoProceedTimer = null;

function unfurlScroll() {
  fx.playSparkle();
  startVideoAudio();

  const scrollCore = document.getElementById('scrollCore');
  const tip = document.getElementById('tapSealTip');
  scrollCore.classList.add('unfurled');
  if (tip) tip.style.display = 'none';

  window.startRosePetals();

  confetti({
    particleCount: 160,
    spread: 120,
    origin: { y: 0.5 },
    colors: ['#d4af37', '#911721', '#ffd666', '#ffffff']
  });

  autoProceedTimer = setTimeout(proceedToHall, 8000);
}

function proceedToHall() {
  fx.playSparkle();
  if (autoProceedTimer) clearTimeout(autoProceedTimer);

  const entrance = document.getElementById('entranceStage');
  const main = document.getElementById('scrollExperience');

  main.style.display = 'block';
  entrance.classList.add('unsealed');
  document.body.classList.remove('locked');

  gsap.from('#hero .hero-content > *', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out'
  });
}

/* ================= STORYLINE FLIP CARD FUNCTION ================= */
function flipStoryCard(cardEl) {
  fx.playSparkle();
  cardEl.classList.toggle('flipped');
}

/* ================= DYNAMIC FLOATING CANDLES ================= */
(function initFloatingCandles() {
  const container = document.getElementById('candlesSystem');
  const candleCount = 20;

  for (let i = 0; i < candleCount; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle-prop';
    candle.style.left = (i % 2 === 0 ? Math.random() * 14 + 2 : Math.random() * 14 + 84) + '%';
    candle.style.top = (Math.random() * 88 + 6) + 'vh';

    const wick = document.createElement('div');
    wick.className = 'candle-wick';
    const flame = document.createElement('div');
    flame.className = 'candle-flame';

    candle.appendChild(wick);
    candle.appendChild(flame);
    container.appendChild(candle);
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const candles = document.querySelectorAll('.candle-prop');
    candles.forEach((c, idx) => {
      if (scrollY > idx * 75) {
        c.classList.add('ignited');
      } else {
        c.classList.remove('ignited');
      }
    });
  }, { passive: true });
})();

/* ================= 3D AERODYNAMIC TWISTING ROSE PETALS ================= */
(function initRosePetalsPhysics() {
  const canvas = document.getElementById('rosePetalsCanvas');
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const petals = [];
  let isRaining = false;

  window.startRosePetals = function() {
    isRaining = true;
    for (let i = 0; i < 60; i++) {
      petals.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        size: Math.random() * 8 + 9,
        vy: Math.random() * 1.8 + 1.2,
        vx: Math.random() * 1.2 - 0.6,
        pitch: Math.random() * Math.PI,
        roll: Math.random() * Math.PI,
        yaw: Math.random() * Math.PI,
        vPitch: (Math.random() - 0.5) * 0.04,
        vRoll: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.35 + 0.65
      });
    }
  };

  function draw3DPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.yaw);
    ctx.scale(Math.cos(p.pitch), Math.sin(p.roll));

    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.size);
    grad.addColorStop(0, '#c71f37');
    grad.addColorStop(0.7, '#8f111f');
    grad.addColorStop(1, '#4f060d');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (isRaining) {
      petals.forEach(p => {
        draw3DPetal(p);
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.015) + p.vx;
        p.pitch += p.vPitch;
        p.roll += p.vRoll;

        if (p.y > h + 30) {
          p.y = -20;
          p.x = Math.random() * w;
        }
      });
    }

    requestAnimationFrame(loop);
  }
  loop();
})();

/* ================= CONTINUOUS CASTLE FIREWORKS ================= */
(function initContinuousFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const colors = ['#ffd666', '#d4af37', '#ff4d4d', '#ffffff', '#ff8c00'];

  function spawnBurst() {
    const x = Math.random() * (w * 0.7) + w * 0.15;
    const y = Math.random() * (h * 0.38) + h * 0.08;
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 32; i++) {
      const angle = (Math.PI * 2 * i) / 32;
      const speed = Math.random() * 3.5 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        color
      });
    }
  }

  setInterval(spawnBurst, 1600);

  function render() {
    ctx.clearRect(0, 0, w, h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.alpha -= 0.015;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    requestAnimationFrame(render);
  }
  render();
})();

/* ================= WAND CURSOR ENGINE ================= */
(function initWand() {
  const isFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!isFine) return;

  const wand = document.getElementById('wandCursor');
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX = targetX;
  let curY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function follow() {
    curX += (targetX - curX) * 0.38;
    curY += (targetY - curY) * 0.38;
    wand.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(follow);
  }
  follow();

  function spawnSpark(x, y) {
    const spark = document.createElement('span');
    spark.className = 'stardust-particle';
    const size = Math.random() * 4 + 2;
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    document.body.appendChild(spark);

    const driftX = (Math.random() - 0.5) * 35;
    const driftY = Math.random() * 30 + 10;

    requestAnimationFrame(() => {
      spark.style.transform = `translate(${driftX}px, ${driftY}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 850);
  }

  let last = 0;
  window.addEventListener('mousemove', () => {
    const now = performance.now();
    if (now - last > 30) {
      spawnSpark(curX, curY);
      last = now;
    }
  }, { passive: true });

  setInterval(() => spawnSpark(curX, curY), 280);
})();

/* ================= EXPECTO PATRONUM + FLOWER BOMB & BUTTERFLIES ================= */
(function initExpectoPatronum() {
  const patronus = document.getElementById('patronusSpell');
  const bWrap = document.getElementById('butterfliesWrap');

  window.addEventListener('dblclick', (e) => {
    fx.playPatronusCrescendo();
    patronus.classList.add('cast');

    bWrap.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const b = document.createElement('div');
      b.className = 'silver-butterfly';
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 180 + 40;
      b.style.left = e.clientX + 'px';
      b.style.top = e.clientY + 'px';
      b.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      b.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      bWrap.appendChild(b);
    }

    confetti({
      particleCount: 90,
      spread: 100,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#c71f37', '#ffd666', '#87d3ff', '#ffffff']
    });

    setTimeout(() => {
      patronus.classList.remove('cast');
    }, 2400);
  });

  setTimeout(() => {
    const hint = document.getElementById('mysteryHint');
    if (hint) hint.classList.add('vanish');
  }, 6500);
})();

/* ================= ILLUMINATED MARAUDER'S PATHWAY ================= */
(function initIlluminatedPathway() {
  const stops = document.querySelectorAll('.path-stop');
  const track = document.getElementById('leylineTrack');
  const map = document.getElementById('itineraryMap');

  window.addEventListener('scroll', () => {
    const mapRect = map.getBoundingClientRect();
    const mapTop = mapRect.top;
    const mapHeight = mapRect.height;
    const windowH = window.innerHeight;

    if (mapTop < windowH * 0.75 && mapRect.bottom > 0) {
      const scrollProgress = Math.min(Math.max((windowH * 0.75 - mapTop) / mapHeight, 0), 1);
      track.style.height = `${scrollProgress * 100}%`;

      stops.forEach(stop => {
        const stopRect = stop.getBoundingClientRect();
        if (stopRect.top < windowH * 0.7) {
          stop.classList.add('illuminated');
        } else {
          stop.classList.remove('illuminated');
        }
      });
    }
  }, { passive: true });
})();

/* ================= 3D BANQUET MENU FLIP BOOK ================= */
function turnMenuPage(pageIndex, toNext) {
  fx.playSparkle();
  const page = document.getElementById(`mPage${pageIndex}`);
  if (toNext) {
    page.classList.add('flipped');
  } else {
    page.classList.remove('flipped');
  }
}

function resetMenuBook() {
  fx.playSparkle();
  for (let i = 0; i <= 5; i++) {
    const p = document.getElementById(`mPage${i}`);
    if (p) p.classList.remove('flipped');
  }
}

/* ================= COUNTDOWN TIMER ================= */
(function initCountdown() {
  const pad = n => String(n).padStart(2, '0');

  function update() {
    const weddingTime = new Date('2026-12-21T17:30:00Z').getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, weddingTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cdDays').innerText = pad(days);
    document.getElementById('cdHours').innerText = pad(hours);
    document.getElementById('cdMins').innerText = pad(mins);
    document.getElementById('cdSecs').innerText = pad(secs);
  }

  update();
  setInterval(update, 1000);
})();

/* ================= HOUSE SELECTOR & RSVP ================= */
const houseBtns = document.querySelectorAll('.house-btn');
houseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fx.playSparkle();
    houseBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

const choices = document.querySelectorAll('.rsvp-choice');
choices.forEach(btn => {
  btn.addEventListener('click', () => {
    fx.playSparkle();
    choices.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

function handleFormSubmit(e) {
  e.preventDefault();
  fx.playSparkle();
  const btn = document.getElementById('submitBtn');
  btn.innerText = 'Binding Spell...';

  confetti({
    particleCount: 85,
    spread: 70,
    origin: { y: 0.8 },
    colors: ['#d4af37', '#911721']
  });

  setTimeout(() => {
    document.getElementById('magicalRsvpForm').hidden = true;
    document.getElementById('rsvpSuccess').hidden = false;
  }, 1200);
}