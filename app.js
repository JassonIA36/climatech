// Configuración general
const storedPhone = localStorage.getItem('climatech_whatsapp');
const DEFAULT_PHONE = '573239421252';
// Si tenía el número placeholder anterior, migrar automáticamente al número real
const activePhone = (storedPhone && storedPhone !== '573001234567') ? storedPhone : DEFAULT_PHONE;
localStorage.setItem('climatech_whatsapp', activePhone);

const CONFIG = {
  // Número de WhatsApp (código de país 57 + 3239421252)
  whatsappNumber: activePhone,
  companyName: 'ClimaTech Valle',
  city: 'Buga y Valle del Cauca'
};

// Generador de URLs de WhatsApp
function getWhatsAppUrl(customMessage) {
  const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(customMessage);
  return `https://wa.me/${phone}?text=${encoded}`;
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCalculator();
  initGallery();
  initContactForm();
  initCatalogButtons();
  initWhatsAppFloating();
  initPhoneConfigModal();
  updateAllWhatsAppLinks();
});

// Actualiza los links estáticos de WhatsApp y llamadas en la página
function updateAllWhatsAppLinks() {
  const phoneDisplayElements = document.querySelectorAll('.dynamic-phone-display');
  const formattedPhone = formatPhoneNumber(CONFIG.whatsappNumber);
  phoneDisplayElements.forEach(el => {
    el.textContent = formattedPhone;
  });

  // Actualizar todos los enlaces de llamada tel:
  const telLinks = document.querySelectorAll('a[href^="tel:"]');
  telLinks.forEach(tel => {
    tel.href = `tel:+${CONFIG.whatsappNumber}`;
  });

  const headerCta = document.getElementById('header-cta-btn');
  if (headerCta) {
    headerCta.href = getWhatsAppUrl(`Hola ${CONFIG.companyName}, deseo solicitar asesoría técnica y cotización para un servicio de aire acondicionado.`);
  }

  const heroWa = document.getElementById('hero-wa-btn');
  if (heroWa) {
    heroWa.href = getWhatsAppUrl(`Hola ${CONFIG.companyName}, quiero agendar una visita técnica prioritaria para mi aire acondicionado.`);
  }

  const emergencyWa = document.getElementById('emergency-wa-btn');
  if (emergencyWa) {
    emergencyWa.href = getWhatsAppUrl(`🚨 URGENCIA TÉCNICA: Hola ${CONFIG.companyName}, requiero asistencia inmediata por fallo/goteo en mi equipo de aire acondicionado.`);
  }

  const floatingWa = document.getElementById('floating-wa-btn');
  if (floatingWa) {
    floatingWa.href = getWhatsAppUrl(`Hola ${CONFIG.companyName}, deseo cotizar un servicio de aire acondicionado.`);
  }
}

// Formatear número de teléfono legible
function formatPhoneNumber(num) {
  const cleaned = ('' + num).replace(/\D/g, '');
  if (cleaned.startsWith('57') && cleaned.length === 12) {
    return `+57 (${cleaned.substring(2, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
  }
  if (cleaned.length === 10) {
    return `+57 (${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  return '+' + cleaned;
}

// Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  const toggle = () => {
    menu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  };

  toggleBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', toggle);

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

// Calculadora de BTU & Cotizador
function initCalculator() {
  let selectedType = 'Habitación';
  let selectedAreaBtu = '12,000 BTU';
  let selectedService = 'Comprar con instalación';

  const typeBtns = document.querySelectorAll('#calc-tipo-container .calc-btn');
  const areaBtns = document.querySelectorAll('#calc-area-container .calc-area-btn');
  const serviceBtns = document.querySelectorAll('#calc-service-container .calc-service-btn');

  const resultBtu = document.getElementById('result-btu');
  const resultTech = document.getElementById('result-tech');
  const resultRefrig = document.getElementById('result-refrig');
  const whatsappBtn = document.getElementById('btn-whatsapp-quote');

  function updateQuoteLink() {
    const text = 
      `Hola ${CONFIG.companyName}, coticé en su simulador de ingeniería:\n` +
      `▪ Espacio: ${selectedType}\n` +
      `▪ Capacidad recomendada: ${selectedAreaBtu}\n` +
      `▪ Requerimiento: ${selectedService}\n` +
      `▪ Cobertura: ${CONFIG.city}\n\n` +
      `¿Podrían indicarme disponibilidad y costo estimado? Muchas gracias.`;
    
    if (whatsappBtn) {
      whatsappBtn.href = getWhatsAppUrl(text);
    }
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');
      selectedType = btn.getAttribute('data-val') || 'Inmueble';
      updateQuoteLink();
    });
  });

  areaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      areaBtns.forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');

      const btu = btn.getAttribute('data-btu');
      if (btu === '9000') {
        selectedAreaBtu = '9,000 BTU';
        if (resultBtu) resultBtu.textContent = '9,000 BTU';
        if (resultTech) resultTech.textContent = 'Tecnología Inverter Eco (Ideal recámaras individuales o estudios compactos)';
        if (resultRefrig) resultRefrig.textContent = 'Refrigerante: R32 Ecológico | 18 dB';
      } else if (btu === '12000') {
        selectedAreaBtu = '12,000 BTU';
        if (resultBtu) resultBtu.textContent = '12,000 BTU';
        if (resultTech) resultTech.textContent = 'Tecnología Dual Inverter (Ahorro energético hasta 70% SEER2 22)';
        if (resultRefrig) resultRefrig.textContent = 'Refrigerante: R32 Ecológico | 19 dB';
      } else if (btu === '18000') {
        selectedAreaBtu = '18,000 BTU';
        if (resultBtu) resultBtu.textContent = '18,000 BTU';
        if (resultTech) resultTech.textContent = 'Tecnología High-Static Inverter (Para áreas sociales, salas amplias y flujo continuo)';
        if (resultRefrig) resultRefrig.textContent = 'Refrigerante: R410A / R32 | 24 dB';
      } else {
        selectedAreaBtu = '24,000 BTU+';
        if (resultBtu) resultBtu.textContent = '24,000 BTU+';
        if (resultTech) resultTech.textContent = 'Multi-Inverter, Cassette o Piso Techo (Gran caudal y balanceo térmico avanzado)';
        if (resultRefrig) resultRefrig.textContent = 'Refrigerante: R410A / R32 Industrial | 28 dB';
      }
      updateQuoteLink();
    });
  });

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceBtns.forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
      btn.classList.add('bg-primary', 'text-on-primary');
      selectedService = btn.getAttribute('data-val') || 'Servicio General';
      updateQuoteLink();
    });
  });

  // Estado visual inicial
  if (typeBtns[0]) typeBtns[0].classList.add('bg-primary', 'text-on-primary');
  if (areaBtns[1]) areaBtns[1].classList.add('bg-primary', 'text-on-primary');
  if (serviceBtns[0]) serviceBtns[0].classList.add('bg-primary', 'text-on-primary');
  updateQuoteLink();
}

