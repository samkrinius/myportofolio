(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = document.documentElement;
  const header = $('header');
  const toTop = $('#to-top');
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');

  /* ---------- Navbar & tombol kembali ke atas ---------- */
  let ticking = false;
  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('navbar-fixed', scrolled);
    toTop.classList.toggle('hidden', !scrolled);
    toTop.classList.toggle('flex', scrolled);
    ticking = false;
  };a
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Hamburger menu ---------- */
  const closeMenu = () => {
    hamburger.classList.remove('hamburger-active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.add('hidden');
  };

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('hamburger-active');
    hamburger.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('hidden', !open);
  });

  // Klik di luar menu (pakai closest supaya klik pada garis hamburger tidak ikut menutup)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hamburger') && !e.target.closest('#nav-menu')) closeMenu();
  });
  $$('a', navMenu).forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Dark mode ---------- */
  const themeToggle = $('#theme-toggle');
  const getStored = () => {
    try {
      return localStorage.getItem('theme');
    } catch (_) {
      return null;
    }
  };
  const setStored = (v) => {
    try {
      localStorage.setItem('theme', v);
    } catch (_) {}
  };
  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    themeToggle.setAttribute('aria-pressed', String(dark));
  };

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(getStored() ? getStored() === 'dark' : media.matches);

  themeToggle.addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    applyTheme(dark);
    setStored(dark ? 'dark' : 'light');
  });
  media.addEventListener?.('change', (e) => {
    if (!getStored()) applyTheme(e.matches);
  });

  /* ---------- Menu aktif sesuai section ---------- */
  const links = $$('.nav-link');
  const sections = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.toggle('nav-active', l.getAttribute('href') === '#' + entry.target.id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Animasi muncul saat scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Lightbox sertifikat ---------- */
  const box = $('#lightbox');
  const boxImg = $('#lightbox-img');
  const boxCount = $('#lightbox-count');
  const certs = $$('.cert');
  let current = 0;

  const show = (i) => {
    current = (i + certs.length) % certs.length;
    const btn = certs[current];
    boxImg.src = btn.dataset.src;
    boxImg.alt = $('img', btn).alt;
    boxCount.textContent = `${current + 1} / ${certs.length}`;
  };
  const openBox = (i) => {
    show(i);
    if (typeof box.showModal === 'function') box.showModal();
    else box.setAttribute('open', '');
    document.body.classList.add('overflow-hidden');
  };
  const closeBox = () => {
    if (typeof box.close === 'function') box.close();
    else box.removeAttribute('open');
  };

  certs.forEach((btn, i) => btn.addEventListener('click', () => openBox(i)));
  $('#lightbox-close').addEventListener('click', closeBox);
  $('#lightbox-prev').addEventListener('click', () => show(current - 1));
  $('#lightbox-next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => {
    if (e.target === box) closeBox();
  });
  box.addEventListener('close', () => document.body.classList.remove('overflow-hidden'));
  document.addEventListener('keydown', (e) => {
    if (!box.hasAttribute('open')) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ---------- Form kontak (membuka aplikasi email) ---------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  const EMAIL = 'samkriniushutagalung@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    const subject = encodeURIComponent(`Pesan dari portofolio - ${name}`);
    const body = encodeURIComponent(`${message}\n\n---\nNama: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    status.textContent = 'Aplikasi email Anda akan terbuka. Terima kasih atas pesannya!';
    form.reset();
  });

  /* ---------- Tahun di footer ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
