// Mobile Menu Toggle - Version 2.0
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
let prevScrollpos = window.pageYOffset;
const navbar = document.querySelector('.navbar');

window.onscroll = function() {
    const currentScrollPos = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScrollPos > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    prevScrollpos = currentScrollPos;
};

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Animate stat numbers on scroll
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = element.dataset.prefix ? element.dataset.prefix + value + (element.dataset.suffix || '') : value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe stat items for animation
const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumber = entry.target.querySelector('.stat-number');
            const finalValue = statNumber.textContent;
            
            // Extract number from text
            let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
            let prefix = '';
            let suffix = '';
            
            // Handle different formats
            if (finalValue.includes('£')) {
                prefix = '£';
                suffix = finalValue.includes('B+') ? 'B+' : '';
            } else if (finalValue.includes('%')) {
                suffix = '%';
            } else if (finalValue.includes('+')) {
                suffix = '+';
            }
            
            statNumber.dataset.prefix = prefix;
            statNumber.dataset.suffix = suffix;
            
            animateValue(statNumber, 0, numericValue, 2000);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-item').forEach(item => {
    statObserver.observe(item);
});

// Add active state to current navigation item
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

const updateActiveNav = () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            const correspondingNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (correspondingNav) {
                correspondingNav.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();