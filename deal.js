/**
 * deals.js — NeonMoney Deals Page Logic
 * Handles: product loading, filtering, sorting, category tabs, price range
 */

// ══════════════════════════════════════════
//  DEALS DATA  (replace with API call later)
// ══════════════════════════════════════════
const ALL_DEALS = [
    {
        id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', emoji: '🎧',
        cat: 'audio', subcats: ['headphones', 'wireless'],
        amazon: 29990, flipkart: 27990, mrp: 34990,
        coins: 150, badge: '🔥 HOT DEAL', tags: ['bestseller', 'premium'],
        rating: 4.8, reviews: 2340, featured: true,
        desc: 'Industry-leading noise cancellation, 30hr battery, multipoint connection.'
    },
    {
        id: 2, name: 'Samsung 65" Crystal 4K UHD Smart TV', emoji: '📺',
        cat: 'electronics', subcats: ['tv', 'samsung'],
        amazon: 64999, flipkart: 61999, mrp: 79900,
        coins: 350, badge: '⚡ FLASH DEAL', tags: ['trending', 'premium'],
        rating: 4.5, reviews: 1820, featured: true,
        desc: 'Crystal Processor 4K, PurColor, HDR, Alexa built-in, Tizen OS.'
    },
    {
        id: 3, name: 'Apple AirPods Pro (2nd Gen)', emoji: '🎵',
        cat: 'audio', subcats: ['earbuds', 'apple'],
        amazon: 24900, flipkart: 23499, mrp: 26900,
        coins: 125, badge: '🍎 APPLE DEAL', tags: ['popular'],
        rating: 4.7, reviews: 3100, featured: true,
        desc: 'Active noise cancellation, Transparency mode, Adaptive Audio, MagSafe.'
    },
    {
        id: 4, name: 'Nike Air Max 270 Men\'s Shoes', emoji: '👟',
        cat: 'fashion', subcats: ['shoes', 'nike'],
        amazon: 9995, flipkart: 8999, mrp: 12995,
        coins: 50, badge: '👟 FASHION', tags: ['popular'],
        rating: 4.4, reviews: 890, featured: false,
        desc: 'Max Air cushioning, breathable mesh upper, rubber outsole.'
    },
    {
        id: 5, name: 'boAt Rockerz 450 Pro Bluetooth Headphones', emoji: '🎧',
        cat: 'audio', subcats: ['headphones', 'boat'],
        amazon: 1999, flipkart: 1799, mrp: 3990,
        coins: 20, badge: '🇮🇳 DESI BRAND', tags: ['budget', 'india'],
        rating: 4.1, reviews: 45200, featured: false,
        desc: 'Up to 70hr battery, BEAST mode, 40mm drivers.'
    },
    {
        id: 6, name: 'Xiaomi 13 Pro 5G', emoji: '📱',
        cat: 'mobiles', subcats: ['smartphone', 'xiaomi'],
        amazon: 49999, flipkart: 47999, mrp: 54999,
        coins: 250, badge: '📱 FLAGSHIP', tags: ['premium', 'trending'],
        rating: 4.6, reviews: 1560, featured: true,
        desc: 'Snapdragon 8 Gen 2, Leica optics, 120W HyperCharge.'
    },
    {
        id: 7, name: 'JBL Charge 5 Portable Speaker', emoji: '🔊',
        cat: 'audio', subcats: ['speakers', 'jbl'],
        amazon: 13999, flipkart: 12999, mrp: 17999,
        coins: 70, badge: '🔊 BASS BOOST', tags: ['popular'],
        rating: 4.6, reviews: 2780, featured: false,
        desc: 'IP67 waterproof, 20hr playtime, USB-C charging port, PartyBoost.'
    },
    {
        id: 8, name: 'Adidas Ultraboost 22 Running Shoes', emoji: '👟',
        cat: 'fashion', subcats: ['shoes', 'adidas'],
        amazon: 12999, flipkart: 11999, mrp: 16000,
        coins: 65, badge: '🔥 SALE', tags: ['popular'],
        rating: 4.5, reviews: 650, featured: false,
        desc: 'Boost midsole, Primeknit+ upper, Continental rubber outsole.'
    },
    {
        id: 9, name: 'OnePlus 12R 5G (16GB RAM)', emoji: '📱',
        cat: 'mobiles', subcats: ['smartphone', 'oneplus'],
        amazon: 39999, flipkart: 38499, mrp: 43999,
        coins: 200, badge: '⚡ HOT', tags: ['trending'],
        rating: 4.5, reviews: 2100, featured: true,
        desc: 'Snapdragon 8 Gen 1, 50MP triple cam, 100W SuperVOOC, 5500mAh.'
    },
    {
        id: 10, name: 'Philips HD9252 Air Fryer 1400W', emoji: '🍳',
        cat: 'home', subcats: ['kitchen', 'philips'],
        amazon: 7999, flipkart: 7499, mrp: 9999,
        coins: 40, badge: '🏠 HOME DEAL', tags: ['popular'],
        rating: 4.4, reviews: 3400, featured: false,
        desc: 'Rapid Air technology, 4.1L capacity, 90% less fat.'
    },
    {
        id: 11, name: 'Bose QuietComfort 45 Headphones', emoji: '🎧',
        cat: 'audio', subcats: ['headphones', 'bose'],
        amazon: 34900, flipkart: 32999, mrp: 38000,
        coins: 175, badge: '🎵 PREMIUM', tags: ['premium', 'bestseller'],
        rating: 4.7, reviews: 1890, featured: false,
        desc: 'World-class noise cancellation, 24hr battery, Aware Mode.'
    },
    {
        id: 12, name: 'iRobot Roomba i3+ Robot Vacuum', emoji: '🤖',
        cat: 'home', subcats: ['cleaning', 'robot'],
        amazon: 29999, flipkart: 28499, mrp: 35000,
        coins: 150, badge: '🤖 SMART HOME', tags: ['premium'],
        rating: 4.3, reviews: 740, featured: false,
        desc: 'Auto-emptying base, iRobot OS, Imprint Smart Mapping.'
    },
    {
        id: 13, name: 'realme Narzo 60 Pro 5G', emoji: '📱',
        cat: 'mobiles', subcats: ['smartphone', 'realme'],
        amazon: 22999, flipkart: 21999, mrp: 26999,
        coins: 110, badge: '💸 VALUE', tags: ['budget'],
        rating: 4.2, reviews: 3200, featured: false,
        desc: 'Dimensity 7050, 100W charging, 67MP main camera.'
    },
    {
        id: 14, name: 'Puma Running T-Shirt (Dri-Fit)', emoji: '👕',
        cat: 'fashion', subcats: ['clothing', 'puma'],
        amazon: 1299, flipkart: 999, mrp: 2499,
        coins: 10, badge: '👕 APPAREL', tags: ['budget'],
        rating: 4.0, reviews: 6700, featured: false,
        desc: 'dryCELL moisture management, lightweight fabric.'
    },
    {
        id: 15, name: 'Samsung Galaxy Buds2 Pro', emoji: '🎵',
        cat: 'audio', subcats: ['earbuds', 'samsung'],
        amazon: 12990, flipkart: 11999, mrp: 17990,
        coins: 60, badge: '💸 DEAL', tags: ['popular'],
        rating: 4.4, reviews: 1200, featured: false,
        desc: 'Intelligent ANC, Hi-Fi 24bit audio, Bixby voice wake-up.'
    },
    {
        id: 16, name: 'Apple iPhone 15 (128GB)', emoji: '📱',
        cat: 'mobiles', subcats: ['smartphone', 'apple'],
        amazon: 69999, flipkart: 67999, mrp: 79900,
        coins: 500, badge: '🍎 APPLE', tags: ['premium', 'bestseller', 'trending'],
        rating: 4.8, reviews: 8900, featured: true,
        desc: 'A16 Bionic, Dynamic Island, USB-C, 48MP main camera.'
    }
];

// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let dealsState = {
    query: '',
    cat: 'all',
    sort: 'savings',
    priceMin: 0,
    priceMax: 100000,
    storeFilter: 'both',
    page: 1,
    perPage: 8
};

// ══════════════════════════════════════════
//  FILTER & SORT ENGINE
// ══════════════════════════════════════════
function filterAndSortDeals() {
    let results = ALL_DEALS.filter(deal => {
        const queryMatch = !dealsState.query ||
            deal.name.toLowerCase().includes(dealsState.query.toLowerCase()) ||
            deal.subcats.some(s => s.includes(dealsState.query.toLowerCase())) ||
            deal.tags.some(t => t.includes(dealsState.query.toLowerCase()));

        const catMatch = dealsState.cat === 'all' || deal.cat === dealsState.cat;

        const minPrice = Math.min(deal.amazon, deal.flipkart);
        const priceMatch = minPrice >= dealsState.priceMin && minPrice <= dealsState.priceMax;

        return queryMatch && catMatch && priceMatch;
    });

    // Sort
    results = results.map(d => ({
        ...d,
        bestPrice: Math.min(d.amazon, d.flipkart),
        savingAmt: d.mrp - Math.min(d.amazon, d.flipkart),
        savingPct: Math.round(((d.mrp - Math.min(d.amazon, d.flipkart)) / d.mrp) * 100),
        bestStore: d.amazon <= d.flipkart ? 'amazon' : 'flipkart'
    }));

    switch (dealsState.sort) {
        case 'savings': results.sort((a, b) => b.savingPct - a.savingPct); break;
        case 'price-low': results.sort((a, b) => a.bestPrice - b.bestPrice); break;
        case 'price-high': results.sort((a, b) => b.bestPrice - a.bestPrice); break;
        case 'coins': results.sort((a, b) => b.coins - a.coins); break;
        case 'rating': results.sort((a, b) => b.rating - a.rating); break;
        case 'newest': results.sort((a, b) => b.id - a.id); break;
    }

    return results;
}

