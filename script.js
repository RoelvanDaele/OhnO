// Preloader
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 700);
    }, 500);
  });
})();

// Custom cursor (alleen op apparaten met muis)
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a, button, .photo-item, .video-thumb, .dot-nav-item, .carousel-btn, label, select, input, textarea');
    cursor.classList.toggle('hover', !!el);
  });
})();

// Dot navigatie + sectie reveal
(function () {
  const allSections = Array.from(document.querySelectorAll('section[id]'));
  const dots = document.querySelectorAll('.dot-nav-item');
  const nav = document.getElementById('dot-nav');

  // Reveal via IntersectionObserver
  allSections.forEach(s => { if (s.id !== 'hero') s.classList.add('section-reveal'); });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
  }, { threshold: 0.1 });
  allSections.forEach(s => revealObserver.observe(s));

  // Actieve dot + thema op basis van scrollpositie
  function updateNav() {
    const mid = window.scrollY + window.innerHeight / 2;
    let active = allSections[0];
    allSections.forEach(s => { if (s.offsetTop <= mid) active = s; });
    dots.forEach(dot => dot.classList.toggle('active', dot.getAttribute('href') === '#' + active.id));
    const isLight = active.dataset.navTheme === 'light';
    if (nav) nav.classList.toggle('on-light', isLight);
    document.body.dataset.theme = isLight ? 'light' : 'dark';
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(dot.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// Spotify bar — verschijn pas als hero niet meer zichtbaar is
(function () {
  const bar = document.getElementById('spotify-bar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  new IntersectionObserver((entries) => {
    bar.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0 }).observe(hero);
})();

// Countdown next show
(function () {
  const target = new Date('2026-06-27T12:00:00');
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };
  if (!els.days) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => el.textContent = '00');
      return;
    }
    els.days.textContent  = pad(Math.floor(diff / 86400000));
    els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.mins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
    els.secs.textContent  = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();

