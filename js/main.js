// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIZaSYA6P5Tj17Ek-pqypdv57Sr4ak_LGx7bL_M",
  authDomain: "artiklanding2.firebaseapp.com",
  projectId: "artiklanding2",
  storageBucket: "artiklanding2.firebasestorage.app",
  messagingSenderId: "706256254956",
  appId: "1:706256254956:web:7b442806cb9ddd0c1132c9",
  measurementId: "G-QL64V7QEBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    // Get all waitlist buttons
    const waitlistButtons = document.querySelectorAll('.join-waitlist');
    const modal = document.getElementById('waitlistModal');
    const closeBtn = document.querySelector('.close');
    const waitlistForm = document.getElementById('waitlistForm');
    
    // Navigation handling
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add active class to current section in navigation
    function setActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for header
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                const currentLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }
    
    // Handle navigation click events
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href
            const targetId = this.getAttribute('href');
            
            // Scroll to the target section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Check active section on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Check active section on page load
    setActiveNavLink();
    
    // Email validation regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    // Work email domain validation - common free email providers that should be avoided for work emails
    const personalEmailDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
        'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
        'gmx.com', 'live.com', 'me.com', 'inbox.com'
    ];
    
    // Open modal when clicking on any waitlist button
    waitlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });
    
    // Close modal when clicking on X
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Real-time email validation
    const workEmailInput = document.getElementById('workEmail');
    const emailError = document.createElement('div');
    emailError.className = 'error-message';
    workEmailInput.parentNode.appendChild(emailError);
    
    workEmailInput.addEventListener('blur', function() {
        validateEmail(this.value);
    });
    
    workEmailInput.addEventListener('input', function() {
        if (emailError.textContent) {
            validateEmail(this.value);
        }
    });
    
    function validateEmail(email) {
        if (!email) {
            emailError.textContent = '';
            return false;
        }
        
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        
        const domain = email.split('@')[1].toLowerCase();
        if (personalEmailDomains.includes(domain)) {
            emailError.textContent = 'Please use your work email address';
            return false;
        }
        
        emailError.textContent = '';
        return true;
    }
    
    // Handle form submission
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const workEmail = document.getElementById('workEmail').value;
        const marketingBudget = document.getElementById('marketingBudget').value;
        
        // Validate email before submission
        if (!validateEmail(workEmail)) {
            return; // Stop form submission if email is invalid
        }
        
        // Disable submit button and show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            // Add to Firestore
            const docRef = await addDoc(collection(db, "waitlist"), {
                name: name,
                workEmail: workEmail,
                marketingBudget: marketingBudget,
                timestamp: new Date()
            });
            
            console.log("Document written with ID: ", docRef.id);
            
            // Show success message
            waitlistForm.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for joining our waitlist!</h3>
                    <p>We'll keep you updated on our launch. Stay tuned!</p>
                </div>
            `;
            
            // Close modal after 3 seconds
            setTimeout(() => {
                modal.classList.remove('active');
                // Reset form after closing
                setTimeout(() => {
                    waitlistForm.reset();
                    waitlistForm.innerHTML = `
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your name" required>
                        </div>
                        <div class="form-group">
                            <label for="workEmail">Work Email</label>
                            <input type="email" id="workEmail" name="workEmail" placeholder="Your work email address" required>
                        </div>
                        <div class="form-group">
                            <label for="marketingBudget">Current Influencer Marketing Budget (Optional)</label>
                            <input type="text" id="marketingBudget" name="marketingBudget" placeholder="e.g. $5,000/month">
                        </div>
                        <button type="submit" class="submit-button">Join Waitlist</button>
                    `;
                    
                    // Re-add the email validation elements
                    const newWorkEmailInput = document.getElementById('workEmail');
                    const newEmailError = document.createElement('div');
                    newEmailError.className = 'error-message';
                    newWorkEmailInput.parentNode.appendChild(newEmailError);
                    
                    newWorkEmailInput.addEventListener('blur', function() {
                        validateEmail(this.value);
                    });
                    
                    newWorkEmailInput.addEventListener('input', function() {
                        if (newEmailError.textContent) {
                            validateEmail(this.value);
                        }
                    });
                }, 300);
            }, 3000);
        } catch (error) {
            console.error("Error adding document: ", error);
            submitButton.disabled = false;
            submitButton.textContent = 'Join Waitlist';
            alert('There was an error submitting your information. Please try again.');
        }
    });
    
    // Add scroll animation for sections
    const sections = document.querySelectorAll('section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Handle hash links on page load
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}); 