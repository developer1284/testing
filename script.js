document.addEventListener('DOMContentLoaded', () => {
    // PHILOSOPHY SECTION TABS
    const phItems = document.querySelectorAll('.ph-item');
    const phContents = document.querySelectorAll('.ph-content');

    phItems.forEach(item => {
        item.addEventListener('mouseenter', () => { // Hover to switch
            // Remove active from all items
            phItems.forEach(i => i.classList.remove('active'));
            // Remove active from all contents
            phContents.forEach(c => c.classList.remove('active'));

            // Add active to current item
            item.classList.add('active');

            // Find target content
            const targetId = item.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            // Add active to target content if exists
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Parallax background spheres
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const spheres = document.querySelectorAll('.bg-glow');

        spheres.forEach((sphere, index) => {
            const speed = (index + 1) * 0.15;
            const yPos = scrolled * speed;
            sphere.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes
    const animateElements = document.querySelectorAll('.vision-text, .vision-description, .power-box, .dashboard-preview');
    animateElements.forEach(el => {
        el.classList.add('fade-in-initial');
        observer.observe(el);
    });
});

// HERO VIDEO SAFETY
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented
                // We rely on the poster image in this case
                console.log('Video autoplay blocked, showing poster.');
            });
        }
    }

    // PARTNER MARQUEE LOGIC
    const partnersList = document.querySelector('.partners-list');
    if (partnersList) {
        // Clone for infinite scroll (x4 for safety on wide screens)
        const originalContent = partnersList.innerHTML;
        const wrapper = document.createElement('div');
        wrapper.className = 'marquee-track';

        // Add multiple copies to ensure seamless loop
        wrapper.innerHTML = originalContent + originalContent + originalContent + originalContent;

        // Clear and append wrapper
        partnersList.innerHTML = '';
        partnersList.appendChild(wrapper);

        // Add class to enable CSS overrides
        partnersList.classList.add('scrolling-enabled');
    }
});

