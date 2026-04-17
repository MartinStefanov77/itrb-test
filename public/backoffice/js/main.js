/* ===================================================
   ITRB — main.js
   Handles: i18n, sticky nav (scrolled state),
            hamburger menu, team slider, GSAP animations,
            contact form
   =================================================== */

/* ---- Translations -------------------------------------------------- */
const translations = { en: LOCALE_EN, bg: LOCALE_BG };

/* ---- Language-change hooks (modules register callbacks here) ------- */
const langChangeCallbacks = [];

/* ---- Language Switcher --------------------------------------------- */
let currentLang = localStorage.getItem("itrb-lang") || "en";

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("itrb-lang", lang);
  document.documentElement.setAttribute("lang", lang);
  document.body.className = `lang-${lang}`;

  const dict = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  langChangeCallbacks.forEach((cb) => cb(lang));
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

/* ---- Sticky Nav & Active Section ------------------------------------ */
const navbar = document.getElementById("navbar");

function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---- Smooth scroll for in-page anchor links ------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  const href = a.getAttribute("href");
  if (href === "#") return;
  a.addEventListener("click", (e) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    const navLinksEl = document.getElementById("navLinks");
    const hamburger = document.getElementById("hamburger");
    if (navLinksEl) navLinksEl.classList.remove("open");
    if (hamburger) hamburger.classList.remove("open");
  });
});

/* ---- Hamburger & Mobile Menu ------------------------------------------ */
const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");

// Backdrop overlay — created once, inserted after nav
const backdrop = document.createElement("div");
backdrop.className = "nav-backdrop";
navbar.insertAdjacentElement("afterend", backdrop);

let menuScrollY = 0;

function openMenu() {
  menuScrollY = window.scrollY;
  hamburger.classList.add("open");
  navLinksEl.classList.add("open");
  backdrop.classList.add("visible");
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${menuScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
}

function closeMenu() {
  const wasOpen = navLinksEl.classList.contains("open");
  hamburger.classList.remove("open");
  navLinksEl.classList.remove("open");
  backdrop.classList.remove("visible");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  if (wasOpen) window.scrollTo(0, menuScrollY);
}

hamburger.addEventListener("click", () => {
  navLinksEl.classList.contains("open") ? closeMenu() : openMenu();
});

// Close on backdrop click
backdrop.addEventListener("click", closeMenu);

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Close when window grows past mobile breakpoint (only if menu is open)
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && navLinksEl.classList.contains("open")) closeMenu();
});

