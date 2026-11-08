const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("nav-links");
const themeToggle = document.querySelector(".theme-toggle");

/* Mobile menu */
function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) setMenu(false);
});

/* Light / dark theme: follows the system until the visitor picks one */
function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
        localStorage.setItem("theme", next);
    } catch (e) {}
});

/* Header border once the page scrolls */
function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Fade sections in as they enter the viewport; anything already on screen shows at once */
const revealItems = [...document.querySelectorAll(".reveal")].filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("visible");
        return false;
    }
    return true;
});
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach((el) => revealObserver.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add("visible"));
}

/* Highlight the nav link for the section in view */
const navAnchors = navLinks.querySelectorAll("a");
const sections = [...navAnchors].map((a) => document.querySelector(a.getAttribute("href")));
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((a) => {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => s && sectionObserver.observe(s));
}

/* Keep the copyright year current */
document.getElementById("year").textContent = new Date().getFullYear();
