/* ===================================================
   ITRB — main.js (с ISO сертификати, looping team slider и Careers)
   =================================================== */

// ========================
// Global Variables
// ========================
let contentData = null;
let currentLang = localStorage.getItem("itrb-lang") || "en";
const langChangeCallbacks = [];

// ========================
// Load Content from JSON File
// ========================
async function loadContent() {
    try {
        const response = await fetch('data/content.json?v=' + Date.now());
        if (!response.ok) throw new Error('JSON file not found');
        contentData = await response.json();
        console.log('Content loaded successfully');
        
        // Инициализираме team slider след зареждане на данните
        initTeamCarousel();
        
        applyLanguage(currentLang);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// ========================
// Get value by dot notation path
// ========================
function getValueByPath(obj, path) {
    if (!obj) return undefined;
    
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
        if (current === undefined || current === null) return undefined;
        
        const part = parts[i];
        
        if (Array.isArray(current) && !isNaN(part)) {
            current = current[parseInt(part)];
        } else {
            current = current[part];
        }
    }
    
    return current;
}

// ========================
// Apply Language to Page
// ========================
function applyLanguage(lang) {
    if (!contentData) return;
    
    currentLang = lang;
    localStorage.setItem("itrb-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.body.className = `lang-${lang}`;
    
    const langData = contentData[lang];
    if (!langData) {
        console.error('No data for language:', lang);
        return;
    }
    
    // Обновява всички елементи с data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getValueByPath(langData, key);
        if (value !== undefined && value !== null) {
            el.innerHTML = value;
        }
    });
    
    // Обновява елементи с data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = getValueByPath(langData, key);
        if (value !== undefined && value !== null) {
            el.setAttribute("placeholder", value);
        }
    });
    
    // Обновява елементи с data-i18n-aria-label
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria-label");
        const value = getValueByPath(langData, key);
        if (value !== undefined && value !== null) {
            el.setAttribute("aria-label", value);
        }
    });
    
    // Обновява team members - само ако carousel е инициализиран
    if (typeof teamTotal !== 'undefined' && teamTotal > 0) {
        updateTeamInfoBox();
    } else {
        const teamData = langData.team?.members;
        if (teamData && teamData.length > 0) {
            const showcaseName = document.getElementById('showcaseName');
            const showcaseRole = document.getElementById('showcaseRole');
            if (showcaseName) showcaseName.textContent = teamData[0].name;
            if (showcaseRole) showcaseRole.textContent = teamData[0].role;
        }
    }
    
    // Обновява ISO сертификатите (текстове и лайтбокс)
    updateCertificatesUI(langData);
    
    // Обновява празното съобщение за кариери (ако има такова)
    const emptyNoJobsEl = document.getElementById('careers-list-empty-no-jobs');
    if (emptyNoJobsEl && langData.careers?.listEmptyNoJobs) {
        emptyNoJobsEl.innerHTML = langData.careers.listEmptyNoJobs;
    }
    
    // Активен бутон за език
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    
    langChangeCallbacks.forEach(cb => cb(lang));
}

// ========================
// ISO CERTIFICATES
// ========================

let certDefinitions = [];

function loadCertDefinitions() {
    if (!contentData) return;
    const lang = currentLang === "bg" ? "bg" : "en";
    const certs = contentData[lang]?.certificates?.items;
    if (!certs || !certs.length) return;
    
    certDefinitions = certs.map((cert, idx) => ({
        titleKey: `certificates.items.${idx}.title`,
        en: cert.enImage,
        bg: cert.bgImage,
        index: idx
    }));
}

