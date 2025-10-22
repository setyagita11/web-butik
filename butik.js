// --- helper kecil
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// jalankan setelah DOM siap
on(document, 'DOMContentLoaded', () => {

    /* ========== 1) BACK TO TOP ========== */
    (function () {
        const back = qs('#backToTop');
        if (!back) return;
        on(window, 'scroll', () => back.style.display = (window.scrollY > 300) ? 'block' : 'none');
        on(back, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* ========== 2) NAVBAR AUTO-HIDE ON SCROLL ========== */
    (function () {
        const navbar = qs('#navbar');
        if (!navbar) return;
        let last = 0;
        on(window, 'scroll', () => {
            const cur = window.pageYOffset || document.documentElement.scrollTop;
            navbar.style.top = (cur > last && cur > 60) ? '-120px' : '0';
            last = cur <= 0 ? 0 : cur;
        });
    })();

    /* ========== 3) LOGIN MODAL (client demo) ========== */
    (function () {
        const modal = qs('#loginModal');
        if (!modal) return;
        const openBtn = qs('#openLogin'), closeBtn = qs('#closeLogin'), doLogin = qs('#doLoginBtn');

        on(openBtn, 'click', () => {
            modal.setAttribute('aria-hidden', 'false');
            const first = modal.querySelector('input');
            if (first) first.focus();
        });
        on(closeBtn, 'click', () => modal.setAttribute('aria-hidden', 'true'));
        on(doLogin, 'click', () => {
            const u = qs('#username')?.value.trim(), p = qs('#password')?.value.trim();
            if (!u || !p) { alert('Isi username & password dulu ya'); return; }
            alert(`Berhasil login (demo). Selamat datang, ${u}!`);
            modal.setAttribute('aria-hidden', 'true');
        });
        on(window, 'keydown', (e) => { if (e.key === 'Escape') modal.setAttribute('aria-hidden', 'true'); });
    })();

    /* ========== 4) PRODUCT CAROUSEL (horizontal) ========== */
    (function () {
        const carousel = qs('#productCarousel');
        if (!carousel) return;
        const prev = qs('.carousel-btn.prev'), next = qs('.carousel-btn.next');
        const step = 240;
        const scrollBy = px => carousel.scrollBy({ left: px, behavior: 'smooth' });

        on(prev, 'click', () => scrollBy(-step));
        on(next, 'click', () => scrollBy(step));

        // auto scroll with pause on hover/focus

        let iv = setInterval(() => scrollBy(step), 4000);
        const stop = () => { if (iv) { clearInterval(iv); iv = null; } };
        const start = () => { stop(); iv = setInterval(() => scrollBy(step), 4000); };

        on(carousel, 'mouseenter', stop);
        on(carousel, 'mouseleave', start);
        on(carousel, 'focusin', stop);
        on(carousel, 'focusout', start);
    })();

    /* ========== 5) HERO SLIDER (simple fade) ========== */
    (function () {
    const slides = qsa('.hero-slide');
    if (!slides.length) return;

    // Tambah array gambar hero
    const bgImages = [
        'url(https://www.rukita.co/stories/wp-content/uploads/2022/05/Rekomendasi-Tempat-Beli-Batik-di-Jogja.jpg)',
        'url(https://images.malkelapagading.com/articles/tampil-kece-dengan-pilihan-batik-di-summarecon-mall-bekasi2-22706.jpg)'
    ];

    const heroSection = qs('.hero');
    let idx = 0, timer = null;

    const show = i => {
        slides.forEach((s, j) => s.style.display = (j === i) ? 'flex' : 'none');
        heroSection.style.backgroundImage = bgImages[i];
    };

    const next = () => { idx = (idx + 1) % slides.length; show(idx); };
    const start = () => timer = setInterval(next, 5000);

    show(idx);
    start();
})();

    /* ========== 6) ACCESSIBILITY HELPERS ========== */
    (function () {
        qsa('.carousel-btn, .hero-prev, .hero-next, .testi-prev, .testi-next').forEach(b => {
            on(b, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } });
        });
    })();

    /* ========== 7) TESTIMONIAL SLIDER ========== */
   (function () {
    const track = qs('.testi-track'), viewport = qs('.testi-viewport');
    if (!track || !viewport) return;
    const prevBtn = qs('.testi-prev'), nextBtn = qs('.testi-next');
    const cards = Array.from(track.children);
    if (!cards.length) return;

    let index = 0;
    const TOTAL = cards.length;
    const INTERVAL = 4000;
    let timer = null, isHover = false, isInteracting = false, interactionTimeout = null;

    function updatePosition(instant = false) {
        // kalau instant = true, matikan transisi biar gak kedip
        track.style.transition = instant ? 'none' : 'transform 0.45s ease';
        const offset = index * viewport.offsetWidth;
        track.style.transform = `translateX(-${offset}px)`;
    }

    function next() {
        index++;
        if (index >= TOTAL) {
            index = 0;
            updatePosition(true); // reset tanpa animasi
        } else updatePosition();
    }

    function prev() {
        index--;
        if (index < 0) {
            index = TOTAL - 1;
            updatePosition(true);
        } else updatePosition();
    }

    function startAuto() {
        stopAuto();
        timer = setInterval(() => {
            if (!isHover && !isInteracting) next();
        }, INTERVAL);
    }

    function stopAuto() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    function resetInteraction() {
        if (interactionTimeout) clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => { isInteracting = false; }, 3000);
        startAuto();
    }

    // event listeners
    on(nextBtn, 'click', () => { isInteracting = true; next(); resetInteraction(); });
    on(prevBtn, 'click', () => { isInteracting = true; prev(); resetInteraction(); });
    on(viewport, 'mouseenter', () => isHover = true);
    on(viewport, 'mouseleave', () => isHover = false);
    on(window, 'resize', () => updatePosition(true));

    updatePosition(true);
    startAuto();
})();

});

/* ========== 8) MOBILE NAVBAR TOGGLE ========== */
(function () {
  const toggle = qs('#navToggle');
  const menu = qs('.main-nav ul');
  if (!toggle || !menu) return;

  on(toggle, 'click', () => {
    menu.classList.toggle('show');
    toggle.classList.toggle('active');
  });

  // otomatis nutup menu saat salah satu link diklik
  qsa('.main-nav a').forEach(link => {
    on(link, 'click', () => {
      menu.classList.remove('show');
      toggle.classList.remove('active');
    });
  });
})();