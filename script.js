document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("site-nav");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = (returnFocus = false) => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    if (!willOpen) {
      closeMenu();
      return;
    }
    menu.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    menu.querySelector("a")?.focus();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu(true);
    }
    if (event.key === "Tab" && menu.classList.contains("is-open")) {
      const focusable = [menuButton, ...menu.querySelectorAll("a")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && menu.classList.contains("is-open")) closeMenu();
  });

  const heroSlider = document.getElementById("hero-slider");
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll("[data-slide]")];
    const previousButton = document.querySelector("[data-slider-prev]");
    const nextButton = document.querySelector("[data-slider-next]");
    const slideNumber = document.querySelector("[data-slide-number]");
    const sliderProgress = document.querySelector("[data-slider-progress]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = 0;
    let autoplayId;

    const showSlide = (nextIndex) => {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.toggleAttribute("inert", !isActive);
      });
      if (slideNumber) slideNumber.textContent = String(activeIndex + 1).padStart(2, "0");
      if (sliderProgress) sliderProgress.style.transform = `translateX(${activeIndex * 100}%)`;
    };

    const stopAutoplay = () => window.clearInterval(autoplayId);
    const startAutoplay = () => {
      if (reduceMotion || document.hidden) return;
      stopAutoplay();
      autoplayId = window.setInterval(() => showSlide(activeIndex + 1), 5500);
    };
    const selectSlide = (index) => {
      showSlide(index);
      startAutoplay();
    };

    previousButton?.addEventListener("click", () => selectSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => selectSlide(activeIndex + 1));

    const hero = heroSlider.closest(".hero");
    hero?.addEventListener("mouseenter", stopAutoplay);
    hero?.addEventListener("mouseleave", startAutoplay);
    hero?.addEventListener("focusin", stopAutoplay);
    hero?.addEventListener("focusout", startAutoplay);
    document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());
    startAutoplay();
  }

  const videoPreview = document.querySelector("[data-video-id]");
  if (videoPreview && /^https?:$/.test(window.location.protocol)) {
    videoPreview.addEventListener("click", (event) => {
      event.preventDefault();
      const player = document.createElement("div");
      player.className = "film-player";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoPreview.dataset.videoId}?autoplay=1&rel=0&playsinline=1`;
      iframe.title = "Unconventional Bridal Makeup by Arpita Ganguly";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      player.appendChild(iframe);
      videoPreview.replaceWith(player);
    }, { once: true });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const subject = `Appointment enquiry from ${data.get("name")}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Email: ${data.get("email") || "Not provided"}`,
        `Service: ${data.get("service")}`,
        "",
        "Message:",
        data.get("message")
      ].join("\n");
      const status = contactForm.querySelector("[data-form-status]");
      if (status) status.textContent = "Opening your email app with the enquiry details...";
      window.location.href = `mailto:arpitazfamilysalon@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.WOW) {
    new WOW({ mobile: true, live: false, offset: 72 }).init();
  }
});
