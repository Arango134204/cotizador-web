const steps = document.querySelectorAll('.step');
const options = document.querySelectorAll('.option');
const subtotalEl = document.getElementById('subtotal');
const finalEl = document.getElementById('finalPrice');
const progress = document.getElementById('progressBar');
const resumenEl = document.getElementById('resumen');

let currentStep = 0;
let pages = 1;

const data = {
  tipo: null,
  tipoPrecio: 0,
  funcionalidades: [],
  funcionalidadesPrecio: 0,
  diseño: null,
  diseñoPrecio: 0
};

/* ------------------ NAVEGACIÓN ------------------ */
function updateStep() {
  steps.forEach((s, i) => s.classList.toggle('active', i === currentStep));
  progress.style.width = (currentStep / (steps.length - 1)) * 100 + '%';

  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
  nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-block';

  // Animar resumen al entrar
  if (currentStep === steps.length - 1) {
    resumenEl.style.animation = 'none';
    resumenEl.offsetHeight;
    resumenEl.style.animation = 'resumenIn 0.6s ease forwards';
  }
}

/* ------------------ OPCIONES ------------------ */
options.forEach(opt => {
  opt.addEventListener('click', () => {
    const price = parseInt(opt.dataset.price || 0);
    const text = opt.dataset.title;

    // Selección única
    if (!opt.classList.contains('multi')) {
      opt.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      if (currentStep === 0) {
        data.tipo = text;
        data.tipoPrecio = price;
      }

      if (currentStep === 3) {
        data.diseño = text;
        data.diseñoPrecio = price;
      }
    } 
    // Selección múltiple
    else {
      opt.classList.toggle('active');
      if (opt.classList.contains('active')) {
        data.funcionalidades.push(text);
        data.funcionalidadesPrecio += price;
      } else {
        data.funcionalidades = data.funcionalidades.filter(f => f !== text);
        data.funcionalidadesPrecio -= price;
      }
    }

    calculate();
  });
});

/* ------------------ CÁLCULO ------------------ */
function aplicarEntrega(total) {
  const entrega = document.querySelector('input[name="entrega"]:checked').value;

  if (entrega === 'urgente') return total * 1.2;      // +20%
  if (entrega === 'extendida') return total * 0.9;    // -10%
  return total; // base
}

function calculate() {
  const paginasPrecio = (pages - 1) * 120000;

  const totalBase =
    data.tipoPrecio +
    paginasPrecio +
    data.funcionalidadesPrecio +
    data.diseñoPrecio;

  const totalFinal = aplicarEntrega(totalBase);

  subtotalEl.textContent = totalFinal.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP'
  });

  finalEl.textContent = `Total estimado: ${subtotalEl.textContent}`;

  generarResumen(totalFinal);
}

/* ------------------ RESUMEN ------------------ */
function generarResumen(total) {
  const entrega = document.querySelector('input[name="entrega"]:checked').value;

  const entregaTexto = {
    urgente: 'Urgente (1 semana – prioridad máxima)',
    base: 'Base (2 semanas – precio estándar)',
    extendida: 'Extendida (4 semanas – mejor planificación)'
  };

  resumenEl.innerHTML = `
    • <span>Tipo de sitio:</span> ${data.tipo}<br>
    • <span>Páginas:</span> ${pages}<br>
    • <span>Funcionalidades:</span> ${data.funcionalidades.length ? data.funcionalidades.join(', ') : 'Ninguna'}<br>
    • <span>Diseño:</span> ${data.diseño}<br>
    • <span>Entrega:</span> ${entregaTexto[entrega]}
    <hr>
    <div class="precio-final">
      ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
    </div>
  `;

  const mensaje = `
Hola 👋
Quiero una cotización para un sitio web.

📌 Detalle:
- Tipo: ${data.tipo}
- Páginas: ${pages}
- Funcionalidades: ${data.funcionalidades.join(', ') || 'Ninguna'}
- Diseño: ${data.diseño}
- Entrega: ${entregaTexto[entrega]}

💰 Total estimado: ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
`;

  document.getElementById('whatsapp').href =
    `https://wa.me/573006030655?text=${encodeURIComponent(mensaje)}`;
}

/* ------------------ CONTROLES ------------------ */
document.getElementById('next').onclick = () => {
  if (currentStep < steps.length - 1) currentStep++;
  updateStep();
};

document.getElementById('prev').onclick = () => {
  if (currentStep > 0) currentStep--;
  updateStep();
};

document.getElementById('plus').onclick = () => {
  pages++;
  document.getElementById('pages').textContent = pages;
  calculate();
};

document.getElementById('minus').onclick = () => {
  if (pages > 1) pages--;
  document.getElementById('pages').textContent = pages;
  calculate();
};

/* ------------------ INIT ------------------ */
updateStep();
calculate();

// Entrega selection visual
document.querySelectorAll('.option.entrega').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.option.entrega').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    card.querySelector('input').checked = true;
    calculate();
  });
});

let lang = 'es';

/* ===== APLICAR IDIOMA INICIAL ===== */
function aplicarIdioma(idioma) {
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = el.dataset[idioma];
  });

  document.querySelectorAll('.lang-switch button')
    .forEach(b => b.classList.remove('active'));

  document.querySelector(`.lang-switch button[data-lang="${idioma}"]`)
    .classList.add('active');
}

/* ===== BOTONES IDIOMA ===== */
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    aplicarIdioma(lang);
  });
});

/* ===== TOGGLE INFO ===== */
document.querySelector('.about-toggle').addEventListener('click', function () {
  const details = document.querySelector('.about-details');
  const abierto = details.style.display === 'block';

  details.style.display = abierto ? 'none' : 'block';

  this.textContent = abierto
    ? this.dataset[lang]
    : (lang === 'es' ? 'Ocultar información' : 'Hide information');
});

/* ===== EJECUCIÓN INICIAL ===== */
document.addEventListener('DOMContentLoaded', () => {
  aplicarIdioma('es');
});