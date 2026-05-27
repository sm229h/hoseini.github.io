document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initParticles();
  initCounterAnimation();
  initScrollReveal();
  renderFeaturedProperties();

  if (document.querySelector('.properties-grid.all')) {
    renderAllProperties();
    initFilters();
  }

  if (document.querySelector('.property-detail')) {
    initPropertyDetail();
  }

  if (document.querySelector('.neighborhoods-grid')) {
    renderNeighborhoods();
  }
});

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.innerHTML = nav.classList.contains('open') ? '✕' : '☰';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-inner')) {
      nav.classList.remove('open');
      toggle.innerHTML = '☰';
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
}

function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
    particle.style.animationDelay = (Math.random() * 20) + 's';
    container.appendChild(particle);
  }
}

function initCounterAnimation() {
  const stats = document.querySelectorAll('.hero-stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const value = parseInt(target.dataset.value || target.textContent.replace(/[^0-9]/g, ''));
        animateCounter(target, value);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el, target) {
  const duration = 2000;
  const steps = 60;
  const stepDuration = duration / steps;
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = formatNumber(Math.round(current));
  }, stepDuration);
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getPropertyTypeLabel(type) {
  const labels = {
    apartment: 'آپارتمان',
    villa: 'ویلا',
    house: 'خانه',
    penthouse: 'پنت هاوس',
    commercial: 'تجاری',
    office: 'دفتر کار',
    land: 'زمین'
  };
  return labels[type] || type;
}

function getPurposeLabel(purpose) {
  return purpose === 'sell' ? 'فروشی' : 'رهن و اجاره';
}

function getPriceDisplay(property) {
  if (property.purpose === 'rent') {
    return `<div class="property-card-price">${formatNumber(property.price)} تومان</div>
            <div class="property-card-price-rent">رهن کامل</div>`;
  }
  return `<div class="property-card-price">${formatNumber(property.price)} تومان</div>`;
}

function createPropertyCard(property, featured = false) {
  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

  return `
    <div class="property-card fade-in">
      <div class="property-card-image">
        <img src="${mainImage}" alt="${property.title}" loading="lazy" />
        <div class="property-card-badges">
          <span class="badge badge-purpose">${getPurposeLabel(property.purpose)}</span>
          <span class="badge badge-type">${getPropertyTypeLabel(property.type)}</span>
          ${featured ? '<span class="badge badge-featured">ویژه</span>' : ''}
        </div>
        <div class="property-card-wishlist" title="علاقمندی">♡</div>
      </div>
      <div class="property-card-body">
        <div class="property-card-price">${getPriceDisplay(property)}</div>
        <h3 class="property-card-title">
          <a href="property-detail.html?id=${property.id}">${property.title}</a>
        </h3>
        <div class="property-card-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${property.neighborhood}، ${property.district}
        </div>
        <div class="property-card-features">
          ${property.area ? `<div class="property-card-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            ${property.area} متر
          </div>` : ''}
          ${property.rooms ? `<div class="property-card-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
            ${property.rooms} خواب
          </div>` : ''}
          ${property.floor ? `<div class="property-card-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4"/></svg>
            طبقه ${property.floor}
          </div>` : ''}
          ${property.yearBuilt ? `<div class="property-card-feature">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 1v3M15 1v3M9 13h6M9 17h3"/></svg>
            ${property.yearBuilt}
          </div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProperties() {
  const grid = document.querySelector('.properties-grid.featured');
  if (!grid) return;

  const featured = properties.filter(p => p.isFeatured);
  grid.innerHTML = featured.map(p => createPropertyCard(p, true)).join('');
}

function renderAllProperties(list = properties) {
  const grid = document.querySelector('.properties-grid.all');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1">
        <div class="empty-state-icon">🏠</div>
        <h3>نتیجه‌ای یافت نشد</h3>
        <p>متاسفانه ملکی با فیلترهای انتخاب شده وجود ندارد.</p>
        <button class="btn btn-primary" onclick="resetFilters()">حذف فیلترها</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(p => createPropertyCard(p)).join('');
  initScrollReveal();
}

function renderNeighborhoods() {
  const grid = document.querySelector('.neighborhoods-grid');
  if (!grid) return;

  const bgColors = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400'
  ];

  grid.innerHTML = neighborhoods.map((n, i) => `
    <a href="properties.html?neighborhood=${n.name}" class="neighborhood-card fade-in">
      <img src="${bgColors[i % bgColors.length]}" alt="${n.name}" loading="lazy" />
      <div class="neighborhood-card-overlay">
        <div class="neighborhood-card-name">${n.name}</div>
        <div class="neighborhood-card-district">${n.district}</div>
      </div>
      <span class="neighborhood-card-count">${n.count} ملک</span>
    </a>
  `).join('');

  initScrollReveal();
}

function initFilters() {
  const filterBtn = document.querySelector('.filters-bar .btn-primary');
  if (!filterBtn) return;

  filterBtn.addEventListener('click', applyFilters);

  document.querySelectorAll('.filters-bar select, .filters-bar input').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  });

  const sidebarCheckboxes = document.querySelectorAll('.sidebar-filter input[type="checkbox"]');
  sidebarCheckboxes.forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('neighborhood')) {
    const nh = urlParams.get('neighborhood');
    const select = document.querySelector('select[name="neighborhood"]');
    if (select) select.value = nh;
    applyFilters();
  }
}