/* ---- Contact Form ----------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  function getGroup(field) {
    return field.closest(".form-group");
  }

  function setError(field, message) {
    const group = getGroup(field);
    const errorEl = group.querySelector(".field-error");
    group.classList.add("has-error");
    errorEl.textContent = message;
  }

  function clearError(field) {
    const group = getGroup(field);
    const errorEl = group.querySelector(".field-error");
    group.classList.remove("has-error");
    errorEl.textContent = "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateField(field, dict) {
    const value = field.value.trim();
    if (!value) {
      setError(field, dict["contact.field.required"]);
      return false;
    }
    if (field.type === "email" && !isValidEmail(value)) {
      setError(field, dict["contact.field.email.invalid"]);
      return false;
    }
    clearError(field);
    return true;
  }

  // Generate captcha question client-side (works without a live server)
  function loadCaptcha() {
    const a = Math.floor(Math.random() * 8) + 2; // 2–9
    const b = Math.floor(Math.random() * 9) + 1; // 1–9
    const expires = Date.now() + 10 * 60 * 1000;  // 10-minute window
    document.getElementById("captchaQuestion").textContent = a + " + " + b;
    document.getElementById("captchaToken").value = btoa(a + ":" + b + ":" + expires);
    document.getElementById("captchaAnswer").value = "";
  }

  loadCaptcha();

  // Clear error as soon as the user starts correcting a field
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (getGroup(field).classList.contains("has-error")) {
        clearError(field);
      }
      toggleSubmit();
    });
  });

  const agreeCheckbox = form.elements["agree"];
  agreeCheckbox.addEventListener("change", toggleSubmit);

  function toggleSubmit() {
    const btn = form.querySelector("button[type=submit]");
    const isDisabled = !agreeCheckbox.checked;
    // aria-disabled keeps the button in tab order (accessible); CSS handles appearance
    btn.setAttribute("aria-disabled", String(isDisabled));
    btn.classList.toggle("is-disabled", isDisabled);
  }

  toggleSubmit();

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const dict = translations[currentLang];
    const btn = this.querySelector("button[type=submit]");

    // Block submit if aria-disabled (checkbox not ticked)
    if (btn.getAttribute("aria-disabled") === "true") {
      setError(agreeCheckbox, dict["contact.field.required"]);
      agreeCheckbox.focus();
      return;
    }
    const fields = ["name", "email", "subject", "message"].map(
      (id) => this.elements[id],
    );
    const status = document.getElementById("formStatus");

    // Validate text fields
    const valid = fields.reduce((allValid, field) => {
      return validateField(field, dict) && allValid;
    }, true);

    // Validate checkbox
    if (!agreeCheckbox.checked) {
      setError(agreeCheckbox, dict["contact.field.required"]);
      return;
    } else {
      clearError(agreeCheckbox);
    }

    // Validate captcha answer
    const captchaAnswerEl = document.getElementById("captchaAnswer");
    if (!captchaAnswerEl.value.trim()) {
      setError(captchaAnswerEl, dict["contact.field.required"]);
      return;
    } else {
      clearError(captchaAnswerEl);
    }

    if (!valid) return;

    status.textContent = "";
    status.className = "form-status";

    const originalText = btn.textContent;
    btn.setAttribute("aria-disabled", "true");
    btn.classList.add("is-disabled");
    btn.textContent = "…";

    try {
      const formData = new FormData(this);
      const res = await fetch("contact.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        status.textContent = data.message || dict["contact.success"];
        status.className = "form-status success";
        this.reset();
        loadCaptcha();
      } else {
        // If captcha was wrong, reload it for a fresh attempt
        if (
          data.message &&
          (data.message.toLowerCase().includes("captcha") ||
            data.message.toLowerCase().includes("expired"))
        ) {
          loadCaptcha();
        }
        status.textContent = data.message || dict["contact.error"];
        status.className = "form-status error";
      }
    } catch {
      status.textContent = dict["contact.error"];
      status.className = "form-status error";
    } finally {
      const isDisabled = !agreeCheckbox.checked;
      btn.setAttribute("aria-disabled", String(isDisabled));
      btn.classList.toggle("is-disabled", isDisabled);
      btn.textContent = originalText;
    }
  });
})();

/* ---- CSS-driven animations + IntersectionObserver ---------------------- */
(function initAnimations() {
  /* Hero entrance — add .hero-visible after paint so CSS transition runs */
  const hero = document.querySelector(".hero");
  if (hero && hero.querySelector(".hero-title-line")) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("hero-visible"));
    });
  }

  /* Scroll-triggered reveals — ~88% viewport (when element top enters bottom 12%) */
  const revealRootMargin = "0px 0px -12% 0px";
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { rootMargin: revealRootMargin, threshold: 0 }
  );
  document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach((el) => revealObserver.observe(el));

  /* Team carousel — no scroll animation, images visible immediately */
})();

