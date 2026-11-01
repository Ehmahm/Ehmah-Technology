document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    const set = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => set(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  // Scroll reveal
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Contact form: prefill service from ?service=, submit without leaving the page
  const form = document.getElementById('contact-form');
  if (form) {
    const select = form.querySelector('#service');
    const wanted = new URLSearchParams(location.search).get('service');
    if (wanted && select) {
      const opt = [...select.options].find((o) => o.value === wanted);
      if (opt) select.value = wanted;
    }

    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.className = 'form-status';
      status.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          status.classList.add('ok');
          status.textContent = 'Thanks! Your message was sent. I will get back to you soon.';
        } else {
          throw new Error('bad response');
        }
      } catch (err) {
        status.classList.add('err');
        status.textContent = 'Could not send. Please email or call me directly instead.';
      } finally {
        btn.disabled = false;
      }
    });
  }
});
