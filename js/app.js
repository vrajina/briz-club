/* ==========================================================================
   Интерактив прототипа базы отдыха «Бриз» (briz.club)
   Без внешних зависимостей и ES-модулей — работает и через file://, и на Vercel.
   ========================================================================== */
(function () {
  "use strict";

  // Опционально: укажите цифровой ID организации в Яндекс Бизнесе (11–12 цифр),
  // чтобы на боевом сайте автоматически загружался живой iframe виджета отзывов.
  var YANDEX_ORG_ID = "";

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

  // Монтирование живого iframe Яндекс Карт, если задан YANDEX_ORG_ID
  var yandexSlot = document.getElementById("yandexReviewsSlot");
  if (YANDEX_ORG_ID && yandexSlot) {
    yandexSlot.innerHTML =
      '<iframe class="yandex-live-iframe" title="Отзывы гостей на Яндекс Картах" src="https://yandex.ru/maps-reviews-widget/' +
      encodeURIComponent(YANDEX_ORG_ID) +
      '?comments"></iframe>';
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
  // 4. Слайдеры реальных фото внутри карточек домов и выбор варианта Барн 70
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
      dot.setAttribute("aria-label", "Слайд " + (i + 1));
      dot.addEventListener("click", function (e) {
        e.stopPropagation();
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

    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      goTo(idx - 1);
    });
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      goTo(idx + 1);
    });
  });

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
  // 5. Фотогалерея: шоппинг-теги + полноэкранный лайтбокс (все реальные кадры)
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
      caption: "Вечерние барнхаусы «Бриза» в\u00A0новогодней подсветке",
      links: [
        { label: "Барн 130 · от\u00A07\u00A0000\u00A0₽ →", href: "#barn-130" },
        { label: "Барн 70 · от\u00A06\u00A0500\u00A0₽ →", href: "#barn-70" }
      ]
    },
    {
      src: "assets/images/house-living-top.jpg",
      caption: "Двусветная гостиная с\u00A0панорамным остеклением и\u00A0видом на\u00A0лес",
      links: [{ label: "Смотреть Барн 130 →", href: "#barn-130" }]
    },
    {
      src: "assets/images/banya-chan.jpg",
      caption: "Сибирский банный чан на\u00A0дровах с\u00A0пихтой и\u00A0цитрусами",
      links: [{ label: "Заказать банный чан (5\u00A0000\u00A0₽) →", href: "#services" }]
    },
    {
      src: "assets/images/house-exterior-5.jpg",
      caption: "Коттедж в\u00A0стиле барнхаус среди сосен",
      links: [{ label: "Перейти к\u00A0Барн 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-pergola.jpg",
      caption: "Индивидуальная крытая пергола со\u00A0столом и\u00A0мангалом",
      links: [{ label: "Услуги и\u00A0наборы для\u00A0гриля →", href: "#services" }]
    },
    {
      src: "assets/images/house-living-window.jpg",
      caption: "Гостиная с\u00A0выходом на\u00A0приватную террасу",
      links: [{ label: "Перейти к\u00A0Барн 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-bedroom-1.jpg",
      caption: "Уютная спальня с\u00A0двуспальной кроватью на\u00A01\u00A0этаже",
      links: [{ label: "Варианты размещения →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-mezzanine.jpg",
      caption: "Спальная антресоль 2\u00A0этажа под мансардным окном",
      links: [{ label: "Барн 70 (3–4\u00A0гостя) →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-kitchen.jpg",
      caption: "Кухня с\u00A0полным комплектом посуды, плитой и\u00A0чайником",
      links: [{ label: "Сравнить оба дома →", href: "#houses" }]
    },
    {
      src: "assets/images/house-bathroom.jpg",
      caption: "Современный санузел с\u00A0LED-зеркалом и\u00A0полотенцами",
      links: [{ label: "Сравнить оба дома →", href: "#houses" }]
    },
    {
      src: "assets/images/real-terrace.jpg",
      caption: "Приватная терраса коттеджа среди хвойного леса",
      links: [{ label: "Барн 130 · от\u00A07\u00A0000\u00A0₽ →", href: "#barn-130" }]
    },
    {
      src: "assets/images/house-bedroom-loft.jpg",
      caption: "Изолированная спальня на\u00A0втором этаже",
      links: [{ label: "Смотреть Барн 130 →", href: "#barn-130" }]
    },
    {
      src: "assets/images/house-second-floor.jpg",
      caption: "Галерея второго этажа с\u00A0видом на\u00A0витраж",
      links: [{ label: "Смотреть Барн 130 →", href: "#barn-130" }]
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
    lightboxCounter.textContent = "Фото " + (currentPhotoIdx + 1) + " из\u00A0" + galleryData.length;
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
    el.addEventListener("click", function (e) {
      e.stopPropagation();
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
      badge: "Объект №\u00A01",
      title: "Въезд, КПП и\u00A0гостевая парковка",
      desc: "Круглогодичный асфальтовый подъезд со\u00A0стороны Курумоча. Охраняемая парковка внутри территории, регистрация гостей после 14:00.",
      btnText: "Как добраться",
      btnHref: "#contacts"
    },
    "2": {
      badge: "Объект №\u00A02",
      title: "Коттеджи «Барн Хаус-130»",
      desc: "Пять двухэтажных домов на\u00A0первой линии над набережной. Внутри\u00A0— дровяной камин и\u00A03\u00A0спальные зоны, снаружи\u00A0— крытая терраса с\u00A0мангалом.",
      btnText: "Перейти к\u00A0Барн 130",
      btnHref: "#barn-130"
    },
    "3": {
      badge: "Объект №\u00A03",
      title: "Коттеджи «Барн Хаус-70»",
      desc: "Камерные двухэтажные домики в\u00A0тихой хвойной части. Основное размещение до\u00A02\u00A0гостей и\u00A0формат 3–4\u00A0гостя с\u00A0дополнительными местами на\u00A0антресоли.",
      btnText: "Перейти к\u00A0Барн 70",
      btnHref: "#barn-70"
    },
    "4": {
      badge: "Объект №\u00A04",
      title: "Русская баня на\u00A0дровах",
      desc: "Уютный сруб с\u00A0панорамным окном, комнатой отдыха и\u00A0душистыми вениками. От\u00A03\u00A0000\u00A0₽ за\u00A0сеанс 2\u00A0часа.",
      btnText: "Смотреть тарифы бани",
      btnHref: "#services"
    },
    "5": {
      badge: "Объект №\u00A05",
      title: "Сибирский банный чан под соснами",
      desc: "Подвесной чан на\u00A0живом огне прямо на\u00A0деревянной террасе. Вода 40\u00A0°C с\u00A0пихтой и\u00A0грейпфрутом\u00A0— 5\u00A0000\u00A0₽ за\u00A0сеанс.",
      btnText: "Заказать чан",
      btnHref: "#services"
    },
    "6": {
      badge: "Объект №\u00A06",
      title: "Каменная набережная и\u00A0лестница к\u00A0Волге",
      desc: "Укреплённый берег с\u00A0прогулочной зоной, вечерней подсветкой и\u00A0удобным спуском к\u00A0воде.",
      btnText: "Смотреть в\u00A0галерее",
      btnHref: "#gallery"
    },
    "7": {
      badge: "Объект №\u00A07",
      title: "Прогулочный пирс и\u00A0старт SUP-прогулок",
      desc: "Деревянный пирс на\u00A0протоке: место утреннего кофе, красивых закатных фото и\u00A0старта на\u00A0сапах и\u00A0каяках летом.",
      btnText: "Летний прокат",
      btnHref: "#services"
    },
    "8": {
      badge: "Объект №\u00A08",
      title: "Крытый причал для катеров",
      desc: "Собственный оборудованный спуск и\u00A0швартовка водного транспорта на\u00A0волжской протоке.",
      btnText: "Уточнить по\u00A0швартовке",
      btnHref: "#contacts"
    },
    "9": {
      badge: "Объект №\u00A09",
      title: "Лесные прогулочные тропы и\u00A0лыжня",
      desc: "Сразу за\u00A0территорией начинается сосновый массив Большецаревщинского лесничества. Лыжи и\u00A0коньки доступны в\u00A0прокате.",
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
  // 7. Фильтрация списка услуг
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
    "barn70-2": { name: "Барн 70 (основное размещение, до\u00A02\u00A0гостей)", weekday: 6500, weekend: 10000, ny: 18000 },
    "barn70-4": { name: "Барн 70 (с\u00A0доп. местами, 3–4\u00A0гостя)", weekday: 8500, weekend: 12000, ny: 21000 },
    "barn130": { name: "Барн 130 (коттедж с\u00A0камином, до\u00A06\u00A0гостей)", weekday: 7000, weekend: 13000, ny: 26000 }
  };

  function calculateStaySummary() {
    var d1 = new Date(modalCheckin.value + "T14:00:00");
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
      var dow = cur.getDay();
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
      '<div class="kontur-summary__row kontur-summary__total"><span>Ориентировочная стоимость</span><span>' + total.toLocaleString("ru-RU") + "\u00A0₽</span></div>";
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

    if (window.HotelWidget && typeof window.HotelWidget.add === "function") {
      try {
        window.HotelWidget.add({
          type: "horizontalBlock",
          appearance: { container: "hotel-widget-container" }
        });
      } catch (err) {
        // В тестовом режиме используется встроенный расчёт
      }
    }
  }

  [modalCheckin, modalCheckout, modalHouse, modalGuests].forEach(function (el) {
    el.addEventListener("change", calculateStaySummary);
  });

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
      "<strong>" + name + "</strong>, ваш запрос на\u00A0<strong>" + houseText + "</strong> (" +
      modalCheckin.value + " — " + modalCheckout.value + ") принят. " +
      "На\u00A0боевом сайте <code>briz.club</code> эта кнопка передаёт параметры прямо в\u00A0шахматку Контур.Отеля и\u00A0отправляет подтверждение на\u00A0номер <strong>" + phone + "</strong>.";
    konturForm.style.display = "none";
    konturSuccess.style.display = "block";
  });

  document.getElementById("konturResetBtn").addEventListener("click", function () {
    konturForm.style.display = "block";
    konturSuccess.style.display = "none";
  });

  var HOUSE_SPECS = {
    barn70: {
      title: "Барн Хаус-70 — планировка и\u00A0оснащение",
      subtitle: "70\u00A0м² · 2\u00A0этажа · основное размещение до\u00A02\u00A0гостей или 3–4\u00A0гостя с\u00A0доп. местами",
      html:
        "<p><strong>1\u00A0этаж:</strong> кухня-гостиная с\u00A0панорамным остеклением и\u00A0выходом на\u00A0террасу, изолированная спальня с\u00A0двуспальной кроватью, санузел с\u00A0душем, LED-зеркалом и\u00A0феном.</p>" +
        "<p><strong>2\u00A0этаж (антресоль):</strong> открытая спальная зона под мансардным окном с\u00A0дополнительным спальным местом и\u00A0раскладным креслом.</p>" +
        "<p><strong>Кухня и\u00A0техника:</strong> индукционная плита, СВЧ, холодильник, чайник, полный набор посуды и\u00A0бокалов, кондиционер, тёплые полы, умная колонка с\u00A0ТВ и\u00A0Wi-Fi.</p>" +
        "<p><strong>Улица:</strong> приватная терраса с\u00A0креслами и\u00A0крытая мангальная пергола рядом с\u00A0домом.</p>",
      targetHouse: "barn70-2"
    },
    barn130: {
      title: "Барн Хаус-130 — планировка и\u00A0оснащение",
      subtitle: "130\u00A0м² · 2\u00A0этажа · до\u00A06\u00A0основных гостей (+ доп. места) · 5\u00A0коттеджей на\u00A0базе",
      html:
        "<p><strong>1\u00A0этаж:</strong> просторная двусветная гостиная с\u00A0дровяным камином, обеденная зона, отдельная гостевая комната с\u00A0двуспальным диваном, санузел с\u00A0душем и\u00A0стиральной машиной.</p>" +
        "<p><strong>2\u00A0этаж:</strong> галерея со\u00A0вторым светом, две изолированные спальни с\u00A0двуспальными кроватями и\u00A0дополнительный туалет.</p>" +
        "<p><strong>Кухня и\u00A0комфорт:</strong> вся бытовая техника, полный комплект посуды и\u00A0бокалов для компании, кондиционирование, тёплые полы, полотенца.</p>" +
        "<p><strong>Улица:</strong> вид на\u00A0волжскую протоку и\u00A0крытая беседка-пергола с\u00A0мангалом.</p>",
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

  syncAllBookingInputs();
})();
