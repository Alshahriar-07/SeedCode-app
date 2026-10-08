/* ============================================================
   Seed Code Chat — Android download site
   Small, focused: nav, scroll reveal, small UI interactions.
   All SEO content lives in the HTML — JS never renders content.
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  root.classList.remove("no-js");
  root.classList.add("js");

  /* ---------------- Mobile navigation ---------------- */
  var navWrap = document.getElementById("nav-wrap");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  function setMenu(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    navWrap && navWrap.classList.toggle("nav-menu-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", function (event) {
      if (!navWrap) return;
      var open = navWrap.classList.contains("nav-menu-open");
      if (open && !navWrap.contains(event.target)) setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setMenu(false);
    });
  }

  /* ---------------- Sticky nav border on scroll ---------------- */
  var scrollNav = function () {
    if (!navWrap) return;
    navWrap.classList.toggle("scrolled", window.scrollY > 8);
  };
  scrollNav();
  window.addEventListener("scroll", scrollNav, { passive: true });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { observer.observe(el); });
  }
})();