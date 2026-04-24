const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = $('#menuToggle');
  const siteMenu = $('#siteMenu');
  const navLinks = $$('.nav-link');
  const floatingChat = $('#floatingChat');
  const chatPopover = $('#chatPopover');
  const chatClose = $('#chatClose');
  const chatQuestions = $$('.chat-question');
  const chatAnswer = $('#chatAnswer');
  const bonusCard = $('#bonusCard');
  const toast = $('#toast');
  const segmentModal = $('#segmentModal');
  const segPrev = $('#segPrev');
  const segNext = $('#segNext');
  const segmentsCarousel = $('#segmentsCarousel');
  const header = $('.site-header');
  const bgParticles = $('#bgParticles');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  // Light background particles
  if (bgParticles && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const colors = ['#a855f7', '#ec4899', '#49c2ff', '#ffffff'];
    const total = window.innerWidth < 768 ? 0 : 6;
    for (let i = 0; i < total; i += 1) {
      const p = document.createElement('div');
      const size = 2 + Math.random() * 2;
      p.className = 'particle';
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${12 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      bgParticles.appendChild(p);
    }
  }

  // Header scroll state
  const onScrollHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // Click ripple
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleEffect{from{transform:translate(-50%,-50%) scale(0);opacity:1}to{transform:translate(-50%,-50%) scale(10);opacity:0}}';
  document.head.appendChild(rippleStyle);

  $$('.glow-click').forEach((el) => {
    el.addEventListener('click', (event) => {
      el.classList.remove('clicked');
      void el.offsetWidth;
      el.classList.add('clicked');
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-node';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Mobile menu
  menuToggle?.addEventListener('click', () => {
    const open = siteMenu?.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteMenu?.classList.remove('open');
      menuToggle?.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav via sections
  const sectionIds = ['topo', 'conteudo-kit', 'segmentos', 'bonus', 'faq'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { threshold: 0.45, rootMargin: '-10% 0px -35% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Chat questions
  chatQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      chatQuestions.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      if (chatAnswer) chatAnswer.textContent = button.dataset.answer || '';
    });
  });

  // Floating chat
  floatingChat?.addEventListener('click', () => {
    if (!chatPopover) return;
    const open = chatPopover.classList.toggle('open');
    chatPopover.setAttribute('aria-hidden', String(!open));
  });
  chatClose?.addEventListener('click', () => {
    chatPopover?.classList.remove('open');
    chatPopover?.setAttribute('aria-hidden', 'true');
  });
  document.addEventListener('click', (event) => {
    if (!chatPopover || !floatingChat) return;
    if (!chatPopover.contains(event.target) && !floatingChat.contains(event.target) && chatPopover.classList.contains('open')) {
      chatPopover.classList.remove('open');
      chatPopover.setAttribute('aria-hidden', 'true');
    }
  });

  // Share
  const shareText = 'Confira o AtivaVendas — kit de mensagens prontas para WhatsApp e Instagram';
  $('.share-whatsapp')?.addEventListener('click', () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${location.href}`)}`, '_blank', 'noopener,noreferrer');
  });
  $('.share-telegram')?.addEventListener('click', () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  });
  $('.share-copy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('Link copiado.');
    } catch {
      showToast('Não foi possível copiar agora.');
    }
  });

  // Bonus reveal
  let bonusRevealed = false;
  const revealBonus = () => {
    if (!bonusCard) return;
    bonusRevealed = !bonusRevealed;
    bonusCard.classList.toggle('revealed', bonusRevealed);
    bonusCard.setAttribute('aria-pressed', String(bonusRevealed));
    showToast(bonusRevealed ? 'Bônus revelado.' : 'Bônus recolhido.');
  };
  bonusCard?.addEventListener('click', revealBonus);
  bonusCard?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealBonus();
    }
  });

  // Segments carousel arrows
  segPrev?.addEventListener('click', () => segmentsCarousel?.scrollBy({ left: -280, behavior: 'smooth' }));
  segNext?.addEventListener('click', () => segmentsCarousel?.scrollBy({ left: 280, behavior: 'smooth' }));

  // Segment modal data and safe render
  const segmentData = {
    beleza: {
      kicker: 'Segmento',
      title: 'Beleza e estética',
      desc: 'Ideal para salões, clínicas, manicure, estética, cílios, sobrancelha e profissionais da beleza.',
      image: 'assets/segment1.webp',
      items: ['Mensagens para confirmação e lembrete de horário.', 'Textos prontos para reativar clientes que sumiram.', 'Ofertas curtas para agenda vazia e datas especiais.']
    },
    delivery: {
      kicker: 'Segmento',
      title: 'Delivery e restaurantes',
      desc: 'Funciona para delivery, lanchonetes, hamburguerias, pizzarias, cafeterias e restaurantes locais.',
      image: 'assets/segment2.webp',
      items: ['Campanhas prontas para combos, promoções e horários de pico.', 'Mensagens para gerar recompra e pedidos recorrentes.', 'Ideias rápidas de stories e posts com chamada para ação.']
    },
    servicos: {
      kicker: 'Segmento',
      title: 'Prestadores de serviço',
      desc: 'Para profissionais autônomos e negócios que vivem de agenda, orçamento e relacionamento.',
      image: 'assets/segment3.webp',
      items: ['Scripts para orçamento, fechamento e pós-atendimento.', 'Mensagens para confirmação, encaixe e follow-up.', 'Modelos para quebrar objeções com mais confiança.']
    },
    ecommerce: {
      kicker: 'Segmento',
      title: 'E-commerce',
      desc: 'Perfeito para lojas online que querem vender mais no WhatsApp, Direct e campanhas rápidas.',
      image: 'assets/segment4.webp',
      items: ['Textos para recuperação de carrinho e recompra.', 'Ofertas prontas para campanhas temáticas e lançamento.', 'Mensagens que aceleram conversa e decisão de compra.']
    }
  };

  const modalImage = $('#modalImage');
  const modalKicker = $('#modalKicker');
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalList = $('#modalList');

  const renderModalList = (items = []) => {
    if (!modalList) return;
    modalList.replaceChildren();
    items.forEach((item) => {
      const div = document.createElement('div');
      div.textContent = item;
      modalList.appendChild(div);
    });
  };

  $$('.segment-card').forEach((button) => {
    button.addEventListener('click', () => {
      const data = segmentData[button.dataset.segment];
      if (!data || !segmentModal) return;
      if (modalImage) {
        modalImage.src = data.image;
        modalImage.alt = data.title;
      }
      if (modalKicker) modalKicker.textContent = data.kicker;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDesc) modalDesc.textContent = data.desc;
      renderModalList(data.items);
      segmentModal.classList.add('open');
      segmentModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (!segmentModal) return;
    segmentModal.classList.remove('open');
    segmentModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  $$('[data-close="modal"]', segmentModal || document).forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      siteMenu?.classList.remove('open');
      menuToggle?.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      chatPopover?.classList.remove('open');
      chatPopover?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Lightweight reveal on scroll
  const revealNodes = $$('.feature-card, .list-panel, .preview-side, .preview-showcase, .share-card, .bonus-card, .chat-card, .final-cta, .stat-item');
  revealNodes.forEach((el) => el.classList.add('will-reveal'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealNodes.forEach((el) => revealObserver.observe(el));
  } else {
    revealNodes.forEach((el) => el.classList.add('is-visible'));
  }
});