function updateCertificatesUI(langData) {
    if (!langData.certificates) return;
    
    const certTriggers = document.querySelectorAll('.cert-trigger');
    certTriggers.forEach((trigger, idx) => {
        const titleKey = `certificates.items.${idx}.title`;
        const title = getValueByPath(langData, titleKey);
        if (title) {
            const titleSpan = trigger.querySelector('.cert-title');
            if (titleSpan) titleSpan.textContent = title;
            trigger.setAttribute('aria-label', title);
        }
    });
    
    const certHeading = document.querySelector('[data-i18n="certificates.heading"]');
    const certIntro = document.querySelector('[data-i18n="certificates.intro"]');
    if (certHeading) certHeading.textContent = langData.certificates.heading || '';
    if (certIntro) certIntro.textContent = langData.certificates.intro || '';
    
    loadCertDefinitions();
    
    const backdrop = document.getElementById("certLightboxBackdrop");
    if (backdrop && backdrop.classList.contains("active")) {
        const imgEl = document.getElementById("certLightboxImg");
        const titleEl = document.getElementById("certLightboxTitle");
        const counterEl = document.getElementById("certLightboxCounter");
        
        if (imgEl && certDefinitions.length > 0) {
            const currentIndex = parseInt(counterEl?.textContent?.split('/')[0]?.trim() || '1') - 1;
            const validIndex = Math.min(Math.max(0, currentIndex), certDefinitions.length - 1);
            const def = certDefinitions[validIndex];
            if (def) {
                const lang = currentLang === "bg" ? "bg" : "en";
                const title = getValueByPath(langData, def.titleKey) || def.titleKey;
                imgEl.src = lang === "bg" ? def.bg : def.en;
                if (titleEl) titleEl.textContent = title;
                if (counterEl) counterEl.textContent = `${validIndex + 1} / ${certDefinitions.length}`;
            }
        }
        
        const thumbsWrap = document.getElementById("certLightboxThumbs");
        if (thumbsWrap) {
            const currentThumbs = thumbsWrap.querySelectorAll(".cert-lightbox-thumb");
            currentThumbs.forEach((btn, i) => {
                const im = btn.querySelector("img");
                if (im && certDefinitions[i]) {
                    const lang = currentLang === "bg" ? "bg" : "en";
                    im.src = lang === "bg" ? certDefinitions[i].bg : certDefinitions[i].en;
                }
                const lbl = getValueByPath(langData, certDefinitions[i]?.titleKey) || `Certificate ${i + 1}`;
                btn.setAttribute("aria-label", lbl);
            });
        }
    }
}

function initCertLightbox() {
    const backdrop = document.getElementById("certLightboxBackdrop");
    if (!backdrop) return;
    
    loadCertDefinitions();
    
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
        const langData = contentData?.[currentLang];
        const certData = langData?.certificates;
        btnClose.setAttribute("aria-label", certData?.a11yClose || "Close");
        btnPrev.setAttribute("aria-label", certData?.a11yPrev || "Previous");
        btnNext.setAttribute("aria-label", certData?.a11yNext || "Next");
        if (thumbsWrap) {
            thumbsWrap.setAttribute("aria-label", certData?.thumbsGroup || "All certificates");
        }
    }
    
    function imageUrl(i) {
        const def = certDefinitions[i];
        if (!def) return '';
        const lang = currentLang === "bg" ? "bg" : "en";
        return lang === "bg" ? def.bg : def.en;
    }
    
    function getCertTitle(i) {
        const langData = contentData?.[currentLang];
        if (!langData || !certDefinitions[i]) return `Certificate ${i + 1}`;
        const title = getValueByPath(langData, certDefinitions[i].titleKey);
        return title || `Certificate ${i + 1}`;
    }
    
    function buildThumbs() {
        if (!thumbsWrap) return;
        thumbsWrap.innerHTML = "";
        certDefinitions.forEach((def, i) => {
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
        const def = certDefinitions[certIndex];
        if (!def) return;
        const title = getCertTitle(certIndex);
        titleEl.textContent = title;
        imgEl.alt = title;
        imgEl.src = imageUrl(certIndex);
        counterEl.textContent = `${certIndex + 1} / ${certDefinitions.length}`;
        if (thumbsWrap) {
            thumbsWrap.querySelectorAll(".cert-lightbox-thumb").forEach((btn, i) => {
                const im = btn.querySelector("img");
                if (im) im.src = imageUrl(i);
                const lbl = getCertTitle(i);
                btn.setAttribute("aria-label", lbl);
                btn.setAttribute("aria-pressed", String(i === certIndex));
                btn.classList.toggle("is-active", i === certIndex);
            });
        }
    }
    
    function openAt(index) {
        if (certDefinitions.length === 0) return;
        certIndex = ((index % certDefinitions.length) + certDefinitions.length) % certDefinitions.length;
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
    
    if (btnClose) btnClose.addEventListener("click", closeLb);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeLb();
    });
    if (btnPrev) btnPrev.addEventListener("click", () => {
        if (!lbOpen) return;
        certIndex = (certIndex - 1 + certDefinitions.length) % certDefinitions.length;
        renderCert();
    });
    if (btnNext) btnNext.addEventListener("click", () => {
        if (!lbOpen) return;
        certIndex = (certIndex + 1) % certDefinitions.length;
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
            certIndex = (certIndex - 1 + certDefinitions.length) % certDefinitions.length;
            renderCert();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            certIndex = (certIndex + 1) % certDefinitions.length;
            renderCert();
        }
    });
}

