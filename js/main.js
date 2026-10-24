// تصفية الأعمال حسب الجهة
(function () {
  var pills = document.querySelectorAll('.pill[data-filter]');
  var clients = document.querySelectorAll('.client[data-client]');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.getAttribute('data-filter');
      pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      clients.forEach(function (c) { var show = f === 'all' || c.getAttribute('data-client') === f; c.hidden = !show; if (show) { c.classList.remove('fade'); void c.offsetWidth; c.classList.add('fade'); c.classList.add('in'); } });
    });
  });
})();

// عداد العرض — نهاية العرض: 30 نوفمبر 2026، 11:59:59 مساءً بتوقيت الرياض
(function () {
  var END = Date.parse('2026-11-30T23:59:59+03:00');
  var timer = document.getElementById('offer-timer');
  var over = document.getElementById('offer-over');
  if (!timer) return;
  var el = {
    d: timer.querySelector('[data-unit="d"]'),
    h: timer.querySelector('[data-unit="h"]'),
    m: timer.querySelector('[data-unit="m"]'),
    s: timer.querySelector('[data-unit="s"]')
  };
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var left = Math.max(0, END - Date.now());
    if (left === 0) { timer.hidden = true; over.hidden = false; clearInterval(id); return; }
    var sec = Math.floor(left / 1000);
    el.d.textContent = Math.floor(sec / 86400);
    el.h.textContent = pad(Math.floor(sec % 86400 / 3600));
    el.m.textContent = pad(Math.floor(sec % 3600 / 60));
    el.s.textContent = pad(sec % 60);
    el.s.classList.remove('tick'); void el.s.offsetWidth; el.s.classList.add('tick');
  }
  var id = setInterval(tick, 1000);
  tick();
})();

// قياس النقرات: يرسل حدث لكل نقرة على الواتساب أو الإنستقرام أو زر باقة (يشتغل لما يكون Google Analytics مفعّل)
(function () {
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', params);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var plan = a.closest('.plan');
    if (href.indexOf('wa.me') !== -1) {
      var sec = a.closest('section, header, footer');
      track('whatsapp_click', { package: plan ? plan.querySelector('h3').textContent : 'عام', label: a.textContent.trim(), location: sec ? (sec.id || sec.tagName.toLowerCase()) : 'page' });
    } else if (href.indexOf('instagram.com') !== -1) {
      track('instagram_click', { label: a.textContent.trim() });
    } else if (href.indexOf('drive.google.com') !== -1) {
      track('videos_click', {});
    }
  });
})();

// الحركة: هيدر عند النزول + ظهور العناصر تدريجياً
(function () {
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  var groups = ['.hero__text > *', '.hero__img', '.work-head', '.client', '.videos', '.section > .h2', '.section > div:first-child', '.timer', '.services .card', '.plans .plan', '.note', '.contact__text > *', '.contact__logo'];
  var seen = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (seen.indexOf(el) !== -1) return; seen.push(el);
      el.classList.add('reveal'); el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { var t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(function () { t.classList.remove('reveal', 'in'); t.style.removeProperty('--d'); }, 1400); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  seen.forEach(function (el) { io.observe(el); });
})();
