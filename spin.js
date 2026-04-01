/* ============================================================
   NEON MONEYVERSE — SPIN WHEEL JS
   ============================================================ */

'use strict';

const SEGMENTS = [
    { label: '10', coins: 10, color: '#1E293B', glow: '#3B82F6' },
    { label: '25', coins: 25, color: '#0F172A', glow: '#7C3AED' },
    { label: '5', coins: 5, color: '#1E293B', glow: '#94A3B8' },
    { label: '50', coins: 50, color: '#0F172A', glow: '#00FFB2' },
    { label: '15', coins: 15, color: '#1E293B', glow: '#3B82F6' },
    { label: '100', coins: 100, color: '#0F172A', glow: '#FBBF24' },
    { label: '30', coins: 30, color: '#1E293B', glow: '#7C3AED' },
    { label: '20', coins: 20, color: '#0F172A', glow: '#00FFB2' },
];

function buildSpinWheel(svgEl) {
    if (!svgEl) return;
    const cx = 110, cy = 110, r = 105;
    const n = SEGMENTS.length;
    const angle = (2 * Math.PI) / n;

    svgEl.innerHTML = '';

    // Outer glow circle
    const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glowCircle.setAttribute('cx', cx); glowCircle.setAttribute('cy', cy); glowCircle.setAttribute('r', r + 4);
    glowCircle.setAttribute('fill', 'none'); glowCircle.setAttribute('stroke', 'rgba(0,255,178,0.15)');
    glowCircle.setAttribute('stroke-width', '8');
    svgEl.appendChild(glowCircle);

    SEGMENTS.forEach((seg, i) => {
        const startAngle = i * angle - Math.PI / 2;
        const endAngle = startAngle + angle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        // Segment path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`);
        path.setAttribute('fill', seg.color);
        path.setAttribute('stroke', seg.glow);
        path.setAttribute('stroke-width', '1.5');
        svgEl.appendChild(path);

        // Label
        const midAngle = startAngle + angle / 2;
        const labelR = r * 0.65;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', lx); text.setAttribute('y', ly);
        text.setAttribute('text-anchor', 'middle'); text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', seg.glow);
        text.setAttribute('font-family', 'Orbitron, monospace');
        text.setAttribute('font-size', seg.coins === 100 ? '12' : '13');
        text.setAttribute('font-weight', '700');
        text.textContent = seg.label;
        svgEl.appendChild(text);

        // Coin icon
        const coinText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const iconR = r * 0.88;
        coinText.setAttribute('x', cx + iconR * Math.cos(midAngle));
        coinText.setAttribute('y', cy + iconR * Math.sin(midAngle));
        coinText.setAttribute('text-anchor', 'middle'); coinText.setAttribute('dominant-baseline', 'central');
        coinText.setAttribute('font-size', '8');
        coinText.textContent = '💰';
        svgEl.appendChild(coinText);
    });

    // Center circle
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('cx', cx); center.setAttribute('cy', cy); center.setAttribute('r', '22');
    center.setAttribute('fill', '#0A0A0F'); center.setAttribute('stroke', 'rgba(0,255,178,0.4)');
    center.setAttribute('stroke-width', '2');
    svgEl.appendChild(center);

    const centerTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerTxt.setAttribute('x', cx); centerTxt.setAttribute('y', cy);
    centerTxt.setAttribute('text-anchor', 'middle'); centerTxt.setAttribute('dominant-baseline', 'central');
    centerTxt.setAttribute('font-size', '14'); centerTxt.textContent = '💸';
    svgEl.appendChild(centerTxt);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('spin-wheel-svg');
    buildSpinWheel(svg);

    const spinBtn = document.getElementById('spin-btn-main');
    if (!spinBtn || !svg) return;

    let totalRotation = 0;
    let canSpin = true;

    // Check if already spun today
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpin === today) {
        canSpin = false;
        spinBtn.disabled = true;
        spinBtn.textContent = '🔒 Come back tomorrow!';
        const timer = document.getElementById('spin-timer');
        if (timer) timer.textContent = 'Next spin available tomorrow';
    }

    spinBtn.addEventListener('click', () => {
        if (!canSpin) return;
        canSpin = false;
        spinBtn.disabled = true;
        spinBtn.textContent = 'Spinning... 🌀';

        const idx = Math.floor(Math.random() * SEGMENTS.length);
        const segAngle = 360 / SEGMENTS.length;
        // This calculates the exact center of the winning slice
        const stopAngle = 360 - (idx * segAngle) - (segAngle / 2);
        const targetAngle = (360 * 5) + stopAngle; // 5 full spins + landing spot
        totalRotation += targetAngle;

        svg.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        svg.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            const won = SEGMENTS[idx];
            spinBtn.textContent = `🎉 Won ${won.coins} Coins!`;
            const timer = document.getElementById('spin-timer');
            if (timer) timer.textContent = 'Next spin: Tomorrow';
            localStorage.setItem('lastSpinDate', today);

            // Trigger celebration
            if (typeof showNotification === 'function') {
                showNotification(`🎉 Amazing! You won ${won.coins} coins!`, 'success');
            }

            // 1. Get current saved coins (or start at 0)
            let savedCoins = parseInt(localStorage.getItem('neon_coins')) || 0;

            // 2. Add the newly won coins
            let newTotal = savedCoins + won.coins;

            // 3. Save the new total back to the browser's memory
            localStorage.setItem('neon_coins', newTotal);

            // 4. Update the visual numbers on the screen instantly
            const navCoinDisplay = document.getElementById('nav-coins-val');
            const dashCoinDisplay = document.getElementById('user-coin-balance');
            if (navCoinDisplay) navCoinDisplay.textContent = newTotal.toLocaleString('en-IN');
            if (dashCoinDisplay) dashCoinDisplay.textContent = newTotal.toLocaleString('en-IN');
        }, 4200);
    });
});