// ========================
// TEAM CAROUSEL (LOOPING)
// ========================

let teamMembers = [];
let teamCarouselItems = [];
let teamTotal = 0;
let teamDomOffset = 0;
let teamIsAnimating = false;
let teamAutoTimer = null;

function initTeamCarousel() {
    const carouselEl = document.getElementById("teamCarousel");
    if (!carouselEl) return;
    
    const langData = contentData[currentLang];
    if (!langData || !langData.team || !langData.team.members) return;
    
    teamMembers = langData.team.members;
    teamTotal = teamMembers.length;
    
    if (teamTotal === 0) return;
    
    const realItems = Array.from(carouselEl.querySelectorAll(".team-carousel-item"));
    realItems.forEach((item, idx) => {
        item.setAttribute('data-member-idx', idx);
        const btn = item.querySelector('.carousel-view-btn');
        if (btn) {
            btn.setAttribute('data-member-idx', idx);
        }
    });
    
    const allExisting = carouselEl.querySelectorAll(".team-carousel-item");
    allExisting.forEach(item => {
        if (item.classList.contains("is-clone")) item.remove();
    });
    
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    
    realItems.forEach((item, idx) => {
        const cloneBefore = item.cloneNode(true);
        const cloneAfter = item.cloneNode(true);
        cloneBefore.classList.add("is-clone");
        cloneAfter.classList.add("is-clone");
        cloneBefore.setAttribute("aria-hidden", "true");
        cloneAfter.setAttribute("aria-hidden", "true");
        
        cloneBefore.setAttribute('data-member-idx', idx);
        cloneAfter.setAttribute('data-member-idx', idx);
        
        const btnBefore = cloneBefore.querySelector('.carousel-view-btn');
        const btnAfter = cloneAfter.querySelector('.carousel-view-btn');
        if (btnBefore) btnBefore.setAttribute('data-member-idx', idx);
        if (btnAfter) btnAfter.setAttribute('data-member-idx', idx);
        
        cloneBefore.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
        cloneAfter.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
        
        before.appendChild(cloneBefore);
        after.appendChild(cloneAfter);
    });
    
    carouselEl.insertBefore(before, carouselEl.firstChild);
    carouselEl.appendChild(after);
    
    teamCarouselItems = Array.from(carouselEl.querySelectorAll(".team-carousel-item"));
    
    teamCarouselItems.forEach((item) => {
        if (item.classList.contains("is-clone")) {
            item.style.removeProperty("opacity");
            item.style.removeProperty("transform");
        }
    });
    
    teamDomOffset = teamTotal;
    
    setupTeamCarouselControls();
    updateTeamCarouselTransform(false);
    updateTeamInfoBox();
    startTeamAutoSlide();
}

function setupTeamCarouselControls() {
    const carouselEl = document.getElementById("teamCarousel");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const carouselOuter = document.querySelector(".team-carousel-outer");
    
    if (!carouselEl) return;
    
    function slide(dir) {
        if (teamIsAnimating) return;
        teamIsAnimating = true;
        
        teamDomOffset += dir;
        updateTeamCarouselTransform(true);
        
        setTimeout(() => {
            if (teamDomOffset >= teamTotal * 2) {
                teamDomOffset -= teamTotal;
                updateTeamCarouselTransform(false);
            } else if (teamDomOffset < teamTotal) {
                teamDomOffset += teamTotal;
                updateTeamCarouselTransform(false);
            }
            updateTeamInfoBox();
            teamIsAnimating = false;
        }, 560);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            slide(-1);
            restartTeamAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            slide(1);
            restartTeamAutoSlide();
        });
    }
    
    let touchStartX = 0;
    carouselEl.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    carouselEl.addEventListener("touchend", (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            slide(diff > 0 ? 1 : -1);
            restartTeamAutoSlide();
        }
    });
    
    if (carouselOuter) {
        carouselOuter.addEventListener("mouseenter", stopTeamAutoSlide);
        carouselOuter.addEventListener("mouseleave", startTeamAutoSlide);
    }
    
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateTeamCarouselTransform(false);
        }, 120);
    });
}

