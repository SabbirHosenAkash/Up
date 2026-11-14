// --- 1. Hero typing effect ---
const textArray = [
    "Bangladeshi Musician",
    "Creative Writer",
    "Web Developer",
    "SEO Expert",
    "AI Agent Developer"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const typingElement = document.getElementById("typing-effect");
    if (!typingElement) return;
    const currentText = textArray[textIndex];
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 65 : 115;
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 450;
    }
    window.setTimeout(typeEffect, typeSpeed);
}

// --- 2. Contact form (existing AJAX workflow retained) ---
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");

if (contactForm && submitBtn && btnText && formStatus) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        const formData = new FormData(this);
        fetch("https://formsubmit.co/ajax/info.sabbirhosenakash@gmail.com", {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        })
        .then(response => {
            if (!response.ok) throw new Error("Message could not be sent");
            return response.json();
        })
        .then(() => {
            formStatus.style.display = "block";
            formStatus.className = "success";
            formStatus.textContent = "✔ Message Sent Successfully!";
            contactForm.reset();
            btnText.textContent = "Send Message";
            submitBtn.disabled = false;
            window.setTimeout(() => { formStatus.style.display = "none"; }, 5000);
        })
        .catch(() => {
            formStatus.style.display = "block";
            formStatus.className = "error";
            formStatus.textContent = "❌ Oops! Something went wrong.";
            btnText.textContent = "Try Again";
            submitBtn.disabled = false;
        });
    });
}

// --- 3. Scroll reveal ---
if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true, mirror: false });
}

// --- 4. Project image slider ---
if (typeof Swiper !== "undefined" && document.querySelector(".project-slider")) {
    new Swiper(".project-slider", {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }
    });
}

// --- 5. Animated skill bars ---
const skillSection = document.getElementById("skills");
const progressBars = document.querySelectorAll(".fill-3d");
function showProgress() {
    progressBars.forEach(bar => {
        const value = bar.style.getPropertyValue("--width");
        if (value) bar.style.width = value;
    });
}
if (skillSection && "IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showProgress();
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    skillObserver.observe(skillSection);
} else {
    showProgress();
}

// --- 6. Cinematic live content: complete phrases, never letter-by-letter typing ---
function initLiveDetails() {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function cycleText(element, phrases, interval = 4200) {
        if (!element || phrases.length < 2 || prefersReduced) return;
        let index = 0;
        element.classList.add("cinematic-copy");
        window.setInterval(() => {
            element.classList.add("is-changing");
            window.setTimeout(() => {
                index = (index + 1) % phrases.length;
                element.textContent = phrases[index];
                element.classList.remove("is-changing");
                element.classList.add("is-arriving");
                window.setTimeout(() => element.classList.remove("is-arriving"), 700);
            }, 520);
        }, interval);
    }

    document.querySelectorAll(".live-detail[data-live-lines], .console-description[data-live-lines]").forEach(item => {
        const phrases = (item.getAttribute("data-live-lines") || "")
            .split("|").map(line => line.trim()).filter(Boolean);
        cycleText(item, phrases, item.classList.contains("console-description") ? 3100 : 4400);
    });

    // Skill descriptions rotate as complete, readable scenes.
    document.querySelectorAll(".skill-3d-card").forEach(card => {
        const desc = card.querySelector(".skill-description");
        const title = card.querySelector(".skill-name");
        if (!desc || !title) return;
        const original = desc.textContent.trim();
        const name = title.textContent.trim();
        const scenes = [
            original,
            `${name}: practical implementation, structured workflows and continuous refinement.`,
            `Applied focus: building reliable solutions with clear architecture, usability and maintainability.`
        ];
        cycleText(desc, scenes, 5200);
    });

    // Give every main portfolio card a synchronized cinematic highlight.
    document.querySelectorAll(".interactive-box, .project-container, .meetwoyou-container, .book-card, .organisation-card").forEach(card => {
        card.classList.add("cinematic-card");
        const heading = card.querySelector("h3, h4");
        const paragraph = card.querySelector("p:not(.live-detail)");
        if (!heading || !paragraph || card.querySelector(".cinematic-caption")) return;
        const caption = document.createElement("div");
        caption.className = "cinematic-caption";
        caption.setAttribute("aria-live", "polite");
        const title = heading.textContent.trim();
        const source = paragraph.textContent.trim();
        const short = source.length > 145 ? source.slice(0, 142).replace(/\s+\S*$/, "") + "…" : source;
        const scenes = [
            `${title} — ${short}`,
            `A closer look at ${title.toLowerCase()}: thoughtful planning, creative execution and continuous improvement.`,
            `Explore the work, capabilities and ideas behind ${title.toLowerCase()}.`
        ];
        caption.textContent = scenes[0];
        card.appendChild(caption);
        cycleText(caption, scenes, 6100);
    });
}

// --- 7. Mobile navigation ---
function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    if (navLinks) navLinks.classList.toggle("active");
}
document.querySelectorAll("#nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        const navLinks = document.getElementById("nav-links");
        if (navLinks) navLinks.classList.remove("active");
    });
});

// --- 8. Background particles ---
if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00ff88" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00ff88", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 3, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" }
            }
        },
        retina_detect: true
    });
}

// --- 9. PWA install prompt (null-safe; original feature retained) ---
let deferredPrompt;
const installBanner = document.getElementById("install-banner");
const btnInstall = document.getElementById("btn-install");
const btnClose = document.getElementById("btn-close");

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    window.setTimeout(() => {
        if (installBanner) installBanner.style.display = "flex";
    }, 5000);
});
if (btnInstall) {
    btnInstall.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        if (installBanner) installBanner.style.display = "none";
        deferredPrompt = null;
    });
}
if (btnClose) {
    btnClose.addEventListener("click", () => {
        if (installBanner) installBanner.style.display = "none";
    });
}

// --- 10. Network status (original notification behavior retained) ---
window.addEventListener("online", () => alert("আপনি এখন অনলাইনে আছেন!"));
window.addEventListener("offline", () => alert("আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন হয়েছে।"));

document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(typeEffect, 700);
    initLiveDetails();
});
