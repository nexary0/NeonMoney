/* ============================================================
   NEON MONEYVERSE — MAIN JS
   ============================================================ */

'use strict';

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

// ── MOBILE HAMBURGER ───────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        hamburger.classList.toggle('active');
    });
}

// ── SCROLL ANIMATIONS (IntersectionObserver) ───────────────
const scrollEls = document.querySelectorAll('.animate-on-scroll');
if (scrollEls.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    scrollEls.forEach(el => obs.observe(el));
}

// ── RIPPLE EFFECT ON BUTTONS ───────────────────────────────
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
});

// ── SEARCH BAR ─────────────────────────────────────────────
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const DEMO_PRODUCTS = [
    { name: 'Sony WH-1000XM5 Headphones', amazon: 24990, flipkart: 23499, img: '🎧', coins: 120, category: 'Electronics' },
    { name: 'Nike Air Max 270 Shoes', amazon: 9995, flipkart: 8999, img: '👟', coins: 80, category: 'Fashion' },
    { name: 'Samsung 65" 4K Smart TV', amazon: 72990, flipkart: 69999, img: '📺', coins: 350, category: 'Electronics' },
    { name: 'Apple AirPods Pro 2nd Gen', amazon: 24900, flipkart: 23500, img: '🎵', coins: 160, category: 'Electronics' },
    { name: 'boAt Rockerz 450 Headphones', amazon: 1999, flipkart: 1699, img: '🎧', coins: 30, category: 'Electronics' },
    { name: 'Adidas Running Shoes', amazon: 4999, flipkart: 4499, img: '👟', coins: 45, category: 'Fashion' },
    { name: 'Xiaomi 13 Pro Smartphone', amazon: 79999, flipkart: 77990, img: '📱', coins: 400, category: 'Electronics' },
    { name: 'JBL Charge 5 Speaker', amazon: 14999, flipkart: 13599, img: '🔊', coins: 90, category: 'Electronics' },
];

function formatINR(num) {
    return '₹' + num.toLocaleString('en-IN');
}

function renderProductCards(products, container) {
    if (!container) return;
    container.innerHTML = '';
    products.forEach((p, i) => {
        const lower = Math.min(p.amazon, p.flipkart);
        const higher = Math.max(p.amazon, p.flipkart);
        const saving = higher - lower;
        const pct = Math.round((saving / higher) * 100);
        const bestStore = p.amazon < p.flipkart ? 'Amazon' : 'Flipkart';
        const bestClass = bestStore === 'Amazon' ? 'amazon' : 'flipkart';

        const card = document.createElement('div');
        card.className = 'product-card animate-on-scroll delay-' + Math.min(i + 1, 5);
        card.innerHTML = `
      <div class="card-img">${p.img}</div>
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-prices">
          <span class="price-new">${formatINR(lower)}</span>
          <span class="price-old">${formatINR(higher)}</span>
          ${saving > 0 ? `<span class="price-save">Save ${pct}%</span>` : ''}
        </div>
        <div class="card-coins">💰 Earn ${p.coins} Coins</div>
        <div class="card-stores">
          <span class="store-tag amazon">Amazon ${formatINR(p.amazon)}</span>
          <span class="store-tag flipkart">Flipkart ${formatINR(p.flipkart)}</span>
        </div>
      </div>`;
        card.addEventListener('click', () => openProductModal(p));
        container.appendChild(card);
    });
    // Re-observe new elements
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    container.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
}

// Search filter
if (searchForm && searchInput) {
    searchInput.addEventListener('input', debounce(() => {
        const q = searchInput.value.trim().toLowerCase();
        if (!searchResults) return;
        if (q.length < 2) { searchResults.style.display = 'none'; return; }
        const filtered = DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        if (filtered.length === 0) { searchResults.style.display = 'none'; return; }
        searchResults.innerHTML = filtered.slice(0, 5).map(p => `
      <div class="search-suggestion" data-name="${p.name}">
        <span class="sugg-img">${p.img}</span>
        <div class="sugg-info">
          <span class="sugg-name">${p.name}</span>
          <span class="sugg-price">${formatINR(Math.min(p.amazon, p.flipkart))}</span>
        </div>
        <span class="sugg-coins">+${p.coins} 💰</span>
      </div>`).join('');
        searchResults.style.display = 'block';
        searchResults.querySelectorAll('.search-suggestion').forEach(s => {
            s.addEventListener('click', () => {
                searchInput.value = s.dataset.name;
                searchResults.style.display = 'none';
                doSearch(s.dataset.name);
            });
        });
    }, 250));

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchResults && (searchResults.style.display = 'none');
        doSearch(searchInput.value.trim());
    });

    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) searchResults && (searchResults.style.display = 'none');
    });
}