function updateTeamCarouselTransform(animated) {
    const carouselEl = document.getElementById("teamCarousel");
    if (!carouselEl || teamCarouselItems.length === 0) return;
    
    const width = teamCarouselItems[0]?.offsetWidth || 0;
    
    if (!animated) carouselEl.style.transition = "none";
    carouselEl.style.transform = `translateX(-${teamDomOffset * width}px)`;
    
    if (!animated) {
        setTimeout(() => {
            carouselEl.style.removeProperty("transition");
        }, 50);
    }
}

function updateTeamInfoBox() {
    if (teamTotal === 0 || !teamMembers.length) {
        const langData = contentData?.[currentLang];
        const teamData = langData?.team?.members;
        if (teamData && teamData.length > 0) {
            const showcaseName = document.getElementById('showcaseName');
            const showcaseRole = document.getElementById('showcaseRole');
            if (showcaseName) showcaseName.textContent = teamData[0].name;
            if (showcaseRole) showcaseRole.textContent = teamData[0].role;
        }
        return;
    }
    
    const realIndex = (teamDomOffset % teamTotal + teamTotal) % teamTotal;
    const member = teamMembers[realIndex];
    const showcaseName = document.getElementById('showcaseName');
    const showcaseRole = document.getElementById('showcaseRole');
    
    if (member && showcaseName && showcaseRole) {
        showcaseName.textContent = member.name;
        showcaseRole.textContent = member.role;
    }
}

function startTeamAutoSlide() {
    stopTeamAutoSlide();
    teamAutoTimer = setInterval(() => {
        if (!teamIsAnimating) {
            teamDomOffset += 1;
            updateTeamCarouselTransform(true);
            
            setTimeout(() => {
                if (teamDomOffset >= teamTotal * 2) {
                    teamDomOffset -= teamTotal;
                    updateTeamCarouselTransform(false);
                }
                updateTeamInfoBox();
            }, 560);
        }
    }, 5000);
}

function stopTeamAutoSlide() {
    if (teamAutoTimer) clearInterval(teamAutoTimer);
    teamAutoTimer = null;
}

function restartTeamAutoSlide() {
    stopTeamAutoSlide();
    startTeamAutoSlide();
}

// ========================
// Team Modal
// ========================
function openTeamModal(index) {
    const langData = contentData[currentLang];
    if (!langData) return;
    
    const teamData = langData.team?.members;
    if (!teamData || !teamData[index]) return;
    
    const member = teamData[index];
    const modal = document.getElementById('teamModal');
    const modalBackdrop = document.getElementById('teamModalBackdrop');
    const modalPhoto = document.getElementById('modalPhoto');
    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalBio = document.getElementById('modalBio');
    
    const allItems = document.querySelectorAll('.team-carousel-item');
    let targetImg = null;
    
    for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        const itemIdx = parseInt(item.getAttribute('data-member-idx'));
        if (itemIdx === index) {
            targetImg = item.querySelector('img');
            break;
        }
    }
    
    if (targetImg && modalPhoto) {
        modalPhoto.src = targetImg.src;
        modalPhoto.alt = targetImg.alt;
    }
    
    if (modalName) modalName.textContent = member.name;
    if (modalRole) modalRole.textContent = member.role;
    if (modalBio) modalBio.textContent = member.bio;
    
    if (modalBackdrop) modalBackdrop.classList.add('active');
    if (modal) modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    stopTeamAutoSlide();
}

function closeTeamModal() {
    const modalBackdrop = document.getElementById('teamModalBackdrop');
    const modal = document.getElementById('teamModal');
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
    startTeamAutoSlide();
}

function setupTeamModal() {
    const modalBackdrop = document.getElementById('teamModalBackdrop');
    const closeBtn = document.getElementById('modalClose');
    
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.carousel-view-btn, #showcaseViewBtn');
        if (!btn) return;
        
        e.preventDefault();
        
        let idx = btn.getAttribute('data-member-idx');
        
        if (idx === null) {
            const parentItem = btn.closest('.team-carousel-item');
            if (parentItem) {
                idx = parentItem.getAttribute('data-member-idx');
            }
        }
        
        if (idx === null && btn.id === 'showcaseViewBtn') {
            idx = (teamDomOffset % teamTotal + teamTotal) % teamTotal;
        } else if (idx !== null) {
            idx = parseInt(idx);
        } else {
            idx = 0;
        }
        
        openTeamModal(idx);
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeTeamModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeTeamModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeTeamModal();
    });
}

