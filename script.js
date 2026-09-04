(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const year = document.querySelector("[data-year]");

  if (year) year.textContent = String(new Date().getFullYear());

  const setMenu = (open) => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.hidden = !open;
    if (overlay) overlay.hidden = !open;
    document.body.classList.toggle("is-nav-open", open);
    if (open) toggle.focus();
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setMenu(!open);
  });

  overlay?.addEventListener("click", () => setMenu(false));

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const navLinks = [...document.querySelectorAll(".nav a, .mobile-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  const setActive = () => {
    const y = window.scrollY + 88;
    let current = sections[0];
    for (const section of sections) {
      if (section.offsetTop <= y) current = section;
    }
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  if (!reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "Message");
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      if (status) {
        status.hidden = false;
        status.textContent = "Please complete name, email, and message.";
        status.style.color = "#e53935";
      }
      return;
    }

    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:team@example.com?subject=${encodeURIComponent(subject + " — Coordinate Robotics")}&body=${body}`;
    if (status) {
      status.hidden = false;
      status.style.color = "#43a047";
      status.textContent = "Opening your email client. Replace the placeholder address when the team email is confirmed.";
    }
    form.reset();
  });
})();
