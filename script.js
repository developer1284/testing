// =========================================
// GLOBAL GSAP REGISTRATION
// =========================================
// GSAP REGISTRATION MOVED TO DOMContentLoaded FOR SAFETY

document.addEventListener("DOMContentLoaded", () => {
    // ===== GSAP SAFE INIT (PRODUCTION SAFE) =====
    if (typeof gsap === "undefined") {
        console.warn("GSAP not loaded. Stopping animation execution.");
        return;
    }

    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* =========================================
       1. PHILOSOPHY SECTION TABS
       ========================================= */
    {
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
    }

    /* =========================================
       2. PARALLAX BACKGROUND SPHERES
       ========================================= */
    {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const spheres = document.querySelectorAll('.bg-glow');

            spheres.forEach((sphere, index) => {
                const speed = (index + 1) * 0.15;
                const yPos = scrolled * speed;
                sphere.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    /* =========================================
       3. FADE-IN ANIMATIONS
       ========================================= */
    {
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
    }

    /* =========================================
       4. NAVBAR TOGGLE LOGIC
       ========================================= */
    {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    /* =========================================
       5. HERO VIDEO SAFETY
       ========================================= */
    {
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Auto-play was prevented
                    console.log('Video autoplay blocked, showing poster.');
                });
            }
        }
    }

    /* =========================================
       6. PARTNER MARQUEE LOGIC
       ========================================= */
    {
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
    }

    /* =========================================
       7. DYNAMIC STYLES
       ========================================= */
    {
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
    }

    /* =========================================
       8. FOOTER BUTTON HOVER
       ========================================= */
    {
        document.querySelectorAll('.footer-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.boxShadow = '0 0 40px rgba(140,82,254,0.6)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.boxShadow = 'none';
            });
        });
    }

    /* =========================================
       9. PREMIUM VISION ANIMATIONS
       ========================================= */
    {
        // WORD-BY-WORD TYPING ANIMATION
        const headline = document.querySelector('.vision-text h2');
        if (headline) {
            headline.closest('.vision-text').classList.remove('fade-in-initial');
            const text = headline.innerHTML.replace(/<br\s*\/?>/gi, " <br> ");
            const words = text.split(' ');

            headline.innerHTML = '';
            headline.classList.add('typing-cursor');
            headline.style.opacity = '1';

            const typeObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    let i = 0;
                    function typeLoop() {
                        if (i < words.length) {
                            if (words[i].includes('<br>')) {
                                headline.innerHTML += '<br>';
                            } else {
                                headline.innerHTML += (headline.innerHTML.endsWith('<br>') || headline.innerHTML === '' ? '' : ' ') + words[i];
                            }
                            i++;
                            setTimeout(typeLoop, 200 + Math.random() * 100);
                        }
                    }
                    setTimeout(typeLoop, 500);
                    typeObserver.disconnect();
                }
            }, { threshold: 0.5 });

            typeObserver.observe(headline);
        }

        // STAGGERED PARAGRAPHS
        const paragraphs = document.querySelectorAll('.vision-description p');
        const descContainer = document.querySelector('.vision-description');

        if (descContainer) descContainer.classList.remove('fade-in-initial');

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
            p.style.transitionDelay = `${index * 0.3}s`;
            paraObserver.observe(p);
        });

        // POWER BOX & BULLETS
        const powerBox = document.querySelector('.power-box');
        if (powerBox) {
            powerBox.classList.remove('fade-in-initial');

            const boxObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    powerBox.classList.add('reveal');
                    const bullets = powerBox.querySelectorAll('.power-list li');
                    bullets.forEach((li, idx) => {
                        setTimeout(() => {
                            li.classList.add('visible');
                        }, 600 + (idx * 200));
                    });
                    boxObserver.disconnect();
                }
            }, { threshold: 0.15 });

            boxObserver.observe(powerBox);
        }
    }

    /* =========================================
       10. HERO BALLS ANIMATION (GSAP)
       ========================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        {
            gsap.set(".ball-light, .ball-dark", {
                scale: 0.5,
                opacity: 0,
                transformOrigin: "center center"
            });
            gsap.set(".ball-main", { opacity: 1 });

            gsap.to(".ball-main", {
                rotation: 360,
                repeat: -1,
                duration: 14,
                ease: "linear"
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-hero",
                    start: "top top",
                    end: "bottom+=300 top",
                    scrub: true
                }
            });

            tl.to(".ball-light", {
                scale: 1, opacity: 1, x: -20, y: 20, duration: 1
            })
                .to(".ball-dark", {
                    scale: 1, opacity: 1, x: 20, y: -20, duration: 1
                }, "-=0.8");

            document.addEventListener("mousemove", (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                gsap.to(".ball-wrapper", {
                    x: x, y: y, duration: 0.4, ease: "power2.out"
                });
            });
        }
    }

    /* =========================================
       11. PREMIUM SCROLL ANIMATIONS (REVERSIBLE)
       ========================================= */
    {
        const scrollObserverOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, scrollObserverOptions);

        const scrollElements = document.querySelectorAll('.scroll-fade-up, .scroll-slide-left, .scroll-stagger-item');
        scrollElements.forEach(el => scrollObserver.observe(el));
    }

    /* =========================================
       12. POV SCROLL STORYTELLING
       ========================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        {
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
                        start: "top top",
                        end: "+=2500",
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1
                    }
                });

                povTl
                    .to(txtSEO, { className: "pov-text-blur", duration: 0.1 }, "phase1")
                    .to(txtAI, { className: "pov-text-active", duration: 0.1 }, "phase1")
                    .to(imgSEO, { opacity: 0, duration: 1 }, "phase1")
                    .to(imgAI, { opacity: 1, duration: 1 }, "phase1")
                    .to(imgWrapper, { rotationY: 180, duration: 2 }, "phase1")
                    .to(txtAI, { className: "pov-text-blur", duration: 0.1 }, "phase2")
                    .to(txtRev, { className: "pov-text-active", duration: 0.1 }, "phase2")
                    .to(imgAI, { opacity: 0, duration: 1 }, "phase2")
                    .to(imgRev, { opacity: 1, duration: 1 }, "phase2")
                    .to(imgWrapper, { rotationY: 360, duration: 2 }, "phase2");
            }
        }
    }

    /* =========================================
       13. REVENUE SECTION BLUR EFFECT
       ========================================= */
    {
        const blurObserverOptions = {
            threshold: 0.9,
            rootMargin: "0px 0px -10% 0px"
        };

        const blurObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targets = entry.target.querySelectorAll('.blur-target-text');
                if (entry.isIntersecting) {
                    targets.forEach(t => t.classList.add('in-focus'));
                } else {
                    targets.forEach(t => t.classList.remove('in-focus'));
                }
            });
        }, blurObserverOptions);

        const revenueHeader = document.querySelector('.revenue-header');
        if (revenueHeader) {
            blurObserver.observe(revenueHeader);
        }
    }

    /* =========================================
       14. SERVICES ANIMATION
       ========================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        {
            const servicesSection = document.querySelector('.section-services');
            const serviceItems = document.querySelectorAll('.service-item');

            if (servicesSection && serviceItems.length > 0) {
                gsap.set(serviceItems, {
                    opacity: 0.5,
                    filter: "blur(6px)",
                    scale: 0.95,
                    zIndex: 0,
                    y: 0
                });

                serviceItems.forEach(item => {
                    const content = item.querySelectorAll('.service-text, .service-visual');
                    gsap.set('.service-visual', { transformOrigin: "center center" });
                    gsap.set(content, { y: 30, opacity: 0 });
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

                    servicesTl.to(item, {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        zIndex: 10,
                        duration: 1,
                        ease: "power2.out"
                    }, label);

                    servicesTl.to(content, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out"
                    }, `${label}+=0.2`);

                    servicesTl.to({}, { duration: 1.5 });

                    if (index < serviceItems.length - 1) {
                        const nextLabel = `card_${index + 1}`;
                        servicesTl.to(item, {
                            filter: "blur(6px)",
                            scale: 0.95,
                            opacity: 0.5,
                            zIndex: 0,
                            duration: 1,
                            ease: "power2.inOut"
                        }, nextLabel);
                    }
                });
            }
        }
    }

    /* =========================================
       15. 10X METRIC ANIMATION (STRICT)
       ========================================= */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        {
            const metricSection = document.querySelector('.metric-10x');
            const tenXText = document.querySelector('.ten-x');
            const metricDesc = document.querySelector('.metric-10x p');

            if (metricSection && tenXText && metricDesc) {
                const chars10X = tenXText.innerText.split('');
                tenXText.innerHTML = chars10X.map(char => `<span style="display:inline-block; transform:translateX(80px); transform-origin: left center;">${char}</span>`).join('');
                const tenXSpans = tenXText.querySelectorAll('span');

                tenXText.style.overflow = 'visible';
                tenXText.style.display = 'inline-flex';
                tenXText.style.verticalAlign = 'bottom';
                tenXText.style.width = 'auto';

                const servicesSection = document.querySelector('.section-services');
                const servicesTrack = document.querySelector('.services-track');
                if (servicesSection) servicesSection.style.overflow = "visible";
                if (servicesTrack) servicesTrack.style.overflow = "visible";

                // UNCOMMENTED PREVIOUS SECTION TO FIX EXECUTION ERROR
                const originalDescText = metricDesc.innerText;
                const charsDesc = originalDescText.split('');
                const randomChars = "01XA_/";

                let newHTML = '';
                charsDesc.forEach(char => {
                    if (char === ' ') {
                        newHTML += '<span style="display:inline-block; white-space:pre">&nbsp;</span>';
                    } else {
                        newHTML += `<span style="display:inline-block">0</span>`;
                    }
                });
                metricDesc.innerHTML = newHTML;

                const descSpans = metricDesc.querySelectorAll('span');

                descSpans.forEach((span, i) => {
                    const char = charsDesc[i];
                    if (char !== ' ') {
                        span.innerText = randomChars[Math.floor(Math.random() * randomChars.length)];
                    }
                });

                const tenXTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".metric-10x",
                        start: "top 70%",
                        end: "bottom 50%",
                        scrub: 1,
                    }
                });

                tenXTl.to(tenXSpans, {
                    x: 0,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power2.out"
                });

                let decryptState = { index: 0 };
                // RE-ENABLED DECRYPT LOGIC
                if (charsDesc && descSpans.length > 0) {
                    tenXTl.to(decryptState, {
                        index: charsDesc.length,
                        duration: 4,
                        ease: "none",
                        onUpdate: () => {
                            const currentIndex = Math.floor(decryptState.index);
                            descSpans.forEach((span, i) => {
                                const targetChar = charsDesc[i];
                                if (targetChar === ' ') return;
                                if (i < currentIndex) {
                                    if (span.innerText !== targetChar) {
                                        span.innerText = targetChar;
                                        span.style.color = "inherit";
                                    }
                                } else {
                                    if (Math.random() > 0.9) {
                                        span.innerText = randomChars[Math.floor(Math.random() * randomChars.length)];
                                    }
                                }
                            });
                        }
                    }, "<+=0.5");
                }


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
    }

    /* =========================================
       16. MOBILE SERVICES ANIMATION KILL
       ========================================= */
    {
        if (typeof ScrollTrigger !== 'undefined' && window.innerWidth <= 1024) {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger?.classList?.contains('section-services')) {
                    st.kill();
                }
            });
        }
    }

    /* =========================================
       17. FOUR CARDS SCROLL STORYTELLING
       ========================================= */
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        {
            const fourCardsSection = document.querySelector(".section-four-cards");
            const fourCardWrappers = document.querySelectorAll(".four-card-wrapper");

            if (fourCardsSection && fourCardWrappers.length > 0) {
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
                        end: "+=3000",
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1
                    }
                });

                // HEADER ROTATION (AUTO INTERVAL)
                const rotatingWords = document.querySelectorAll(".rotating-word");
                if (rotatingWords.length > 0) {
                    gsap.set(rotatingWords, { opacity: 0, y: 40 });
                    gsap.set(rotatingWords[0], { opacity: 1, y: 0 });

                    let currentIndex = 0;
                    setInterval(() => {
                        const nextIndex = (currentIndex + 1) % rotatingWords.length;
                        const currentWord = rotatingWords[currentIndex];
                        const nextWord = rotatingWords[nextIndex];
                        const tl = gsap.timeline();

                        tl.to(currentWord, {
                            y: -40, opacity: 0, duration: 0.6, ease: "power2.in",
                        }, 0);

                        tl.fromTo(nextWord,
                            { y: 40, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                            "-=0.2"
                        );
                        currentIndex = nextIndex;
                    }, 2500);
                }

                // BEAM BRANCHING LOGIC
                const beamBranches = document.querySelectorAll(".beam-branch");
                const globalBeam = document.querySelector(".global-beam");
                const fourContainer = document.querySelector(".four-cards-container");

                function updateBeamPaths() {
                    if (!globalBeam || !fourContainer || beamBranches.length === 0) return;
                    const containerRect = fourContainer.getBoundingClientRect();
                    const beamRect = globalBeam.getBoundingClientRect();
                    const sourceX = beamRect.left + beamRect.width / 2 - containerRect.left;
                    const sourceY = 0;

                    fourCardWrappers.forEach((wrapper, index) => {
                        const branch = beamBranches[index];
                        if (!branch) return;
                        const cardRect = wrapper.querySelector('.four-card')?.getBoundingClientRect();
                        if (!cardRect) return;
                        const targetX = cardRect.left + cardRect.width / 2 - containerRect.left;
                        const targetY = cardRect.top + cardRect.height / 2 - containerRect.top;
                        const midY = sourceY + (targetY - sourceY) * 0.6;
                        const pathData = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${sourceX} ${targetY}, ${targetX} ${targetY}`;
                        branch.setAttribute("d", pathData);
                        const length = branch.getTotalLength();
                        branch.style.strokeDasharray = length;
                        branch.style.strokeDashoffset = length;
                    });
                }
                updateBeamPaths();
                window.addEventListener("resize", updateBeamPaths);

                fourCardWrappers.forEach((wrapper, index) => {
                    const beam = wrapper.querySelector(".card-beam");
                    fcTl.to(wrapper, {
                        y: 0, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power3.out"
                    });
                    const branchPath = document.querySelectorAll(".beam-branch")[index];
                    if (branchPath) {
                        fcTl.to(branchPath, {
                            strokeDashoffset: 0, duration: 1.2, ease: "power2.out"
                        }, "<");
                    }
                    if (beam) {
                        fcTl.to(beam, {
                            scaleY: 1, opacity: 1, duration: 1.5, ease: "power2.out"
                        });
                    }
                });

                fcTl.to({}, { duration: 1 });

                if (globalBeam) {
                    fcTl.to(globalBeam, {
                        scaleY: 1, ease: "none", duration: fcTl.totalDuration() || 5
                    }, 0);
                }
            }

            if (window.innerWidth <= 1024) {
                ScrollTrigger.getAll().forEach(st => {
                    if (st.trigger?.classList?.contains('section-four-cards')) {
                        st.kill();
                    }
                });
            }
        }
    }

    /* =========================================
       18. POV SCROLL STORY SECTION (BLOCK B)
       ========================================= */
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        {
            const povSection = document.querySelector(".section-pov-scroll");
            if (povSection) {
                const card3d = document.querySelector(".pov-card-3d");
                const cardHeading = document.getElementById("card-heading");
                const navItems = document.querySelectorAll(".flow-item");

                const stages = [
                    { id: "seo", title: "SEO Foundation" },
                    { id: "ai", title: "AI Visibility" },
                    { id: "rev", title: "Revenue Engine" }
                ];

                const povTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".section-pov-scroll",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                        pin: ".pov-content-wrapper",
                        anticipatePin: 1
                    }
                });

                povTl.to(card3d, {
                    rotationY: 1080,
                    ease: "none",
                    duration: 3
                });

                const stageData = [
                    {
                        nav: 0,
                        title: "SEO Foundation",
                        image: "images/pov/seo.png",
                        leftTitle: "Drive Revenue →",
                        leftText: "Turn visibility into pipeline",
                        rightTitle: "Scale Growth",
                        rightText: "Search as a Growth Service",
                        quote: `"Visibility without revenue is noise."`
                    },
                    {
                        nav: 1,
                        title: "AI Visibility",
                        image: "images/pov/ai.png",
                        leftTitle: "Own the Future →",
                        leftText: "Be where answers happen",
                        rightTitle: "First-Mover Advantage",
                        rightText: "AI Search is Here Now",
                        quote: `"When AI recommends, your brand wins."`
                    },
                    {
                        nav: 2,
                        title: "Revenue Engine",
                        image: "images/pov/revenue.png",
                        leftTitle: "Qualified Leads →",
                        leftText: "Not just clicks, conversions",
                        rightTitle: "Growth That Scales",
                        rightText: "Revenue, Not Vanity Metrics",
                        quote: `"We eat what we kill - Success tied to yours."`
                    }
                ];

                function updateStage(index) {
                    const data = stageData[index];
                    if (!data) return;

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

                    // 1. Image Switching (Class-based)
                    const images = document.querySelectorAll(".pov-stage-img");
                    images.forEach(img => img.classList.remove("active"));
                    if (images[index]) images[index].classList.add("active");

                    // 2. Text Content Update (GSAP Animation)
                    const leftBox = document.querySelector(".pov-side-text.left");
                    const rightBox = document.querySelector(".pov-side-text.right");

                    gsap.to(
                        [cardHeading, leftBox, rightBox],
                        {
                            opacity: 0,
                            duration: 0.25,
                            onComplete: () => {
                                if (cardHeading) cardHeading.innerText = data.title;

                                if (leftBox) {
                                    leftBox.querySelector("h3").innerText = data.leftTitle;
                                    leftBox.querySelector(".subtext").innerText = data.leftText;
                                }

                                if (rightBox) {
                                    rightBox.querySelector("h3").innerText = data.rightTitle;
                                    rightBox.querySelector(".subtext").innerText = data.rightText;
                                    const quoteEl = rightBox.querySelector(".pov-quote");
                                    if (quoteEl) quoteEl.innerHTML = data.quote;
                                }

                                gsap.to(
                                    [cardHeading, leftBox, rightBox],
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

                povTl.call(() => updateStage(0), null, 0);
                povTl.call(() => updateStage(1), null, 0.95);
                povTl.call(() => updateStage(2), null, 1.95);
            }
        }
    }

    /* =========================================
       19. WORKFLOW SLIDER (6-STEP)
       ========================================= */
    {
        const workflowSection = document.querySelector('.section-workflow');
        if (workflowSection) {

            const navPills = document.querySelectorAll('.nav-pill');
            const stepBadge = document.querySelector('.step-badge');
            const stepTitle = document.querySelector('.step-title');
            const stepDesc = document.querySelector('.step-desc');
            const workflowText = document.querySelector('.workflow-text');

            const dashMetrics = document.querySelectorAll('.dash-metric');
            const chartLine = document.querySelector('.chart-line');
            const gaugeProgress = document.querySelector('.gauge-progress');
            const gaugeScore = document.querySelector('.gauge-score');

            // --- ANIMATION: Graph Line & Dots ---
            if (chartLine && typeof gsap !== 'undefined') {
                const length = chartLine.getTotalLength();
                gsap.set(chartLine, { strokeDasharray: length, strokeDashoffset: length });

                const chartSvg = document.querySelector('.chart-svg');
                // Data points from the path d="M0,100 C50,90 100,95 150,80 C200,65 250,70 300,40 C350,10 400,20"
                // Approximate connection points: 0, 150, 300, 400
                const points = [
                    { x: 0, y: 100 },
                    { x: 150, y: 80 },
                    { x: 300, y: 40 },
                    { x: 400, y: 20 }
                ];

                const dots = [];
                points.forEach(p => {
                    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    dot.setAttribute("cx", p.x);
                    dot.setAttribute("cy", p.y);
                    dot.setAttribute("r", "4");
                    dot.setAttribute("fill", "#8C52FE");
                    dot.setAttribute("stroke", "#fff");
                    dot.setAttribute("stroke-width", "2");
                    dot.style.opacity = "0";
                    dot.style.filter = "drop-shadow(0 0 4px rgba(140, 82, 254, 0.8))";
                    if (chartSvg) chartSvg.appendChild(dot);
                    dots.push(dot);
                });

                // Helper to animate graph, dots, gauge, and numbers (called on step update)
                animateGraphAndMetrics = (dataMetrics, gaugeValue) => {
                    // 1. Reset & Animate Line
                    gsap.killTweensOf(chartLine);
                    gsap.fromTo(chartLine,
                        { strokeDashoffset: length },
                        { strokeDashoffset: 0, duration: 2.5, ease: "power2.out" }
                    );

                    // 2. Animate Dots sequence
                    dots.forEach((dot, i) => {
                        gsap.killTweensOf(dot);
                        gsap.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: i * 0.8 });
                    });

                    // 3. Pulse Effect (scheduled after draw)
                    gsap.to(chartLine, {
                        filter: "drop-shadow(0 0 10px rgba(140, 82, 254, 0.8))",
                        yoyo: true,
                        repeat: -1,
                        duration: 1.5,
                        delay: 2.5,
                        ease: "sine.inOut"
                    });

                    // 4. Animate Metric Numbers
                    const metricValues = document.querySelectorAll('.dash-metric .dm-value');
                    metricValues.forEach((el, i) => {
                        const targetStr = dataMetrics[i];
                        const match = targetStr.match(/([\d\.]+)(.*)/);
                        if (match) {
                            const val = parseFloat(match[1]);
                            const suffix = match[2];
                            const proxy = { val: 0 };
                            gsap.to(proxy, {
                                val: val,
                                duration: 2.5,
                                ease: "power2.out",
                                onUpdate: () => {
                                    const current = proxy.val;
                                    const formatted = current % 1 === 0 ? current.toFixed(0) : current.toFixed(1);
                                    el.innerText = formatted + suffix;
                                }
                            });
                        }
                    });

                    // 5. Animate Gauge
                    if (gaugeProgress && gaugeScore) {
                        const maxDash = 126; // matches stroke-dasharray
                        const targetOffset = maxDash - (gaugeValue / 100 * maxDash);

                        // Animate Stroke
                        gsap.fromTo(gaugeProgress,
                            { strokeDashoffset: maxDash },
                            { strokeDashoffset: targetOffset, duration: 2.5, ease: "power2.out" }
                        );

                        // Animate Score Number
                        const proxyGauge = { val: 0 };
                        gsap.to(proxyGauge, {
                            val: gaugeValue,
                            duration: 2.5,
                            ease: "power2.out",
                            onUpdate: () => {
                                gaugeScore.innerText = Math.round(proxyGauge.val);
                            }
                        });
                    }
                };
            }

            const stepsData = [
                {
                    step: "01",
                    title: "Deep, authoritative, AI-optimized content.",
                    desc: "Deep dive into market gaps, competitor weaknesses, and high-intent keywords to build a data-backed roadmap.",
                    metrics: ["400K", "2.1M", "3.2%", "12.4"],
                    gauge: 80
                },
                {
                    step: "02",
                    title: "Quality, accuracy, and brand consistency.",
                    desc: "Mapping topics to buyer journey stages. We plan clustered content that establishes topical authority instantly.",
                    metrics: ["450K", "2.5M", "3.5%", "10.1"],
                    gauge: 85
                },
                {
                    step: "03",
                    title: "Communication, clarity, and execution.",
                    desc: "Our hybrid engine combines AI speed with human editorial precision to create high-ranking assets at scale.",
                    metrics: ["520K", "3.1M", "3.8%", "8.5"],
                    gauge: 90
                },
                {
                    step: "04",
                    title: "Owns SEO strategy, AI visibility, conversions & revenue.",
                    desc: "Technical SEO, schema markup, and internal linking automation ensure every piece is primed for indexing.",
                    metrics: ["600K", "3.8M", "4.2%", "6.2"],
                    gauge: 92
                },
            ];

            let currentStep = 0;
            let autoPlayInterval;
            const intervalTime = 4000;

            function updateStep(index) {
                // FIXED SAFETY: Validate index against nav buttons count to prevent overflow
                const limit = navPills.length > 0 ? navPills.length : stepsData.length;
                if (index >= limit) index = 0;

                const data = stepsData[index];
                if (!data) return;

                // Sync Nav Buttons
                if (navPills.length > 0) {
                    navPills.forEach(pill => pill.classList.remove('active'));
                    if (navPills[index]) navPills[index].classList.add('active');
                }

                // Sync Text Content with simple transition
                workflowText.style.opacity = "0";
                workflowText.style.transform = "translateY(20px)";

                setTimeout(() => {
                    stepBadge.innerText = `Step ${data.step}`;
                    stepTitle.innerText = data.title;
                    stepDesc.innerText = data.desc;

                    workflowText.style.opacity = "1";
                    workflowText.style.transform = "translateY(0)";
                }, 300);

                // Sync Metrics & Charts (Line + Gauge)
                if (animateGraphAndMetrics) {
                    animateGraphAndMetrics(data.metrics, data.gauge);
                } else {
                    // Fallback: Static updates if GSAP helper fails
                    dashMetrics.forEach((metric, i) => {
                        const valSpan = metric.querySelector('.dm-value');
                        if (valSpan) valSpan.innerText = data.metrics[i];
                    });
                    if (gaugeProgress && gaugeScore) {
                        const maxDash = 126;
                        const offset = maxDash - (data.gauge / 100 * maxDash);
                        gaugeProgress.style.strokeDashoffset = offset;
                        gaugeScore.innerText = data.gauge;
                    }
                }

                // Active class for styling
                dashMetrics.forEach((metric, i) => {
                    metric.classList.remove('active');
                    if (i === index % dashMetrics.length) {
                        metric.classList.add('active');
                    }
                });

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
                // FIXED LOOP: Wrap based on available buttons
                const limit = navPills.length > 0 ? navPills.length : stepsData.length;
                if (next >= limit) next = 0;

                updateStep(next);
            }

            function startAutoPlay() {
                clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(nextStep, intervalTime);
            }

            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }

            navPills.forEach((pill, index) => {
                pill.addEventListener('click', () => {
                    stopAutoPlay();
                    updateStep(index);
                });
            });

            const card = document.querySelector('.workflow-card');
            if (card) {
                card.addEventListener('mouseenter', stopAutoPlay);
                card.addEventListener('mouseleave', startAutoPlay);
            }

            updateStep(0);
            startAutoPlay();
        }
    }

    /* =========================================
       20. WINNING SEARCH ANIMATIONS
       ========================================= */
    {
        const winCards = document.querySelectorAll('.scroll-slide-up');

        if (winCards.length > 0) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const winObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let delay = 0;
                        entry.target.classList.forEach(cls => {
                            if (cls.startsWith('delay-')) {
                                const num = parseInt(cls.split('-')[1]);
                                if (!isNaN(num)) delay = num * 100;
                            }
                        });

                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);

                        winObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            winCards.forEach(card => {
                winObserver.observe(card);
            });
        }
    }

    /* =========================================
       21. PRE-FOOTER CTA ANIMATION
       ========================================= */
    {
        const saElements = document.querySelectorAll('.sa-anim-fade-up');
        if (saElements.length > 0) {
            const saObserverOptions = {
                threshold: 0.2,
                rootMargin: '0px'
            };

            const saObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('sa-visible');
                        saObserver.unobserve(entry.target);
                    }
                });
            }, saObserverOptions);

            saElements.forEach(el => saObserver.observe(el));
        }
    }

    /* =========================================
       22. INSIGHTS SECTION
       ========================================= */
    {
        const section = document.querySelector(".section-insights");
        if (section) {
            const tabs = document.querySelectorAll(".insight-tab");
            const leftContent = document.querySelector(".insights-content");
            const rightCard = document.querySelector(".insights-card");
            const bgImages = document.querySelectorAll(".insight-bg");

            // PART 1 – SCROLL REVEAL
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        section.classList.add("sa-visible");
                        observer.unobserve(section);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(section);

            // PART 2 – TAB DATA
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

                tabs.forEach(tab => tab.classList.remove("active"));
                tabs[index].classList.add("active");

                leftContent.classList.add("fade-out");
                rightCard.classList.add("fade-out");

                setTimeout(() => {
                    const h2 = leftContent.querySelector("h2");
                    const p = leftContent.querySelector("p");

                    if (h2) h2.textContent = contentData[index].title;
                    if (p) p.textContent = contentData[index].text;

                    if (bgImages.length > 0) {
                        bgImages.forEach(bg => bg.classList.remove("active"));
                        if (bgImages[index]) {
                            bgImages[index].classList.add("active");
                        }
                    }

                    leftContent.classList.remove("fade-out");
                    rightCard.classList.remove("fade-out");
                }, 500);

                current = index;
            }

            function startAutoPlay() {
                clearInterval(interval);
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

            tabs.forEach((tab, index) => {
                tab.addEventListener("click", () => {
                    switchTab(index);
                    resetAutoPlay();
                });
            });

            switchTab(0);
            startAutoPlay();

            // PART 3 – ENERGY BEAM
            if (!document.querySelector(".insights-energy-beam")) {
                const beam = document.createElement("div");
                beam.classList.add("insights-energy-beam");
                section.appendChild(beam);
            }
        }
    }

    /* =========================================
       23. CURSOR GLOW
       ========================================= */
    {
        // Don't duplicate if already exists
        if (!document.querySelector('.cursor-glow')) {
            const glow = document.createElement("div");
            glow.classList.add("cursor-glow");
            document.body.appendChild(glow);

            document.addEventListener("mousemove", (e) => {
                glow.style.left = e.clientX + "px";
                glow.style.top = e.clientY + "px";
            });
        }
    }

    /* =========================================
       24. REVENUE GRAPH ANIMATION (Pinned & Scrubbed)
       ========================================= */
    {
        const revenueSection = document.querySelector('.section-revenue');
        const revBefore = document.querySelector('.rev-before');
        const revAfter = document.querySelector('.rev-after');
        const miniCards = document.querySelectorAll('.mini-card');

        if (revenueSection && revBefore && revAfter && typeof gsap !== 'undefined') {
            [revBefore, revAfter].forEach(line => {
                const length = line.getTotalLength();
                gsap.set(line, {
                    strokeDasharray: length,
                    strokeDashoffset: length
                });
            });

            gsap.set(miniCards, { opacity: 0 });

            const revenueTL = gsap.timeline({
                scrollTrigger: {
                    trigger: ".section-revenue",
                    start: "top top",
                    end: "+=2000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            revenueTL.to(revBefore, {
                strokeDashoffset: 0,
                duration: 3,
                ease: "power1.out"
            })
                .to(revAfter, {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: "power2.out"
                }, "-=1")
                .to(miniCards, {
                    opacity: 1,
                    stagger: 0.2,
                    duration: 1
                }, "-=0.5");
        }
    }

    // REFRESH SCROLLTRIGGER AFTER SETUP
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
    }
});
