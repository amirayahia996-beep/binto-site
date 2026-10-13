// تصفية الأعمال حسب الجهة
(function () {
  var pills = document.querySelectorAll('.pill[data-filter]');
  var clients = document.querySelectorAll('.client[data-client]');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.getAttribute('data-filter');
      pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      clients.forEach(function (c) { c.hidden = !(f === 'all' || c.getAttribute('data-client') === f); });
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
      track('whatsapp_click', { package: plan ? plan.querySelector('h3').textContent : 'عام', label: a.textContent.trim() });
    } else if (href.indexOf('instagram.com') !== -1) {
      track('instagram_click', { label: a.textContent.trim() });
    } else if (href.indexOf('drive.google.com') !== -1) {
      track('videos_click', {});
    }
  });
})();