// ══════════════════════════════════════════
//  RENDER DEAL CARD
// ══════════════════════════════════════════
function renderDealCard(deal) {
    const diff = deal.amazon - deal.flipkart;
    const diffAbs = Math.abs(diff);
    const priceDiffLabel = diff > 0
        ? `<span style="color:#2874F0;">🛍️ Flipkart cheaper by ₹${diffAbs.toLocaleString('en-IN')}</span>`
        : diff < 0
            ? `<span style="color:#FF9900;">🛒 Amazon cheaper by ₹${diffAbs.toLocaleString('en-IN')}</span>`
            : `<span style="color:var(--text-muted);">Same price on both</span>`;

    return `
    <div class="product-card animate-on-scroll" data-id="${deal.id}">
      ${deal.featured ? '<div class="pc-featured-ribbon">⭐ Featured</div>' : ''}
      <div class="pc-badge">${deal.badge}</div>
      <div class="pc-img">${deal.emoji}</div>
      <h3 class="pc-name">${deal.name}</h3>
      <p class="pc-desc">${deal.desc}</p>
      <div class="pc-meta">
        <span class="pc-rating">⭐ ${deal.rating} <span style="color:var(--text-muted);">(${deal.reviews.toLocaleString('en-IN')})</span></span>
      </div>
      <div class="pc-prices">
        <div class="hpc-row amazon">
          <span class="hpc-store amazon">🛒 Amazon</span>
          <span class="hpc-price" style="color:${deal.bestStore === 'amazon' ? '#FF9900' : 'var(--text-muted)'};">
            ₹${deal.amazon.toLocaleString('en-IN')}
            ${deal.bestStore === 'amazon' ? '<span class="best-badge">BEST</span>' : ''}
          </span>
        </div>
        <div class="hpc-row flipkart">
          <span class="hpc-store flipkart">🛍️ Flipkart</span>
          <span class="hpc-price" style="color:${deal.bestStore === 'flipkart' ? '#2874F0' : 'var(--text-muted)'};">
            ₹${deal.flipkart.toLocaleString('en-IN')}
            ${deal.bestStore === 'flipkart' ? '<span class="best-badge">BEST</span>' : ''}
          </span>
        </div>
      </div>
      <div style="font-size:0.75rem;margin:8px 0;text-align:center;">${priceDiffLabel}</div>
      <div class="pc-saving">💸 Save ₹${deal.savingAmt.toLocaleString('en-IN')} (${deal.savingPct}% off MRP)</div>
      <div class="pc-coins">💰 Earn ${deal.coins} Coins</div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <a href="#" class="btn btn-primary btn-sm btn-ripple" style="flex:1;justify-content:center;" 
           onclick="trackDealClick(${deal.id}, '${deal.bestStore}', event)">
          🛒 Best Deal
        </a>
        <button class="btn btn-secondary btn-sm" style="padding:0 12px;" 
                onclick="addPriceAlert(${deal.id})" title="Set Price Alert">🔔</button>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════
//  RENDER TO DOM
// ══════════════════════════════════════════
function renderDeals(container, paginationContainer) {
    const results = filterAndSortDeals();
    const total = results.length;
    const start = (dealsState.page - 1) * dealsState.perPage;
    const page = results.slice(start, start + dealsState.perPage);

    if (!container) return;

    // Update count label
    const countEl = document.getElementById('deals-count-label');
    if (countEl) countEl.textContent = `${total} deals found`;

    if (total === 0) {
        container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
        <div style="font-size:3rem;margin-bottom:16px;">🔍</div>
        <h3 style="margin-bottom:12px;">No deals found</h3>
        <p style="color:var(--text-muted);">Try a different search term or category.</p>
        <button class="btn btn-secondary" style="margin-top:20px;" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
        return;
    }

    container.innerHTML = page.map(renderDealCard).join('');

    // Pagination
    if (paginationContainer) {
        const totalPages = Math.ceil(total / dealsState.perPage);
        if (totalPages > 1) {
            paginationContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="changePage(${dealsState.page - 1})" ${dealsState.page <= 1 ? 'disabled' : ''}>← Prev</button>
        <span style="color:var(--text-secondary);font-size:0.88rem;">Page ${dealsState.page} of ${totalPages}</span>
        <button class="btn btn-secondary btn-sm" onclick="changePage(${dealsState.page + 1})" ${dealsState.page >= totalPages ? 'disabled' : ''}>Next →</button>
      `;
        } else {
            paginationContainer.innerHTML = '';
        }
    }

    // Re-run scroll animations
    requestAnimationFrame(() => {
        document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) el.classList.add('visible');
        });
    });
}