// ========================
// CAREERS PAGE
// ========================

(function initCareersListing() {
  const listRoot = document.querySelector("[data-careers-list]");
  const form = document.getElementById("careers-filters");
  const emptyEl = document.getElementById("careers-list-empty");
  const emptyNoJobsEl = document.getElementById("careers-list-empty-no-jobs");
  if (!listRoot || !form) return;

  const citySel = document.getElementById("careers-filter-city");
  const deptSel = document.getElementById("careers-filter-dept");
  const searchInput = document.getElementById("careers-search-input");
  const suggestUl = document.getElementById("careers-search-suggestions");
  const resetCityBtn = document.getElementById("careers-filter-reset-city");
  const resetDeptBtn = document.getElementById("careers-filter-reset-dept");
  const resetSearchBtn = document.getElementById("careers-filter-reset-search");

  let careersData = null;

  async function loadCareersFromJSON() {
    try {
      const response = await fetch('data/content.json?v=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        careersData = data[currentLang]?.careers;
        renderCareersJobs();
        updateDepartmentOptions();
        applyFilters();
      }
    } catch (error) {
      console.error('Error loading careers:', error);
    }
  }

  function renderCareersJobs() {
    if (!careersData || !careersData.positions || careersData.positions.length === 0) {
      listRoot.innerHTML = '';
      if (emptyNoJobsEl) emptyNoJobsEl.hidden = false;
      if (emptyEl) emptyEl.hidden = true;
      form.hidden = true;
      listRoot.hidden = true;
      return;
    }

    form.hidden = false;
    listRoot.hidden = false;
    if (emptyNoJobsEl) emptyNoJobsEl.hidden = true;

    listRoot.innerHTML = careersData.positions.map(job => {
        // Генерираме slug за детайлната страница
        const slug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const detailUrl = `careers-job-${slug}.html`;
        
        return `
      <article class="careers-job-card" data-careers-job
               data-city="${job.city || 'sofia'}"
               data-department="${(job.department || 'General').toLowerCase().replace(/ /g, '-')}"
               data-search="${escapeCareerHtml(job.title)} ${escapeCareerHtml(job.location || '')} ${escapeCareerHtml(job.description || '')}">
        <div class="careers-card-main">
          <h3 class="position-title">${escapeCareerHtml(job.title)}</h3>
          <div class="careers-card-details">
            <p class="position-desc"><strong data-i18n="careers.location">Location:</strong> ${escapeCareerHtml(job.location || 'Sofia, Bulgaria')}</p>
            ${job.type ? `<p class="position-type"><strong data-i18n="careers.type">Type:</strong> ${escapeCareerHtml(job.type)}</p>` : ''}
          </div>
          ${job.description ? `<p class="position-short-desc">${escapeCareerHtml(job.description.substring(0, 150))}${job.description.length > 150 ? '...' : ''}</p>` : ''}
        </div>
        <div class="careers-card-aside">
          <a href="${detailUrl}" class="btn btn-outline btn-sm" data-i18n="careers.card.apply">View Details →</a>
        </div>
      </article>
    `}).join('');
  }

  function updateDepartmentOptions() {
    if (!deptSel || !careersData?.positions) return;
    
    const langData = contentData?.[currentLang];
    const allText = langData?.careers?.filter?.all || 'All';
    const departments = [...new Set(careersData.positions.map(p => p.department || 'General'))];
    const currentValue = deptSel.value;
    
    deptSel.innerHTML = `<option value="" data-i18n="careers.filter.all">${allText}</option>` +
      departments.map(dept => {
        const deptKey = dept.toLowerCase().replace(/ /g, '-');
        const deptName = langData?.careers?.filter?.dept?.[deptKey] || dept;
        return `<option value="${deptKey}">${deptName}</option>`;
      }).join('');
    if (currentValue) deptSel.value = currentValue;
    
    const deptWrap = deptSel.closest('[data-careers-dd]');
    if (deptWrap) {
      const valueSpan = deptWrap.querySelector('.careers-dd__value');
      if (valueSpan) {
        const opt = deptSel.options[deptSel.selectedIndex];
        valueSpan.textContent = opt ? opt.textContent.trim() : allText;
      }
    }
  }

  function allJobs() {
    return listRoot.querySelectorAll("[data-careers-job]");
  }

  function jobTitleEl(card) {
    return card.querySelector(".position-title");
  }

  function jobMatchesSearch(card, q) {
    const needle = q.trim().toLowerCase();
    if (needle.length < 3) return true;
    const title = jobTitleEl(card)?.textContent || "";
    const extra = card.getAttribute("data-search") || "";
    const haystack = `${title.toLowerCase()} ${extra.toLowerCase()}`;
    if (haystack.includes(needle)) return true;
    const words = needle.split(/\s+/).filter((w) => w.length >= 2);
    if (words.length < 2) return haystack.includes(needle);
    return words.every((w) => haystack.includes(w));
  }

  function applyFilters() {
    const totalJobs = allJobs().length;
    if (totalJobs === 0) {
      if (emptyEl) emptyEl.hidden = true;
      if (emptyNoJobsEl) emptyNoJobsEl.hidden = false;
      form.hidden = true;
      listRoot.hidden = true;
      return;
    }

    form.hidden = false;
    listRoot.hidden = false;
    if (emptyNoJobsEl) emptyNoJobsEl.hidden = true;

    const city = citySel?.value || "";
    const dept = deptSel?.value || "";
    const q = searchInput?.value || "";
    let visible = 0;

    allJobs().forEach((card) => {
      const c = card.getAttribute("data-city") || "";
      const d = card.getAttribute("data-department") || "";
      const okCity = !city || c === city;
      const okDept = !dept || d === dept;
      const okSearch = jobMatchesSearch(card, q);
      const show = okCity && okDept && okSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (emptyEl) emptyEl.hidden = visible > 0;
    updateFilterResetButtons();
  }

  function updateFilterResetButtons() {
    const showCity = Boolean(citySel?.value);
    if (resetCityBtn) {
      resetCityBtn.classList.toggle("is-visible", showCity);
      resetCityBtn.setAttribute("aria-hidden", showCity ? "false" : "true");
      resetCityBtn.setAttribute("tabindex", showCity ? "0" : "-1");
    }
    const showDept = Boolean(deptSel?.value);
    if (resetDeptBtn) {
      resetDeptBtn.classList.toggle("is-visible", showDept);
      resetDeptBtn.setAttribute("aria-hidden", showDept ? "false" : "true");
      resetDeptBtn.setAttribute("tabindex", showDept ? "0" : "-1");
    }
    const showSearch = Boolean(searchInput?.value?.trim());
    if (resetSearchBtn) {
      resetSearchBtn.classList.toggle("is-visible", showSearch);
      resetSearchBtn.setAttribute("aria-hidden", showSearch ? "false" : "true");
      resetSearchBtn.setAttribute("tabindex", showSearch ? "0" : "-1");
    }
  }

  function setupCareersDropdown(selectEl, onChange) {
    const wrap = selectEl.closest("[data-careers-dd]");
    const openBtn = wrap?.querySelector(".careers-dd__open");
    const chevBtn = wrap?.querySelector(".careers-dd__chevron-btn");
    const panel = wrap?.querySelector(".careers-dd__panel");
    const valueSpan = wrap?.querySelector(".careers-dd__value");
    if (!wrap || !openBtn || !panel || !valueSpan) return null;

    function closePanel() {
      panel.hidden = true;
      wrap.classList.remove("is-open");
      openBtn.setAttribute("aria-expanded", "false");
    }

    function syncTrigger() {
      const opt = selectEl.options[selectEl.selectedIndex];
      valueSpan.textContent = opt ? opt.textContent.trim() : "";
    }

    function buildPanel() {
      panel.innerHTML = "";
      const selIdx = selectEl.selectedIndex;
      Array.from(selectEl.options).forEach((opt, i) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.className = "careers-dd__option";
        li.setAttribute("data-value", opt.value);
        const selected = i === selIdx;
        li.setAttribute("aria-selected", selected ? "true" : "false");
        if (selected) li.classList.add("is-selected");
        li.textContent = opt.textContent.trim();
        li.addEventListener("mousedown", (e) => e.preventDefault());
        li.addEventListener("click", () => {
          selectEl.selectedIndex = i;
          syncTrigger();
          closePanel();
          selectEl.dispatchEvent(new Event("change", { bubbles: true }));
          onChange();
        });
        panel.appendChild(li);
      });
    }

    function openPanel() {
      document.querySelectorAll("[data-careers-dd]").forEach((w) => {
        if (w === wrap) return;
        const p = w.querySelector(".careers-dd__panel");
        const b = w.querySelector(".careers-dd__open");
        if (p && !p.hidden) {
          p.hidden = true;
          w.classList.remove("is-open");
          b?.setAttribute("aria-expanded", "false");
        }
      });
      buildPanel();
      panel.hidden = false;
      wrap.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
    }

    function togglePanel(e) {
      e.stopPropagation();
      if (panel.hidden) openPanel();
      else closePanel();
    }

    openBtn.addEventListener("click", togglePanel);
    chevBtn?.addEventListener("click", togglePanel);
    selectEl.addEventListener("change", onChange);
    langChangeCallbacks.push(() => {
      syncTrigger();
      if (!panel.hidden) buildPanel();
    });
    syncTrigger();
    return { closePanel };
  }

  function closeSuggestions() {
    if (!suggestUl || !searchInput) return;
    suggestUl.hidden = true;
    suggestUl.innerHTML = "";
    searchInput.setAttribute("aria-expanded", "false");
  }

  function openSuggestionsIfAny() {
    if (!suggestUl || !searchInput) return;
    const hasItems = suggestUl.children.length > 0;
    suggestUl.hidden = !hasItems;
    searchInput.setAttribute("aria-expanded", hasItems ? "true" : "false");
  }

  let suggestDebounce;
  function buildSuggestions() {
    if (!suggestUl || !searchInput) return;
    const q = searchInput.value.trim().toLowerCase();
    suggestUl.innerHTML = "";
    if (q.length < 3) {
      closeSuggestions();
      return;
    }
    const seen = new Set();
    allJobs().forEach((card) => {
      const title = jobTitleEl(card)?.textContent || "";
      if (!title || seen.has(title)) return;
      const extra = card.getAttribute("data-search") || "";
      const haystack = `${title.toLowerCase()} ${extra.toLowerCase()}`;
      if (haystack.includes(q)) {
        seen.add(title);
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.className = "careers-search-suggestions__item careers-floating-panel__item";
        li.textContent = title;
        li.addEventListener("mousedown", (e) => e.preventDefault());
        li.addEventListener("click", () => {
          searchInput.value = title;
          closeSuggestions();
          applyFilters();
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        suggestUl.appendChild(li);
      }
    });
    openSuggestionsIfAny();
  }

  function debouncedSuggestions() {
    clearTimeout(suggestDebounce);
    suggestDebounce = setTimeout(buildSuggestions, 200);
  }

  if (citySel) setupCareersDropdown(citySel, applyFilters);
  if (deptSel) setupCareersDropdown(deptSel, applyFilters);

  searchInput?.addEventListener("input", () => {
    debouncedSuggestions();
    applyFilters();
  });
  searchInput?.addEventListener("focus", () => {
    if ((searchInput.value || "").trim().length >= 3) buildSuggestions();
  });

  function closeAllCareersDropdowns() {
    document.querySelectorAll("[data-careers-dd]").forEach((w) => {
      const p = w.querySelector(".careers-dd__panel");
      const b = w.querySelector(".careers-dd__open");
      if (p && !p.hidden) {
        p.hidden = true;
        w.classList.remove("is-open");
        b?.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", (e) => {
    const raw = e.target;
    const el = raw.nodeType === Node.ELEMENT_NODE ? raw : raw.parentElement;
    if (el && typeof el.closest === "function" && !el.closest("[data-careers-dd]")) {
      closeAllCareersDropdowns();
    }
    if (searchInput && suggestUl) {
      const wrap = searchInput.closest(".careers-search-wrap");
      const node = el || raw;
      if (wrap && !wrap.contains(node)) closeSuggestions();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllCareersDropdowns();
    closeSuggestions();
  });

  function syncAllCareersDropdownTriggers() {
    document.querySelectorAll("[data-careers-dd]").forEach((w) => {
      const sel = w.querySelector("select.careers-filters__select-native");
      const span = w.querySelector(".careers-dd__value");
      if (sel && span) {
        const opt = sel.options[sel.selectedIndex];
        span.textContent = opt ? opt.textContent.trim() : "";
      }
    });
  }

  resetCityBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (citySel) citySel.selectedIndex = 0;
    closeAllCareersDropdowns();
    syncAllCareersDropdownTriggers();
    applyFilters();
  });

  resetDeptBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (deptSel) deptSel.selectedIndex = 0;
    closeAllCareersDropdowns();
    syncAllCareersDropdownTriggers();
    applyFilters();
  });

  resetSearchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchInput) searchInput.value = "";
    closeSuggestions();
    applyFilters();
  });

  function escapeCareerHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  }

  // Добавяме loadCareersFromJSON към langChangeCallbacks
  langChangeCallbacks.push(() => {
    loadCareersFromJSON();
  });

  loadCareersFromJSON();
})();