function applyFilters() {
  const type = document.querySelector('select[name="type"]')?.value;
  const purpose = document.querySelector('select[name="purpose"]')?.value;
  const neighborhood = document.querySelector('select[name="neighborhood"]')?.value;
  const minPrice = document.querySelector('input[name="minPrice"]')?.value;
  const maxPrice = document.querySelector('input[name="maxPrice"]')?.value;
  const minArea = document.querySelector('input[name="minArea"]')?.value;

  let filtered = [...properties];

  if (type) filtered = filtered.filter(p => p.type === type);
  if (purpose) filtered = filtered.filter(p => p.purpose === purpose);
  if (neighborhood) filtered = filtered.filter(p => p.neighborhood === neighborhood);
  if (minPrice) filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  if (minArea) filtered = filtered.filter(p => p.area >= parseInt(minArea));

  const sidebarTypes = document.querySelectorAll('.sidebar-filter input[type="checkbox"][data-type]');
  const selectedTypes = [];
  sidebarTypes.forEach(cb => { if (cb.checked) selectedTypes.push(cb.dataset.type); });
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(p => selectedTypes.includes(p.type));
  }

  updateResultCount(filtered.length);
  renderAllProperties(filtered);
}

function updateResultCount(count) {
  const el = document.querySelector('.result-count');
  if (el) el.textContent = `${count} ملک یافت شد`;
}

function resetFilters() {
  document.querySelectorAll('.filters-bar select').forEach(s => s.value = '');
  document.querySelectorAll('.filters-bar input').forEach(i => i.value = '');
  document.querySelectorAll('.sidebar-filter input[type="checkbox"]').forEach(cb => cb.checked = false);
  updateResultCount(properties.length);
  renderAllProperties(properties);
}

function initPropertyDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const property = properties.find(p => p.id === id);

  if (!property) {
    document.querySelector('.property-detail .container').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏠</div>
        <h3>ملک مورد نظر یافت نشد</h3>
        <a href="properties.html" class="btn btn-primary">مشاهده همه املاک</a>
      </div>
    `;
    return;
  }

  renderPropertyDetail(property);
}

function renderPropertyDetail(property) {
  document.title = `${property.title} | خانه من`;
  document.querySelector('.breadcrumb-inner').innerHTML = `
    <a href="index.html">خانه</a>
    <span>/</span>
    <a href="properties.html">املاک</a>
    <span>/</span>
    <span>${property.title}</span>
  `;

  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

  let thumbsHtml = property.images.map((img, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="changeGalleryImage(${i})">
      <img src="${img}" alt="" />
    </div>
  `).join('');

  let featuresHtml = property.features.map(f => `
    <div class="detail-feature">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      ${f}
    </div>
  `).join('');

  window._galleryImages = property.images;
  window._currentGallery = 0;

  document.querySelector('.property-gallery-main img').src = mainImage;
  document.querySelector('.property-gallery-thumbs').innerHTML = thumbsHtml;

  document.querySelector('.detail-main h1').textContent = property.title;
  document.querySelector('.detail-meta').innerHTML = `
    <div class="detail-meta-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${property.address}
    </div>
    <div class="detail-meta-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
      ${property.area} متر
    </div>
    <div class="detail-meta-item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 1v3M15 1v3M9 13h6M9 17h3"/></svg>
      ساخت ${property.yearBuilt || 'نامشخص'}
    </div>
  `;

  document.querySelector('.detail-price').innerHTML = `${formatNumber(property.price)} تومان`;
  document.querySelector('.detail-price-label').textContent =
    property.purpose === 'sell' ? 'قیمت فروش' : 'رهن کامل';

  document.querySelector('.detail-features-list').innerHTML = featuresHtml;

  document.querySelector('.detail-description p').textContent = property.description;

  document.querySelector('.specs-grid').innerHTML = `
    <div class="spec-item"><span>نوع ملک</span><span>${getPropertyTypeLabel(property.type)}</span></div>
    <div class="spec-item"><span>منطقه</span><span>${property.district}</span></div>
    <div class="spec-item"><span>محله</span><span>${property.neighborhood}</span></div>
    <div class="spec-item"><span>متراژ</span><span>${property.area} مترمربع</span></div>
    ${property.rooms ? `<div class="spec-item"><span>تعداد خواب</span><span>${property.rooms}</span></div>` : ''}
    ${property.floor ? `<div class="spec-item"><span>طبقه</span><span>${property.floor} از ${property.totalFloors}</span></div>` : ''}
    ${property.yearBuilt ? `<div class="spec-item"><span>سال ساخت</span><span>${property.yearBuilt}</span></div>` : ''}
    <div class="spec-item"><span>نوع معامله</span><span>${getPurposeLabel(property.purpose)}</span></div>
  `;
}

function changeGalleryImage(index) {
  const images = window._galleryImages || [];
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  window._currentGallery = index;

  document.querySelector('.property-gallery-main img').src = images[index];
  document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}