// ══════════════════════════════════════════
//  ACTIONS
// ══════════════════════════════════════════
function changePage(page) {
    const results = filterAndSortDeals();
    const totalPages = Math.ceil(results.length / dealsState.perPage);
    if (page < 1 || page > totalPages) return;
    dealsState.page = page;
    const container = document.getElementById('deals-grid');
    const pagination = document.getElementById('deals-pagination');
    renderDeals(container, pagination);
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setDealFilter(key, value) {
    dealsState[key] = value;
    dealsState.page = 1;
    const container = document.getElementById('deals-grid');
    const pagination = document.getElementById('deals-pagination');
    if (container) renderDeals(container, pagination);
}

function resetFilters() {
    dealsState = { ...dealsState, query: '', cat: 'all', sort: 'savings', priceMin: 0, priceMax: 100000, page: 1 };
    const searchInput = document.getElementById('deals-search');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    const allTab = document.querySelector('.cat-tab[data-cat="all"]');
    if (allTab) allTab.classList.add('active');
    const container = document.getElementById('deals-grid');
    const pagination = document.getElementById('deals-pagination');
    if (container) renderDeals(container, pagination);
}

window.trackDealClick = function (id, store, e) {
    e.preventDefault();
    const deal = ALL_DEALS.find(d => d.id === id);
    if (!deal) return;

    // 1. Show the cool notification
    if (typeof showNotification === 'function') {
        showNotification(`🛒 Taking you to ${store === 'amazon' ? 'Amazon' : 'Flipkart'}...`, 'success');
    }

    // 2. Build the real link to search for this exact product!
    let outLink = '';
    const searchName = encodeURIComponent(deal.name);

    if (store === 'amazon') {
        outLink = `https://www.amazon.in/s?k=${searchName}`;
    } else {
        outLink = `https://www.flipkart.com/search?q=${searchName}`;
    }

    // 3. Open the new tab after a tiny delay
    setTimeout(() => {
        window.open(outLink, '_blank');
    }, 800);
};
function addPriceAlert(id) {
    const deal = ALL_DEALS.find(d => d.id === id);
    if (!deal) return;
    const session = sessionStorage.getItem('nm_session');
    if (!session) {
        if (typeof showNotification === 'function') {
            showNotification('🔔 Login to set price alerts!', 'info');
        }
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);
        return;
    }
    if (typeof showNotification === 'function') {
        showNotification(`🔔 Price alert set for "${deal.name}"! We'll notify you when price drops.`, 'success');
    }
}

