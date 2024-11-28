document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Validation and Submission
/*    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
           // const name = contactForm.querySelector('input[name="name"]');
            const email = contactForm.querySelector('input[name="email"]');
            const message = contactForm.querySelector('textarea[name="message"]');
            
            // Reset previous error states
            [ email, message].forEach(field => {
                field.classList.remove('error');
            });

            // Validation checks
            let isValid = true;
            
            // if (name.value.trim() === '') {
            //     name.classList.add('error');
            //     isValid = false;
            // }
            
            if (!/\S+@\S+\.\S+/.test(email.value)) {
                email.classList.add('error');
                isValid = false;
            }
            
            if (message.value.trim() === '') {
                message.classList.add('error');
                isValid = false;
            }

            // If form is valid, show success message
            if (isValid) {
                // In a real-world scenario, you'd typically send this to a backend
                alert('Message sent successfully! I will get back to you soon.');
                contactForm.reset();
            }
        });
    } */

    // Navbar Toggle for Mobile (optional, but good for responsiveness)
    const navbarToggle = document.createElement('button');
    navbarToggle.classList.add('navbar-toggle');
    navbarToggle.innerHTML = '☰';
    
    const navbar = document.querySelector('.navbar nav');
    if (navbar) {
        navbar.insertAdjacentElement('afterbegin', navbarToggle);
        
        navbarToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    // Dynamic Age Calculation (optional)
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Example usage - replace with actual birthdate
    const ageElement = document.createElement('span');
    ageElement.textContent = `${calculateAge('2006-01-01')} years old`;
    const tagline = document.querySelector('.tagline');
 //   if (tagline) {
 //       tagline.appendChild(ageElement);
  //  }

    // Scroll-triggered Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});

// Additional CSS for form validation
const styles = `
    .error {
        border: 2px solid red !important;
    }
    
    .navbar-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .navbar-toggle {
            display: block;
        }

        .navbar nav ul {
            display: none;
        }

        .navbar nav.active ul {
            display: flex;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);