function doSearch(query) {
    const q = query.toLowerCase();
    const filtered = q ? DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : DEMO_PRODUCTS;
    const resultsSection = document.getElementById('results-section');
    const resultsGrid = document.getElementById('results-grid');
    const resultsTitle = document.getElementById('results-title');
    if (resultsSection && resultsGrid) {
        resultsSection.style.display = 'block';
        resultsTitle && (resultsTitle.textContent = `Results for "${query}" (${filtered.length} found)`);
        renderProductCards(filtered, resultsGrid);
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
    const start = performance.now();
    const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(eased * target).toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// ── STAT COUNTERS ──────────────────────────────────────────
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseFloat(el.dataset.count);
                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, 2000, prefix, suffix);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
}

// ── TRENDING DEALS (HOMEPAGE) ──────────────────────────────
const trendingGrid = document.getElementById('trending-grid');
if (trendingGrid) renderProductCards(DEMO_PRODUCTS.slice(0, 4), trendingGrid);

// ── PRODUCT MODAL ──────────────────────────────────────────
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    const lower = Math.min(product.amazon, product.flipkart);
    const higher = Math.max(product.amazon, product.flipkart);
    const saving = higher - lower;
    const bestStore = product.amazon < product.flipkart ? 'Amazon' : 'Flipkart';
    modal.querySelector('#modal-title').textContent = product.name;
    modal.querySelector('#modal-img').textContent = product.img;
    modal.querySelector('#modal-amazon').textContent = formatINR(product.amazon);
    modal.querySelector('#modal-flipkart').textContent = formatINR(product.flipkart);
    modal.querySelector('#modal-saving').textContent = saving > 0 ? `You save ${formatINR(saving)} on ${bestStore}!` : 'Same price on both';
    modal.querySelector('#modal-coins').textContent = '+' + product.coins + ' Coins';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
const modal = document.getElementById('product-modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}
function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
window.closeModal = closeModal;

// ── LOSS ALERT TICKER ──────────────────────────────────────
const alerts = [
    { msg: '⚠️ You could save ₹1,491 on Sony WH-1000XM5 if you wait 2 days', urgency: 'medium' },
    { msg: '🔥 Price dropped! boAt Rockerz just got ₹300 cheaper on Flipkart', urgency: 'low' },
    { msg: '⚠️ Limited deal! Samsung TV at ₹69,999 expires in 4 hours', urgency: 'high' },
    { msg: '💡 Nike shoes are ₹996 cheaper on Flipkart right now', urgency: 'medium' },
];
let alertIdx = 0;
const alertEl = document.getElementById('loss-alert-text');
if (alertEl) {
    const cycle = () => {
        alertEl.style.opacity = '0';
        setTimeout(() => {
            alertEl.textContent = alerts[alertIdx % alerts.length].msg;
            alertEl.style.opacity = '1';
            alertIdx++;
        }, 400);
    };
    cycle();
    setInterval(cycle, 4000);
}

// ── SPIN WHEEL ─────────────────────────────────────────────
const spinBtn = document.getElementById('spin-btn');
const spinWheel = document.getElementById('spin-wheel-el');
let canSpin = true;
const spinPrizes = [10, 25, 5, 50, 15, 100, 30, 20];

if (spinBtn && spinWheel) {
    spinBtn.addEventListener('click', () => {
        if (!canSpin) return;
        canSpin = false;
        spinBtn.disabled = true;
        spinBtn.textContent = 'Spinning...';
        const idx = Math.floor(Math.random() * spinPrizes.length);
        const deg = 360 * 5 + (idx * (360 / spinPrizes.length));
        spinWheel.style.transition = 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)';
        spinWheel.style.transform = `rotate(${deg}deg)`;
        setTimeout(() => {
            showNotification(`🎉 You won ${spinPrizes[idx]} coins!`, 'success');
            spinBtn.textContent = 'Come back tomorrow!';
        }, 4200);
    });
}

// ── TOAST NOTIFICATION ────────────────────────────────────
function showNotification(msg, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 400); }, 4000);
}
function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container'; div.className = 'toast-container';
    document.body.appendChild(div); return div;
}
window.showNotification = showNotification;