// ══════════════════════════════════════════
//  CATEGORY TAB HELPER
// ══════════════════════════════════════════
function initCategoryTabs() {
    document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            setDealFilter('cat', tab.dataset.cat);
        });
    });
}

// ══════════════════════════════════════════
//  SORT SELECT HELPER
// ══════════════════════════════════════════
function initSortSelect() {
    const sortSel = document.getElementById('sort-select');
    if (sortSel) {
        sortSel.addEventListener('change', () => setDealFilter('sort', sortSel.value));
    }
}

// ══════════════════════════════════════════
//  SEARCH HELPER
// ══════════════════════════════════════════
function initDealsSearch() {
    const searchInput = document.getElementById('deals-search');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => setDealFilter('query', searchInput.value), 300);
        });
    }
}

// ══════════════════════════════════════════
//  PRICE RANGE HELPER
// ══════════════════════════════════════════
function initPriceRange() {
    const minEl = document.getElementById('price-min');
    const maxEl = document.getElementById('price-max');
    const minDisp = document.getElementById('price-min-display');
    const maxDisp = document.getElementById('price-max-display');
    if (!minEl || !maxEl) return;

    function updateRange() {
        const min = parseInt(minEl.value) || 0;
        const max = parseInt(maxEl.value) || 100000;
        if (minDisp) minDisp.textContent = '₹' + min.toLocaleString('en-IN');
        if (maxDisp) maxDisp.textContent = '₹' + max.toLocaleString('en-IN');
        dealsState.priceMin = min;
        dealsState.priceMax = max;
        dealsState.page = 1;
        const container = document.getElementById('deals-grid');
        const pagination = document.getElementById('deals-pagination');
        if (container) renderDeals(container, pagination);
    }
    minEl.addEventListener('input', updateRange);
    maxEl.addEventListener('input', updateRange);
}

// ══════════════════════════════════════════
//  AUTO-INIT ON DEALS PAGE
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('deals-grid');
    if (!grid) return; // not on deals page

    const pagination = document.getElementById('deals-pagination');
    renderDeals(grid, pagination);
    initCategoryTabs();
    initSortSelect();
    initDealsSearch();
    initPriceRange();

    // URL param: ?cat=electronics
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('cat')) {
        const cat = urlParams.get('cat');
        setDealFilter('cat', cat);
        const tab = document.querySelector(`.cat-tab[data-cat="${cat}"]`);
        if (tab) {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }
    }
    if (urlParams.has('q')) {
        const q = urlParams.get('q');
        setDealFilter('query', q);
        const searchInput = document.getElementById('deals-search');
        if (searchInput) searchInput.value = q;
    }
});