/* ---- Team Showcase + Modal ------------------------------------------- */
(function initTeamShowcase() {
  const members = [
    {
      nameKey: "team.name1",
      photo: "images/team/Asen%20Tsonev.webp",
      roleKey: "team.role1",
      bioKey: "team.bio1",
    },
    {
      nameKey: "team.name2",
      photo: "images/team/Ekaterina%20Delcheva.webp",
      roleKey: "team.role2",
      bioKey: "team.bio2",
    },
    {
      nameKey: "team.name3",
      photo: "images/team/Elena%20Petrova.webp",
      roleKey: "team.role3",
      bioKey: "team.bio3",
    },
    {
      nameKey: "team.name4",
      photo: "images/team/Momchil%20Pakyov.webp",
      roleKey: "team.role4",
      bioKey: "team.bio4",
    },
    {
      nameKey: "team.name5",
      photo: "images/team/Vladimir%20Nikolov.webp",
      roleKey: "team.role5",
      bioKey: "team.bio5",
    },
    {
      nameKey: "team.name7",
      photo: "images/team/Zdravko_Zdravkov.webp",
      roleKey: "team.role7",
      bioKey: "team.bio7",
    },
    {
      nameKey: "team.name8",
      photo: "images/team/Emre%20Sakal.webp",
      roleKey: "team.role8",
      bioKey: "team.bio8",
    },
  ];

  const carouselEl = document.getElementById("teamCarousel");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const nameEl = document.getElementById("showcaseName");
  const roleEl = document.getElementById("showcaseRole");

  if (!carouselEl) return;

  const total = members.length; // 6

  /* ---- Build infinite loop: prepend + append full set of clones --------- */
  const realItems = Array.from(
    carouselEl.querySelectorAll(".team-carousel-item"),
  );

  const before = document.createDocumentFragment();
  const after = document.createDocumentFragment();
  realItems.forEach((item) => {
    const cloneBefore = item.cloneNode(true);
    const cloneAfter = item.cloneNode(true);
    cloneBefore.classList.add("is-clone");
    cloneAfter.classList.add("is-clone");
    // Remove clones from tab order and accessibility tree
    cloneBefore.setAttribute("aria-hidden", "true");
    cloneAfter.setAttribute("aria-hidden", "true");
    cloneBefore.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
    cloneAfter.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
    before.appendChild(cloneBefore);
    after.appendChild(cloneAfter);
  });
  carouselEl.insertBefore(before, carouselEl.firstChild);
  carouselEl.appendChild(after);

  // DOM layout: [C0..C5 | R0..R5 | C0..C5]  indices 0-5 | 6-11 | 12-17
  const allItems = Array.from(
    carouselEl.querySelectorAll(".team-carousel-item"),
  );

  // GSAP fromTo sets opacity:0 / transform:translateY on the real items immediately.
  // Clones inherit those inline styles but are never animated — clear them so clones are visible.
  allItems.forEach((item) => {
    if (item.classList.contains("is-clone")) {
      item.style.removeProperty("opacity");
      item.style.removeProperty("transform");
    }
  });

  // domOffset points to the first visible item; real items live at indices total..2*total-1
  let domOffset = total; // start at first real item (R0)
  let realOffset = 0; // which member is the active/first-visible
  let isAnimating = false;

  /* ---- Helpers ---------------------------------------------------------- */
  function memberIdx(domIdx) {
    return domIdx % total;
  }

  function itemWidth() {
    return allItems[0].offsetWidth;
  }

  function applyTransform(animated) {
    if (!animated) carouselEl.style.transition = "none";
    carouselEl.style.transform = `translateX(-${domOffset * itemWidth()}px)`;
    if (!animated) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          carouselEl.style.removeProperty("transition");
        }),
      );
    }
  }

  function setActiveItem(domIdx) {
    allItems.forEach((item, i) => {
      item.classList.toggle("active", i === domIdx);
      // Only the active real item's button is keyboard reachable;
      // clones are already aria-hidden with tabIndex=-1
      if (!item.classList.contains("is-clone")) {
        const btn = item.querySelector(".carousel-view-btn");
        if (btn) btn.tabIndex = i === domIdx ? 0 : -1;
      }
    });
  }

  function updateInfoBox(mIdx) {
    const m = members[mIdx];
    const dict = translations[currentLang];
    const newName = dict[m.nameKey] || m.nameKey;
    const newRole = dict[m.roleKey] || "";

    if (nameEl) nameEl.textContent = newName;
    if (roleEl) roleEl.textContent = newRole;
  }

  const SLIDE_MS = 560; // slightly longer than CSS transition (550ms)

  /* ---- Thumbnail strip (mobile only) ------------------------------------ */
  let thumbEls = [];

  function buildThumbnails() {
    const container = document.getElementById("teamThumbnails");
    if (!container) return;
    container.innerHTML = "";
    thumbEls = members.map((m, i) => {
      const div = document.createElement("div");
      div.className = "team-thumb";
      const img = document.createElement("img");
      img.src = m.photo;
      img.alt = (translations[currentLang] && translations[currentLang][m.nameKey]) || m.nameKey;
      div.appendChild(img);
      div.addEventListener("click", () => slideTo(i));
      container.appendChild(div);
      return div;
    });
  }

  function updateThumbnails(activeIdx) {
    thumbEls.forEach((th, i) => th.classList.toggle("active", i === activeIdx));
  }

  /* Direct jump to a specific member (used by thumbnail clicks) ----------- */
  function slideTo(targetReal) {
    if (isAnimating) return;
    realOffset = targetReal;
    domOffset = total + realOffset;
    carouselEl.style.transition = "none";
    carouselEl.style.transform = `translateX(-${domOffset * itemWidth()}px)`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        carouselEl.style.removeProperty("transition");
      }),
    );
    setActiveItem(domOffset);
    updateInfoBox(realOffset);
    updateThumbnails(realOffset);
    startAuto();
  }

  function slide(dir) {
    if (isAnimating) return;
    isAnimating = true;
    domOffset += dir;
    realOffset = memberIdx(domOffset);
    applyTransform(true);
    setActiveItem(domOffset);
    updateInfoBox(realOffset);
    updateThumbnails(realOffset);

    /* After the CSS transition finishes, silently snap back to the real zone */
    setTimeout(() => {
      if (domOffset >= total * 2) {
        domOffset -= total;
        applyTransform(false);
        setActiveItem(domOffset);
      } else if (domOffset < total) {
        domOffset += total;
        applyTransform(false);
        setActiveItem(domOffset);
      }
      isAnimating = false;
    }, SLIDE_MS);
  }

  /* Auto-slide every 5 s -------------------------------------------------- */
  let autoTimer = null;

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => slide(1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  /* Hover: pause auto, update info box + highlight item ------------------- */
  const carouselOuter = carouselEl.closest(".team-carousel-outer");

  carouselOuter.addEventListener("mouseenter", stopAuto);
  carouselOuter.addEventListener("mouseleave", startAuto);

  allItems.forEach((item, i) => {
    item.addEventListener("mouseenter", () => {
      setActiveItem(i);
      updateInfoBox(memberIdx(i));
    });
    item.addEventListener("mouseleave", () => {
      setActiveItem(domOffset);
      updateInfoBox(realOffset);
    });
  });

  prevBtn.addEventListener("click", () => {
    slide(-1);
    startAuto();
  });
  nextBtn.addEventListener("click", () => {
    slide(1);
    startAuto();
  });

  /* Touch swipe ----------------------------------------------------------- */
  let touchStartX = 0;
  carouselEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  carouselEl.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slide(diff > 0 ? 1 : -1);
  });

  /* Resize: recalculate pixel offsets without animation ------------------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      carouselEl.style.transition = "none";
      carouselEl.style.transform = `translateX(-${domOffset * itemWidth()}px)`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          carouselEl.style.removeProperty("transition");
        }),
      );
    }, 120);
  });

  /* Language change: refresh info box text -------------------------------- */
  langChangeCallbacks.push(() => updateInfoBox(realOffset));

  /* Init ------------------------------------------------------------------ */
  buildThumbnails();
  applyTransform(false);
  setActiveItem(domOffset);
  updateInfoBox(0);
  updateThumbnails(0);
  startAuto();

  /* ---- Modal ---------------------------------------- */
  const modalBackdrop = document.getElementById("teamModalBackdrop");
  const modal = document.getElementById("teamModal");
  const closeBtn = document.getElementById("modalClose");

  if (!modal) return;

  function openModal(mIdx) {
    stopAuto();
    const m = members[mIdx];
    const dict = translations[currentLang];
    document.getElementById("modalPhoto").src = m.photo;
    document.getElementById("modalPhoto").alt = dict[m.nameKey] || m.nameKey;
    document.getElementById("modalName").textContent = dict[m.nameKey] || m.nameKey;
    document.getElementById("modalRole").textContent = dict[m.roleKey] || "";
    document.getElementById("modalBio").textContent = dict[m.bioKey] || "";
    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    modal.classList.remove("is-closing");
    requestAnimationFrame(() => modal.classList.add("is-open"));
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    const onEnd = () => {
      modal.removeEventListener("transitionend", onEnd);
      modal.classList.remove("is-closing");
      modalBackdrop.classList.remove("active");
      document.body.style.overflow = "";
      startAuto();
    };
    modal.addEventListener("transitionend", onEnd);
  }

  /* Attach View Profile to all items (real + clones) so wraps work too ---- */
  allItems.forEach((item, i) => {
    const btn = item.querySelector(".carousel-view-btn");
    if (btn)
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(memberIdx(i));
      });
  });

  const viewBtn = document.getElementById("showcaseViewBtn");
  if (viewBtn) viewBtn.addEventListener("click", () => openModal(realOffset));

  closeBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const certBd = document.getElementById("certLightboxBackdrop");
    if (certBd && certBd.classList.contains("active")) return;
    closeModal();
  });
})();

