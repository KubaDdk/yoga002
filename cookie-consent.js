const GA_ID = 'G-VRX6WE3Z76';

function loadGoogleAnalytics() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
}

function initCookieConsent() {
    var consent = localStorage.getItem('cookieConsent');
    var banner = document.getElementById('cookie-banner');

    if (consent === 'accepted') {
        loadGoogleAnalytics();
    } else if (!consent) {
        banner.style.display = 'flex';

        document.getElementById('cookie-accept').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.display = 'none';
            loadGoogleAnalytics();
        });

        document.getElementById('cookie-reject').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'rejected');
            banner.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', initCookieConsent);
