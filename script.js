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

    // NAVBAR TOGGLE LOGIC
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
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
        threshold: 0.9,
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
                    scrub: 1,
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
                    xPercent: 3,
                    yPercent: -3,
                    rotation: 1.5,
                    duration: 0.1,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    overwrite: "auto"
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




// ===============================
// FOUR CARDS SCROLL STORYTELLING
// ===============================
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // 4. FOUR CARDS ANIMATION (Strict Bottom-Up + Beams)
    // ===================================
    const fourCardsSection = document.querySelector(".section-four-cards");
    const fourCardWrappers = document.querySelectorAll(".four-card-wrapper");

    if (fourCardsSection && fourCardWrappers.length > 0) {
        // Set Initial States Forcefully via GSAP to ensure consistency
        gsap.set(fourCardWrappers, {
            y: 120,
            opacity: 0,
            filter: "blur(12px)"
        });

        const cardBeams = document.querySelectorAll(".card-beam");
        gsap.set(cardBeams, {
            scaleY: 0,
            transformOrigin: "top center",
            opacity: 0
        });

        const fcTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-four-cards",
                start: "top top",
                end: "+=3000", /* 300vh scroll distance */
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        // Loop through each card/beam pair
        fourCardWrappers.forEach((wrapper, index) => {
            const beam = wrapper.querySelector(".card-beam");

            // 1. Card Enters from Bottom
            fcTl.to(wrapper, {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 2,
                ease: "power3.out"
            });

            // 2. Beam Grows Downward (After card settles)
            if (beam) {
                fcTl.to(beam, {
                    scaleY: 1,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }
        });

        // Final buffer to keep everything visible
        fcTl.to({}, { duration: 1 });

        // GLOBAL BEAM ANIMATION (Critical Continuity)
        // ===================================
        const globalBeam = document.querySelector(".global-beam");
        if (globalBeam) {
            // Grow continuously from start to finish + overlap
            fcTl.to(globalBeam, {
                scaleY: 1,
                ease: "none",
                duration: fcTl.totalDuration() || 5
            }, 0); // Start at 0 to grow while scrolling
        }
    }

    // Mobile: disable pin on small screens
    if (window.innerWidth <= 1024) {
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger?.classList?.contains('section-four-cards')) {
                st.kill();
            }
        });
    }
}