/* ---- ISO certificate lightbox (Who we are, JPEG) ------------------------ */
(function initCertLightbox() {
  const backdrop = document.getElementById("certLightboxBackdrop");
  if (!backdrop) return;

  const CERT_DEFS = [
    {
      titleKey: "wwa.cert.c1.title",
      en: "images/certificates/2989-itrb-certificate-9001-en.jpg",
      bg: "images/certificates/2989-itrb-certificate-9001-bg.jpg",
    },
    {
      titleKey: "wwa.cert.c2.title",
      en: "images/certificates/2989-itrb-certificate-27001-en.jpg",
      bg: "images/certificates/2989-itrb-certificate-27001-bg.jpg",
    },
    {
      titleKey: "wwa.cert.c3.title",
      en: "images/certificates/2989-itrb-certificate-20000-en.jpg",
      bg: "images/certificates/2989-itrb-certificate-20000-bg.jpg",
    },
    {
      titleKey: "wwa.cert.c4.title",
      en: "images/certificates/3019-itrb-certificate-37001-en.jpg",
      bg: "images/certificates/3019-itrb-certificate-37001-bg.jpg",
    },
  ];

  const imgEl = document.getElementById("certLightboxImg");
  const titleEl = document.getElementById("certLightboxTitle");
  const counterEl = document.getElementById("certLightboxCounter");
  const thumbsWrap = document.getElementById("certLightboxThumbs");
  const btnClose = document.getElementById("certLightboxClose");
  const btnPrev = document.getElementById("certLightboxPrev");
  const btnNext = document.getElementById("certLightboxNext");
  let certIndex = 0;
  let lbOpen = false;

  if (imgEl) {
    imgEl.addEventListener("contextmenu", (e) => e.preventDefault());
    imgEl.addEventListener("dragstart", (e) => e.preventDefault());
  }

  function a11yLabels() {
    const dict = translations[currentLang];
    btnClose.setAttribute("aria-label", dict["wwa.cert.a11y.close"] || "Close");
    btnPrev.setAttribute("aria-label", dict["wwa.cert.a11y.prev"] || "Previous");
    btnNext.setAttribute("aria-label", dict["wwa.cert.a11y.next"] || "Next");
    if (thumbsWrap) {
      thumbsWrap.setAttribute(
        "aria-label",
        dict["wwa.cert.thumbsGroup"] || "All certificates",
      );
    }
  }

  function imageUrl(i) {
    const lang = currentLang === "bg" ? "bg" : "en";
    return CERT_DEFS[i][lang];
  }

  function buildThumbs() {
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = "";
    CERT_DEFS.forEach((def, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cert-lightbox-thumb";
      const im = document.createElement("img");
      im.alt = "";
      im.draggable = false;
      im.src = imageUrl(i);
      im.addEventListener("contextmenu", (e) => e.preventDefault());
      btn.appendChild(im);
      btn.addEventListener("click", () => {
        if (certIndex === i) return;
        certIndex = i;
        renderCert();
      });
      btn.addEventListener("contextmenu", (e) => e.preventDefault());
      thumbsWrap.appendChild(btn);
    });
  }

  function renderCert() {
    const dict = translations[currentLang];
    const def = CERT_DEFS[certIndex];
    const t = dict[def.titleKey] || def.titleKey;
    titleEl.textContent = t;
    imgEl.alt = t;
    imgEl.src = imageUrl(certIndex);
    counterEl.textContent = `${certIndex + 1} / ${CERT_DEFS.length}`;
    if (thumbsWrap) {
      thumbsWrap.querySelectorAll(".cert-lightbox-thumb").forEach((btn, i) => {
        const im = btn.querySelector("img");
        if (im) im.src = imageUrl(i);
        const lbl = dict[CERT_DEFS[i].titleKey] || CERT_DEFS[i].titleKey;
        btn.setAttribute("aria-label", lbl);
        btn.setAttribute("aria-pressed", String(i === certIndex));
        btn.classList.toggle("is-active", i === certIndex);
      });
    }
  }

  function openAt(index) {
    certIndex = ((index % CERT_DEFS.length) + CERT_DEFS.length) % CERT_DEFS.length;
    lbOpen = true;
    buildThumbs();
    a11yLabels();
    renderCert();
    backdrop.classList.add("active");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function closeLb() {
    if (!lbOpen) return;
    lbOpen = false;
    backdrop.classList.remove("active");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    if (thumbsWrap) thumbsWrap.innerHTML = "";
  }

  document.querySelectorAll(".cert-trigger[data-cert-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-cert-index"), 10);
      openAt(Number.isFinite(i) ? i : 0);
    });
  });

  btnClose.addEventListener("click", closeLb);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLb();
  });
  btnPrev.addEventListener("click", () => {
    if (!lbOpen) return;
    certIndex = (certIndex - 1 + CERT_DEFS.length) % CERT_DEFS.length;
    renderCert();
  });
  btnNext.addEventListener("click", () => {
    if (!lbOpen) return;
    certIndex = (certIndex + 1) % CERT_DEFS.length;
    renderCert();
  });

  document.addEventListener("keydown", (e) => {
    if (!backdrop.classList.contains("active")) return;
    if (e.key === "Escape") {
      closeLb();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      certIndex = (certIndex - 1 + CERT_DEFS.length) % CERT_DEFS.length;
      renderCert();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      certIndex = (certIndex + 1) % CERT_DEFS.length;
      renderCert();
    }
  });

  langChangeCallbacks.push(() => {
    a11yLabels();
    if (lbOpen) renderCert();
  });
})();

/* ---- Accordion -------------------------------------------------------- */
(function initAccordion() {
  const items = document.querySelectorAll(".acc-item");
  if (!items.length) return;

  items[0].classList.add("is-open");

  items.forEach((item) => {
    const trigger = item.querySelector(".acc-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      items.forEach((i) => {
        i.classList.remove("is-open");
        i.querySelector(".acc-trigger").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

/* ---- Init language on load ------------------------------------------- */
applyLang(currentLang);
