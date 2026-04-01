// Give the worker access to Firebase
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Your exact Firebase keys
const firebaseConfig = {
    apiKey: "AIzaSyBNXh2aPjvZcWceDxCuMNzJegJ3RKwNsx0",
    authDomain: "neonmoney-a2d18.firebaseapp.com",
    projectId: "neonmoney-a2d18",
    storageBucket: "neonmoney-a2d18.firebasestorage.app",
    messagingSenderId: "759618988071",
    appId: "1:759618988071:web:b65d190a3a7ececabc4602"
};

// Initialize Firebase in the background
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Tell it what to do when a message arrives
messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});