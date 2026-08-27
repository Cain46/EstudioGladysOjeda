const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');


const consentCheckbox = document.getElementById('consentimiento');
const contactSubmitButton = contactForm ? contactForm.querySelector('.contact-form__submit') : null;

if (consentCheckbox && contactSubmitButton) {
  const syncConsentState = () => {
    const enabled = consentCheckbox.checked;
    contactSubmitButton.disabled = !enabled;
    contactSubmitButton.setAttribute('aria-disabled', String(!enabled));
  };

  consentCheckbox.addEventListener('change', syncConsentState);
  syncConsentState();
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    formStatus.className = 'contact-form__status';
    formStatus.textContent = 'Enviando consulta...';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'No se pudo enviar la consulta.');
      }

      contactForm.reset();
      if (consentCheckbox && contactSubmitButton) {
        contactSubmitButton.disabled = true;
        contactSubmitButton.setAttribute('aria-disabled', 'true');
      }
      formStatus.classList.add('is-success');
      formStatus.textContent = '✓ Consulta enviada correctamente. Gracias por comunicarte con el Estudio Gladys Ojeda Villalba & Asociados. Nos pondremos en contacto a la brevedad.';

      window.setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'contact-form__status';
      }, 6000);
    } catch (error) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'No pudimos enviar la consulta. Intentá nuevamente o escribinos por WhatsApp.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