// Botones del catálogo
function initCatalogButtons() {
  const catalogBtns = document.querySelectorAll('.btn-catalog-quote');
  catalogBtns.forEach(btn => {
    const model = btn.getAttribute('data-model') || 'Equipo A/C';
    const btu = btn.getAttribute('data-btu') || '';
    const price = btn.getAttribute('data-price') || '';
    
    const msg = `Hola ${CONFIG.companyName}, estoy interesado en adquirir o cotizar con instalación el modelo *${model}* (${btu}) con precio de referencia ${price}. ¿Tienen disponibilidad inmediata?`;
    btn.href = getWhatsAppUrl(msg);
    btn.setAttribute('target', '_blank');
  });
}

// Galería con Filtro y Lightbox
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary');
          b.classList.add('bg-surface-container', 'text-on-surface');
        });
        btn.classList.add('bg-primary', 'text-on-primary');
        btn.classList.remove('bg-surface-container', 'text-on-surface');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Instalación ClimaTech';
      const desc = item.getAttribute('data-desc') || 'Servicio técnico especializado.';

      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
}

// Formulario de Contacto
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const sector = document.getElementById('form-sector').value.trim();
    const service = document.getElementById('form-service').value;
    const notes = document.getElementById('form-notes').value.trim();

    const msg = 
      `👋 *Nueva Solicitud de Servicio - ${CONFIG.companyName}*\n` +
      `▪ *Nombre:* ${name}\n` +
      `▪ *Teléfono:* ${phone}\n` +
      `▪ *Sector / Barrio:* ${sector}\n` +
      `▪ *Servicio Requerido:* ${service}\n` +
      (notes ? `▪ *Detalles adicionales:* ${notes}\n` : '') +
      `\nPor favor contáctenme para agendar la visita o remitirme la cotización.`;

    const waUrl = getWhatsAppUrl(msg);
    window.open(waUrl, '_blank');

    const successBox = document.getElementById('form-success-alert');
    if (successBox) {
      successBox.classList.remove('hidden');
      setTimeout(() => successBox.classList.add('hidden'), 6000);
    }
    form.reset();
  });
}

// Botón Flotante de WhatsApp Tooltip
function initWhatsAppFloating() {
  const tooltip = document.getElementById('whatsapp-floating-tooltip');
  if (tooltip) {
    setTimeout(() => {
      tooltip.classList.remove('opacity-0', 'translate-y-2');
      tooltip.classList.add('opacity-100', 'translate-y-0');
    }, 2500);

    const closeTooltip = document.getElementById('close-wa-tooltip');
    if (closeTooltip) {
      closeTooltip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        tooltip.classList.add('opacity-0', 'translate-y-2');
      });
    }
  }
}

// Modal para configurar o cambiar el número de WhatsApp fácilmente
function initPhoneConfigModal() {
  const configBtn = document.getElementById('open-config-btn');
  const modal = document.getElementById('config-modal');
  const closeBtn = document.getElementById('close-config-modal');
  const saveBtn = document.getElementById('save-config-btn');
  const phoneInput = document.getElementById('config-phone-input');

  if (!configBtn || !modal) return;

  configBtn.addEventListener('click', () => {
    if (phoneInput) phoneInput.value = CONFIG.whatsappNumber;
    modal.classList.remove('hidden');
  });

  const closeModal = () => modal.classList.add('hidden');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (saveBtn && phoneInput) {
    saveBtn.addEventListener('click', () => {
      const val = phoneInput.value.replace(/[^0-9]/g, '');
      if (val.length >= 8) {
        CONFIG.whatsappNumber = val;
        localStorage.setItem('climatech_whatsapp', val);
        updateAllWhatsAppLinks();
        initCalculator();
        initCatalogButtons();
        closeModal();
        alert(`¡Número de WhatsApp actualizado con éxito a: +${val}! Todos los botones ahora enlazan a este número.`);
      } else {
        alert('Por favor introduce un número válido con código de país (ejemplo: 573239421252).');
      }
    });
  }
}