// ── FILTER TABS ────────────────────────────────────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        tab.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// ── UTILITY: DEBOUNCE ──────────────────────────────────────
function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ── PARTICLES (HERO BG) ────────────────────────────────────
function spawnParticle(container) {
    if (!container) return;
    const p = document.createElement('div');
    p.className = 'particle';
    const colors = ['rgba(0,255,178,0.5)', 'rgba(124,58,237,0.5)', 'rgba(59,130,246,0.5)', 'rgba(251,191,36,0.4)'];
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
    width:${size}px; height:${size}px;
    background:${colors[Math.floor(Math.random() * colors.length)]};
    left:${Math.random() * 100}%;
    bottom:${Math.random() * 40}%;
    --duration:${Math.random() * 3 + 2}s;
    --delay:${Math.random() * 2}s;
    box-shadow: 0 0 6px currentColor;
  `;
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
}
const particleContainer = document.getElementById('particles');
if (particleContainer) setInterval(() => spawnParticle(particleContainer), 600);

// ── ACTIVE NAV LINK ────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ── TOAST STYLES (INJECTED) ───────────────────────────────
const toastCSS = `
.toast-container { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:10px; }
.toast {
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:14px 18px; border-radius:12px; min-width:280px;
  background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.1);
  backdrop-filter:blur(20px); color:#F0F4FF; font-family:'Inter',sans-serif; font-size:0.88rem;
  opacity:0; transform:translateX(20px); transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
}
.toast.visible { opacity:1; transform:translateX(0); }
.toast-success { border-color:rgba(0,255,178,0.3); }
.toast-error   { border-color:rgba(239,68,68,0.3); }
.toast button  { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); font-size:0.8rem; }
.search-suggestion {
  display:flex; align-items:center; gap:12px; padding:12px 16px; cursor:pointer;
  border-bottom:1px solid rgba(255,255,255,0.05); transition:background 0.2s;
}
.search-suggestion:hover { background:rgba(255,255,255,0.04); }
.sugg-img { font-size:1.4rem; }
.sugg-info { flex:1; }
.sugg-name { display:block; font-size:0.88rem; color:#F0F4FF; font-family:'Inter',sans-serif; }
.sugg-price { font-size:0.78rem; color:#00FFB2; font-family:'Orbitron',monospace; }
.sugg-coins { font-size:0.75rem; color:#FBBF24; font-family:'Orbitron',monospace; white-space:nowrap; }
.nav-links.mobile-open {
  display:flex; flex-direction:column; position:absolute; top:72px; left:0; right:0;
  background:rgba(10,10,15,0.98); border-bottom:1px solid rgba(255,255,255,0.08);
  padding:12px; z-index:999;
}
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.hamburger.active span:nth-child(2) { opacity:0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
`;
const style = document.createElement('style');
style.textContent = toastCSS;
document.head.appendChild(style);

/* ============================================================
   SMART SEARCH BAR LOGIC
   ============================================================ */

// 1. A mini-database of products to search through
const sampleProducts = [
    { name: "Sony WH-1000XM5 Headphones", img: "🎧", amz: "₹24,990", flip: "₹23,499", best: "Flipkart", save: "₹1,491" },
    { name: "Nike Air Max 270 Shoes", img: "👟", amz: "₹11,495", flip: "₹10,499", best: "Flipkart", save: "₹996" },
    { name: "Samsung 65-inch 4K TV", img: "📺", amz: "₹65,990", flip: "₹62,990", best: "Flipkart", save: "₹3,000" },
    { name: "Apple AirPods Pro 2nd Gen", img: "🍎", amz: "₹20,900", flip: "₹19,500", best: "Flipkart", save: "₹1,400" },
    { name: "JBL Flip 6 Bluetooth Speaker", img: "🔊", amz: "₹8,999", flip: "₹9,499", best: "Amazon", save: "₹500" }
];

// 2. The magic function that searches and shows results
window.doSearch = function (query) {
    if (!query) return;

    // Find the hidden results section on the homepage
    const resultsSection = document.getElementById('results-section');
    const resultsTitle = document.getElementById('results-title');
    const resultsGrid = document.getElementById('results-grid');

    if (!resultsSection) return;

    // Search the database (ignores uppercase/lowercase)
    const lowerQuery = query.toLowerCase();
    const matches = sampleProducts.filter(p => p.name.toLowerCase().includes(lowerQuery));

    // Make the hidden results section visible!
    resultsSection.style.display = 'block';

    if (matches.length > 0) {
        // Build the HTML cards for the exact products found
        resultsTitle.innerHTML = `Found ${matches.length} best deals for "<span class="gradient-text">${query}</span>"`;
        resultsGrid.innerHTML = matches.map(p => `
            <div class="reward-card glass-card">
                <div style="font-size: 3rem; margin-bottom: 16px;">${p.img}</div>
                <h4 style="margin-bottom: 12px; font-family: var(--font-body);">${p.name}</h4>
                <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 8px;">
                    <span>🛒 Amazon:</span> <span style="${p.best === 'Amazon' ? 'color:var(--neon-green);font-weight:bold;' : 'color:var(--text-muted);'}">${p.amz}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 16px;">
                    <span>🛍️ Flipkart:</span> <span style="${p.best === 'Flipkart' ? 'color:var(--neon-green);font-weight:bold;' : 'color:var(--text-muted);'}">${p.flip}</span>
                </div>
                <div style="background: rgba(0,255,178,0.08); color: var(--neon-green); padding: 8px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 16px; border: 1px solid rgba(0,255,178,0.2);">
                    Save <strong>${p.save}</strong> on ${p.best}
                </div>
                <a href="deals.html" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">View Deal</a>
            </div>
        `).join('');
    } else {
        // What to show if they search for something we don't have yet
        resultsTitle.innerHTML = `No live deals found for "${query}" right now.`;
        resultsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border);">
                <div style="font-size: 2rem; margin-bottom: 12px;">⏳</div>
                <p>We are currently scanning Amazon and Flipkart for the best prices. Check back soon!</p>
                <a href="deals.html" class="btn btn-secondary" style="margin-top: 16px;">Browse All Deals</a>
            </div>
        `;
    }

    // Automatically scroll down so the user sees the results!
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// 3. Connect the typing box to the search function
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the page from reloading
            window.doSearch(searchInput.value);
        });
    }
});