// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll behavior
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

// Only apply scroll behavior on screens larger than 768px
window.addEventListener('scroll', () => {
    // Check if screen width is greater than 768px
    if (window.innerWidth > 768) {
        const currentScroll = window.pageYOffset;
        
        // Add background when scrolled down
        if (currentScroll > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down & past navbar
            navbar.classList.add('navbar--hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar--hidden');
        }
        
        lastScroll = currentScroll;
    } else {
        // Remove any scroll-related classes on mobile
        navbar.classList.remove('navbar--hidden');
        navbar.classList.remove('navbar--scrolled');
    }
});

// Update navbar classes when window is resized
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        navbar.classList.remove('navbar--hidden');
        navbar.classList.remove('navbar--scrolled');
    }
});