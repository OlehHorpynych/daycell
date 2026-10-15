/* DAYCELL — карусель товаров на главном экране.
   Слайд 2 (Deye) уже в разметке; JS подменяет поля [data-f] и переключает по точкам, ←/→ и свайпу.
   Движение по DS: кроссфейд 600ms, объект 0.98→1. При prefers-reduced-motion — мгновенная смена. */
(function () {
  'use strict';

  var SLIDES = [
    {
      name: 'LONGi Hi-MO X10 Explorer',
      category: 'Solar panel',
      brand: 'LONGi',
      model: 'Hi-MO X10 Explorer',
      lead: 'Premium solar panel (645 W).',
      shopText: 'Shop solar panels',
      shopHref: '#catalog?category=solar-panels',
      image: 'assets/longi/longi-hi-mo-x10-explorer.svg',
      alt: 'LONGi Hi-MO X10 Explorer 645 W solar panel',
      specs: ['645 W', '15 years warranty']
    },
    {
      name: 'Deye SUN-10K',
      category: 'Hybrid inverter',
      brand: 'Deye',
      model: 'SUN-10K',
      lead: 'Premium inverter. For comfort and quiet in your home.',
      shopText: 'Shop inverters',
      shopHref: '#catalog?category=inverters',
      image: 'assets/deye/deye-sun10k-34.png',
      alt: 'Deye SUN-10K hybrid inverter',
      specs: ['10 kW', '10 years warranty']
    },
    {
      name: 'Felicity FLB48230WG1-H',
      category: 'Home battery',
      brand: 'Felicity',
      model: 'FLB48230WG1-H',
      lead: 'Excellent balance of performance and safety.',
      shopText: 'Shop home batteries',
      shopHref: '#catalog?category=home-batteries',
      image: 'assets/felicity/felicity-flb48230-34.png',
      alt: 'Felicity FLB48230WG1-H 11.7 kWh home battery',
      specs: ['11.7 kWh', '10 years warranty']
    }
  ];

  var root = document.querySelector('.home');
  if (!root) return;
  var f = function (key) { return root.querySelector('[data-f="' + key + '"]'); };
  var img = f('image');
  var hero = root.querySelector('.home-hero');
  var specs = f('specs');
  var dots = Array.prototype.slice.call(root.querySelectorAll('.dm-dot[data-slide]'));
  var current = 1;
  var busy = false;
  var queued = null; // клик во время перехода не теряется — покажем после текущей анимации
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Заранее грузим картинки, чтобы смена была без мигания
  SLIDES.forEach(function (s) { var p = new Image(); p.src = s.image; });

  function fill(s) {
    f('category').textContent = s.category;
    f('brand').textContent = s.brand;
    f('model').textContent = s.model;
    f('lead').textContent = s.lead;
    f('shopText').textContent = s.shopText;
    f('shop').setAttribute('href', s.shopHref);
    img.src = s.image;
    img.alt = s.alt;
    specs.textContent = '';
    s.specs.forEach(function (text) {
      var tag = document.createElement('span');
      tag.className = 'dm-tag';
      tag.textContent = text;
      specs.appendChild(tag);
    });
  }

  var restartTimer = function () {}; // задаётся ниже, в блоке автосмены
  var shown = current;

  // Новая активная точка = новый отсчёт 5s (CSS-заливка тоже стартует заново на новой точке)
  function markDots(n) {
    dots.forEach(function (d, i) {
      if (i === n) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    if (n !== shown) { shown = n; restartTimer(); }
  }

  function ready(src) {
    var probe = new Image();
    probe.src = src;
    return probe.decode ? probe.decode().catch(function () {}) : Promise.resolve();
  }

  function go(n) {
    n = (n + SLIDES.length) % SLIDES.length;
    if (busy) { queued = n; markDots(n); return; }
    if (n === current) return;
    var s = SLIDES[n];
    current = n;
    markDots(n);

    if (reduced.matches || !img.animate) { fill(s); return; }

    busy = true;
    // Мягкий переход ≈1.6s: уход — фото слегка растворяется в размытии, строки текста уходят вверх по очереди;
    // приход — фото проявляется из размытия и 0.97, строки поднимаются снизу лесенкой.
    var easeOut = 'cubic-bezier(.16,1,.3,1)';   // плавное торможение
    var easeIn = 'cubic-bezier(.65,0,.35,1)';   // мягкий разгон-торможение для ухода
    // Лесенка — только для левой колонки. Плашки (specs) стоят отдельно справа и идут вместе с первой строкой,
    // иначе как последняя ступень лесенки они появлялись заметно позже остального.
    var lines = [f('category'), hero.querySelector('.dm-hero-t'), f('lead'), f('shop')];
    var lineOut = function (i) { return i * 40; };
    var lineIn = function (i) { return 140 + i * 80; };
    var steps = lines.map(function (el, i) { return { el: el, out: lineOut(i), in: lineIn(i) }; })
      .concat({ el: specs, out: lineOut(0), in: lineIn(0) });

    var outs = [img.animate(
      [{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.015)', filter: 'blur(6px)' }],
      { duration: 520, easing: easeIn, fill: 'forwards' }
    )].concat(steps.map(function (s) {
      return s.el.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }],
        { duration: 420, delay: s.out, easing: easeIn, fill: 'forwards' }
      );
    }));

    Promise.all(outs.map(function (a) { return a.finished; }).concat(ready(s.image))).then(function () {
      fill(s);
      var ins = [img.animate(
        [{ opacity: 0, transform: 'scale(.97)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 1100, easing: easeOut }
      )].concat(steps.map(function (st) {
        return st.el.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
          { duration: 900, delay: st.in, easing: easeOut, fill: 'backwards' }
        );
      }));
      outs.forEach(function (a) { a.cancel(); });
      return Promise.all(ins.map(function (a) { return a.finished; }));
    }).then(done, done);
  }

  function done() {
    busy = false;
    if (queued !== null) { var next = queued; queued = null; go(next); }
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () { go(Number(d.getAttribute('data-slide'))); });
  });

  // Стрелки считают от последнего выбранного слайда, даже если переход ещё идёт
  function target() { return queued !== null ? queued : current; }

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight') go(target() + 1);
    else if (e.key === 'ArrowLeft') go(target() - 1);
  });

  // Автосмена каждые 7s. Время считает JS-таймер с учётом пауз (CSS-анимации в фоне тормозятся),
  // заливка пилюли (pager-fill, 7s в styles.css — держать равными) — только индикатор, пауза тем же классом.
  // Ручное переключение перезапускает отсчёт. При prefers-reduced-motion автосмены нет.
  var DURATION = 7000;
  var pager = root.querySelector('.home-pager');
  var hoverPause = false, focusPause = false;
  var timer = null, startedAt = 0, remaining = DURATION;

  function isPaused() { return hoverPause || focusPause || document.hidden; }

  function schedule() {
    clearTimeout(timer); timer = null;
    if (reduced.matches || isPaused()) return;
    startedAt = Date.now();
    timer = setTimeout(function () { timer = null; go(target() + 1); }, remaining);
  }

  function holdTimer() {
    if (timer === null) return;
    clearTimeout(timer); timer = null;
    remaining = Math.max(0, remaining - (Date.now() - startedAt));
  }

  restartTimer = function () { remaining = DURATION; schedule(); };

  function syncPlaying() { pager.classList.toggle('is-playing', !reduced.matches); restartTimer(); }
  function syncPaused() {
    var paused = isPaused();
    pager.classList.toggle('is-paused', paused);
    if (paused) holdTimer(); else if (timer === null) schedule();
  }

  // Пауза, пока человек читает текст, наводится на пагинацию или работает с клавиатуры
  [hero, pager, specs].forEach(function (el) {
    el.addEventListener('mouseenter', function () { hoverPause = true; syncPaused(); });
    el.addEventListener('mouseleave', function () { hoverPause = false; syncPaused(); });
  });
  // Только фокус с клавиатуры (:focus-visible) — клик мышкой по точке не должен останавливать показ
  function keyboardFocusInside() {
    var a = document.activeElement;
    return !!a && root.contains(a) && a.matches(':focus-visible');
  }
  root.addEventListener('focusin', function () { focusPause = keyboardFocusInside(); syncPaused(); });
  root.addEventListener('focusout', function () {
    setTimeout(function () { focusPause = keyboardFocusInside(); syncPaused(); }, 0);
  });
  document.addEventListener('visibilitychange', syncPaused);
  if (reduced.addEventListener) reduced.addEventListener('change', syncPlaying);

  syncPlaying();
  syncPaused();

  // Свайп по экрану (телефон): горизонтальный жест длиннее 40px и явно горизонтальный
  var sx = null, sy = null;
  root.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(target() + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