// Smooth scroll voor navigatie-links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// WHERE WE'VE BEEN — Leaflet map
(function () {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const map = L.map('map', { scrollWheelZoom: false });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18
  }).addTo(map);

  const locations = [
    // Nederland
    { name: 'Rhenen',        label: 'Rhine Town Jazz Festival',                lat: 51.9619, lng:  5.5675 },
    { name: 'Eindhoven',     label: 'Jazz in Lighttown',                       lat: 51.4416, lng:  5.4697 },
    { name: 'Eindhoven',     label: 'Familiedag DAF',                          lat: 51.4416, lng:  5.4697 },
    { name: 'Bergen op Zoom',label: 'JazzBoZ',                                 lat: 51.4958, lng:  4.2878 },
    { name: 'Bergen op Zoom',label: 'De Foodstoet',                            lat: 51.4958, lng:  4.2878 },
    { name: 'Bergen op Zoom',label: 'Werkbezoek Koninklijke Familie',          lat: 51.4958, lng:  4.2878 },
    { name: 'Oirschot',      label: 'Jazzweekend Oirschot',                    lat: 51.5017, lng:  5.3106 },
    { name: 'Breda',         label: 'Breda Jazz Festival',                     lat: 51.5719, lng:  4.7683 },
    { name: 'Middelburg',    label: 'International Jazz Festival Middelburg',   lat: 51.4988, lng:  3.6136 },
    { name: 'Enkhuizen',     label: 'Jazzfestival Enkhuizen',                  lat: 52.7025, lng:  5.2908 },
    { name: 'Domburg',       label: 'Jazz by the Sea',                         lat: 51.5636, lng:  3.4939 },
    { name: 'Gorinchem',     label: 'Jazz Festival Gorinchem',                 lat: 51.8333, lng:  4.9667 },
    { name: 'Den Bosch',     label: 'Jazz in Duketown',                        lat: 51.6978, lng:  5.3037 },
    { name: 'Den Bosch',     label: 'Speciaal Bierfestival',                   lat: 51.6978, lng:  5.3037 },
    { name: 'Rotterdam',     label: 'Carnaval Mundial',                        lat: 51.9244, lng:  4.4777 },
    { name: 'Rotterdam',     label: 'North Sea Round Town',                    lat: 51.9244, lng:  4.4777 },
    { name: 'Den Haag',      label: 'The Hague Jazz',                          lat: 52.0705, lng:  4.3007 },
    { name: 'Woerden',       label: "Jazzin' Woerden",                         lat: 52.0872, lng:  4.8825 },
    { name: 'Laag-Keppel',   label: 'Jazztime at the Keppel Castle',           lat: 51.9830, lng:  6.1780 },
    { name: 'Delft',         label: 'Jazzfestival Delft',                      lat: 52.0116, lng:  4.3571 },
    { name: 'Wijchen',       label: 'Jazz & Wine Wijchen',                     lat: 51.8069, lng:  5.7261 },
    { name: 'Oosterhout',    label: 'Jazzclub Oosterhout',                     lat: 51.6444, lng:  4.8583 },
    { name: 'Oosterhout',    label: 'Parkfeest Oosterhout',                    lat: 51.6444, lng:  4.8583 },
    { name: 'Groningen',     label: 'Walk-in Concerts Groningen',              lat: 53.2194, lng:  6.5665 },
    { name: 'Goes',          label: 'Swingend Goes',                           lat: 51.5042, lng:  3.8897 },
    { name: 'Goes',          label: 'Zeelandjazz',                             lat: 51.5042, lng:  3.8897 },
    { name: 'Gouda',         label: 'Gouda Jazz Festival',                     lat: 52.0116, lng:  4.7106 },
    { name: 'Leeuwarden',    label: 'Fries Straatfestival',                    lat: 53.2012, lng:  5.7999 },
    { name: 'Nijmegen',      label: 'Roze Zaterdag',                           lat: 51.8126, lng:  5.8372 },
    { name: 'Amstelveen',    label: 'Jazz in het Dorp',                        lat: 52.3095, lng:  4.8608 },
    { name: 'Amsterdam',     label: 'JAZZFEST mini festival',                  lat: 52.3676, lng:  4.9041 },
    { name: 'Calfven',       label: 'De Luchtballon',                          lat: 51.5667, lng:  4.5167 },
    // België
    { name: 'Antwerpen',     label: 'OhnO! Goes Antwerp!',                    lat: 51.2194, lng:  4.4025 },
    { name: 'Dendermonde',   label: 'Terassenfestival Dendermonde',            lat: 51.0267, lng:  4.0994 },
    // Duitsland
    { name: 'Gronau',        label: 'Jazzfest Gronau',                         lat: 52.2122, lng:  7.0333 },
    { name: 'Celle',         label: 'Celler Streetparade',                     lat: 52.6214, lng: 10.0822 },
    { name: 'Dresden',       label: 'Internationales Dixieland Festival Dresden', lat: 51.0504, lng: 13.7373 },
    // Zwitserland
    { name: 'Lenk',          label: 'Jazz Tage Lenk',                          lat: 46.4455, lng:  7.4477 },
    // Israël
    { name: 'Jeruzalem',     label: 'The Israël Festival',                     lat: 31.7683, lng: 35.2137 },
    // Denemarken
    { name: 'Silkeborg',     label: 'Riverboat Jazz Festival',                 lat: 56.1701, lng:  9.5484 },
    // Frankrijk
    { name: 'Neuil',         label: 'Jazzneuil',                               lat: 46.3800, lng:  0.5000 },
    { name: 'Bessines-sur-Gartempe', label: 'Bandafolies',                     lat: 46.1030, lng:  1.3680 },
    // Ierland
    { name: 'Cork',          label: 'Guinness Cork Jazz Festival',             lat: 51.8985, lng: -8.4756 },
    { name: 'Kenmare',       label: 'Kenmare Food Carnival',                   lat: 51.8768, lng: -9.5820 },
    // Amerika
    { name: 'New Orleans',   label: 'New Orleans',                             lat: 29.9511, lng: -90.0715 },
  ];

  // Groepeer per locatie, grotere stip bij meer optredens
  const grouped = {};
  locations.forEach(loc => {
    const key = `${loc.lat},${loc.lng}`;
    if (!grouped[key]) grouped[key] = { name: loc.name, lat: loc.lat, lng: loc.lng, events: [] };
    grouped[key].events.push(loc.label);
  });

  const allGroups = Object.values(grouped);

  // fitBounds op basis van alle locaties, vóór animatie
  const boundsGroup = L.featureGroup(
    allGroups.map(g => L.circleMarker([g.lat, g.lng]))
  );
  map.fitBounds(boundsGroup.getBounds().pad(0.1));

  // Scroll-animatie: stippen verschijnen één voor één als sectie in beeld komt
  function animateMarkers() {
    allGroups.forEach((group, i) => {
      setTimeout(() => {
        const radius = Math.min(8 + group.events.length * 3, 22);
        const eventsHtml = group.events.map(e => `• ${e}`).join('<br>');
        const popupHtml = `
          <p class="mpop-city">${group.name}</p>
          <p class="mpop-events">${eventsHtml}</p>`;
        L.circleMarker([group.lat, group.lng], {
          radius,
          fillColor: '#F985B5',
          fillOpacity: 0.9,
          color: '#ffffff',
          weight: 2
        })
        .bindPopup(popupHtml, { minWidth: 190 })
        .addTo(map);
      }, i * 60);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateMarkers();
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(mapEl);
})();

// Sound toggle hero video
(function () {
  const btn = document.getElementById('sound-toggle');
  const video = document.getElementById('hero-video');
  if (!btn || !video) return;

  video.muted = true;
  video.volume = 0;
  let muted = true;

  function setMuted(val) {
    muted = val;
    video.muted = val;
    video.volume = val ? 0 : 1;
    btn.querySelector('i').className = val
      ? 'fa-solid fa-volume-xmark'
      : 'fa-solid fa-volume-high';
  }

  btn.addEventListener('click', () => setMuted(!muted));

  // Dempen zodra gebruiker de Spotify bar aanklikt
  window.addEventListener('blur', () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (active && active.tagName === 'IFRAME' && active.closest('#spotify-bar')) {
        setMuted(true);
      }
    }, 0);
  });
})();