// POV SCROLL STORY SECTION
// ===============================
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const povSection = document.querySelector(".section-pov-scroll");
    if (povSection) {
        // Elements
        const card3d = document.querySelector(".pov-card-3d");
        const cardHeading = document.getElementById("card-heading");
        const navItems = document.querySelectorAll(".flow-item");

        // Data for stages
        const stages = [
            { id: "seo", title: "SEO Foundation" },
            { id: "ai", title: "AI Visibility" },
            { id: "rev", title: "Revenue Engine" }
        ];

        // Master Timeline
        const povTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-pov-scroll",
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth scrubbing
                pin: ".pov-content-wrapper", // Pin the content
                anticipatePin: 1
            }
        });

        // 1. Card Rotation (Total 3 full rotations = 1080 degrees over the scroll duration)
        povTl.to(card3d, {
            rotationY: 1080,
            ease: "none", // Linear rotation linked to scroll
            duration: 3
        });
        const stageData = [
            {
                nav: 0,
                title: "SEO Foundation",
                image: "images/dashboard.png",

                leftTitle: "Get Discovered →",
                leftText: "Across search engines and AI models",

                rightTitle: "Build Authority",
                rightText: "Rank consistently on Google and Bing",

                quote: `"Traffic is attention.<br>Authority converts it."`
            },
            {
                nav: 1,
                title: "AI Visibility",
                image: "/images/ai.png",

                leftTitle: "Be Referenced →",
                leftText: "Across ChatGPT, Claude & Gemini",

                rightTitle: "Get Recommended",
                rightText: "By LLMs, not just algorithms",

                quote: `"If AI mentions you — you win."`
            },
            {
                nav: 2,
                title: "Revenue Engine",
                image: "/images/revenue.png",

                leftTitle: "Drive Revenue →",
                leftText: "Turn visibility into pipeline",

                rightTitle: "Scale Growth",
                rightText: "Search as a Growth Service",

                quote: `"Visibility without revenue is noise."`
            }
        ];

        // Helper to set active stage
        function updateStage(index) {

            const data = stageData[index];
            if (!data) return;

            // ========================
            // NAV UPDATE
            // ========================
            navItems.forEach((item, i) => {
                const isActive = i === index;
                item.classList.toggle("active", isActive);

                gsap.to(item, {
                    filter: isActive ? "blur(0px)" : "blur(6px)",
                    opacity: isActive ? 1 : 0.4,
                    duration: 0.4,
                    overwrite: true
                });
            });

            const cardImg = document.getElementById("pov-card-img");
            const leftBox = document.querySelector(".pov-side-text.left");
            const rightBox = document.querySelector(".pov-side-text.right");

            // ========================
            // FADE OUT ALL CONTENT
            // ========================
            gsap.to(
                [cardHeading, cardImg, leftBox, rightBox],
                {
                    opacity: 0,
                    duration: 0.25,
                    onComplete: () => {

                        // ========================
                        // UPDATE CENTER CARD
                        // ========================
                        if (cardHeading) cardHeading.innerText = data.title;
                        if (cardImg) cardImg.src = data.image;

                        // ========================
                        // UPDATE LEFT SIDE
                        // ========================
                        if (leftBox) {
                            leftBox.querySelector("h3").innerText = data.leftTitle;
                            leftBox.querySelector(".subtext").innerText = data.leftText;
                        }

                        // ========================
                        // UPDATE RIGHT SIDE
                        // ========================
                        if (rightBox) {
                            rightBox.querySelector("h3").innerText = data.rightTitle;
                            rightBox.querySelector(".subtext").innerText = data.rightText;

                            const quoteEl = rightBox.querySelector(".pov-quote");
                            if (quoteEl) quoteEl.innerHTML = data.quote;
                        }

                        // ========================
                        // FADE BACK IN
                        // ========================
                        gsap.to(
                            [cardHeading, cardImg, leftBox, rightBox],
                            {
                                opacity: 1,
                                duration: 0.4,
                                ease: "power2.out"
                            }
                        );
                    }
                }
            );
        }



        // 2. Schedule Callbacks for Stage Changes
        // Timeline duration is 3. 
        // 0 -> Start (SEO)
        // 1 -> 33% (AI)
        // 2 -> 66% (Revenue)

        povTl.call(() => updateStage(0), null, 0);     // 0%
        povTl.call(() => updateStage(1), null, 0.95);  // ~32% (Just before 33%)
        povTl.call(() => updateStage(2), null, 1.95);  // ~65% (Just before 66%)
    }
}
// ===============================
// WORKFLOW SLIDER (6-STEP)
// ===============================
document.addEventListener('DOMContentLoaded', () => {

    const workflowSection = document.querySelector('.section-workflow');
    if (!workflowSection) return;

    const navPills = document.querySelectorAll('.nav-pill');
    const stepBadge = document.querySelector('.step-badge');
    const stepTitle = document.querySelector('.step-title');
    const stepDesc = document.querySelector('.step-desc');
    const workflowText = document.querySelector('.workflow-text');

    const dashMetrics = document.querySelectorAll('.dash-metric');
    const chartLine = document.querySelector('.chart-line');
    const gaugeProgress = document.querySelector('.gauge-progress');
    const gaugeScore = document.querySelector('.gauge-score');

    const stepsData = [
        {
            step: "01",
            title: "We identify your highest-value opportunities.",
            desc: "Deep dive into market gaps, competitor weaknesses, and high-intent keywords to build a data-backed roadmap.",
            metrics: ["400K", "2.1M", "3.2%", "12.4"],
            gauge: 80
        },
        {
            step: "02",
            title: "We architect a content strategy that wins.",
            desc: "Mapping topics to buyer journey stages. We plan clustered content that establishes topical authority instantly.",
            metrics: ["450K", "2.5M", "3.5%", "10.1"],
            gauge: 85
        },
        {
            step: "03",
            title: "We produce expert-led, AI-accelerated content.",
            desc: "Our hybrid engine combines AI speed with human editorial precision to create high-ranking assets at scale.",
            metrics: ["520K", "3.1M", "3.8%", "8.5"],
            gauge: 90
        },
        {
            step: "04",
            title: "We publish and optimize for maximum reach.",
            desc: "Technical SEO, schema markup, and internal linking automation ensure every piece is primed for indexing.",
            metrics: ["600K", "3.8M", "4.2%", "6.2"],
            gauge: 92
        },
        {
            step: "05",
            title: "We track what’s working and what’s not.",
            desc: "Every two weeks, we analyze your content performance and deliver detailed reports.",
            metrics: ["750K", "4.5M", "4.8%", "4.1"],
            gauge: 95
        },
        {
            step: "06",
            title: "We amplify winning content for exponential growth.",
            desc: "Doubling down on top performers and expanding into new topic clusters.",
            metrics: ["900K", "5.2M", "5.5%", "2.3"],
            gauge: 98
        }
    ];

    let currentStep = 0;
    let autoPlayInterval;
    const intervalTime = 4000;

    function updateStep(index) {

        const data = stepsData[index];

        // 1️⃣ Update Nav
        navPills.forEach(pill => pill.classList.remove('active'));
        navPills[index].classList.add('active');

        // 2️⃣ Animate Text Out
        workflowText.style.opacity = "0";
        workflowText.style.transform = "translateY(20px)";

        setTimeout(() => {

            stepBadge.innerText = `Step ${data.step}`;
            stepTitle.innerText = data.title;
            stepDesc.innerText = data.desc;

            workflowText.style.opacity = "1";
            workflowText.style.transform = "translateY(0)";

        }, 300);

        // 3️⃣ Update Dashboard Metrics Properly
        dashMetrics.forEach((metric, i) => {

            metric.classList.remove('active');

            const valSpan = metric.querySelector('.dm-value');
            if (valSpan) {
                valSpan.innerText = data.metrics[i];
            }

            // Highlight one metric per step
            if (i === index % dashMetrics.length) {
                metric.classList.add('active');
            }
        });

        // 4️⃣ Restart Chart Animation
        if (chartLine) {
            chartLine.style.animation = 'none';
            chartLine.offsetHeight; // reflow
            chartLine.style.animation = 'drawChart 2s ease forwards';
        }

        // 5️⃣ Gauge Update
        if (gaugeProgress && gaugeScore) {
            const maxDash = 126; // circumference
            const offset = maxDash - (data.gauge / 100 * maxDash);

            gaugeProgress.style.strokeDashoffset = offset;

            animateValue(gaugeScore, parseInt(gaugeScore.innerText) || 0, data.gauge, 800);
        }

        currentStep = index;
    }

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function nextStep() {
        let next = currentStep + 1;
        if (next >= stepsData.length) next = 0;
        updateStep(next);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextStep, intervalTime);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Click Support
    navPills.forEach((pill, index) => {
        pill.addEventListener('click', () => {
            stopAutoPlay();
            updateStep(index);
        });
    });

    // Pause on hover
    const card = document.querySelector('.workflow-card');
    if (card) {
        card.addEventListener('mouseenter', stopAutoPlay);
        card.addEventListener('mouseleave', startAutoPlay);
    }

    // INIT
    updateStep(0);
    startAutoPlay();

});

