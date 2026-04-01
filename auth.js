/* ============================================================
   NEON MONEYVERSE — REAL FIREBASE AUTH JS
   ============================================================ */

'use strict';

// 1. Import Firebase from the Web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// 2. Your Exact Firebase Keys
const firebaseConfig = {
    apiKey: "AIzaSyBNXh2aPjvZcWceDxCuMNzJegJ3RKwNsx0",
    authDomain: "neonmoney-a2d18.firebaseapp.com",
    projectId: "neonmoney-a2d18",
    storageBucket: "neonmoney-a2d18.firebasestorage.app",
    messagingSenderId: "759618988071",
    appId: "1:759618988071:web:312dda665f3efb76bc4602",
    measurementId: "G-9R99HC2B3V"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ── UPDATE NAV & PROTECT PAGES (Runs Automatically) ────────
onAuthStateChanged(auth, (user) => {
    const authLinks = document.getElementById('nav-auth-links');
    const userMenu = document.getElementById('nav-user-menu');
    const coinsNav = document.getElementById('nav-coins');
    const userName = document.getElementById('nav-user-name');
    const coinsVal = document.getElementById('nav-coins-val');

    if (user) {
        // User is logged in! Show dashboard stuff
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (coinsNav) coinsNav.style.display = 'flex';

        // Set Name (fallback to the first part of their email if no name is provided)
        if (userName) userName.textContent = user.displayName || user.email.split('@')[0];

        // Give them a starter balance for the UI since we just switched databases
        if (coinsVal) coinsVal.textContent = "100";
    } else {
        // User is logged out! Show login stuff
        if (authLinks) authLinks.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (coinsNav) coinsNav.style.display = 'none';

        // Protect Dashboard: Kick them out if they try to sneak in without logging in
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

// ── SIGNUP FORM ────────────────────────────────────────────
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page reload

        const name = signupForm.querySelector('#signup-name').value.trim();
        const email = signupForm.querySelector('#signup-email').value.trim();
        const password = signupForm.querySelector('#signup-password').value;
        const confirm = signupForm.querySelector('#signup-confirm').value;
        const btnEl = signupForm.querySelector('button[type=submit]');
        const errEl = document.getElementById('signup-error');

        if (errEl) errEl.style.display = 'none'; // Hide old errors

        // Check passwords
        if (password !== confirm) {
            if (errEl) { errEl.textContent = '❌ Passwords do not match.'; errEl.style.display = 'block'; }
            return;
        }
        if (password.length < 6) {
            if (errEl) { errEl.textContent = '❌ Password must be at least 6 characters.'; errEl.style.display = 'block'; }
            return;
        }

        // Change button text so they know it's working
        btnEl.disabled = true;
        btnEl.textContent = 'Creating account...';

        // Tell Firebase to create the user!
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Attach their name to their new account
                return updateProfile(userCredential.user, { displayName: name });
            })
            .then(() => {
                if (typeof showNotification === 'function') showNotification('🎉 Welcome! Account created.', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            })
            .catch((error) => {
                // If Firebase throws an error (like "email already in use")
                if (errEl) { errEl.textContent = '❌ ' + error.message; errEl.style.display = 'block'; }
                btnEl.disabled = false;
                btnEl.textContent = 'Sign Up Free';
            });
    });
}

// ── LOGIN FORM ─────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#login-email').value.trim();
        const password = loginForm.querySelector('#login-password').value;
        const btnEl = loginForm.querySelector('button[type=submit]');
        const errEl = document.getElementById('login-error');

        btnEl.disabled = true;
        btnEl.textContent = 'Signing in...';
        if (errEl) errEl.style.display = 'none';

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                if (errEl) { errEl.textContent = '❌ Invalid email or password.'; errEl.style.display = 'block'; }
                btnEl.disabled = false;
                btnEl.textContent = 'Sign In ->';
            });
    });
}

// ── GOOGLE LOGIN (Bonus Feature!) ───────────────────────────
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.innerHTML = '⏳ Connecting...';

        signInWithPopup(auth, provider)
            .then((result) => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error(error);
                btn.disabled = false;
                btn.innerHTML = 'Continue with Google';
            });
    });
});

// ── LOGOUT ─────────────────────────────────────────────────
document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error("Logout Error", error);
        });
    });
});