// Photo lightbox
(function () {
  const items = Array.from(document.querySelectorAll('.photo-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbPlaceholder = document.getElementById('lightbox-placeholder');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  if (!lightbox || !items.length) return;

  let current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    const img = items[current].querySelector('img');
    if (img) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbImg.style.display = 'block';
      lbPlaceholder.style.display = 'none';
    } else {
      lbImg.style.display = 'none';
      lbPlaceholder.style.display = 'block';
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// Video sectie — thumbnail switching
(function () {
  const thumbs = document.querySelectorAll('.video-thumb');
  const iframe = document.getElementById('featured-iframe');
  const placeholder = document.getElementById('featured-placeholder');
  if (!thumbs.length || !iframe) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      if (!src || src.includes('VIDEO_ID')) return;

      iframe.src = src + '?autoplay=1';
      iframe.style.display = 'block';
      placeholder.style.display = 'none';

      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
})();

// Shows & Gigs — meer/minder past shows
(function () {
  const btn = document.getElementById('shows-toggle-btn');
  const more = document.getElementById('shows-more-past');
  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const isHidden = more.hasAttribute('hidden');
    if (isHidden) {
      more.removeAttribute('hidden');
      btn.textContent = 'Less Shows';
    } else {
      more.setAttribute('hidden', '');
      btn.textContent = 'More Shows';
    }
  });
})();

// Geanimeerde teller — herbruikbare functie
function animateCounters(containerSelector, numSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const nums = container.querySelectorAll(numSelector + '[data-target]');
  if (!nums.length) return;

  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    nums.forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
    observer.disconnect();
  }, { threshold: 0.4 }).observe(container);
}

