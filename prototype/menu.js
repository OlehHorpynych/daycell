/* DAYCELL — liquid-morph меню (порт 21st.dev/liquid-morph-floating-menu без React/framer-motion).
   Мышь: открывается при наведении, закрывается через 250ms после ухода курсора (не мигает при соскоке).
   Тач (нет hover): открывается/закрывается нажатием, закрывается тапом вне меню.
   Клавиатура: Enter/Space на бургере — открыть/закрыть, Esc — закрыть и вернуть фокус, Tab наружу — закрыть. */
(function () {
  'use strict';

  var menu = document.querySelector('.burger');
  if (!menu) return;
  var toggle = menu.querySelector('.burger-toggle');
  var links = Array.prototype.slice.call(menu.querySelectorAll('.burger-link'));
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var closeTimer = null;

  // Буквы для прокрутки: видимый текст из двух копий каждой буквы, для скринридера — aria-label
  links.forEach(function (a, i) {
    var text = a.textContent.trim();
    a.setAttribute('aria-label', text);
    a.style.setProperty('--i', i);
    a.textContent = '';
    text.split('').forEach(function (ch, n) {
      var c = document.createElement('span');
      c.className = 'roll-c';
      c.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.className = 'roll-in';
      inner.style.setProperty('--d', (30 * n) + 'ms');
      inner.appendChild(document.createElement('span')).textContent = ch;
      inner.appendChild(document.createElement('span')).textContent = ch;
      c.appendChild(inner);
      a.appendChild(c);
    });
  });

  function isOpen() { return menu.getAttribute('data-open') === 'true'; }

  function setOpen(open) {
    clearTimeout(closeTimer);
    if (open === isOpen()) return;
    menu.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Наведение (только устройства с мышью)
  menu.addEventListener('mouseenter', function () { if (canHover.matches) setOpen(true); });
  menu.addEventListener('mouseleave', function () {
    if (!canHover.matches) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      if (!menu.contains(document.activeElement) || !document.activeElement.matches(':focus-visible')) setOpen(false);
    }, 250);
  });

  // Нажатие: с клавиатуры (detail === 0) и на тач-экранах — переключает; мышью при hover — только открывает
  toggle.addEventListener('click', function (e) {
    if (e.detail === 0 || !canHover.matches) setOpen(!isOpen());
    else setOpen(true);
  });

  // Тап вне меню закрывает
  document.addEventListener('pointerdown', function (e) {
    if (isOpen() && !menu.contains(e.target)) setOpen(false);
  });

  // Esc закрывает и возвращает фокус на бургер
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
  });

  // Фокус ушёл за пределы меню (Tab) — закрываем
  menu.addEventListener('focusout', function () {
    setTimeout(function () {
      if (!menu.contains(document.activeElement) && !menu.matches(':hover')) setOpen(false);
    }, 0);
  });
})();
