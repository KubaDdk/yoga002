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