// ===============================
// WINNING SEARCH ANIMATIONS
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the 'scroll-slide-up' class
    const winCards = document.querySelectorAll('.scroll-slide-up');

    if (winCards.length === 0) return;

    const observerOptions = {
        threshold: 0.1,  // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Slight offset
    };

    const winObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the delay class if present (delay-1, delay-2, etc.)
                let delay = 0;
                entry.target.classList.forEach(cls => {
                    if (cls.startsWith('delay-')) {
                        const num = parseInt(cls.split('-')[1]);
                        if (!isNaN(num)) delay = num * 100; // 100ms multiplier
                    }
                });

                // Apply animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                winObserver.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    winCards.forEach(card => {
        winObserver.observe(card);
    });
});

// =========================================
// PRE-FOOTER CTA ANIMATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const saObserverOptions = {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: '0px'
    };

    const saObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sa-visible');
                saObserver.unobserve(entry.target); // Animates once
            }
        });
    }, saObserverOptions);

    const saElements = document.querySelectorAll('.sa-anim-fade-up');
    saElements.forEach(el => saObserver.observe(el));
});





document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".section-insights");
    if (!section) return;

    const tabs = document.querySelectorAll(".insight-tab");
    const leftContent = document.querySelector(".insights-content");
    const rightCard = document.querySelector(".insights-card");
    const bgImages = document.querySelectorAll(".insight-bg");

    /* =========================
       PART 1 – SCROLL REVEAL
    ========================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add("sa-visible");
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(section);

    /* =========================
       PART 2 – TAB DATA
    ========================== */

    const contentData = [
        {
            title: "Understand brand visibility",
            text: "See where your brands are mentioned in Answer Engines"
        },
        {
            title: "Track Prompt Volumes",
            text: "Monitor frequency of prompts related to your domain"
        },
        {
            title: "Measure Agent Performance",
            text: "Compare performance across AI agents and assistants"
        },
        {
            title: "Optimize for AI Agents",
            text: "Customize strategy for specific AI personalities"
        }
    ];

    let current = 0;
    let interval;

    function switchTab(index) {

        if (!tabs[index]) return;

        // Remove active from tabs
        tabs.forEach(tab => tab.classList.remove("active"));
        tabs[index].classList.add("active");

        // Fade out content
        leftContent.classList.add("fade-out");
        rightCard.classList.add("fade-out");

        setTimeout(() => {

            // Update left text
            const h2 = leftContent.querySelector("h2");
            const p = leftContent.querySelector("p");

            if (h2) h2.textContent = contentData[index].title;
            if (p) p.textContent = contentData[index].text;

            // Update background image
            if (bgImages.length > 0) {
                bgImages.forEach(bg => bg.classList.remove("active"));
                if (bgImages[index]) {
                    bgImages[index].classList.add("active");
                }
            }

            // Fade back in
            leftContent.classList.remove("fade-out");
            rightCard.classList.remove("fade-out");

        }, 500);

        current = index;
    }

    /* =========================
       AUTO PLAY
    ========================== */

    function startAutoPlay() {
        interval = setInterval(() => {
            let next = current + 1;
            if (next >= tabs.length) next = 0;
            switchTab(next);
        }, 4000);
    }

    function resetAutoPlay() {
        clearInterval(interval);
        startAutoPlay();
    }

    /* =========================
       TAB CLICK SUPPORT
    ========================== */

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            switchTab(index);
            resetAutoPlay();
        });
    });

    /* =========================
       START
    ========================== */

    switchTab(0);
    startAutoPlay();

    /* =========================
       PART 3 – ENERGY BEAM
    ========================== */

    if (!document.querySelector(".insights-energy-beam")) {
        const beam = document.createElement("div");
        beam.classList.add("insights-energy-beam");
        section.appendChild(beam);
    }

});

// Cursor Glow
const glow = document.createElement("div");
glow.classList.add("cursor-glow");
document.body.appendChild(glow);

document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});
