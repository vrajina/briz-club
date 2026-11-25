/* ==========================================================================
   Интерактив прототипа базы отдыха «Бриз» (briz.club)
   Поддерживает index.html и new-year.html, работает через file:// и на Vercel.
   ========================================================================== */
(function () {
  "use strict";

  // ID организации в Яндекс Картах для автоматической подгрузки живого виджета отзывов.
  var YANDEX_ORG_ID = "227400604591";

  // --------------------------------------------------------------------------
  // 1. Данные коттеджей из модуля Контур.Отель (Frontdesk24 ID 1292)
  // --------------------------------------------------------------------------
  var KONTUR_ROOMS = {
    "254819": {
      id: "254819",
      title: "«Барн-Хаус», 70",
      area: "70\u00A0м² (75\u00A0м²)",
      baseCap: 4,
      extraCap: 1,
      maxGuests: 5,
      roomsText: "3\u00A0комнаты: 2\u00A0спальни, гостиная",
      tariffName: "Бархатный сезон 2026",
      included: "Проживание · Завтрак",
      weekday: 8000,
      friday: 10000,
      saturday: 12000,
      nyEve: 38500,
      nyHoliday: 16500,
      description:
        "<p>Дома «Барн Хаус-70»\u00A0— это 70\u00A0м² уюта, рассчитанных на\u00A0семью до\u00A04\u00A0человек с\u00A0возможностью 1\u00A0дополнительного места. Всего на\u00A0территории 8\u00A0таких домов.</p>" +
        "<p>У\u00A0каждого дома есть индивидуальная мангальная зона с\u00A0комплектом шампуров и\u00A0решётки для барбекю. Дома оборудованы всей необходимой бытовой техникой и\u00A0отлично подойдут для долгосрочного проживания.</p>" +
        "<p>На\u00A0первом этаже можно приготовить и\u00A0пообедать, собраться всей семьёй, чтобы поиграть в\u00A0настолки. Здесь\u00A0же расположен просторный санузел с\u00A0душем и\u00A0комната с\u00A0двуспальной кроватью. Второй этаж\u00A0— мансардный без двери: две односпальные кровати, которые при желании сдвигаются, и\u00A0возможность разместить 1\u00A0дополнительное место (кресло-кровать или матрас).</p>" +
        "<p>Лаконичный дизайн с\u00A0хорошей шумоизоляцией не\u00A0отвлекает от\u00A0красоты природы, а\u00A0панорамные окна открывают живописный волжский пейзаж.</p>",
      amenities: [
        { group: "Основное", items: "Кондиционер, Wi-Fi, телевизор, мини-бар, диван или кресло, утюг, гладильная доска, терраса, гриль для барбекю" },
        { group: "Ванная комната", items: "Душ, фен, стиральная машина, тапочки, ванные принадлежности" },
        { group: "Кухня в\u00A0номере", items: "Стол и\u00A0стулья, холодильник и\u00A0мини-холодильник, чайник, плита, микроволновая печь, кухонные принадлежности" },
        { group: "Вид из\u00A0окна", items: "На\u00A0реку и\u00A0хвойную территорию базы" }
      ]
    },
    "254820": {
      id: "254820",
      title: "«Барн-хаус», 130",
      area: "130\u00A0м²",
      baseCap: 6,
      extraCap: 2,
      maxGuests: 8,
      roomsText: "4\u00A0комнаты: 3\u00A0спальни, гостиная",
      tariffName: "Бархатный сезон 2026",
      included: "Проживание · Завтрак",
      weekday: 11500,
      friday: 14500,
      saturday: 16500,
      nyEve: 55000,
      nyHoliday: 24500,
      description:
        "<p>Дома «Барн Хаус-130»\u00A0— это 130\u00A0м² уюта, рассчитанных на\u00A0семью до\u00A06\u00A0человек (с\u00A0возможностью 2\u00A0дополнительных мест). Всего на\u00A0территории 5\u00A0таких домов.</p>" +
        "<p>У\u00A0каждого дома есть индивидуальная мангальная зона с\u00A0комплектом шампуров и\u00A0решётки для барбекю. Дома оборудованы всей необходимой бытовой техникой и\u00A0отлично подойдут для долгосрочного проживания.</p>" +
        "<p>На\u00A0первом этаже можно приготовить и\u00A0пообедать, помедитировать у\u00A0камина или собраться всей семьёй, чтобы поиграть в\u00A0настолки. Здесь\u00A0же расположен просторный санузел с\u00A0душем и\u00A0комната с\u00A0двуспальным раскладным диваном (кабинет, гостевая или ещё одна спальня). Второй этаж\u00A0— зона сна и\u00A0отдыха с\u00A0двумя спальнями и\u00A0туалетом.</p>" +
        "<p>Панорамные окна открывают живописный волжский пейзаж, а\u00A0хорошая шумоизоляция позволяет взрослым и\u00A0детям отдыхать с\u00A0полным комфортом.</p>",
      amenities: [
        { group: "Основное", items: "Камин, кондиционер, Wi-Fi, телевизор, мини-бар, диван или кресло, письменный стол, утюг, гладильная доска, терраса, гриль для барбекю" },
        { group: "Санузлы и\u00A0бельё", items: "Душ и\u00A0дополнительный гостевой туалет на\u00A02\u00A0этаже, фен, стиральная машина, халат, ванные принадлежности" },
        { group: "Кухня в\u00A0номере", items: "Стол и\u00A0стулья, холодильник, чайник, плита, микроволновая печь, кухонные принадлежности" },
        { group: "Вид из\u00A0окна", items: "На\u00A0реку и\u00A0волжскую протоку" }
      ]
    }
  };

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
    selectedRoomId: "254820",
    note: ""
  };

  function pluralNights(n) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return n + "\u00A0ночь";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return n + "\u00A0ночи";
    return n + "\u00A0ночей";
  }

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

    var submitLabel = "Проверить наличие";
    if (bookingState.checkin && bookingState.checkout) {
      var d1 = new Date(bookingState.checkin + "T14:00:00");
      var d2 = new Date(bookingState.checkout + "T12:00:00");
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d2 > d1) {
        var nights = Math.round((d2 - d1) / 86400000);
        if (nights >= 1 && nights <= 60) {
          submitLabel = "Проверить · " + pluralNights(nights);
        }
      }
    }
    document.querySelectorAll(".js-booking-form .booking-submit").forEach(function (btn) {
      btn.textContent = submitLabel;
    });
  }

  // Неблокирующая синхронизация с /api/kontur (при работе на Vercel / HTTP)
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    fetch("/api/kontur")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (payload) {
        if (!payload || !payload.ok || !payload.data) return;
        var roomTypes = payload.data.roomTypes || payload.data.rooms || [];
        if (Array.isArray(roomTypes)) {
          roomTypes.forEach(function (rt) {
            var id = String(rt.id || "");
            if (KONTUR_ROOMS[id] && rt.name) {
              KONTUR_ROOMS[id].title = rt.name;
              var elTitle = document.getElementById("title-" + id);
              if (elTitle) elTitle.textContent = rt.name;
            }
          });
        }
      })
      .catch(function () {
        // Работаем на встроенных данных Контур.Отеля
      });
  }

  // Монтирование живого iframe Яндекс Карт, если указан YANDEX_ORG_ID
  var yandexSlot = document.getElementById("yandexReviewsSlot");
  if (YANDEX_ORG_ID && yandexSlot) {
    yandexSlot.innerHTML =
      '<iframe class="yandex-live-iframe" title="Отзывы гостей на Яндекс Картах" src="https://yandex.ru/maps-reviews-widget/' +
      encodeURIComponent(YANDEX_ORG_ID) +
      '?comments"></iframe>';
  }

  // --------------------------------------------------------------------------
  // 2. Шапка при скролле + фиксация плашки бронирования + мобильная нижняя кнопка
  // --------------------------------------------------------------------------
  var siteHeader = document.getElementById("siteHeader");
  var heroSection = document.getElementById("heroSection");
  var heroBookingSlot = document.getElementById("heroBookingSlot");
  var heroBookingBar = document.getElementById("heroBookingBar");
  var mobileStickyCta = document.getElementById("mobileStickyCta");

  function handleScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", y > 60);
    }

    if (heroBookingSlot && heroBookingBar) {
      if (window.innerWidth >= 1024) {
        if (!heroBookingBar.classList.contains("is-pinned")) {
          heroBookingSlot.style.minHeight = heroBookingBar.offsetHeight + "px";
        }
        var slotRect = heroBookingSlot.getBoundingClientRect();
        var shouldPin = slotRect.bottom <= window.innerHeight - 20;
        heroBookingBar.classList.toggle("is-pinned", shouldPin);
      } else {
        heroBookingBar.classList.remove("is-pinned");
        heroBookingSlot.style.minHeight = "";
      }
    }

    var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 120 : 540;
    if (mobileStickyCta) {
      mobileStickyCta.classList.toggle("is-visible", y > heroBottom);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
  handleScroll();

  // Открытие нативного календаря при клике на любую область даты
  document.querySelectorAll('input[type="date"]').forEach(function (dateInput) {
    function openPicker() {
      if (typeof dateInput.showPicker === "function") {
        try {
          dateInput.showPicker();
        } catch (_) {}
      }
    }
    dateInput.addEventListener("click", openPicker);
    var box = dateInput.closest(".kontur-input-box");
    if (box) {
      box.style.cursor = "pointer";
      box.addEventListener("click", function (e) {
        if (e.target === box) {
          dateInput.focus();
          openPicker();
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 3. Мобильное бургер-меню
  // --------------------------------------------------------------------------
  var burgerBtn = document.getElementById("burgerBtn");
  var mobileDrawer = document.getElementById("mobileDrawer");
  var drawerCloseBtn = document.getElementById("drawerCloseBtn");

  function setDrawerOpen(open) {
    if (!mobileDrawer || !burgerBtn) return;
    mobileDrawer.classList.toggle("is-open", open);
    mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burgerBtn && mobileDrawer && drawerCloseBtn) {
    burgerBtn.addEventListener("click", function () {
      setDrawerOpen(true);
    });
    drawerCloseBtn.addEventListener("click", function () {
      setDrawerOpen(false);
    });
    mobileDrawer.addEventListener("click", function (e) {
      if (e.target === mobileDrawer) setDrawerOpen(false);
    });
    mobileDrawer.querySelectorAll("a, button.js-open-booking, button.js-book-ny").forEach(function (el) {
      el.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    });
  }

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
  // 4. Слайдеры реальных фото внутри карточек домов
  // --------------------------------------------------------------------------
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".house-slider__track");
    var slides = slider.querySelectorAll(".house-slider__slide");
    var dotsContainer = slider.querySelector(".house-slider__dots");
    var prevBtn = slider.querySelector(".house-slider__nav--prev");
    var nextBtn = slider.querySelector(".house-slider__nav--next");
    var idx = 0;
    if (!track || !slides.length || !dotsContainer) return;

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

    function syncTransform() {
      if (window.innerWidth < 768) {
        track.style.transform = "";
      } else {
        track.style.transform = "translateX(-" + idx * 100 + "%)";
      }
    }

    function goTo(newIndex) {
      idx = (newIndex + slides.length) % slides.length;
      syncTransform();
      dotsContainer.querySelectorAll(".house-slider__dot").forEach(function (d, i) {
        d.classList.toggle("is-active", i === idx);
      });
    }

    window.addEventListener("resize", syncTransform);
    syncTransform();

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        goTo(idx - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        goTo(idx + 1);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 5. Фотогалерея: шоппинг-теги и полноэкранный лайтбокс (14 фото)
  // --------------------------------------------------------------------------
  document.querySelectorAll(".shop-tag").forEach(function (tag) {
    var dot = tag.querySelector(".shop-tag__dot");
    if (!dot) return;
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
        { label: "«Барн-хаус», 130 · от\u00A011\u00A0500\u00A0₽ →", href: "#barn-130" },
        { label: "«Барн-Хаус», 70 · от\u00A08\u00A0000\u00A0₽ →", href: "#barn-70" }
      ]
    },
    {
      src: "assets/images/house-living-top.jpg",
      caption: "Двусветная гостиная с\u00A0панорамным остеклением и\u00A0видом на\u00A0лес",
      links: [{ label: "Смотреть «Барн-хаус», 130 →", href: "#barn-130" }]
    },
    {
      src: "assets/images/banya-chan.jpg",
      caption: "Сибирский банный чан на\u00A0дровах с\u00A0пихтой и\u00A0цитрусами",
      links: [{ label: "Заказать банный чан (5\u00A0000\u00A0₽) →", href: "#services" }]
    },
    {
      src: "assets/images/house-exterior-5.jpg",
      caption: "Коттедж в\u00A0стиле барнхаус среди сосен",
      links: [{ label: "Перейти к\u00A0«Барн-Хаус», 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-pergola.jpg",
      caption: "Индивидуальная крытая пергола со\u00A0столом и\u00A0мангалом",
      links: [{ label: "Услуги и\u00A0наборы для\u00A0гриля →", href: "#services" }]
    },
    {
      src: "assets/images/winter-active.jpg",
      caption: "Русская баня на\u00A0дровах и\u00A0зимний прокат лыж и\u00A0коньков",
      links: [{ label: "Все услуги и\u00A0прокат →", href: "#services" }]
    },
    {
      src: "assets/images/house-living-window.jpg",
      caption: "Гостиная с\u00A0выходом на\u00A0приватную террасу",
      links: [{ label: "Перейти к\u00A0«Барн-Хаус», 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-bedroom-1.jpg",
      caption: "Спальня с\u00A0двуспальной кроватью на\u00A01\u00A0этаже",
      links: [{ label: "Смотреть «Барн-Хаус», 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-mezzanine.jpg",
      caption: "Второй мансардный этаж со\u00A0спальными местами",
      links: [{ label: "Смотреть «Барн-Хаус», 70 →", href: "#barn-70" }]
    },
    {
      src: "assets/images/house-kitchen.jpg",
      caption: "Кухня с\u00A0плитой, СВЧ, холодильником и\u00A0полным набором посуды",
      links: [{ label: "Сравнить оба дома →", href: "#houses" }]
    },
    {
      src: "assets/images/house-bathroom.jpg",
      caption: "Современный санузел с\u00A0душем, LED-зеркалом и\u00A0полотенцами",
      links: [{ label: "Сравнить оба дома →", href: "#houses" }]
    },
    {
      src: "assets/images/real-terrace.jpg",
      caption: "Приватная терраса коттеджа среди хвойного леса",
      links: [{ label: "Смотреть «Барн-хаус», 130 →", href: "#barn-130" }]
    },
    {
      src: "assets/images/house-bedroom-loft.jpg",
      caption: "Изолированная спальня на\u00A0втором этаже",
      links: [{ label: "Смотреть «Барн-хаус», 130 →", href: "#barn-130" }]
    },
    {
      src: "assets/images/house-second-floor.jpg",
      caption: "Галерея второго этажа с\u00A0видом на\u00A0витраж",
      links: [{ label: "Смотреть «Барн-хаус», 130 →", href: "#barn-130" }]
    }
  ];

  var lightboxModal = document.getElementById("lightboxModal");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxCounter = document.getElementById("lightboxCounter");
  var lightboxLinks = document.getElementById("lightboxLinks");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentPhotoIdx = 0;

  function renderLightbox(index) {
    if (!lightboxModal || !lightboxImg) return;
    currentPhotoIdx = (index + galleryData.length) % galleryData.length;
    var item = galleryData[currentPhotoIdx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) lightboxCounter.textContent = "Фото " + (currentPhotoIdx + 1) + " из\u00A0" + galleryData.length;
    if (lightboxLinks) {
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
  }

  if (lightboxModal) {
    document.querySelectorAll(".js-open-lightbox").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        var idx = parseInt(el.getAttribute("data-index") || "0", 10);
        renderLightbox(idx);
        openModal(lightboxModal);
      });
    });
    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", function () {
        renderLightbox(currentPhotoIdx - 1);
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener("click", function () {
        renderLightbox(currentPhotoIdx + 1);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Полноширинная карта территории и сворачиваемая легенда
  // --------------------------------------------------------------------------
  var territoryObjects = {
    "1": {
      badge: "Объект №\u00A01",
      title: "Въезд, КПП и\u00A0гостевая парковка",
      desc: "Круглогодичный асфальтовый подъезд со\u00A0стороны Курумоча. Охраняемая парковка на\u00A0территории, заезд гостей после 14:00.",
      btnText: "Как добраться",
      btnHref: "#contacts"
    },
    "2": {
      badge: "Объект №\u00A02",
      title: "Коттеджи «Барн-хаус», 130",
      desc: "Пять двухэтажных домов (130\u00A0м², 6+2\u00A0места) с\u00A0дровяным камином, 3\u00A0спальнями, 2\u00A0санузлами и\u00A0мангальной зоной.",
      btnText: "Перейти к\u00A0Барн 130",
      btnHref: "#barn-130"
    },
    "3": {
      badge: "Объект №\u00A03",
      title: "Коттеджи «Барн-Хаус», 70",
      desc: "Восемь двухэтажных домов (70\u00A0м², 4+1\u00A0гостя) со\u00A0спальней на\u00A01\u00A0этаже, мансардой и\u00A0видом на\u00A0реку.",
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
    var badge = document.getElementById("territoryDetailBadge");
    var title = document.getElementById("territoryDetailTitle");
    var desc = document.getElementById("territoryDetailDesc");
    var btn = document.getElementById("territoryDetailBtn");
    if (badge) badge.textContent = info.badge;
    if (title) title.textContent = info.title;
    if (desc) desc.textContent = info.desc;
    if (btn) {
      btn.textContent = info.btnText;
      btn.href = info.btnHref;
    }
  }

  document.querySelectorAll("[data-pin]").forEach(function (el) {
    el.addEventListener("click", function () {
      selectTerritoryPin(el.getAttribute("data-pin"));
    });
  });

  var territoryPanel = document.getElementById("territoryPanel");
  var territoryToggleBtn = document.getElementById("territoryToggleBtn");
  if (territoryPanel && territoryToggleBtn) {
    territoryToggleBtn.addEventListener("click", function () {
      var collapsed = territoryPanel.classList.toggle("is-legend-collapsed");
      territoryToggleBtn.textContent = collapsed ? "Показать список" : "Свернуть список";
    });
  }

  // --------------------------------------------------------------------------
  // 7. Фильтрация списка услуг
  // --------------------------------------------------------------------------
  var filterTabs = document.querySelectorAll(".filter-tab");
  var serviceRows = document.querySelectorAll("#servicesList .service-row");

  if (filterTabs.length && serviceRows.length) {
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
  }

  // --------------------------------------------------------------------------
  // 8. Модальное окно подбора домиков Контур.Отель и попап удобств
  // --------------------------------------------------------------------------
  var bookingModal = document.getElementById("bookingModal");
  var specsModal = document.getElementById("specsModal");
  var konturForm = document.getElementById("konturSimForm");
  var konturSuccess = document.getElementById("konturSuccess");
  var modalCheckin = document.getElementById("modalCheckin");
  var modalCheckout = document.getElementById("modalCheckout");
  var modalGuests = document.getElementById("modalGuests");
  var guestComment = document.getElementById("guestComment");
  var konturRoomsList = document.getElementById("konturRoomsList");
  var konturSummary = document.getElementById("konturSummary");
  var konturDirectLink = document.getElementById("konturDirectLink");
  var konturResetBtn = document.getElementById("konturResetBtn");

  function openModal(modal) {
    if (!modal) return;
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
    if (lightboxModal && lightboxModal.classList.contains("is-open")) {
      if (e.key === "ArrowLeft") renderLightbox(currentPhotoIdx - 1);
      if (e.key === "ArrowRight") renderLightbox(currentPhotoIdx + 1);
    }
  });

  function computeRoomStay(room, d1, d2, nights) {
    var total = 0;
    var nyDays = 0;
    for (var i = 0; i < nights; i++) {
      var cur = new Date(d1.getTime() + i * 86400000);
      var m = cur.getMonth() + 1;
      var day = cur.getDate();
      var dow = cur.getDay();
      if (m === 12 && day === 31) {
        total += room.nyEve;
        nyDays++;
      } else if ((m === 12 && day >= 29) || (m === 1 && day <= 8)) {
        total += room.nyHoliday;
        nyDays++;
      } else if (dow === 5) {
        total += room.friday;
      } else if (dow === 6) {
        total += room.saturday;
      } else {
        total += room.weekday;
      }
    }
    return { total: total, firstNight: Math.round(total / nights), nyDays: nyDays };
  }

  function renderKonturRooms() {
    if (!modalCheckin || !modalCheckout || !modalGuests || !konturRoomsList || !konturSummary) return;

    var d1 = new Date(modalCheckin.value + "T14:00:00");
    var d2 = new Date(modalCheckout.value + "T12:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
      d2 = new Date(d1.getTime() + 86400000);
      modalCheckout.value = formatIsoDate(d2);
    }
    var nights = Math.max(1, Math.round((d2 - d1) / 86400000));
    var guestsCount = parseInt(modalGuests.value || "2", 10);

    // Если гостей больше 5 — по умолчанию выбираем Барн 130
    if (guestsCount > 5 && bookingState.selectedRoomId === "254819") {
      bookingState.selectedRoomId = "254820";
    }

    var primaryIds = guestsCount <= 5 ? ["254819", "254820"] : ["254820"];
    var overflowIds = guestsCount > 5 ? ["254819"] : [];

    function buildOfferCard(room, isSmall) {
      var calc = computeRoomStay(room, d1, d2, nights);
      var isSelected = bookingState.selectedRoomId === room.id;
      var cls = "kontur-room-offer" + (isSelected ? " is-selected" : "") + (isSmall ? " is-small-capacity" : "");
      var capNote = isSmall
        ? "Вместимость дома до\u00A05\u00A0мест (для\u00A0" + guestsCount + "\u00A0гостей потребуется 2\u00A0дома)"
        : room.area + " · " + room.baseCap + "+" + room.extraCap + "\u00A0гостей · " + room.roomsText;

      return (
        '<div class="' + cls + '" data-offer-id="' + room.id + '">' +
          '<div>' +
            '<div class="kontur-room-offer__title">' + room.title + "</div>" +
            '<div class="kontur-room-offer__meta">' + capNote + "</div>" +
            '<div class="kontur-room-offer__tariff">Тариф «' + room.tariffName + "» · " + room.included + "</div>" +
          "</div>" +
          '<div class="kontur-room-offer__right">' +
            '<div class="kontur-room-offer__price">' + calc.total.toLocaleString("ru-RU") + "\u00A0₽</div>" +
            '<div style="font-size:0.78rem;color:var(--text-muted);">за\u00A0' + nights + "\u00A0ноч. · отмена за\u00A024\u00A0ч</div>" +
            '<button type="button" class="btn ' + (isSelected ? "btn--primary" : "btn--outline") + ' btn--sm js-pick-room" data-room-id="' + room.id + '">' +
              (isSelected ? "Выбрано" : "Выбрать") +
            "</button>" +
          "</div>" +
        "</div>"
      );
    }

    var html = primaryIds.map(function (id) {
      return buildOfferCard(KONTUR_ROOMS[id], false);
    }).join("");

    if (overflowIds.length) {
      html += '<div class="kontur-section-note">Дома меньшей вместимости</div>';
      html += overflowIds.map(function (id) {
        return buildOfferCard(KONTUR_ROOMS[id], true);
      }).join("");
    }

    konturRoomsList.innerHTML = html;

    konturRoomsList.querySelectorAll(".js-pick-room").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bookingState.selectedRoomId = btn.getAttribute("data-room-id");
        renderKonturRooms();
      });
    });

    var chosen = KONTUR_ROOMS[bookingState.selectedRoomId] || KONTUR_ROOMS["254820"];
    var chosenCalc = computeRoomStay(chosen, d1, d2, nights);
    var rateType = chosenCalc.nyDays > 0 ? "праздничный / новогодний тариф" : "тариф «Бархатный сезон 2026»";

    konturSummary.innerHTML =
      '<div class="kontur-summary__row"><span>Выбранный дом</span><strong>' + chosen.title + " (" + guestsCount + "\u00A0гост.)</strong></div>" +
      '<div class="kontur-summary__row"><span>Период и\u00A0условия</span><span>' + nights + "\u00A0ноч. · " + rateType + " · завтрак включён</span></div>" +
      '<div class="kontur-summary__row kontur-summary__total"><span>Итого (предоплата первых суток)</span><span>' + chosenCalc.total.toLocaleString("ru-RU") + "\u00A0₽</span></div>";

    if (konturDirectLink) {
      konturDirectLink.href = "https://briz.club/booking?room-type=" + chosen.id;
    }
  }

  function openBookingModal(opts) {
    opts = opts || {};
    if (opts.checkin) bookingState.checkin = opts.checkin;
    if (opts.checkout) bookingState.checkout = opts.checkout;
    if (opts.guests) bookingState.guests = String(opts.guests);
    if (opts.house && KONTUR_ROOMS[opts.house]) bookingState.selectedRoomId = opts.house;
    if (opts.note !== undefined) bookingState.note = opts.note;

    if (modalCheckin) modalCheckin.value = bookingState.checkin;
    if (modalCheckout) modalCheckout.value = bookingState.checkout;
    if (modalGuests) modalGuests.value = bookingState.guests;
    if (guestComment) guestComment.value = bookingState.note || "";

    if (konturForm) konturForm.style.display = "block";
    if (konturSuccess) konturSuccess.style.display = "none";

    renderKonturRooms();
    openModal(bookingModal);
  }

  if (modalCheckin && modalCheckout && modalGuests) {
    [modalCheckin, modalCheckout, modalGuests].forEach(function (el) {
      el.addEventListener("change", function () {
        bookingState.checkin = modalCheckin.value;
        bookingState.checkout = modalCheckout.value;
        bookingState.guests = modalGuests.value;
        syncAllBookingInputs();
        renderKonturRooms();
      });
    });
  }

  document.querySelectorAll(".js-booking-form").forEach(function (form) {
    var cinInput = form.querySelector(".js-checkin");
    var coutInput = form.querySelector(".js-checkout");
    var gSelect = form.querySelector(".js-guests");
    var hSelect = form.querySelector(".js-house");

    [cinInput, coutInput, gSelect, hSelect].forEach(function (ctrl) {
      if (!ctrl) return;
      ctrl.addEventListener("change", function () {
        if (cinInput && coutInput && cinInput.value && coutInput.value) {
          var d1 = new Date(cinInput.value + "T14:00:00");
          var d2 = new Date(coutInput.value + "T12:00:00");
          if (!isNaN(d1.getTime()) && (isNaN(d2.getTime()) || d2 <= d1)) {
            coutInput.value = formatIsoDate(new Date(d1.getTime() + 86400000));
          }
          bookingState.checkin = cinInput.value;
          bookingState.checkout = coutInput.value;
        }
        if (gSelect) {
          bookingState.guests = gSelect.value;
        }
        syncAllBookingInputs();
        if (hSelect) {
          document.querySelectorAll(".js-house").forEach(function (el) {
            el.value = hSelect.value;
          });
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cin = form.querySelector(".js-checkin").value;
      var cout = form.querySelector(".js-checkout").value;
      var g = form.querySelector(".js-guests").value;
      var hEl = form.querySelector(".js-house");
      var h = hEl ? hEl.value : "all";

      var targetId = h && h !== "all" ? h : (parseInt(g, 10) >= 5 ? "254820" : "254819");
      openBookingModal({
        checkin: cin,
        checkout: cout,
        guests: g,
        house: targetId
      });
    });
  });

  document.querySelectorAll(".js-open-booking").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-house-target");
      var svc = btn.getAttribute("data-service-note");
      openBookingModal({
        house: target && KONTUR_ROOMS[target] ? target : bookingState.selectedRoomId,
        note: svc ? "Интересует услуга: " + svc : ""
      });
    });
  });

  document.querySelectorAll(".js-book-ny").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openBookingModal({
        checkin: btn.getAttribute("data-checkin"),
        checkout: btn.getAttribute("data-checkout"),
        house: btn.getAttribute("data-house") || bookingState.selectedRoomId,
        note: "Новогодний заезд 2027"
      });
    });
  });

  if (konturForm && konturSuccess) {
    konturForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("guestName").value.trim() || "Гость";
      var phone = document.getElementById("guestPhone").value.trim();
      var room = KONTUR_ROOMS[bookingState.selectedRoomId] || KONTUR_ROOMS["254820"];
      var successText = document.getElementById("konturSuccessText");
      if (successText) {
        successText.innerHTML =
          "<strong>" + name + "</strong>, ваш запрос на\u00A0<strong>" + room.title + "</strong> (" +
          modalCheckin.value + "\u00A0— " + modalCheckout.value + ", гостей: " + modalGuests.value + ") сформирован. " +
          "При подключении API Контур.Отеля бронь отправляется напрямую в\u00A0систему управления (ID\u00A01292) с\u00A0подтверждением на\u00A0номер <strong>" + phone + "</strong>.";
      }
      konturForm.style.display = "none";
      konturSuccess.style.display = "block";
    });
  }

  if (konturResetBtn && konturForm && konturSuccess) {
    konturResetBtn.addEventListener("click", function () {
      konturForm.style.display = "block";
      konturSuccess.style.display = "none";
    });
  }

  // Попап с полным описанием и всеми удобствами из Контур.Отеля
  var specsBookBtn = document.getElementById("specsBookBtn");
  var activeSpecId = "254819";

  document.querySelectorAll(".js-open-specs").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-spec");
      var room = KONTUR_ROOMS[id];
      if (!room || !specsModal) return;

      document.getElementById("specsModalTitle").textContent = room.title;
      document.getElementById("specsModalSubtitle").textContent =
        room.area + " · " + room.baseCap + "+" + room.extraCap + "\u00A0гостей · " + room.roomsText + " · Тариф «" + room.tariffName + "» (" + room.included + ")";

      var amenitiesHtml = '<div class="specs-amenities-grid">' + room.amenities.map(function (a) {
        return '<div class="specs-amenities-col"><h4>' + a.group + "</h4><p>" + a.items + "</p></div>";
      }).join("") + "</div>";

      document.getElementById("specsModalBody").innerHTML = room.description + amenitiesHtml;
      activeSpecId = id;
      openModal(specsModal);
    });
  });

  if (specsBookBtn) {
    specsBookBtn.addEventListener("click", function () {
      closeAllModals();
      openBookingModal({ house: activeSpecId });
    });
  }

  // Быстрые пресеты дат в окне подбора
  document.querySelectorAll(".js-date-preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var preset = btn.getAttribute("data-preset");
      var now = new Date();
      var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var end;

      if (preset === "weekend") {
        var daysToFri = (5 - start.getDay() + 7) % 7 || 7;
        start = new Date(start.getTime() + daysToFri * 86400000);
        end = new Date(start.getTime() + 2 * 86400000);
      } else if (preset === "midweek") {
        var daysToTue = (2 - start.getDay() + 7) % 7 || 7;
        start = new Date(start.getTime() + daysToTue * 86400000);
        end = new Date(start.getTime() + 2 * 86400000);
      } else {
        bookingState.checkin = "2026-12-31";
        bookingState.checkout = "2027-01-03";
        if (modalCheckin) modalCheckin.value = bookingState.checkin;
        if (modalCheckout) modalCheckout.value = bookingState.checkout;
        syncAllBookingInputs();
        renderKonturRooms();
        return;
      }

      bookingState.checkin = formatIsoDate(start);
      bookingState.checkout = formatIsoDate(end);
      if (modalCheckin) modalCheckin.value = bookingState.checkin;
      if (modalCheckout) modalCheckout.value = bookingState.checkout;
      syncAllBookingInputs();
      renderKonturRooms();
    });
  });

  // Копирование координат для навигатора в один клик
  var copyCoordsBtn = document.getElementById("copyCoordsBtn");
  if (copyCoordsBtn) {
    var defaultCoordsLabel = copyCoordsBtn.textContent;
    copyCoordsBtn.addEventListener("click", function () {
      var coords = copyCoordsBtn.getAttribute("data-coords") || "53.4718, 50.0384";
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(coords).catch(function () {});
      }
      copyCoordsBtn.textContent = "Скопировано: " + coords;
      setTimeout(function () {
        copyCoordsBtn.textContent = defaultCoordsLabel;
      }, 2000);
    });
  }

  syncAllBookingInputs();
})();
