// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all navigation links
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.hero-left, .hero-right, .skill-card, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Add hover effects to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero image
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `rotate(-5deg) translateY(${rate}px)`;
        }
    });

    // Add typing effect to name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const nameText = nameElement.textContent;
        nameElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < nameText.length) {
                nameElement.textContent += nameText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Add floating animation to circles
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.style.animation = `float ${2 + index * 0.5}s ease-in-out infinite`;
        circle.style.animationDelay = `${index * 0.2}s`;
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        .dot {
            animation: pulse 2s ease-in-out infinite;
        }
        
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .dot:nth-child(4) { animation-delay: 0.6s; }
        .dot:nth-child(5) { animation-delay: 0.8s; }
        .dot:nth-child(6) { animation-delay: 1s; }
        .dot:nth-child(7) { animation-delay: 1.2s; }
        .dot:nth-child(8) { animation-delay: 1.4s; }
        .dot:nth-child(9) { animation-delay: 1.6s; }
    `;
    document.head.appendChild(style);
});

// Contact Me function
function contactMe() {
    // Create a modal or redirect to contact form
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        ">
            <h2 style="margin-bottom: 20px; color: #333;">Contact Me</h2>
            <p style="margin-bottom: 30px; color: #666;">Let's work together to create amazing experiences!</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="window.open('mailto:markus@example.com')" style="
                    background: linear-gradient(135deg, #8B5CF6, #A855F7);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Send Email</button>
                <button onclick="window.open('https://linkedin.com/in/markus-raikkonen')" style="
                    background: white;
                    color: #8B5CF6;
                    border: 2px solid #8B5CF6;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">LinkedIn</button>
            </div>
            <button onclick="this.closest('div').parentElement.remove()" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Download CV function
function downloadCV() {
    // Create a simple CV download simulation
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Markus Räikkönen - Product Designer\n\nExperience:\n- 5+ years in product design\n- UX/UI specialist\n- User research expert\n\nSkills:\n- User Research\n- Visual Design\n- User Testing\n- Prototyping\n\nContact: markus@example.com';
    link.download = 'Markus_Raikkonen_CV.txt';
    link.click();
    
    // Show success message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #8B5CF6, #A855F7);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
    `;
    message.textContent = 'CV Downloaded Successfully!';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add scroll indicator
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(135deg, #8B5CF6, #A855F7);
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 0.1s ease;
            z-index: 10001;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.transform = `scaleX(${progress / 100})`;
});

// Add mobile menu toggle for smaller screens
function createMobileMenu() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768) {
        // Create mobile menu button
        const menuButton = document.createElement('button');
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #333;
            display: block;
        `;
        
        // Add toggle functionality
        menuButton.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
        
        // Add mobile styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .nav.mobile-open {
                    transform: translateY(0);
                    opacity: 1;
                }
                
                .nav-list {
                    flex-direction: column;
                    padding: 20px;
                    gap: 15px;
                }
                
                .nav-list a {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(mobileStyles);
        
        header.appendChild(menuButton);
    }
}

// Initialize mobile menu
window.addEventListener('resize', createMobileMenu);
createMobileMenu();
