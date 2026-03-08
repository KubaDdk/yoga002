document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            if (window.innerWidth <= 768) {
                // Mobile view - account for navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Desktop view - normal scrolling
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('active');
        }
    });
});

// Navbar scroll behavior (desktop only)
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('navbar--hidden');
        } else {
            navbar.classList.remove('navbar--hidden');
        }
        
        lastScroll = currentScroll;
    } else {
        navbar.classList.remove('navbar--hidden');
        navbar.classList.remove('navbar--scrolled');
    }
});

// Load blog posts on the home page
async function loadBlogPosts() {
    try {
        // Only load posts if we're on the homepage and the blog grid exists
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        // Fetch the blog posts data
        const response = await fetch('blog-posts.json');
        const data = await response.json();
        
        // Sort posts by date (newest first)
        const sortedPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create HTML for each post
        const postsHTML = sortedPosts.map(post => {
            // Format the date
            const date = new Date(post.date).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <a href="blog/blog-post.html?id=${post.id}" class="blog-card">
                    <img src="${post.image}" alt="${post.title}">
                    <div class="blog-overlay"></div>
                    <div class="blog-content">
                        <span class="blog-date">${date}</span>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                    </div>
                </a>
            `;
        }).join('');
        
        // Insert the posts into the grid
        blogGrid.innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-grid').innerHTML = `
            <p>Sorry, we couldn't load the blog posts at this time.</p>
        `;
    }
}

// Load blog posts when the page loads
window.addEventListener('DOMContentLoaded', loadBlogPosts);

// Load classes for the reservation section
async function loadClasses() {
    const classCards = document.getElementById('class-cards');
    if (!classCards) return;

    try {
        const response = await fetch('classes.json');
        const data = await response.json();

        classCards.innerHTML = data.classes.map(cls => `
            <div class="class-card" data-id="${cls.id}" data-day="${cls.day}" data-time="${cls.time}" data-description="${cls.description}">
                <div class="class-card-header">
                    <span class="class-day">${cls.day}</span>
                    <span class="class-time">${cls.time}</span>
                </div>
                <p class="class-description">${cls.description}</p>
            </div>
        `).join('');

        document.querySelectorAll('.class-card').forEach(card => {
            card.addEventListener('click', () => selectClass(card));
        });

        const info = document.getElementById('selected-class-info');
        if (info && !info.textContent.trim()) {
            info.textContent = 'Wybierz zajęcia z listy po lewej stronie.';
        }
    } catch (error) {
        console.error('Błąd ładowania zajęć:', error);
        classCards.innerHTML = '<p>Nie udało się załadować listy zajęć.</p>';
    }
}

function selectClass(card) {
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const day = card.dataset.day;
    const time = card.dataset.time;
    const description = card.dataset.description;
    const id = card.dataset.id;

    document.getElementById('form-class-id').value = id;
    document.getElementById('form-class-day').value = day;
    document.getElementById('form-class-time').value = time;
    document.getElementById('form-class-desc').value = description;

    const info = document.getElementById('selected-class-info');
    info.textContent = `Wybrano: ${day} ${time} – ${description}`;
    info.classList.add('has-selection');
}

// Handle booking form submission
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const classId = document.getElementById('form-class-id').value;
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const classDay = document.getElementById('form-class-day').value;
        const classTime = document.getElementById('form-class-time').value;
        const classDescription = document.getElementById('form-class-desc').value;
        const messageEl = document.getElementById('form-message');
        const submitBtn = document.getElementById('submit-button');

        messageEl.textContent = '';
        messageEl.className = 'form-message';

        if (!classId) {
            messageEl.textContent = 'Proszę wybrać zajęcia z listy po lewej.';
            messageEl.classList.add('error');
            return;
        }
        if (!name) {
            messageEl.textContent = 'Proszę podać imię i nazwisko.';
            messageEl.classList.add('error');
            return;
        }
        if (!email) {
            messageEl.textContent = 'Proszę podać adres email.';
            messageEl.classList.add('error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Wysyłanie...';

        try {
            const res = await fetch('/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, classId, classDay, classTime, classDescription }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                messageEl.textContent = result.message || 'Rezerwacja potwierdzona! Sprawdź swoją skrzynkę email.';
                messageEl.classList.add('success');
                bookingForm.reset();
                document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
                const info = document.getElementById('selected-class-info');
                info.textContent = 'Wybierz zajęcia z listy po lewej stronie.';
                info.classList.remove('has-selection');
            } else {
                messageEl.textContent = result.error || 'Wystąpił błąd. Spróbuj ponownie.';
                messageEl.classList.add('error');
            }
        } catch (error) {
            console.error('Błąd rezerwacji:', error);
            messageEl.textContent = 'Nie udało się połączyć z serwerem. Spróbuj ponownie.';
            messageEl.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Zarezerwuj miejsce';
        }
    });
}

window.addEventListener('DOMContentLoaded', loadClasses);