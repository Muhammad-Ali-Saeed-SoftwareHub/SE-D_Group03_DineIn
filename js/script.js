// ==========================================================
// Shared JavaScript - Olive & Sage Restaurant (Module M4)
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  // --------------------------------------------------------
  // Shared Helpers (reused across pages)
  // --------------------------------------------------------

  // Returns today's local date in YYYY-MM-DD format for date input min limits
  function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function showError(element, message) {
    element.textContent = message;
    element.hidden = false;
  }

  function clearError(element) {
    element.textContent = "";
    element.hidden = true;
  }

  // Safely builds label/value rows inside a modal summary container
  function renderSummaryRows(container, rows) {
    container.innerHTML = "";
    rows.forEach(function (row) {
      const line = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = row.label + " ";
      line.appendChild(strong);
      line.appendChild(document.createTextNode(row.value));
      container.appendChild(line);
    });
  }

  // --------------------------------------------------------
  // 1. Mobile Collapsible Navigation Menu (all pages)
  // --------------------------------------------------------
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Allow clicking "Navigation" link to toggle the dropdown cleanly
  const navDropdown = document.querySelector(".nav-dropdown");
  if (navDropdown) {
    const dropdownTrigger = navDropdown.querySelector(".nav-link");
    if (dropdownTrigger) {
      dropdownTrigger.addEventListener("click", function (event) {
        event.preventDefault();
        const isOpen = navDropdown.classList.toggle("open");
        dropdownTrigger.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.addEventListener("click", function (event) {
      if (!navDropdown.contains(event.target)) {
        navDropdown.classList.remove("open");
        if (dropdownTrigger) {
          dropdownTrigger.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // --------------------------------------------------------
  // 2. Table Reservation Page Logic (reservations.html)
  // --------------------------------------------------------
  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm) {
    initReservationPage(reservationForm);
  }

  // --------------------------------------------------------
  // 3. Catering & Events Page Logic (catering.html)
  // --------------------------------------------------------
  const cateringForm = document.getElementById("catering-form");
  if (cateringForm) {
    initCateringPage(cateringForm);
  }

  // --------------------------------------------------------
  // 4. Our Branches Page Logic (branches.html)
  // --------------------------------------------------------
  const branchSelect = document.getElementById("branch-select");
  if (branchSelect) {
    initBranchesPage(branchSelect);
  }

  function initReservationPage(form) {
    const dateInput = document.getElementById("res-date");
    const timeInput = document.getElementById("res-time");
    const guestsInput = document.getElementById("res-guests");
    const formError = document.getElementById("form-error");

    const loadingIndicator = document.getElementById("loading-indicator");
    const slotsSection = document.getElementById("slots-section");
    const slotsSummary = document.getElementById("slots-summary");
    const slotsGrid = document.getElementById("slots-grid");
    const slotError = document.getElementById("slot-error");
    const confirmBtn = document.getElementById("confirm-btn");

    const bookingModal = document.getElementById("booking-modal");
    const bookingSummary = document.getElementById("booking-summary");
    const backHomeBtn = document.getElementById("back-home-btn");

    const today = getTodayDateString();
    dateInput.setAttribute("min", today);

    let selectedSlot = "";
    let availabilityTimer = null;

    // Sample availability schedule mapped by preferred time (for demo only)
    const sampleSlotsByTime = {
      "12:00 PM": [
        { time: "11:30 AM", available: true },
        { time: "12:00 PM", available: true },
        { time: "12:30 PM", available: false },
        { time: "1:00 PM", available: true },
        { time: "1:30 PM", available: true },
        { time: "2:00 PM", available: true }
      ],
      "1:00 PM": [
        { time: "12:30 PM", available: true },
        { time: "1:00 PM", available: true },
        { time: "1:30 PM", available: true },
        { time: "2:00 PM", available: false },
        { time: "2:30 PM", available: true },
        { time: "3:00 PM", available: true }
      ],
      "2:00 PM": [
        { time: "1:30 PM", available: true },
        { time: "2:00 PM", available: true },
        { time: "2:30 PM", available: true },
        { time: "3:00 PM", available: true },
        { time: "3:30 PM", available: false },
        { time: "4:00 PM", available: true }
      ],
      "5:00 PM": [
        { time: "4:30 PM", available: true },
        { time: "5:00 PM", available: true },
        { time: "5:30 PM", available: true },
        { time: "6:00 PM", available: false },
        { time: "6:30 PM", available: true },
        { time: "7:00 PM", available: true }
      ],
      "6:00 PM": [
        { time: "5:30 PM", available: true },
        { time: "6:00 PM", available: true },
        { time: "6:30 PM", available: false },
        { time: "7:00 PM", available: true },
        { time: "7:30 PM", available: true },
        { time: "8:00 PM", available: true }
      ],
      "7:00 PM": [
        { time: "6:30 PM", available: true },
        { time: "7:00 PM", available: true },
        { time: "7:30 PM", available: true },
        { time: "8:00 PM", available: false },
        { time: "8:30 PM", available: true },
        { time: "9:00 PM", available: true }
      ],
      "8:00 PM": [
        { time: "7:30 PM", available: true },
        { time: "8:00 PM", available: true },
        { time: "8:30 PM", available: true },
        { time: "9:00 PM", available: true },
        { time: "9:30 PM", available: false },
        { time: "10:00 PM", available: true }
      ],
      "9:00 PM": [
        { time: "8:00 PM", available: true },
        { time: "8:30 PM", available: false },
        { time: "9:00 PM", available: true },
        { time: "9:30 PM", available: true },
        { time: "10:00 PM", available: true },
        { time: "10:30 PM", available: true }
      ]
    };

    // Handle "Check Availability" form submission
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError(formError);
      clearError(slotError);

      const dateValue = dateInput.value.trim();
      const timeValue = timeInput.value.trim();
      const guestsValue = Number(guestsInput.value);

      if (!dateValue) {
        showError(formError, "Please select a reservation date.");
        dateInput.focus();
        return;
      }

      if (dateValue < today) {
        showError(formError, "Please choose today or a future date.");
        dateInput.focus();
        return;
      }

      if (!timeValue) {
        showError(formError, "Please select a preferred time.");
        timeInput.focus();
        return;
      }

      if (
        !guestsInput.value ||
        !Number.isInteger(guestsValue) ||
        guestsValue < 1 ||
        guestsValue > 20
      ) {
        showError(formError, "Please enter a valid whole number of guests (between 1 and 20).");
        guestsInput.focus();
        return;
      }

      // Reset previous selection and show loading indicator briefly
      clearTimeout(availabilityTimer);
      selectedSlot = "";
      slotsSection.hidden = true;
      loadingIndicator.hidden = false;

      availabilityTimer = setTimeout(function () {
        loadingIndicator.hidden = true;
        renderAvailableSlots(dateValue, timeValue, guestsValue);
      }, 700);
    });

    function renderAvailableSlots(dateValue, timeValue, guestsValue) {
      const slots = sampleSlotsByTime[timeValue] || [];
      slotsGrid.innerHTML = "";

      const guestLabel = guestsValue === 1 ? "1 guest" : guestsValue + " guests";
      slotsSummary.textContent =
        "Showing tables for " + guestLabel + " on " + dateValue + " near " + timeValue + ":";

      slots.forEach(function (slot) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "slot-btn";
        button.textContent = slot.time;

        if (!slot.available) {
          button.disabled = true;
          button.title = "This time slot is unavailable";
        } else {
          button.addEventListener("click", function () {
            const allButtons = slotsGrid.querySelectorAll(".slot-btn");
            allButtons.forEach(function (btn) {
              btn.classList.remove("selected");
            });
            button.classList.add("selected");
            selectedSlot = slot.time;
            clearError(slotError);
          });
        }

        slotsGrid.appendChild(button);
      });

      slotsSection.hidden = false;
    }

    // Handle "Confirm Booking" button click
    confirmBtn.addEventListener("click", function () {
      if (!selectedSlot) {
        showError(slotError, "Please select an available time slot before confirming.");
        return;
      }

      clearError(slotError);

      const dateValue = dateInput.value;
      const guestsValue = guestsInput.value;
      const guestLabel = Number(guestsValue) === 1 ? "1 Guest" : guestsValue + " Guests";

      renderSummaryRows(bookingSummary, [
        { label: "Date:", value: dateValue },
        { label: "Time Slot:", value: selectedSlot },
        { label: "Party Size:", value: guestLabel }
      ]);

      bookingModal.hidden = false;
    });

    // Reset form and close modal when user clicks "Back to Home"
    backHomeBtn.addEventListener("click", function (event) {
      event.preventDefault();
      bookingModal.hidden = true;
      form.reset();
      slotsSection.hidden = true;
      selectedSlot = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initCateringPage(form) {
    const eventTypeInput = document.getElementById("event-type");
    const eventDateInput = document.getElementById("event-date");
    const eventGuestsInput = document.getElementById("event-guests");
    const specialRequestsInput = document.getElementById("special-requests");
    const packageSelectInput = document.getElementById("package-select");
    const cateringError = document.getElementById("catering-error");

    const cateringModal = document.getElementById("catering-modal");
    const cateringSummary = document.getElementById("catering-summary");
    const closeModalBtn = document.getElementById("close-catering-modal");

    const today = getTodayDateString();
    eventDateInput.setAttribute("min", today);

    // Handle "Request Quote" form submission
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError(cateringError);

      const eventType = eventTypeInput.value.trim();
      const eventDate = eventDateInput.value.trim();
      const guestCount = Number(eventGuestsInput.value);
      const specialRequests = specialRequestsInput.value.trim();
      const selectedPackage = packageSelectInput.value.trim();

      if (!eventType) {
        showError(cateringError, "Please select an event type.");
        eventTypeInput.focus();
        return;
      }

      if (!eventDate) {
        showError(cateringError, "Please select an event date.");
        eventDateInput.focus();
        return;
      }

      if (eventDate < today) {
        showError(cateringError, "Please choose today or a future event date.");
        eventDateInput.focus();
        return;
      }

      if (
        !eventGuestsInput.value ||
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > 500
      ) {
        showError(cateringError, "Please enter a valid whole number of guests (between 1 and 500).");
        eventGuestsInput.focus();
        return;
      }

      if (!selectedPackage) {
        showError(cateringError, "Please select a catering package.");
        packageSelectInput.focus();
        return;
      }

      const guestLabel = guestCount === 1 ? "1 Guest" : guestCount + " Guests";
      const summaryRows = [
        { label: "Event Type:", value: eventType },
        { label: "Event Date:", value: eventDate },
        { label: "Guest Count:", value: guestLabel },
        { label: "Package:", value: selectedPackage }
      ];

      if (specialRequests) {
        summaryRows.push({ label: "Special Requests:", value: specialRequests });
      }

      renderSummaryRows(cateringSummary, summaryRows);
      cateringModal.hidden = false;
    });

    function closeCateringModal() {
      cateringModal.hidden = true;
      form.reset();
    }

    closeModalBtn.addEventListener("click", closeCateringModal);

    // Allow closing popup by clicking outside the modal box
    cateringModal.addEventListener("click", function (event) {
      if (event.target === cateringModal) {
        closeCateringModal();
      }
    });
  }

  function initBranchesPage(branchSelect) {
    const searchInput = document.getElementById("branch-search");
    const cityFilter = document.getElementById("city-filter");
    const resetBtn = document.getElementById("reset-branch-filters");

    const noBranchesMessage = document.getElementById("no-branches-message");
    const branchSpotlight = document.getElementById("branch-spotlight");
    const branchesDirectory = document.getElementById("branches-directory");
    const branchesGrid = document.getElementById("branches-grid");

    const mapPinLabel = document.getElementById("map-pin-label");
    const detailCity = document.getElementById("detail-city");
    const detailName = document.getElementById("detail-name");
    const detailInfoList = document.getElementById("detail-info-list");

    // Sample branch data (replace with real restaurant locations later)
    const sampleBranches = [
      {
        id: "downtown-main",
        name: "Olive & Sage - Downtown Main (Sample)",
        city: "Lahore",
        address: "14 Sample Boulevard, Gulberg District",
        phone: "(555) 101-2020",
        email: "downtown.sample@oliveandsage.example",
        hours: "Mon - Sun: 11:30 AM - 11:00 PM"
      },
      {
        id: "garden-courtyard",
        name: "Olive & Sage - Garden Courtyard (Sample)",
        city: "Lahore",
        address: "88 Parkside Avenue, Model Town",
        phone: "(555) 101-3030",
        email: "garden.sample@oliveandsage.example",
        hours: "Mon - Sun: 12:00 PM - 11:30 PM"
      },
      {
        id: "hillview-terrace",
        name: "Olive & Sage - Hillview Terrace (Sample)",
        city: "Islamabad",
        address: "22 Margalla Road, Sector F-7",
        phone: "(555) 202-4040",
        email: "hillview.sample@oliveandsage.example",
        hours: "Mon - Fri: 12:00 PM - 10:30 PM | Sat - Sun: 11:00 AM - 11:30 PM"
      },
      {
        id: "civic-center",
        name: "Olive & Sage - Civic Center (Sample)",
        city: "Islamabad",
        address: "5 Blue Area Plaza, Jinnah Avenue",
        phone: "(555) 202-5050",
        email: "civic.sample@oliveandsage.example",
        hours: "Mon - Sun: 11:30 AM - 10:30 PM"
      },
      {
        id: "harbor-breeze",
        name: "Olive & Sage - Harbor Breeze (Sample)",
        city: "Karachi",
        address: "305 Clifton Promenade, Block 4",
        phone: "(555) 303-6060",
        email: "harbor.sample@oliveandsage.example",
        hours: "Mon - Sun: 12:00 PM - 12:00 AM"
      }
    ];

    let selectedBranchId = sampleBranches[0].id;

    // Populate City Filter dropdown from sample branches
    const uniqueCities = [];
    sampleBranches.forEach(function (branch) {
      if (!uniqueCities.includes(branch.city)) {
        uniqueCities.push(branch.city);
      }
    });

    uniqueCities.forEach(function (city) {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });

    function getFilteredBranches() {
      const query = searchInput.value.trim().toLowerCase();
      const chosenCity = cityFilter.value;

      return sampleBranches.filter(function (branch) {
        const matchesCity = chosenCity === "all" || branch.city === chosenCity;
        const matchesName = branch.name.toLowerCase().includes(query);
        return matchesCity && matchesName;
      });
    }

    function renderSelectedBranch(branch) {
      detailCity.textContent = branch.city;
      detailName.textContent = branch.name;

      // Update map placeholder pin label safely
      mapPinLabel.innerHTML = "";
      const pinTitle = document.createElement("strong");
      pinTitle.textContent = branch.name;
      mapPinLabel.appendChild(pinTitle);
      mapPinLabel.appendChild(document.createElement("br"));
      mapPinLabel.appendChild(document.createTextNode(branch.address + ", " + branch.city));

      // Update branch details definition list safely
      detailInfoList.innerHTML = "";
      const infoItems = [
        { label: "Address", value: branch.address },
        { label: "Phone", value: branch.phone },
        { label: "Email", value: branch.email },
        { label: "Opening Hours", value: branch.hours }
      ];

      infoItems.forEach(function (item) {
        const wrapper = document.createElement("div");
        wrapper.className = "branch-info-row";

        const dt = document.createElement("dt");
        dt.textContent = item.label;

        const dd = document.createElement("dd");
        dd.textContent = item.value;

        wrapper.appendChild(dt);
        wrapper.appendChild(dd);
        detailInfoList.appendChild(wrapper);
      });
    }

    function renderBranches() {
      const filtered = getFilteredBranches();

      // Update Branch Select dropdown
      branchSelect.innerHTML = "";

      if (filtered.length === 0) {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "No matching branches";
        branchSelect.appendChild(emptyOption);
        branchSelect.disabled = true;

        noBranchesMessage.hidden = false;
        branchSpotlight.hidden = true;
        branchesDirectory.hidden = true;
        branchesGrid.innerHTML = "";
        return;
      }

      branchSelect.disabled = false;
      noBranchesMessage.hidden = true;
      branchSpotlight.hidden = false;
      branchesDirectory.hidden = false;

      // Keep current selection if still in filtered list; otherwise pick first match
      const stillVisible = filtered.some(function (branch) {
        return branch.id === selectedBranchId;
      });
      if (!stillVisible) {
        selectedBranchId = filtered[0].id;
      }

      filtered.forEach(function (branch) {
        const option = document.createElement("option");
        option.value = branch.id;
        option.textContent = branch.name + " (" + branch.city + ")";
        branchSelect.appendChild(option);
      });
      branchSelect.value = selectedBranchId;

      const activeBranch = filtered.find(function (branch) {
        return branch.id === selectedBranchId;
      });
      if (activeBranch) {
        renderSelectedBranch(activeBranch);
      }

      // Render branch cards grid
      branchesGrid.innerHTML = "";
      filtered.forEach(function (branch) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "branch-card" + (branch.id === selectedBranchId ? " active" : "");

        const badge = document.createElement("span");
        badge.className = "city-badge";
        badge.textContent = branch.city;

        const title = document.createElement("h3");
        title.textContent = branch.name;

        const meta = document.createElement("div");
        meta.className = "branch-card-meta";

        const phoneLine = document.createElement("span");
        phoneLine.textContent = "Phone: " + branch.phone;

        const hoursLine = document.createElement("span");
        hoursLine.textContent = "Hours: " + branch.hours;

        const addressLine = document.createElement("span");
        addressLine.textContent = branch.address;

        meta.appendChild(addressLine);
        meta.appendChild(phoneLine);
        meta.appendChild(hoursLine);

        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(meta);

        card.addEventListener("click", function () {
          selectedBranchId = branch.id;
          renderBranches();
        });

        branchesGrid.appendChild(card);
      });
    }

    // Event listeners for search, city filter, dropdown selection, and reset
    searchInput.addEventListener("input", renderBranches);
    cityFilter.addEventListener("change", renderBranches);

    branchSelect.addEventListener("change", function () {
      selectedBranchId = branchSelect.value;
      renderBranches();
    });

    resetBtn.addEventListener("click", function () {
      searchInput.value = "";
      cityFilter.value = "all";
      selectedBranchId = sampleBranches[0].id;
      renderBranches();
    });

    // Initial render
    renderBranches();
  }
});