// Our Story & Where We've Been — geanimeerde statistieken
animateCounters('.story-stats', '.stat-number');
animateCounters('.map-stats', '.map-stat-num');

// Tilt-effect op bandleden-kaarten
(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  carousel.addEventListener('mousemove', e => {
    const card = e.target.closest('.member-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`;
    card.style.boxShadow = `0 12px 36px rgba(46,34,25,0.35)`;
  });

  carousel.addEventListener('mouseleave', () => {
    document.querySelectorAll('.member-card').forEach(c => {
      c.style.transform = '';
      c.style.boxShadow = '';
    });
  });

  carousel.addEventListener('mouseout', e => {
    const card = e.target.closest('.member-card');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
      card.style.boxShadow = '';
    }
  });
})();

// Carrousel (doorlopend / infinite loop)
(function () {
  const wrapper = document.querySelector('.carousel-track-wrapper');
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (!track || !wrapper) return;

  const originals = Array.from(track.children);
  const total = originals.length;
  let current = 0;
  let busy = false;

  function visible() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 4;
  }

  function slideWidth() {
    return wrapper.offsetWidth / visible();
  }

  function build() {
    track.querySelectorAll('.carousel-clone').forEach(el => el.remove());
    const n = visible();
    const w = slideWidth();

    // Kloon laatste n slides en zet ze vooraan
    originals.slice(-n).reverse().forEach(s => {
      const c = s.cloneNode(true);
      c.classList.add('carousel-clone');
      c.style.minWidth = w + 'px';
      track.insertBefore(c, track.firstChild);
    });

    // Kloon eerste n slides en zet ze achteraan
    originals.slice(0, n).forEach(s => {
      const c = s.cloneNode(true);
      c.classList.add('carousel-clone');
      c.style.minWidth = w + 'px';
      track.appendChild(c);
    });

    originals.forEach(s => { s.style.minWidth = w + 'px'; });
  }

  function goTo(idx, animate) {
    if (!animate) busy = false;
    track.style.transition = animate ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(${-(idx + visible()) * slideWidth()}px)`;
    current = idx;
  }

  track.addEventListener('transitionend', () => {
    if (current >= total) {
      goTo(current - total, false);
    } else if (current < 0) {
      goTo(current + total, false);
    } else {
      busy = false;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    goTo(current - 1, true);
  });

  nextBtn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    goTo(current + 1, true);
  });

  // Drag / swipe
  let dragStartX = null;
  let dragged = false;

  // Voorkom native browser-drag op afbeeldingen
  wrapper.addEventListener('dragstart', e => e.preventDefault());

  function dragStart(x) {
    dragStartX = x;
    dragged = false;
    track.style.transition = 'none';
    wrapper.classList.add('dragging');
  }

  function dragMove(x) {
    if (dragStartX === null) return;
    const dx = x - dragStartX;
    if (Math.abs(dx) > 5) dragged = true;
    if (dragged) {
      track.style.transform = `translateX(${-(current + visible()) * slideWidth() + dx}px)`;
    }
  }

  function dragEnd(x) {
    if (dragStartX === null) return;
    const dx = x - dragStartX;
    dragStartX = null;
    wrapper.classList.remove('dragging');
    if (!dragged) return;
    if (Math.abs(dx) > slideWidth() / 5) {
      busy = true;
      goTo(dx < 0 ? current + 1 : current - 1, true);
    } else {
      goTo(current, true);
    }
  }

  wrapper.addEventListener('mousedown', e => { e.preventDefault(); dragStart(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragStartX !== null) dragMove(e.clientX); });
  window.addEventListener('mouseup',   e => { if (dragStartX !== null) dragEnd(e.clientX); });

  wrapper.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
  wrapper.addEventListener('touchmove',  e => dragMove(e.touches[0].clientX),  { passive: true });
  wrapper.addEventListener('touchend',   e => dragEnd(e.changedTouches[0].clientX));

  window.addEventListener('resize', () => { build(); goTo(current, false); });

  build();
  goTo(0, false);
})();