// ========================
// Language Switcher
// ========================
document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        applyLanguage(btn.dataset.lang);
    });
});

// ========================
// Sticky Nav
// ========================
const navbar = document.getElementById("navbar");
if (navbar) {
    function onScroll() {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
}

// ========================
// Smooth scroll for anchor links
// ========================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (href === "#" || !href) return;
    a.addEventListener("click", (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        const navLinks = document.getElementById("navLinks");
        const hamburger = document.getElementById("hamburger");
        if (navLinks) navLinks.classList.remove("open");
        if (hamburger) hamburger.classList.remove("open");
    });
});

// ========================
// Hamburger Menu
// ========================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    if (navbar) navbar.insertAdjacentElement("afterend", backdrop);
    
    let menuScrollY = 0;
    
    function openMenu() {
        menuScrollY = window.scrollY;
        hamburger.classList.add("open");
        navLinks.classList.add("open");
        backdrop.classList.add("visible");
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${menuScrollY}px`;
    }
    
    function closeMenu() {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
        backdrop.classList.remove("visible");
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, menuScrollY);
    }
    
    hamburger.addEventListener("click", () => {
        navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });
    
    backdrop.addEventListener("click", closeMenu);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });
    
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && navLinks.classList.contains("open")) closeMenu();
    });
}

// ========================
// Contact Form
// ========================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    function loadCaptcha() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 9) + 1;
        const captchaQuestion = document.getElementById("captchaQuestion");
        const captchaToken = document.getElementById("captchaToken");
        if (captchaQuestion) captchaQuestion.textContent = a + " + " + b;
        if (captchaToken) captchaToken.value = btoa(a + ":" + b + ":" + (Date.now() + 600000));
        const captchaAnswer = document.getElementById("captchaAnswer");
        if (captchaAnswer) captchaAnswer.value = "";
    }
    loadCaptcha();
    
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const status = document.getElementById("formStatus");
        if (status) status.textContent = "Sending...";
        
        const formData = new FormData(contactForm);
        try {
            const res = await fetch("contact.php", { method: "POST", body: formData });
            const data = await res.json();
            if (status) {
                status.textContent = data.success ? "Message sent!" : "Error: " + data.message;
                status.className = data.success ? "success" : "error";
            }
            if (data.success) contactForm.reset();
            loadCaptcha();
        } catch {
            if (status) {
                status.textContent = "Error sending message";
                status.className = "error";
            }
        }
    });
}

// ========================
// Animations
// ========================
const hero = document.querySelector(".hero");
if (hero) {
    setTimeout(() => hero.classList.add("hero-visible"), 100);
}

const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")),
    { threshold: 0.1 }
);
document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => revealObserver.observe(el));

// ========================
// Accordion
// ========================
document.querySelectorAll(".acc-item").forEach((item, i) => {
    if (i === 0) item.classList.add("is-open");
    const trigger = item.querySelector(".acc-trigger");
    if (trigger) {
        trigger.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");
            document.querySelectorAll(".acc-item").forEach(a => a.classList.remove("is-open"));
            if (!isOpen) item.classList.add("is-open");
        });
    }
});

// ========================
// Initialize
// ========================
loadContent();
setupTeamModal();
initCertLightbox();

window.applyLanguage = applyLanguage;
window.switchLanguage = applyLanguage;
window.openTeamModal = openTeamModal;
window.closeTeamModal = closeTeamModal;

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}