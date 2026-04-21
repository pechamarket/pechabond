/* ========== script.js — pecha.bond ========== */

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// ===== MOBILE HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.querySelectorAll('span').forEach((s, i) => {
    if (isOpen) {
      if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (i === 1) s.style.opacity = '0';
      if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s.style.transform = '';
      s.style.opacity = '';
    }
  });
});

// Close nav on link click
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== ACTIVE NAV LINKS (scroll spy) =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

// Style active nav link
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--yellow) !important; font-weight: 700; }`;
document.head.appendChild(style);

// ===== BACK TO TOP =====
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backTop.classList.add('visible');
  else backTop.classList.remove('visible');
});
backTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ===== AOS (Animate On Scroll) =====
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
      setTimeout(() => { entry.target.classList.add('aos-animate'); }, delay);
      aosObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
aosEls.forEach(el => aosObs.observe(el));

// ===== REVIEW SLIDER =====
const track = document.getElementById('reviews-track');
const dotsContainer = document.getElementById('reviews-dots');
const prevBtn = document.getElementById('review-prev');
const nextBtn = document.getElementById('review-next');

const cards = track ? track.querySelectorAll('.review-card') : [];
let current = 0;
let visibleCount = 4;

function getVisibleCount() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 992) return 2;
  return 4;
}

function updateSlider() {
  if (!track) return;
  visibleCount = getVisibleCount();
  const max = cards.length - visibleCount;
  if (current > max) current = max < 0 ? 0 : max;
  if (current < 0) current = 0;

  const cardW = cards[0] ? cards[0].offsetWidth : 0;
  const gap = 20;
  const offset = current * (cardW + gap);
  track.style.transform = `translateX(-${offset}px)`;
  renderDots();
}

function renderDots() {
  if (!dotsContainer) return;
  visibleCount = getVisibleCount();
  const total = cards.length - visibleCount + 1;
  dotsContainer.innerHTML = '';
  for (let i = 0; i <= Math.max(0, total - 1); i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === current ? ' active' : '');
    dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => { current = i; updateSlider(); });
    dotsContainer.appendChild(dot);
  }
}

if (track && dotsContainer) {
  if (prevBtn) prevBtn.addEventListener('click', () => { current--; updateSlider(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { current++; updateSlider(); });

  window.addEventListener('resize', updateSlider);
  setTimeout(updateSlider, 100);

  // Auto-advance reviews every 5s
  setInterval(() => {
    visibleCount = getVisibleCount();
    const max = cards.length - visibleCount;
    if (current >= max) current = 0;
    else current++;
    updateSlider();
  }, 5000);
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ===== ESTIMATE FORM =====
function submitEstimate(e) {
  e.preventDefault();
  const carNum = document.getElementById('car-number').value.trim();
  const phone = document.getElementById('phone-number').value.trim();
  const agreed = document.getElementById('privacy-agree').checked;

  if (!carNum) {
    showToast('차량번호를 입력해주세요.');
    return;
  }
  if (!phone || phone.length < 10) {
    showToast('올바른 연락처를 입력해주세요.');
    return;
  }
  if (!agreed) {
    showToast('개인정보 수집·이용·제공에 동의해주세요.');
    return;
  }

  showToast('✅ 상담 신청이 완료되었습니다! 빠른 시간 내에 연락드리겠습니다.', true);
  document.getElementById('estimate-form').reset();
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, success = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;

  const toastStyle = document.createElement('style');
  if (!document.getElementById('toast-style')) {
    toastStyle.id = 'toast-style';
    toastStyle.textContent = `
      .toast {
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: ${success ? '#22c55e' : '#ef4444'};
        color: #fff;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 0.92rem;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        animation: toastIn 0.3s ease forwards;
        white-space: nowrap;
        font-family: 'Noto Sans KR', sans-serif;
      }
      @keyframes toastIn {
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
        from { opacity: 0; }
      }
    `;
    document.head.appendChild(toastStyle);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ===== CAR NUMBER INPUT FORMATTING =====
const carInput = document.getElementById('car-number');
if (carInput) {
  carInput.addEventListener('input', (e) => {
    // allow korean characters, numbers, spaces
    e.target.value = e.target.value.replace(/[^가-힣0-9\s]/g, '');
  });
}

const phoneInput = document.getElementById('phone-number');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
  });
}

// ===== PRIVACY MODAL LOGIC =====
const privacyModal = document.getElementById('privacy-modal');
const openPrivacy = document.getElementById('open-privacy');
const closePrivacy = document.getElementById('close-privacy');
const modalConfirm = document.getElementById('modal-confirm');
const modalOverlay = privacyModal ? privacyModal.querySelector('.modal-overlay') : null;

function toggleModal(show) {
  if (!privacyModal) return;
  if (show) {
    privacyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    privacyModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (openPrivacy) openPrivacy.addEventListener('click', () => toggleModal(true));
if (closePrivacy) closePrivacy.addEventListener('click', () => toggleModal(false));
if (modalConfirm) modalConfirm.addEventListener('click', () => toggleModal(false));
if (modalOverlay) modalOverlay.addEventListener('click', () => toggleModal(false));
