(function () {
  'use strict';

  // Mobile nav toggle
  var header = document.getElementById('site-header');
  var burger = document.getElementById('nav-burger');
  var burgerIcon = burger ? burger.querySelector('i') : null;

  function closeNav() {
    header.classList.remove('nav-open');
    if (burgerIcon) {
      burgerIcon.classList.remove('fa-xmark');
      burgerIcon.classList.add('fa-bars');
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      if (burgerIcon) {
        burgerIcon.classList.toggle('fa-bars', !open);
        burgerIcon.classList.toggle('fa-xmark', open);
      }
    });
  }

  document.querySelectorAll('#nav-mobile a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  var mq = window.matchMedia('(max-width:768px)');
  var handleMqChange = function (e) { if (!e.matches) closeNav(); };
  if (mq.addEventListener) mq.addEventListener('change', handleMqChange);
  else mq.addListener(handleMqChange);

  // Scroll reveal animations
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Contact form — fetch submit to Formspree
  var form = document.getElementById('start-form');
  var startCard = document.getElementById('start-card');
  var startError = document.getElementById('start-error');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      startError.textContent = '';
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          startCard.classList.add('submitted');
        } else {
          return res.json().then(function (data) {
            throw new Error((data.errors || []).map(function (err) { return err.message; }).join(', ') || 'Submission failed.');
          });
        }
      }).catch(function (err) {
        startError.textContent = 'Something went wrong — please try again or email us directly.';
        btn.disabled = false;
      });
    });
  }

  // FAQ accordion (one open at a time)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
