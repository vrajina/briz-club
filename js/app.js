/* ==========================================================================
   Интерактив прототипа базы отдыха «Бриз» (briz.club)
   Без внешних зависимостей и ES-модулей — работает и через file://, и на Vercel.
   ========================================================================== */
(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. Хелперы и состояние бронирования (синхронизировано между всеми формами)
  // --------------------------------------------------------------------------
  function formatIsoDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  var today = new Date();
  var defaultIn = new Date(today.getTime() + 7 * 86400000);
  var defaultOut = new Date(today.getTime() + 9 * 86400000);

  var bookingState = {
    checkin: formatIsoDate(defaultIn),
    checkout: formatIsoDate(defaultOut),
    guests: "2",
    house: "barn70-2",
    note: ""
  };

  function syncAllBookingInputs() {
    document.querySelectorAll(".js-checkin").forEach(function (el) {
      el.value = bookingState.checkin;
    });
    document.querySelectorAll(".js-checkout").forEach(function (el) {
      el.value = bookingState.checkout;
    });
    document.querySelectorAll(".js-guests").forEach(function (el) {
      el.value = bookingState.guests;
    });
    document.querySelectorAll(".js-house").forEach(function (el) {
      el.value = bookingState.house === "all" ? "all" : bookingState.house;
    });
  }

  // --------------------------------------------------------------------------
  // 2. Шапка при скролле + парящий бар бронирования + мобильная нижняя кнопка
  // --------------------------------------------------------------------------
  var siteHeader = document.getElementById("siteHeader");
  var heroSection = document.getElementById("heroSection");
  var floatingBooking = document.getElementById("floatingBooking");
  var mobileStickyCta = document.getElementById("mobileStickyCta");

  function handleScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 60) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }

    var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 120 : 540;
    if (y > heroBottom) {
      floatingBooking.classList.add("is-visible");
      mobileStickyCta.classList.add("is-visible");
    } else {
      floatingBooking.classList.remove("is-visible");
      mobileStickyCta.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Сворачивание / разворачивание парящей формы на десктопе
  var collapseFloatingBtn = document.getElementById("collapseFloatingBtn");
  var restoreFloatingBtn = document.getElementById("restoreFloatingBtn");
  if (collapseFloatingBtn && restoreFloatingBtn) {
    collapseFloatingBtn.addEventListener("click", function () {
      floatingBooking.classList.add("is-collapsed");
    });
    restoreFloatingBtn.addEventListener("click", function () {
      floatingBooking.classList.remove("is-collapsed");
    });
  }

  // --------------------------------------------------------------------------
  // 3. Мобильное бургер-меню
  // --------------------------------------------------------------------------
  var burgerBtn = document.getElementById("burgerBtn");
  var mobileDrawer = document.getElementById("mobileDrawer");
  var drawerCloseBtn = document.getElementById("drawerCloseBtn");

  function setDrawerOpen(open) {
    mobileDrawer.classList.toggle("is-open", open);
    mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  burgerBtn.addEventListener("click", function () {
    setDrawerOpen(true);
  });
  drawerCloseBtn.addEventListener("click", function () {
    setDrawerOpen(false);
  });
  mobileDrawer.addEventListener("click", function (e) {
    if (e.target === mobileDrawer) setDrawerOpen(false);
  });
  mobileDrawer.querySelectorAll("a, button.js-open-booking").forEach(function (el) {
    el.addEventListener("click", function () {
      setDrawerOpen(false);
    });
  });

  // Подсветка карточки домика при переходе из меню или галереи
  document.querySelectorAll("[data-house-jump]").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = link.getAttribute("data-house-jump");
      document.querySelectorAll("[data-house-card]").forEach(function (c) {
        c.classList.remove("is-highlighted");
      });
      var card = document.querySelector('[data-house-card="' + target + '"]');
      if (card) {
        card.classList.add("is-highlighted");
        setTimeout(function () {
          card.classList.remove("is-highlighted");
        }, 2200);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Слайдеры фото внутри карточек домов и выбор варианта Барн 70
  // --------------------------------------------------------------------------
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".house-slider__track");
    var slides = slider.querySelectorAll(".house-slider__slide");
    var dotsContainer = slider.querySelector(".house-slider__dots");
    var prevBtn = slider.querySelector(".house-slider__nav--prev");
    var nextBtn = slider.querySelector(".house-slider__nav--next");
    var idx = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "house-slider__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Фото " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsContainer.appendChild(dot);
    });

    function goTo(newIndex) {
      idx = (newIndex + slides.length) % slides.length;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      dotsContainer.querySelectorAll(".house-slider__dot").forEach(function (d, i) {
        d.classList.toggle("is-active", i === idx);
      });
    }

    prevBtn.addEventListener("click", function () {
      goTo(idx - 1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(idx + 1);
    });
  });

  // Переключение вариантов размещения внутри Барн 70
  var barn70Variants = document.querySelectorAll("[data-variant]");
  barn70Variants.forEach(function (btn) {
    btn.addEventListener("click", function () {
      barn70Variants.forEach(function (b) {
        b.classList.remove("is-selected");
      });
      btn.classList.add("is-selected");
      bookingState.house = btn.getAttribute("data-variant");
      bookingState.guests = bookingState.house === "barn70-4" ? "4" : "2";
      syncAllBookingInputs();
    });
  });

  // --------------------------------------------------------------------------
  // 5. Фотогалерея: шоппинг-теги (на тач-устройствах) + полноэкранный лайтбокс
  // --------------------------------------------------------------------------
  document.querySelectorAll(".shop-tag").forEach(function (tag) {
    var dot = tag.querySelector(".shop-tag__dot");
    dot.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = tag.classList.contains("is-open");
      document.querySelectorAll(".shop-tag.is-open").forEach(function (t) {
        t.classList.remove("is-open");
      });
      if (!wasOpen) tag.classList.add("is-open");
    });
  });

  document.querySelectorAll(".js-tag-link").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.stopPropagation();
      document.querySelectorAll(".shop-tag.is-open").forEach(function (t) {
        t.classList.remove("is-open");
      });
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".shop-tag.is-open").forEach(function (t) {
      t.classList.remove("is-open");
    });
  });

  var galleryData = [
    {
      src: "assets/images/hero-winter.jpg",
      caption: "Вечерние барнхаусы «Бриза» в новогодней подсветке",
      links: [
        { label: "Барн 130 · от 13 500 ₽ →", href: "#barn-130" },
        { label: "Барн 70 · от 7 500 ₽ →", href: "#barn-70" }
      ]
    },
    {
      src: "assets/images/barn130-interior.jpg",
      caption: "Двусветная гостиная Барн 130 с настоящим дровяным камином",
      links: [
        { label: "Забронировать Барн 130 →", href: "#barn-130" }
      ]
    },
    {
      src: "assets/images/banya-chan.jpg",
      caption: "Сибирский банный чан на дровах с пихтой и цитрусами",
      links: [
        { label: "Заказать банный чан (5 000 ₽) →", href: "#services" }
      ]
    },
    {
      src: "assets/images/barn70-interior.jpg",
      caption: "Уютный интерьер Барн 70: спальня-антресоль и кухня-гостиная",
      links: [
        { label: "Оба варианта Барн 70 →", href: "#barn-70" }
      ]
    },
    {
      src: "assets/images/real-terrace.jpg",
      caption: "Приватная терраса коттеджа среди хвойного леса",
      links: [
        { label: "Барн 70 · от 7 500 ₽ →", href: "#barn-70" },
        { label: "Барн 130 · от 13 500 ₽ →", href: "#barn-130" }
      ]
    },
    {
      src: "assets/images/winter-active.jpg",
      caption: "Русская баня с панорамным окном и прокат лыж и коньков",
      links: [
        { label: "Услуги и зимний прокат →", href: "#services" }
      ]
    }
  ];

  var lightboxModal = document.getElementById("lightboxModal");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var lightboxLinks = document.getElementById("lightboxLinks");
  var currentPhotoIdx = 0;

  function renderLightbox(index) {
    currentPhotoIdx = (index + galleryData.length) % galleryData.length;
    var item = galleryData[currentPhotoIdx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = "Фото " + (currentPhotoIdx + 1) + " из " + galleryData.length;
    lightboxLinks.innerHTML = "";
    item.links.forEach(function (lnk) {
      var a = document.createElement("a");
      a.href = lnk.href;
      a.className = "lightbox-tag-link";
      a.textContent = lnk.label;
      a.addEventListener("click", function () {
        closeAllModals();
      });
      lightboxLinks.appendChild(a);
    });
  }

  document.querySelectorAll(".js-open-lightbox").forEach(function (el) {
    el.addEventListener("click", function () {
      var idx = parseInt(el.getAttribute("data-index") || "0", 10);
      renderLightbox(idx);
      openModal(lightboxModal);
    });
  });

  document.getElementById("lightboxPrev").addEventListener("click", function () {
    renderLightbox(currentPhotoIdx - 1);
  });
  document.getElementById("lightboxNext").addEventListener("click", function () {
    renderLightbox(currentPhotoIdx + 1);
  });

  // --------------------------------------------------------------------------
  // 6. Интерактивная карта территории
  // --------------------------------------------------------------------------
  var territoryObjects = {
    "1": {
      badge: "Объект № 1",
      title: "Въезд, КПП и гостевая парковка",
      desc: "Круглогодичный асфальтовый подъезд со стороны Курумоча. Охраняемая парковка внутри территории, регистрация гостей с 15:00.",
      btnText: "Как добраться",
      btnHref: "#contacts"
    },
    "2": {
      badge: "Объект № 2",
      title: "Коттеджи «Барн Хаус-130»",
      desc: "Пять двухэтажных домов на первой линии над набережной. Внутри — дровяной камин и 3 спальни, снаружи — крытая терраса с мангалом.",
      btnText: "Перейти к Барн 130",
      btnHref: "#barn-130"
    },
    "3": {
      badge: "Объект № 3",
      title: "Коттеджи «Барн Хаус-70»",
      desc: "Камерные двухэтажные домики в тихой хвойной части. Доступны два варианта заселения: для двоих (1–2 гостя) и семейный (3–4 гостя).",
      btnText: "Перейти к Барн 70",
      btnHref: "#barn-70"
    },
    "4": {
      badge: "Объект № 4",
      title: "Русская баня на дровах",
      desc: "Уютный сруб с панорамным окном, комнатой отдыха и душистыми вениками. От 3 000 ₽ за сеанс 2 часа.",
      btnText: "Смотреть тарифы бани",
      btnHref: "#services"
    },
    "5": {
      badge: "Объект № 5",
      title: "Сибирский банный чан под соснами",
      desc: "Подвесной чан на живом огне прямо на деревянной террасе. Вода 40 °C с пихтой и грейпфрутом — 5 000 ₽ за сеанс.",
      btnText: "Заказать чан",
      btnHref: "#services"
    },
    "6": {
      badge: "Объект № 6",
      title: "Каменная набережная и лестница к Волге",
      desc: "Укреплённый берег с прогулочной зоной, вечерней подсветкой и удобным спуском к воде.",
      btnText: "Смотреть в галерее",
      btnHref: "#gallery"
    },
    "7": {
      badge: "Объект № 7",
      title: "Прогулочный пирс и старт SUP-прогулок",
      desc: "Деревянный пирс на протоке: место утреннего кофе, красивых закатных фото и старта на сапах и каяках летом.",
      btnText: "Летний прокат",
      btnHref: "#services"
    },
    "8": {
      badge: "Объект № 8",
      title: "Крытый причал для катеров",
      desc: "Собственный оборудованный спуск и швартовка водного транспорта на волжской протоке.",
      btnText: "Уточнить по швартовке",
      btnHref: "#contacts"
    },
    "9": {
      badge: "Объект № 9",
      title: "Лесные прогулочные тропы и лыжня",
      desc: "Сразу за территорией начинается сосновый массив Большецаревщинского лесничества. Лыжи и коньки доступны в прокате.",
      btnText: "Зимний прокат",
      btnHref: "#services"
    }
  };

  function selectTerritoryPin(pinId) {
    var info = territoryObjects[pinId];
    if (!info) return;

    document.querySelectorAll("[data-pin]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-pin") === pinId);
    });

    document.getElementById("territoryDetailBadge").textContent = info.badge;
    document.getElementById("territoryDetailTitle").textContent = info.title;
    document.getElementById("territoryDetailDesc").textContent = info.desc;
    var btn = document.getElementById("territoryDetailBtn");
    btn.textContent = info.btnText;
    btn.href = info.btnHref;
  }

  document.querySelectorAll("[data-pin]").forEach(function (el) {
    el.addEventListener("click", function () {
      selectTerritoryPin(el.getAttribute("data-pin"));
    });
  });

  // --------------------------------------------------------------------------
  // 7. Фильтрация списка услуг (Баня и чан / Зима / Лето)
  // --------------------------------------------------------------------------
  var filterTabs = document.querySelectorAll(".filter-tab");
  var serviceRows = document.querySelectorAll("#servicesList .service-row");

  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter");
      filterTabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
      });
      serviceRows.forEach(function (row) {
        var cat = row.getAttribute("data-category");
        row.classList.toggle("is-hidden", filter !== "all" && cat !== filter);
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Модальные окна: Контур.Отель (расчёт) и Планировки домов
  // --------------------------------------------------------------------------
  var bookingModal = document.getElementById("bookingModal");
  var specsModal = document.getElementById("specsModal");
  var konturForm = document.getElementById("konturSimForm");
  var konturSuccess = document.getElementById("konturSuccess");
  var modalCheckin = document.getElementById("modalCheckin");
  var modalCheckout = document.getElementById("modalCheckout");
  var modalHouse = document.getElementById("modalHouse");
  var modalGuests = document.getElementById("modalGuests");
  var guestComment = document.getElementById("guestComment");
  var konturSummary = document.getElementById("konturSummary");

  function openModal(modal) {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach(function (m) {
      m.classList.remove("is-open");
    });
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeAllModals);
  });
  document.querySelectorAll(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m) closeAllModals();
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllModals();
    if (lightboxModal.classList.contains("is-open")) {
      if (e.key === "ArrowLeft") renderLightbox(currentPhotoIdx - 1);
      if (e.key === "ArrowRight") renderLightbox(currentPhotoIdx + 1);
    }
  });

  var HOUSE_TARIFFS = {
    "barn70-2": { name: "Барн 70 (1–2 гостя)", weekday: 7500, weekend: 10500, ny: 19000 },
    "barn70-4": { name: "Барн 70 (3–4 гостя)", weekday: 9500, weekend: 12500, ny: 22000 },
    "barn130": { name: "Барн 130 (до 6 гостей)", weekday: 13500, weekend: 17500, ny: 29000 }
  };

  function calculateStaySummary() {
    var d1 = new Date(modalCheckin.value + "T15:00:00");
    var d2 = new Date(modalCheckout.value + "T12:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
      d2 = new Date(d1.getTime() + 86400000);
      modalCheckout.value = formatIsoDate(d2);
    }

    var nights = Math.max(1, Math.round((d2 - d1) / 86400000));
    var houseKey = modalHouse.value;
    var tariff = HOUSE_TARIFFS[houseKey] || HOUSE_TARIFFS["barn70-2"];

    var total = 0;
    var nyDays = 0;
    var weekendDays = 0;
    for (var i = 0; i < nights; i++) {
      var cur = new Date(d1.getTime() + i * 86400000);
      var m = cur.getMonth() + 1;
      var day = cur.getDate();
      var dow = cur.getDay(); // 5 = Пт, 6 = Сб
      if ((m === 12 && day >= 30) || (m === 1 && day <= 8)) {
        total += tariff.ny;
        nyDays++;
      } else if (dow === 5 || dow === 6) {
        total += tariff.weekend;
        weekendDays++;
      } else {
        total += tariff.weekday;
      }
    }

    var rateNote = nyDays > 0
      ? "Новогодний праздничный тариф"
      : (weekendDays > 0 ? "Учтён тариф выходного дня" : "Тариф будних дней");

    konturSummary.innerHTML =
      '<div class="kontur-summary__row"><span>Выбранный дом</span><strong>' + tariff.name + "</strong></div>" +
      '<div class="kontur-summary__row"><span>Ночей проживания</span><strong>' + nights + " · " + rateNote + "</strong></div>" +
      '<div class="kontur-summary__row kontur-summary__total"><span>Ориентировочная стоимость</span><span>' + total.toLocaleString("ru-RU") + " ₽</span></div>";
  }

  function openBookingModal(opts) {
    opts = opts || {};
    if (opts.checkin) bookingState.checkin = opts.checkin;
    if (opts.checkout) bookingState.checkout = opts.checkout;
    if (opts.guests) bookingState.guests = opts.guests;
    if (opts.house && opts.house !== "all") bookingState.house = opts.house;
    if (opts.note !== undefined) bookingState.note = opts.note;

    modalCheckin.value = bookingState.checkin;
    modalCheckout.value = bookingState.checkout;
    modalHouse.value = bookingState.house === "all" ? "barn70-2" : bookingState.house;
    modalGuests.value = bookingState.guests;
    guestComment.value = bookingState.note || "";

    konturForm.style.display = "block";
    konturSuccess.style.display = "none";
    calculateStaySummary();
    openModal(bookingModal);

    // Хук для боевого модуля Контур.Отель на продакшен-домене Тильды
    if (window.HotelWidget && typeof window.HotelWidget.add === "function") {
      try {
        window.HotelWidget.add({
          type: "horizontalBlock",
          appearance: { container: "hotel-widget-container" }
        });
      } catch (err) {
        // В локальном/тестовом режиме используется интерактивный расчёт
      }
    }
  }

  [modalCheckin, modalCheckout, modalHouse, modalGuests].forEach(function (el) {
    el.addEventListener("change", calculateStaySummary);
  });

  // Сабмит любой из форм на странице (Hero / Mobile / Парящая)
  document.querySelectorAll(".js-booking-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cin = form.querySelector(".js-checkin").value;
      var cout = form.querySelector(".js-checkout").value;
      var g = form.querySelector(".js-guests").value;
      var h = form.querySelector(".js-house").value;

      var resolvedHouse = h;
      if (h === "all") {
        resolvedHouse = parseInt(g, 10) >= 5 ? "barn130" : (parseInt(g, 10) >= 3 ? "barn70-4" : "barn70-2");
      }

      openBookingModal({
        checkin: cin,
        checkout: cout,
        guests: g,
        house: resolvedHouse
      });
    });
  });

  // Кнопки "Забронировать" и "Заказать" у услуг и домов
  document.querySelectorAll(".js-open-booking").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-house-target");
      var svc = btn.getAttribute("data-service-note");
      var house = bookingState.house;
      if (target === "barn130") house = "barn130";
      if (target === "barn70") {
        var selected = document.querySelector(".variant-row.is-selected[data-variant]");
        house = selected ? selected.getAttribute("data-variant") : "barn70-2";
      }
      openBookingModal({
        house: house,
        note: svc ? "Интересует услуга: " + svc : ""
      });
    });
  });

  // Кнопки новогоднего блока
  document.querySelectorAll(".js-book-ny").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openBookingModal({
        checkin: btn.getAttribute("data-checkin"),
        checkout: btn.getAttribute("data-checkout"),
        note: "Новогодний заезд 2027"
      });
    });
  });

  konturForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("guestName").value.trim() || "Гость";
    var phone = document.getElementById("guestPhone").value.trim();
    var houseText = modalHouse.options[modalHouse.selectedIndex].text;
    document.getElementById("konturSuccessText").innerHTML =
      "<strong>" + name + "</strong>, ваш запрос на <strong>" + houseText + "</strong> (" +
      modalCheckin.value + " — " + modalCheckout.value + ") принят. " +
      "На боевом сайте <code>briz.club</code> эта кнопка передаёт параметры прямо в шахматку Контур.Отеля и отправляет подтверждение на номер <strong>" + phone + "</strong>.";
    konturForm.style.display = "none";
    konturSuccess.style.display = "block";
  });

  document.getElementById("konturResetBtn").addEventListener("click", function () {
    konturForm.style.display = "block";
    konturSuccess.style.display = "none";
  });

  // Модальное окно детальной планировки и комплектации
  var HOUSE_SPECS = {
    barn70: {
      title: "Барн Хаус-70 — планировка и оснащение",
      subtitle: "70 м² · 2 этажа · 1–2 гостя (романтический тариф) или 3–4 гостя (семейный тариф)",
      html:
        "<p><strong>1 этаж:</strong> кухня-гостиная с панорамными окнами в лес, удобный диван (раскладной для 3–4 гостей), обеденный стол, душевая с туалетом и феном.</p>" +
        "<p><strong>2 этаж (антресоль):</strong> спальня с широкой двуспальной кроватью и ортопедическим матрасом, мягким светом и видом на кроны сосен.</p>" +
        "<p><strong>Кухня и техника:</strong> варочная панель, холодильник, чайник, полный набор посуды и бокалов, кондиционер, тёплые полы, Smart-TV, Wi-Fi.</p>" +
        "<p><strong>Улица:</strong> собственная деревянная терраса и мангальная зона рядом с домом.</p>",
      targetHouse: "barn70-2"
    },
    barn130: {
      title: "Барн Хаус-130 — планировка и оснащение",
      subtitle: "130 м² · 2 этажа · до 6 основных гостей (+ до 2 доп. мест) · 5 коттеджей на базе",
      html:
        "<p><strong>1 этаж:</strong> просторная двусветная гостиная с настоящим дровяным камином, большая обеденная зона, отдельная гостевая спальня/кабинет с двуспальным диваном, санузел с душем и стиральной машиной.</p>" +
        "<p><strong>2 этаж:</strong> две изолированные спальни с двуспальными кроватями и отдельный дополнительный санузел.</p>" +
        "<p><strong>Кухня и комфорт:</strong> вся бытовая техника, полный комплект посуды и бокалов для компании, кондиционирование, тёплые полы, полотенца и халаты.</p>" +
        "<p><strong>Улица:</strong> вид на волжскую протоку и крытая беседка-пергола с мангалом.</p>",
      targetHouse: "barn130"
    }
  };

  var specsBookBtn = document.getElementById("specsBookBtn");
  var activeSpecTarget = "barn70-2";

  document.querySelectorAll(".js-open-specs").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-spec");
      var spec = HOUSE_SPECS[key];
      if (!spec) return;
      document.getElementById("specsModalTitle").textContent = spec.title;
      document.getElementById("specsModalSubtitle").textContent = spec.subtitle;
      document.getElementById("specsModalBody").innerHTML = spec.html;
      activeSpecTarget = spec.targetHouse;
      openModal(specsModal);
    });
  });

  specsBookBtn.addEventListener("click", function () {
    closeAllModals();
    openBookingModal({ house: activeSpecTarget });
  });

  // Инициализация дат во всех формах
  syncAllBookingInputs();
})();
