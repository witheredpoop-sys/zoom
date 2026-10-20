(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  document.body.classList.add("is-loading");

  /* ------------------------------------------------------------- header */

  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");

  const onScroll = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle("is-scrolled", y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------- mobile menu */

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  /* ------------------------------------------------------------- reveals */

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      item.style.setProperty("--d", `${(index % 5) * 70}ms`);
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* -------------------------------------------------------- card spotlight */

  if (finePointer && !reduced) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  /* ---------------------------------------------------------------- tilt */

  if (finePointer && !reduced) {
    document.querySelectorAll("[data-tilt]").forEach((element) => {
      const strength = Number(element.dataset.tilt) || 5;
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(1000px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg)`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------ parallax */

  if (!reduced) {
    const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
    let ticking = false;

    const paintParallax = () => {
      const viewport = window.innerHeight;
      for (const item of parallaxItems) {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewport + 200) continue;
        const speed = Number(item.dataset.parallax) || 0.12;
        const offset = (rect.top + rect.height / 2 - viewport / 2) * speed;
        item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(paintParallax);
        }
      },
      { passive: true }
    );
    paintParallax();
  }

  /* ------------------------------------------------------------- counters */

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          const target = Number(element.dataset.count) || 0;
          const suffix = element.dataset.suffix || "";
          const duration = reduced ? 0 : 1100;
          const start = performance.now();

          const tick = (now) => {
            const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            element.textContent = `${Math.round(target * eased)}${suffix}`;
            if (t < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ------------------------------------------------------------- tickers */

  document.querySelectorAll(".ticker__track").forEach((track) => {
    if (track.dataset.cloned === "true") return;
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = "true";
  });

  /* ----------------------------------------------------------- accordion */

  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      if (open) {
        document.querySelectorAll(".faq-item.is-open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  });

  /* -------------------------------------------------------------- gallery */

  const filters = document.querySelectorAll(".filter");
  const galleryItems = [...document.querySelectorAll(".gallery-item")];

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      filter.classList.add("is-active");
      const value = filter.dataset.filter || "all";

      galleryItems.forEach((item) => {
        const tags = (item.dataset.tags || "").split(" ");
        item.hidden = value !== "all" && !tags.includes(value);
      });
    });
  });

  const lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryItems.length) {
    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption span");
    let index = 0;

    const visibleItems = () => galleryItems.filter((item) => !item.hidden);

    const show = (nextIndex) => {
      const visible = visibleItems();
      if (!visible.length) return;
      index = (nextIndex + visible.length) % visible.length;
      const item = visible[index];
      const source = item.querySelector("img");
      if (!source || !image) return;
      image.src = source.src;
      image.alt = source.alt;
      if (caption) caption.textContent = `${index + 1} / ${visible.length} — ${item.dataset.title || image.alt}`;
      if (lightbox.open) lightbox.close();
      lightbox.showModal();
    };

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const visible = visibleItems();
        show(visible.indexOf(item));
      });
    });

    lightbox.querySelector(".lightbox__close")?.addEventListener("click", () => lightbox.close());
    lightbox.querySelector(".lightbox__nav--prev")?.addEventListener("click", (event) => {
      event.stopPropagation();
      show(index - 1);
    });
    lightbox.querySelector(".lightbox__nav--next")?.addEventListener("click", (event) => {
      event.stopPropagation();
      show(index + 1);
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    window.addEventListener("keydown", (event) => {
      if (!lightbox.open) return;
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }

  /* ---------------------------------------------------------------- glow */

  if (finePointer && !reduced) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    document.body.classList.add("has-pointer");

    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let cx = gx;
    let cy = gy;

    window.addEventListener(
      "pointermove",
      (event) => {
        gx = event.clientX;
        gy = event.clientY;
      },
      { passive: true }
    );

    const loop = () => {
      cx += (gx - cx) * 0.09;
      cy += (gy - cy) * 0.09;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll("[data-magnetic]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `translate(${x * 7}px, ${y * 5}px)`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------ page transition */

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (
      link.target === "_blank" ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("http") ||
      link.hasAttribute("data-no-transition")
    ) {
      return;
    }

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => {
        window.location.href = href;
      }, reduced ? 0 : 240);
    });
  });

  /* ------------------------------------------------------------- footer */

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  window.addEventListener("load", () => {
    document.body.classList.remove("is-loading");
    window.setTimeout(() => document.body.classList.remove("page-leaving"), 20);
  });

  // The load event can already have fired when this script is deferred late.
  if (document.readyState === "complete") {
    document.body.classList.remove("is-loading");
  }
})();
