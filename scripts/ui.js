(function(window, $){
  'use strict';
  window.App = window.App || {};

  // App-scoped state and data
  window.App.state = {
    pricingMode: window.App.Storage.get('pricingMode', 'full'), // 'full' or 'monthly'
    expandedModules: window.App.Storage.getJSON('expandedModules', {}),
    carouselIndex: parseInt(window.App.Storage.get('carouselIndex', '0'), 10) || 0,
    selectedTier: window.App.Storage.get('selectedTier', 'Pro'),
    selectedCohort: window.App.Storage.get('selectedCohort', ''),
    email: window.App.Storage.get('email', ''),
    name: window.App.Storage.get('name', ''),
    lastViewedTimeline: parseInt(window.App.Storage.get('lastViewedTimeline', '0'), 10) || 0
  };

  window.App.data = {
    cohorts: [
      { id: 'apr', label: 'Apr 15', year: new Date().getFullYear() },
      { id: 'jun', label: 'Jun 10', year: new Date().getFullYear() },
      { id: 'sep', label: 'Sep 2', year: new Date().getFullYear() }
    ],
    timeline: [
      { title: 'Prep & Kickoff', date: 'Week 0', text: 'Onboarding, tooling, and scope review.' },
      { title: 'Foundation', date: 'Week 1', text: 'User research, positioning, strong problem statements.' },
      { title: 'Design to Code', date: 'Week 2', text: 'Systems thinking, interface patterns, and implementation.' },
      { title: 'Ship Backend', date: 'Week 3', text: 'APIs, data modeling, deployment best practices.' },
      { title: 'Iterate', date: 'Week 4', text: 'Feedback loops, usability testing, analytics.' },
      { title: 'Launch', date: 'Week 5', text: 'Polish, marketing page, demo day and retros.' }
    ],
    curriculum: [
      { id: 'm1', title: 'Clarity & Scope', duration: 'Week 1', lessons: ['Define audience and outcome', 'Craft a no-fluff problem statement', 'Scope for momentum'] },
      { id: 'm2', title: 'Design Systems for Speed', duration: 'Week 2', lessons: ['Interface inventory', 'Tokens and components', 'Friction logs'] },
      { id: 'm3', title: 'From Figma to Production', duration: 'Week 3', lessons: ['Accessible patterns', 'Responsive layouts that scale', 'Design QA checklists'] },
      { id: 'm4', title: 'APIs & Data', duration: 'Week 4', lessons: ['Modeling your domain', 'Pragmatic endpoints', 'Error handling and observability'] },
      { id: 'm5', title: 'Polish & Launch', duration: 'Week 5', lessons: ['Performance budgets', 'Storytelling for launch', 'Demo day prep'] }
    ],
    testimonials: [
      { name: 'Jamal R.', role: 'Founder, Kite', quote: 'I shipped my MVP and landed first customers during the cohort. The feedback loop was priceless.', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=crop' },
      { name: 'Elena M.', role: 'Senior PM, SaaS', quote: 'The best balance of strategy and hands-on building I have experienced. My portfolio finally reflects my craft.', avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop' },
      { name: 'Chris D.', role: 'Full-stack Dev', quote: 'Structured sprints got me unstuck. The community kept me accountable and energized.', avatar: 'https://images.unsplash.com/photo-1541534401786-2077eed87a9c?q=80&w=300&auto=format&fit=crop' }
    ],
    tiers: [
      { id: 'Starter', tag: 'Best for first-time shippers', color: 'bg-mist', accent: 'text-ink', full: 690, monthly: 150, features: ['Live workshops', 'Peer squad', 'Project feedback'], best: false },
      { id: 'Pro', tag: 'Most popular', color: 'bg-amber/10', accent: 'text-ink', full: 1190, monthly: 260, features: ['Everything in Starter', '1:1 office hour weekly', 'Hiring referrals'], best: true },
      { id: 'Mentor', tag: 'For senior makers', color: 'bg-coral/10', accent: 'text-ink', full: 2190, monthly: 480, features: ['Everything in Pro', 'Private design and code reviews', 'Launch strategy workshop'], best: false }
    ]
  };

  // Cache DOM nodes
  var $doc, $mobileNav, $year, $curriculum, $timelineTrack, $tsSlides, $tsDots, $pricingCards, $pricingToggle, $modalOverlay, $form;

  function cacheDom(){
    $doc = $(document);
    $mobileNav = $('#mobileNav');
    $year = $('#year');
    $curriculum = $('#curriculumList');
    $timelineTrack = $('#timelineTrack');
    $tsSlides = $('#testimonialSlides');
    $tsDots = $('#testimonialDots');
    $pricingCards = $('#pricingCards');
    $pricingToggle = $('#pricingToggle');
    $modalOverlay = $('#modalOverlay');
    $form = $('#waitlistForm');
  }

  // Rendering functions
  function renderYear(){ $year.text(new Date().getFullYear()); }

  function renderCurriculum(){
    var state = window.App.state;
    var html = '';
    window.App.data.curriculum.forEach(function(mod){
      var expanded = !!state.expandedModules[mod.id];
      var lessons = mod.lessons.map(function(ls){ return '<li class="py-1">'+ ls +'</li>'; }).join('');
      html += `
        <article class="card overflow-hidden" data-module="${mod.id}">
          <button class="w-full text-left px-5 py-4 flex items-start justify-between gap-4 module-toggle" aria-expanded="${expanded}" aria-controls="panel-${mod.id}">
            <div>
              <div class="text-xs text-ink/60">${mod.duration}</div>
              <h3 class="text-lg md:text-xl font-extrabold text-night">${mod.title}</h3>
            </div>
            <span class="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/70 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition" viewBox="0 0 20 20" fill="currentColor" style="transform: rotate(${expanded ? 180 : 0}deg);"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clip-rule="evenodd"/></svg>
            </span>
          </button>
          <div id="panel-${mod.id}" class="px-5 pb-5" style="display: ${expanded ? 'block' : 'none'};">
            <ul class="pl-1 text-ink/80">${lessons}</ul>
          </div>
        </article>
      `;
    });
    $curriculum.html(html);
  }

  function renderTimeline(){
    var state = window.App.state;
    var html = '';
    window.App.data.timeline.forEach(function(item, idx){
      html += `
        <div class="timeline-card card p-5 ${idx === state.lastViewedTimeline ? 'is-selected' : ''}" data-index="${idx}">
          <div class="price-pill bg-white text-ink border border-ink/10">${item.date}</div>
          <h3 class="mt-3 text-xl font-extrabold text-night">${item.title}</h3>
          <p class="mt-2 text-ink/70">${item.text}</p>
        </div>
      `;
    });
    $timelineTrack.html(html);
    // Scroll to saved index
    var $target = $timelineTrack.find('[data-index="'+ state.lastViewedTimeline +'"]');
    if ($target.length) {
      setTimeout(function(){ try { $target[0].scrollIntoView({ behavior: window.App.Prefs.reducedMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' }); } catch(e){} }, 50);
    }
  }

  function renderTestimonials(){
    var html = '';
    window.App.data.testimonials.forEach(function(t, idx){
      html += `
        <div class="ts-slide card p-6 ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
          <div class="flex items-start gap-4">
            <img alt="${t.name}" src="${t.avatar}" class="h-14 w-14 rounded-xl object-cover shadow-soft"/>
            <div>
              <p class="text-ink/90">${t.quote}</p>
              <p class="mt-3 text-sm text-ink/60">${t.name} • ${t.role}</p>
            </div>
          </div>
        </div>
      `;
    });
    $tsSlides.html(html);
    var dots = '';
    window.App.data.testimonials.forEach(function(_, idx){ dots += `<button class="h-2.5 w-2.5 rounded-full ${idx===window.App.state.carouselIndex?'bg-ink':'bg-ink/30'} js-ts-dot" data-index="${idx}" aria-label="Go to testimonial ${idx+1}"></button>`; });
    $tsDots.html(dots);
    activateSlide(window.App.state.carouselIndex);
  }

  function renderPricing(){
    var mode = window.App.state.pricingMode; // 'full' or 'monthly'
    $pricingToggle.attr('aria-pressed', mode === 'monthly');
    var cards = '';
    window.App.data.tiers.forEach(function(t){
      var price = mode === 'monthly' ? t.monthly : t.full;
      var period = mode === 'monthly' ? '/mo' : ' one-time';
      var badge = t.best ? '<span class="price-pill bg-amber text-ink">Popular</span>' : '';
      var features = t.features.map(function(f){ return `<li class="feature"><i>✓</i><span>${f}</span></li>`; }).join('');
      cards += `
        <div class="flex-1 card p-6 ${t.best ? 'shadow-glow' : ''}">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-xl font-extrabold text-night">${t.id}</h3>
            ${badge}
          </div>
          <p class="mt-1 text-sm text-ink/60">${t.tag}</p>
          <div class="mt-5 ${t.color} rounded-xl p-5">
            <div class="text-3xl font-extrabold text-night">${window.App.Utils.currency(price)} <span class="text-base font-semibold text-ink/60">${period}</span></div>
          </div>
          <ul class="mt-5 space-y-2">${features}</ul>
          <div class="mt-6 flex items-center gap-3">
            <button class="btn-primary flex-1 js-open-modal" data-tier="${t.id}">Apply</button>
            <button class="btn-secondary js-choose-tier" data-tier="${t.id}">Choose</button>
          </div>
        </div>
      `;
    });
    $pricingCards.html(cards);
  }

  // Interactions
  function bindEvents(){
    // Smooth scroll
    $doc.on('click', '.js-scroll', function(e){
      var href = $(this).attr('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        try { document.querySelector(href).scrollIntoView({ behavior: window.App.Prefs.reducedMotion ? 'auto' : 'smooth', block: 'start' }); } catch(err){}
      }
      // Close mobile nav
      if ($mobileNav.is(':visible')) { $mobileNav.slideUp(150); }
    });

    // Mobile menu toggle
    $doc.on('click', '.js-open-mobile', function(){ $mobileNav.stop(true, true).slideToggle(150); });

    // Curriculum expand/collapse single
    $doc.on('click', '.module-toggle', function(){
      var $btn = $(this);
      var $article = $btn.closest('[data-module]');
      var id = $article.data('module');
      var $panel = $('#panel-' + id);
      var expanded = $btn.attr('aria-expanded') === 'true';
      $btn.attr('aria-expanded', !expanded);
      if (expanded) { $panel.slideUp(160); } else { $panel.slideDown(160); }
      window.App.state.expandedModules[id] = !expanded;
      window.App.Storage.setJSON('expandedModules', window.App.state.expandedModules);
    });

    // Expand all
    $doc.on('click', '.js-toggle-all', function(){
      var allOpen = Object.keys(window.App.state.expandedModules).length && Object.values(window.App.state.expandedModules).every(function(v){ return v; });
      var newStateOpen = !allOpen;
      $('.module-toggle').each(function(){
        var $btn = $(this);
        var id = $btn.closest('[data-module]').data('module');
        $btn.attr('aria-expanded', newStateOpen);
        var $panel = $('#panel-' + id);
        if (newStateOpen) { $panel.stop(true, true).slideDown(160); } else { $panel.stop(true, true).slideUp(160); }
        window.App.state.expandedModules[id] = newStateOpen;
      });
      window.App.Storage.setJSON('expandedModules', window.App.state.expandedModules);
      $(this).attr('aria-expanded', newStateOpen).text(newStateOpen ? 'Collapse all' : 'Expand all');
    });

    // Timeline selection
    $doc.on('click', '#timelineTrack .timeline-card', function(){
      $('#timelineTrack .timeline-card').removeClass('is-selected');
      $(this).addClass('is-selected');
      var idx = parseInt($(this).data('index'), 10) || 0;
      window.App.state.lastViewedTimeline = idx;
      window.App.Storage.set('lastViewedTimeline', String(idx));
    });

    // Timeline nav
    $doc.on('click', '.js-tl-prev', function(){ moveTimeline(-1); });
    $doc.on('click', '.js-tl-next', function(){ moveTimeline(1); });

    // Testimonials controls
    $doc.on('click', '.js-ts-prev', function(){ moveSlide(-1); });
    $doc.on('click', '.js-ts-next', function(){ moveSlide(1); });
    $doc.on('click', '.js-ts-dot', function(){ var i = parseInt($(this).data('index'), 10) || 0; goToSlide(i); });

    // Pricing toggle
    $pricingToggle.on('click', function(){
      var pressed = $(this).attr('aria-pressed') === 'true';
      var newMode = pressed ? 'full' : 'monthly';
      window.App.state.pricingMode = newMode;
      window.App.Storage.set('pricingMode', newMode);
      renderPricing();
    });

    // Choose tier
    $doc.on('click', '.js-choose-tier', function(){
      var tier = $(this).data('tier');
      window.App.state.selectedTier = tier;
      window.App.Storage.set('selectedTier', tier);
      // provide subtle feedback
      $(this).text('Selected').prop('disabled', true);
      setTimeout(() => { $('.js-choose-tier').not(this).prop('disabled', false).text('Choose'); }, 900);
    });

    // Modal open/close
    $doc.on('click', '.js-open-modal', function(e){ e.preventDefault(); openModal($(this).data('tier')); });
    $doc.on('click', '.js-close-modal', function(){ closeModal(); });
    $modalOverlay.on('click', function(e){ if (e.target === this) closeModal(); });
    $(document).on('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

    // Form submission
    $form.on('submit', function(e){
      e.preventDefault();
      var name = String($('#name').val() || '').trim();
      var email = String($('#email').val() || '').trim();
      var tier = $('#tier').val();
      var cohort = $('#cohort').val();
      var valid = true;
      if (!window.App.Utils.validateEmail(email)) { $('#emailError').removeClass('hidden'); valid = false; } else { $('#emailError').addClass('hidden'); }
      if (!name) { valid = false; $('#name').addClass('ring-2 ring-coral').one('input', function(){ $(this).removeClass('ring-2 ring-coral'); }); }
      if (!valid) return;
      window.App.state.email = email; window.App.Storage.set('email', email);
      window.App.state.name = name; window.App.Storage.set('name', name);
      window.App.state.selectedTier = tier; window.App.Storage.set('selectedTier', tier);
      window.App.state.selectedCohort = cohort; window.App.Storage.set('selectedCohort', cohort);
      // Simulate success
      showToast('You are on the list. We will email you next steps.');
      closeModal();
    });
  }

  function moveTimeline(step){
    var cards = $('#timelineTrack .timeline-card');
    var idx = window.App.state.lastViewedTimeline + step;
    idx = window.App.Utils.clamp(idx, 0, cards.length - 1);
    window.App.state.lastViewedTimeline = idx;
    window.App.Storage.set('lastViewedTimeline', String(idx));
    cards.removeClass('is-selected');
    var el = cards.eq(idx);
    el.addClass('is-selected');
    try { el[0].scrollIntoView({ behavior: window.App.Prefs.reducedMotion ? 'auto' : 'smooth', inline: 'start', block: 'nearest' }); } catch(e){}
  }

  // Testimonials logic
  var autoTimer = null;
  function activateSlide(index){
    var slides = $tsSlides.find('.ts-slide');
    if (!slides.length) return;
    index = window.App.Utils.clamp(index, 0, slides.length - 1);
    slides.removeClass('is-active').attr('aria-hidden', 'true');
    var $current = slides.eq(index).addClass('is-active').attr('aria-hidden', 'false');
    window.App.state.carouselIndex = index;
    window.App.Storage.set('carouselIndex', String(index));
    // dots
    $tsDots.children().removeClass('bg-ink').addClass('bg-ink/30');
    $tsDots.children().eq(index).removeClass('bg-ink/30').addClass('bg-ink');
  }
  function goToSlide(i){ activateSlide(i); }
  function moveSlide(step){ goToSlide(window.App.state.carouselIndex + step); }
  function startAutoplay(){
    if (window.App.Prefs.reducedMotion) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(function(){ moveSlide(1); }, 5000);
  }

  // Modal helpers
  function openModal(prefTier){
    if (prefTier) { $('#tier').val(prefTier); }
    if (window.App.state.selectedCohort) { $('#cohort').val(window.App.state.selectedCohort); }
    if (window.App.state.name) { $('#name').val(window.App.state.name); }
    if (window.App.state.email) { $('#email').val(window.App.state.email); }
    $('#emailError').addClass('hidden');
    $modalOverlay.removeClass('hidden').addClass('flex');
  }
  function closeModal(){ $modalOverlay.removeClass('flex').addClass('hidden'); }

  // Toast
  function showToast(msg){
    var $t = $(`<div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-3 rounded-xl shadow-glow z-50">${msg}</div>`);
    $('body').append($t);
    setTimeout(function(){ $t.fadeOut(200, function(){ $(this).remove(); }); }, 2200);
  }

  function populateCohorts(){
    var opts = window.App.data.cohorts.map(function(c){ return `<option value="${c.label} ${c.year}">${c.label} ${c.year}</option>`; }).join('');
    $('#cohort').html(opts);
  }

  // Public API
  window.App.init = function(){
    cacheDom();
    bindEvents();
  };

  window.App.render = function(){
    renderYear();
    renderCurriculum();
    renderTimeline();
    renderTestimonials();
    renderPricing();
    populateCohorts();
    startAutoplay();
  };

})(window, jQuery);
