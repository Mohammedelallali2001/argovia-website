/* ==========================================================================
   ARGOV — interactions
   ========================================================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header state + reading progress ---------- */
  const header = $(".site-header");
  const progress = $(".page-progress");
  const scrollCue = $(".scroll-cue");
  const backTop = $(".back-to-top");
  if (backTop) {
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* nav spy — highlight the section currently in view */
  const navLinks = $$(".desktop-nav a");
  const spySections = navLinks
    .map((link) => ({ link, el: $(link.getAttribute("href")) }))
    .filter((item) => item.el);

  const updateSpy = (y) => {
    if (!spySections.length) return;
    const probe = y + window.innerHeight * 0.4;
    let current = null;
    spySections.forEach((item) => {
      if (item.el.getBoundingClientRect().top + y <= probe) current = item;
    });
    spySections.forEach((item) => item.link.classList.toggle("is-active", item === current));
  };

  /* studio clock — always shows the Fez, Morocco time */
  const clockEl = $("[data-clock]");
  if (clockEl) {
    const clockFmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Casablanca",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const tickClock = () => {
      clockEl.textContent = clockFmt.format(new Date());
    };
    tickClock();
    setInterval(tickClock, 20000);
  }

  /* ---------- Background process: parallax decor field ---------- */
  const fieldItems = $$(".bg-field [data-px]");

  const updateField = (y) => {
    if (!fieldItems.length) return;
    fieldItems.forEach((el) => {
      const k = parseFloat(el.dataset.px) || 0;
      const rot = parseFloat(el.dataset.rot) || 0;
      el.style.transform = `translate3d(0, ${(y * k).toFixed(1)}px, 0) rotate(${(y * rot).toFixed(2)}deg)`;
    });
  };

  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (backTop) backTop.classList.toggle("is-visible", y > 480);
    updateSpy(y);
    if (!reduceMotion) updateField(y);

    if (progress) {
      const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = `${pct}%`;
    }

    if (scrollCue) scrollCue.classList.toggle("is-hidden", y > 80);

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const nav = $(".desktop-nav");

  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      window.setTimeout(() => {
        const first = nav?.querySelector("a");
        first?.focus();
      }, 20);
    }
  };

  toggle?.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    const isOpen = document.body.classList.contains("menu-open");
    if (event.key === "Escape" && isOpen) {
      setMenu(false);
      toggle?.focus();
      return;
    }
    if (isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp") && nav) {
      const links = Array.from(nav.querySelectorAll("a")).filter((a) => a.offsetParent !== null);
      if (!links.length) return;
      event.preventDefault();
      const idx = links.indexOf(document.activeElement);
      let next = idx + (event.key === "ArrowDown" ? 1 : -1);
      if (next < 0) next = links.length - 1;
      if (next >= links.length) next = 0;
      links[next].focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ---------- Seamless marquee ---------- */
  const track = $(".marquee-track");
  if (track && !reduceMotion) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- Hero mascot: cursor-tracking character ---------- */
  const mascotBox = $(".mascot");
  if (mascotBox && !reduceMotion) {
    const mBodies = $$(".mascot-body", mascotBox);
    const mPupils = $$(".m-pupil", mascotBox);
    const mEyes = $$(".m-eye", mascotBox);
    const skews = { b1: -18, b2: -9, b3: -6, b4: -6 };
    const skewOf = (el) => skews[["b1", "b2", "b3", "b4"].find((c) => el.classList.contains(c))] || -6;

    let mouseX = -1e4;
    let mouseY = -1e4;
    let mascotRaf = 0;
    let mouseSeen = false;
    let held = false;
    const floating = new Set(); // slabs currently picked up (dragged)

    const mLead = mBodies[0];
    const mTail = mBodies[mBodies.length - 1];

    const applyMascot = () => {
      mascotRaf = 0;
      const r = mascotBox.getBoundingClientRect();
      const dxRaw = (mouseX - (r.left + r.width / 2)) / Math.max(r.width, 1);
      /* don't let the slabs slide past their box — they stop a few px
         short of the edge so they never look cropped */
      const kMax = Math.max(0.01, ...mBodies.map((b) => Math.abs(parseFloat(b.dataset.slide) || 0)));
      const slack = Math.max(
        6,
        Math.min(mLead.offsetLeft, mascotBox.offsetWidth - (mTail.offsetLeft + mTail.offsetWidth)) - 5
      );
      const dxMax = Math.max(0.05, slack / (200 * kMax));
      const dx = Math.max(-dxMax, Math.min(dxMax, dxRaw));
      mBodies.forEach((b) => {
        if (floating.has(b)) return; // picked-up slabs are positioned directly
        const k = parseFloat(b.dataset.slide) || 0;
        const push = Math.max(-60, Math.min(60, dx * 200 * k));
        b.style.transform = `skewX(${skewOf(b)}deg) translateX(${push.toFixed(1)}px)`;
      });
      mPupils.forEach((p) => {
        const pr = p.getBoundingClientRect();
        const ex = pr.left + pr.width / 2;
        const ey = pr.top + pr.height / 2;
        const ang = Math.atan2(mouseY - ey, mouseX - ex);
        const dist = Math.hypot(mouseX - ex, mouseY - ey);
        const d = held ? Math.min(7, dist / 32) : Math.min(3.5, dist / 90);
        p.style.transform = `translate(${(Math.cos(ang) * d).toFixed(2)}px, ${(Math.sin(ang) * d).toFixed(2)}px)${held ? " scale(1.45)" : ""}`;
      });
    };

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!mouseSeen) {
        mouseSeen = true;
        applyMascot();
        return;
      }
      if (!mascotRaf) mascotRaf = requestAnimationFrame(applyMascot);
    }, { passive: true });

    /* the character settles back when the cursor leaves the page */
    const settleMascot = () => {
      mBodies.forEach((b) => { b.style.transform = `skewX(${skewOf(b)}deg)`; });
      mPupils.forEach((p) => { p.style.transform = "translate(0, 0)"; });
    };
    document.documentElement.addEventListener("mouseleave", settleMascot);
    window.addEventListener("blur", settleMascot);

    window.addEventListener("scroll", () => {
      if (mouseSeen && !mascotRaf) mascotRaf = requestAnimationFrame(applyMascot);
    }, { passive: true });

    /* occasional blink of the round eyes */
    setInterval(() => {
      if (document.hidden) return;
      mEyes.forEach((eye) => {
        eye.style.height = "5px";
        setTimeout(() => { eye.style.height = ""; }, 130);
      });
    }, 4200);

    /* ---------- Drag each slab independently ---------- */
    const MOVE_KEY = "argov-mascot-slabs";
    const slabs = mBodies;
    const home = slabs.map((slab) => ({
      parent: mascotBox,
      next: slab.nextSibling
    }));

    let dragRaf = 0;
    let cur = null;

    const floatSlab = (slab, i) => {
      if (floating.has(slab)) return;
      const r = slab.getBoundingClientRect();
      /* keep the slab's exact current look (skew + lean) so it doesn't
         pop when lifted — only the position changes */
      const kept = getComputedStyle(slab).transform;
      document.body.appendChild(slab);
      slab.style.position = "fixed";
      slab.style.left = `${r.left}px`;
      slab.style.top = `${r.top}px`;
      slab.style.margin = "0";
      slab.style.zIndex = "120";
      slab.style.transform = kept && kept !== "none" ? kept : "";
      floating.add(slab);
    };

    const homeSlab = (slab, i) => {
      const h = home[i];
      if (h.parent) {
        if (h.next) h.parent.insertBefore(slab, h.next);
        else h.parent.appendChild(slab);
      }
      slab.style.position = "";
      slab.style.left = "";
      slab.style.top = "";
      slab.style.width = "";
      slab.style.margin = "";
      slab.style.zIndex = "";
      slab.style.transform = "";
      floating.delete(slab);
    };

    const applyDrag = () => {
      dragRaf = 0;
      if (!cur) return;
      cur.slab.style.left = `${cur.anchorX + (cur.targetX - cur.grabX)}px`;
      cur.slab.style.top = `${cur.anchorY + (cur.targetY - cur.grabY)}px`;
      mouseX = cur.targetX;
      mouseY = cur.targetY;
      if (!mascotRaf) mascotRaf = requestAnimationFrame(applyMascot);
    };

    const startSlab = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.pointerType === "touch") return; // never drag via touch
      const slab = e.currentTarget;
      e.preventDefault();
      const i = slabs.indexOf(slab);
      if (i < 0) return;
      if (!floating.has(slab)) floatSlab(slab, i);
      const r = slab.getBoundingClientRect();
      cur = {
        slab,
        i,
        anchorX: r.left,
        anchorY: r.top,
        grabX: e.clientX,
        grabY: e.clientY,
        targetX: e.clientX,
        targetY: e.clientY
      };
      held = true;
      slab.classList.add("is-dragging");
      try { slab.setPointerCapture(e.pointerId); } catch (err) {}
    };

    const moveSlab = (e) => {
      if (!cur) return;
      cur.targetX = e.clientX;
      cur.targetY = e.clientY;
      if (!dragRaf) dragRaf = requestAnimationFrame(applyDrag);
    };

    const persistSlabs = () => {
      try {
        const arr = slabs.map((slab) => {
          if (!floating.has(slab)) return null;
          const r = slab.getBoundingClientRect();
          return { x: Math.round(r.left), y: Math.round(r.top) };
        });
        localStorage.setItem(MOVE_KEY, JSON.stringify(arr));
      } catch (err) {}
    };

    const endSlab = (e) => {
      if (!cur) return;
      const slab = cur.slab;
      slab.classList.remove("is-dragging");
      try { slab.releasePointerCapture(e.pointerId); } catch (err) {}
      applyDrag(); // flush the final, precise position
      persistSlabs();
      cur = null;
      held = false;
    };

    /* dragging is desktop-only — on touch the page must scroll freely */
    if (!isTouch) {
      slabs.forEach((slab) => {
        slab.addEventListener("pointerdown", startSlab);
        slab.addEventListener("pointermove", moveSlab);
        slab.addEventListener("pointerup", endSlab);
        slab.addEventListener("pointercancel", endSlab);
        slab.addEventListener("dblclick", () => {
          const i = slabs.indexOf(slab);
          homeSlab(slab, i);
          persistSlabs();
        });
      });

      /* restore previously dropped positions */
      try {
        const raw = localStorage.getItem(MOVE_KEY);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach((p, i) => {
              if (p && typeof p.x === "number" && slabs[i]) {
                floatSlab(slabs[i], i);
                slabs[i].style.left = `${p.x}px`;
                slabs[i].style.top = `${p.y}px`;
              }
            });
          }
        }
      } catch (err) {}
    }
  }

  /* ---------- Contact buddy: orange accent with eyes that follow ---------- */
  const buddy = $(".contact-buddy");
  const contactEmail = $(".contact-email");
  if (buddy) {
    const bPupils = $$(".cb-pupil", buddy);
    const bEyes = $$(".cb-eye", buddy);
    let bX = -1e4;
    let bY = -1e4;
    let bRaf = 0;

    const applyBuddy = () => {
      bRaf = 0;
      bPupils.forEach((p) => {
        const pr = p.getBoundingClientRect();
        const ex = pr.left + pr.width / 2;
        const ey = pr.top + pr.height / 2;
        const ang = Math.atan2(bY - ey, bX - ex);
        const d = Math.min(3, Math.hypot(bX - ex, bY - ey) / 70);
        p.style.transform = `translate(${(Math.cos(ang) * d).toFixed(2)}px, ${(Math.sin(ang) * d).toFixed(2)}px)`;
      });
    };

    window.addEventListener("mousemove", (e) => {
      bX = e.clientX;
      bY = e.clientY;
      if (!bRaf) bRaf = requestAnimationFrame(applyBuddy);
    }, { passive: true });

    /* blinks while waiting */
    setInterval(() => {
      bEyes.forEach((eye) => {
        eye.style.height = "3px";
        setTimeout(() => { eye.style.height = ""; }, 120);
      });
    }, 3600);

    /* hops with excitement when someone heads for the email */
    const exciteBuddy = () => {
      buddy.classList.remove("is-excited");
      void buddy.offsetWidth; // restart the CSS animation
      buddy.classList.add("is-excited");
      setTimeout(() => buddy.classList.remove("is-excited"), 700);
    };
    if (contactEmail) {
      contactEmail.addEventListener("mouseenter", exciteBuddy);
      contactEmail.addEventListener("click", exciteBuddy);
    }
  }

  /* ---------- Lottie loading shimmer ---------- */
  $$(".service-visual").forEach((v) => {
    const lott = v.querySelector("dotlottie-wc");
    if (!lott) return;
    const sh = document.createElement("span");
    sh.className = "sv-shimmer";
    sh.setAttribute("aria-hidden", "true");
    v.appendChild(sh);
    let done = false;
    const clear = () => {
      if (done) return;
      done = true;
      v.classList.add("is-loaded");
    };
    lott.addEventListener("load", clear, { once: true });
    window.setTimeout(clear, 2000);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = [
    ".hero-copy .eyebrow",
    ".hero-copy h1",
    ".hero-intro",
    ".hero-actions",
    ".hero-art",
    ".section-heading > *",
    ".service-item",
    ".work-top > *",
    ".project-card",
    ".manifesto > *",
    ".testimonial > *",
    ".contact > *"
  ];

  if (!reduceMotion && "IntersectionObserver" in window) {
    const items = revealTargets.flatMap((sel) => $$(sel));

    items.forEach((el, i) => {
      el.classList.add("reveal");
      // small stagger inside a group, capped so nothing feels slow
      el.style.setProperty("--d", `${Math.min(i % 6, 5) * 60}ms`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ---------- Brand logo ---------- */
  /* falls back to the typographic wordmark when the file is absent */
  const probe = new Image();
  probe.addEventListener("load", () => {
    if (probe.naturalWidth > 0) document.documentElement.classList.add("has-logo");
  });
  probe.src = "assets/argov-logo.png";

  /* ---------- Missing-asset fallback for client cards ---------- */
  $$(".client-profile-image img").forEach((img) => {
    const markMissing = () => {
      const frame = img.closest(".client-profile-image");
      if (!frame) return;

      const name = frame.querySelector(".profile-name")?.textContent?.trim() || "";
      const initials = name
        .split(/[\s_]+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((word) => word[0].toUpperCase())
        .join("");

      frame.dataset.initials = initials || "ARG";
      frame.classList.add("img-missing");
    };

    img.addEventListener("error", markMissing);

    // already failed before the listener was attached
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  /* ---------- Footer year ---------- */
  const yearText = $$(".site-footer > span").find((el) => /©/.test(el.textContent || ""));
  if (yearText) {
    yearText.textContent = `© ${new Date().getFullYear()} ARGOV STUDIO`;
  }
})();
