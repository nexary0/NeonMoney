/* ============================================================
   NEON MONEYVERSE — ALERTS JS
   ============================================================ */

'use strict';

// 1. Your Live Deals Database (Edit these whenever you want!)
const PRICE_ALERTS = [
    { product: 'Sony WH-1000XM5', saving: 1491, days: 2, store: 'Flipkart', img: '🎧', urgency: 'high' },
    { product: 'Samsung 65" 4K TV', saving: 3000, hours: 4, store: 'Flipkart', img: '📺', urgency: 'critical' },
    { product: 'Apple AirPods Pro 2nd Gen', saving: 1400, days: 3, store: 'Amazon', img: '🎵', urgency: 'medium' },
    { product: 'Nike Air Max 270', saving: 996, days: 1, store: 'Flipkart', img: '👟', urgency: 'medium' },
];

// 2. Logic for rendering the alerts on a dedicated alerts page (if you build one)
function renderAlerts(container) {
    if (!container) return;
    container.innerHTML = PRICE_ALERTS.map(a => `
    <div class="alert-card glass-card animate-on-scroll ${a.urgency === 'critical' ? 'alert-pulse' : ''}">
      <div class="alert-card-inner">
        <div class="alert-icon">${a.img}</div>
        <div class="alert-info">
          <h4>${a.product}</h4>
          <p>
            ${a.urgency === 'critical' ? '🔴' : '⚠️'}
            You could save <strong style="color:var(--neon-green)">₹${a.saving.toLocaleString('en-IN')}</strong>
            on ${a.store}
            ${a.hours ? `— Deal expires in <strong style="color:var(--neon-orange)">${a.hours} hours!</strong>` : `if you wait ${a.days} day${a.days > 1 ? 's' : ''}`}
          </p>
        </div>
        <div class="alert-actions">
          <a href="deals.html" class="btn btn-primary btn-sm">View Deal</a>
          <button class="btn btn-secondary btn-sm" onclick="dismissAlert(this)">Dismiss</button>
        </div>
      </div>
    </div>`).join('');
}

window.dismissAlert = function (btn) {
    const card = btn.closest('.alert-card');
    card.style.opacity = '0'; card.style.transform = 'translateX(20px)';
    setTimeout(() => card.remove(), 300);
};

// 3. Render on an Alerts page (if it exists)
const alertsContainer = document.getElementById('alerts-container');
if (alertsContainer) renderAlerts(alertsContainer);

// 4. The 5-Second Auto-Rotating Logic for your Homepage!
const heroAlert = document.querySelector('.loss-alert-box');
if (heroAlert) {
    let i = 0;
    const rotate = () => {
        const a = PRICE_ALERTS[i % PRICE_ALERTS.length];
        heroAlert.querySelector('.alert-msg').innerHTML =
            `${a.urgency === 'critical' ? '🔴' : '⚠️'} <strong>${a.product}</strong> — Save ₹${a.saving.toLocaleString('en-IN')} on ${a.store}${a.hours ? ` in ${a.hours}h!` : ` if you wait ${a.days} day${a.days > 1 ? 's' : ''}`}`;
        i++;
    };
    rotate();
    setInterval(rotate, 5000); // 5000 milliseconds = 5 seconds
}