// Add extra CSS for animations dynamically to keep CSS file cleaner
const style = document.createElement('style');
style.textContent = `
    .fade-in-initial {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Optional subtle hover glow
document.querySelectorAll('.footer-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.boxShadow = '0 0 40px rgba(140,82,254,0.6)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.boxShadow = 'none';
    });
});

// =========================================
// PREMIUM VISION ANIMATIONS
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. WORD-BY-WORD TYPING ANIMATION
    const headline = document.querySelector('.vision-text h2');
    if (headline) {
        // Prevent conflict with existing global fade
        headline.closest('.vision-text').classList.remove('fade-in-initial');

        // Prepare text
        const text = headline.innerHTML.replace(/<br\s*\/?>/gi, " <br> "); // Preserve line breaks
        const words = text.split(' '); // Split by spaces (handles <br> as separate "word" if spaced)

        headline.innerHTML = '';
        headline.classList.add('typing-cursor');
        headline.style.opacity = '1'; // Ensure visible

        // Intersection Observer to start typing when in view
        const typeObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let i = 0;
                // Recursive typing function
                function typeLoop() {
                    if (i < words.length) {
                        // Check if word is a break tag
                        if (words[i].includes('<br>')) {
                            headline.innerHTML += '<br>';
                        } else {
                            headline.innerHTML += (headline.innerHTML.endsWith('<br>') || headline.innerHTML === '' ? '' : ' ') + words[i];
                        }
                        i++;
                        setTimeout(typeLoop, 200 + Math.random() * 100); // Natural variation
                    }
                }
                setTimeout(typeLoop, 500); // Initial delay
                typeObserver.disconnect();
            }
        }, { threshold: 0.5 });

        typeObserver.observe(headline);
    }

    // 2. STAGGERED PARAGRAPHS
    const paragraphs = document.querySelectorAll('.vision-description p');
    const descContainer = document.querySelector('.vision-description');

    if (descContainer) descContainer.classList.remove('fade-in-initial'); // Clear old anim

    const paraObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                paraObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    paragraphs.forEach((p, index) => {
        p.classList.add('anim-fade-up');
        p.style.transitionDelay = `${index * 0.3}s`; // Stagger delay
        paraObserver.observe(p);
    });

    // 3. POWER BOX & BULLETS
    const powerBox = document.querySelector('.power-box');
    if (powerBox) {
        powerBox.classList.remove('fade-in-initial'); // Clear old anim

        const boxObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                powerBox.classList.add('reveal');

                // Animate bullets sequence
                const bullets = powerBox.querySelectorAll('.power-list li');
                bullets.forEach((li, idx) => {
                    setTimeout(() => {
                        li.classList.add('visible');
                    }, 600 + (idx * 200)); // Start after box reveals
                });

                boxObserver.disconnect();
            }
        }, { threshold: 0.15 });

        boxObserver.observe(powerBox);
    }
});

// =========================================
// HERO BALLS ANIMATION (GSAP)
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // Ensure GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Initial state
        gsap.set(".ball-light, .ball-dark", {
            scale: 0.5, // Start with non-zero scale to debug
            opacity: 0,
            transformOrigin: "center center"
        });

        // Ensure main ball is visible immediately
        gsap.set(".ball-main", { opacity: 1 });

        // Continuous rotation (Main Ball)
        gsap.to(".ball-main", {
            rotation: 360,
            repeat: -1,
            duration: 14,
            ease: "linear"
        });

        // Scroll Animation Timeline
        // Note: We target .section-hero as the trigger since .hero class might not exist identical to your request
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-hero",
                start: "top top",
                end: "bottom+=300 top",
                scrub: true
            }
        });

        // Balls emerge on scroll
        tl.to(".ball-light", {
            scale: 1,
            opacity: 1,
            x: -20,
            y: 20,
            duration: 1
        })
            .to(".ball-dark", {
                scale: 1,
                opacity: 1,
                x: 20,
                y: -20,
                duration: 1
            }, "-=0.8");

        // Cursor Interaction
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            gsap.to(".ball-wrapper", {
                x: x,
                y: y,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    }
});

// FIXED: Removed duplicate GSAP/ScrollTrigger block
// Reason: there was a duplicate GSAP initialization (with slightly different initial
// states and event listeners) which caused conflicting animation state and
// doubled event handlers. The earlier GSAP block (above) now handles all
// .ball-* animations, scrollTrigger timeline, and cursor interactions.


// =========================================
// PREMIUM SCROLL ANIMATIONS (REVERSIBLE)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const scrollObserverOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Reverse smoothly on scroll up
                entry.target.classList.remove('visible');
            }
        });
    }, scrollObserverOptions);

    // Target elements
    const scrollElements = document.querySelectorAll('.scroll-fade-up, .scroll-slide-left, .scroll-stagger-item');
    scrollElements.forEach(el => scrollObserver.observe(el));

    // =========================================
    // POV SCROLL STORYTELLING
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Elements
        const txtSEO = document.getElementById('pov-txt-seo');
        const txtAI = document.getElementById('pov-txt-ai');
        const txtRev = document.getElementById('pov-txt-rev');

        const imgSEO = document.getElementById('pov-img-seo');
        const imgAI = document.getElementById('pov-img-ai');
        const imgRev = document.getElementById('pov-img-rev');
        const imgWrapper = document.querySelector('.pov-image-wrapper');

        if (txtSEO && imgWrapper) {
            const povTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-pov-branding",
                    start: "top top", // Trigger when top of section hits top of viewport
                    end: "+=2500",    // Pin for 2500px of scroll distance
                    pin: true,        // PIN THE SECTION
                    scrub: 1,         // Smooth scrubbing
                    anticipatePin: 1  // Avoid jitter
                    // markers: true // Uncomment for debugging
                }
            });

            // PHASE 1: TRANSITION TO AI VISIBILITY
            povTl
                // Blur SEO, Focus AI
                .to(txtSEO, { className: "pov-text-blur", duration: 0.1 }, "phase1")
                .to(txtAI, { className: "pov-text-active", duration: 0.1 }, "phase1")
                // Crossfade Images
                .to(imgSEO, { opacity: 0, duration: 1 }, "phase1")
                .to(imgAI, { opacity: 1, duration: 1 }, "phase1")
                // Rotate Wrapper (3D)
                .to(imgWrapper, { rotationY: 180, duration: 2 }, "phase1")

                // PHASE 2: TRANSITION TO REVENUE
                // Blur AI, Focus Revenue
                .to(txtAI, { className: "pov-text-blur", duration: 0.1 }, "phase2")
                .to(txtRev, { className: "pov-text-active", duration: 0.1 }, "phase2")
                // Crossfade Images
                .to(imgAI, { opacity: 0, duration: 1 }, "phase2")
                .to(imgRev, { opacity: 1, duration: 1 }, "phase2")
                // Rotate Wrapper Further
                .to(imgWrapper, { rotationY: 360, duration: 2 }, "phase2");
        }
    }
});

// =========================================
// REVENUE SECTION BLUR EFFECT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const blurObserverOptions = {
        threshold: 0.5, // Trigger when 50% visible (center of viewport approx)
        rootMargin: "0px 0px -10% 0px"
    };

    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targets = entry.target.querySelectorAll('.blur-target-text');
            if (entry.isIntersecting) {
                // Remove blur (Focus)
                targets.forEach(t => t.classList.add('in-focus'));
            } else {
                // Add blur (Default state)
                targets.forEach(t => t.classList.remove('in-focus'));
            }
        });
    }, blurObserverOptions);

    const revenueHeader = document.querySelector('.revenue-header');
    if (revenueHeader) {
        blurObserver.observe(revenueHeader);
    }

    // =========================================
    // SERVICES PINNING & REVEAL
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const servicesSection = document.querySelector('.section-services');
        const serviceItems = document.querySelectorAll('.service-item');

        if (servicesSection && serviceItems.length > 0) {
            // Initial States
            gsap.set(serviceItems, {
                opacity: 0.5, // Start visible (blurred)
                filter: "blur(6px)", // User requirement: 6-8px blur
                scale: 0.95, // User requirement: scale ~0.95
                zIndex: 0,
                y: 0
            });

            // Content Initial States
            serviceItems.forEach(item => {
                const content = item.querySelectorAll('.service-text, .service-visual');
                gsap.set('.service-visual', { transformOrigin: "center center" });
                gsap.set(content, { y: 30, opacity: 0 }); // Prepare for reveal
            });

            const servicesTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-services",
                    start: "top top",
                    end: "+=3000",
                    pin: true,
                    scrub: 1, // Smooth scrub
                    anticipatePin: 1
                }
            });

            serviceItems.forEach((item, index) => {
                const content = item.querySelectorAll('.service-text, .service-visual');
                const label = `card_${index}`;
                servicesTl.addLabel(label);

                // 1. FOCUS (Come into view)
                servicesTl.to(item, {
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    zIndex: 10,
                    duration: 1,
                    ease: "power2.out"
                }, label);

                // 2. CONTENT REVEAL (Slightly after focus starts)
                servicesTl.to(content, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }, `${label}+=0.2`);

                // 3. HOLD (Reading time)
                servicesTl.to({}, { duration: 1.5 });

                // 4. RECEDE (Blur out - unless last item needs to stay? 

                if (index < serviceItems.length - 1) {
                    const nextLabel = `card_${index + 1}`; // Sync with next card arrival

                    servicesTl.to(item, {
                        filter: "blur(6px)",
                        scale: 0.95,
                        opacity: 0.5, // Keep visible in background
                        zIndex: 0,
                        duration: 1,
                        ease: "power2.inOut"
                    }, nextLabel); // Happens precisely when next card starts entering
                }
            });
        }
    }

    // =========================================
    // 10X METRIC ANIMATION (STRICT)
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const metricSection = document.querySelector('.metric-10x');
        const tenXText = document.querySelector('.ten-x');
        const metricDesc = document.querySelector('.metric-10x p');

        if (metricSection && tenXText && metricDesc) {
            // A. SPLIT TEXT (10X)
const chars10X = tenXText.innerText.split('');
tenXText.innerHTML = chars10X.map(char => `<span style="display:inline-block; transform:translateX(80px); transform-origin: left center;">${char}</span>`).join('');
const tenXSpans = tenXText.querySelectorAll('span');

tenXText.style.overflow = 'visible';
tenXText.style.display = 'inline-flex';
tenXText.style.verticalAlign = 'bottom';
tenXText.style.width = 'auto';


            // SAFETY FIX: Prevent clipping in Services section
            const servicesSection = document.querySelector('.section-services');
            const servicesTrack = document.querySelector('.services-track');
            if (servicesSection) servicesSection.style.overflow = "visible";
            if (servicesTrack) servicesTrack.style.overflow = "visible";

            // B. DECRYPT TEXT PREP
            const originalDescText = metricDesc.innerText;
            // PRESERVE SPACES using a custom split
            const charsDesc = originalDescText.split('');
            const randomChars = "01XA_/"; // Techy scramble pool

            // Build HTML with preserved layout
            let newHTML = '';
            charsDesc.forEach(char => {
                if (char === ' ') {
                    // Non-breaking space to prevent collapse
                    newHTML += '<span style="display:inline-block; white-space:pre">&nbsp;</span>';
                } else {
                    // Scrambled placeholder
                    newHTML += `<span style="display:inline-block">0</span>`;
                }
            });
            metricDesc.innerHTML = newHTML;

            const descSpans = metricDesc.querySelectorAll('span');

            // Set random chars initially for non-space
            descSpans.forEach((span, i) => {
                const char = charsDesc[i];
                if (char !== ' ') {
                    span.innerText = randomChars[Math.floor(Math.random() * randomChars.length)];
                }
            });

            // C. TIMELINE
            const tenXTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".metric-10x",
                    start: "top 70%",
                    end: "bottom 50%",
                    scrub: 1,
                }
            });

            // 1. 10X ENTRY (Slide Left, Staggered)
            tenXTl.to(tenXSpans, {
                x: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: "power2.out"
            });

            // 2. DECRYPT EFFECT (Scrubbed)
            // Progress object to control reveal index
            let decryptState = { index: 0 };

            tenXTl.to(decryptState, {
                index: charsDesc.length,
                duration: 4,
                ease: "none",
                onUpdate: () => {
                    const currentIndex = Math.floor(decryptState.index);

                    descSpans.forEach((span, i) => {
                        const targetChar = charsDesc[i];
                        if (targetChar === ' ') return; // Skip spaces

                        if (i < currentIndex) {
                            // REVEAL REAL CHAR
                            if (span.innerText !== targetChar) {
                                span.innerText = targetChar;
                                span.style.color = "inherit";
                            }
                        } else {
                            // REMAINDER SCRAMBLE (Light)
                            if (Math.random() > 0.9) {
                                span.innerText = randomChars[Math.floor(Math.random() * randomChars.length)];
                            }
                        }
                    });
                }
            }, "<+=0.5");

            // 3. X VIBRATION (Continuous, Separate Tween)
            const xSpan = tenXSpans[2];
            if (xSpan) {
                gsap.to(xSpan, {
                    x: "1",
                    y: "-=1",
                    rotation: 1.5,
                    duration: 0.1,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        }
    }
});

if (window.innerWidth <= 1024) {
    ScrollTrigger.getAll().forEach(st => {
        if (st.trigger?.classList?.contains('section-services')) {
            st.kill();
        }
    });
}
