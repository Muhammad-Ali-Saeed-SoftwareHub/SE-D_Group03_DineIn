/**
 * Dine in — Catering Inquiries Front-End Logic
 * Group 03 | Section SE-D | Module M4
 *
 * Responsibilities:
 *  - Interactive package cards: "Select Package" buttons automatically preselect
 *    the package in the form and smooth-scroll to the inquiry section.
 *  - Form validation: Name, valid email format, sensible phone digits,
 *    event type, guest count, location, and past date prevention.
 *  - Front-end feedback and submission processing.
 *  - Polished confirmation modal displaying inquiry summary & demo reference.
 *  - Modal closing (button, Escape key, backdrop click) & form reset options.
 *  - Integrates seamlessly with window.DineInCart toast notifications.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initCateringPage);

  function initCateringPage() {
    const form = document.getElementById('catering-form');
    if (!form) return;

    // Elements
    const nameInput = document.getElementById('cat-name');
    const emailInput = document.getElementById('cat-email');
    const phoneInput = document.getElementById('cat-phone');
    const eventTypeSelect = document.getElementById('cat-event-type');
    const dateInput = document.getElementById('cat-date');
    const guestsInput = document.getElementById('cat-guests');
    const packageSelect = document.getElementById('cat-package');
    const locationInput = document.getElementById('cat-location');
    const notesInput = document.getElementById('cat-notes');
    const submitBtn = document.getElementById('submit-catering-btn');
    const resetBtn = document.getElementById('reset-catering-btn');
    const activePackageBanner = document.getElementById('active-package-banner');
    const activePackageName = document.getElementById('active-package-name');

    // Modal Elements
    const modalBackdrop = document.getElementById('catering-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDoneBtn = document.getElementById('modal-done-btn');
    const modalResetNewBtn = document.getElementById('modal-new-inquiry-btn');
    const modalCodeEl = document.getElementById('modal-inquiry-code');
    const modalClientName = document.getElementById('modal-client-name');
    const modalEventInfo = document.getElementById('modal-event-info');
    const modalPackageName = document.getElementById('modal-package-name');
    const modalGuestCount = document.getElementById('modal-guest-count');
    const modalLocation = document.getElementById('modal-location');
    const modalContact = document.getElementById('modal-contact');
    const modalDietary = document.getElementById('modal-dietary');

    // Date Constraints: Prevent past dates, limit up to 1 year ahead
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    const maxYyyy = maxDate.getFullYear();
    const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDd = String(maxDate.getDate()).padStart(2, '0');
    const maxDateStr = `${maxYyyy}-${maxMm}-${maxDd}`;

    dateInput.min = minDateStr;
    dateInput.max = maxDateStr;

    // -------------------------------------------------------------
    // Package Selection Cards Sync
    // -------------------------------------------------------------
    const selectPackageButtons = document.querySelectorAll('[data-select-package]');
    selectPackageButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pkgValue = btn.getAttribute('data-select-package');
        if (pkgValue && packageSelect) {
          packageSelect.value = pkgValue;
          updateActivePackageBanner(pkgValue);
          clearFieldError(packageSelect, 'cat-package-error');

          // Smooth scroll to the inquiry form
          const inquirySection = document.getElementById('inquiry-section');
          if (inquirySection) {
            inquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
            window.DineInCart.showToast(`Selected the ${pkgValue} Package for your event!`, 'success');
          }
        }
      });
    });

    packageSelect.addEventListener('change', () => {
      clearFieldError(packageSelect, 'cat-package-error');
      updateActivePackageBanner(packageSelect.value);
    });

    function updateActivePackageBanner(pkg) {
      if (!activePackageBanner || !activePackageName) return;
      if (pkg) {
        activePackageName.textContent = `${pkg} Package`;
        activePackageBanner.hidden = false;
      } else {
        activePackageBanner.hidden = true;
      }
    }

    // Input Sanitization & Live Feedback
    nameInput.addEventListener('input', () => clearFieldError(nameInput, 'cat-name-error'));
    emailInput.addEventListener('input', () => clearFieldError(emailInput, 'cat-email-error'));
    phoneInput.addEventListener('input', () => clearFieldError(phoneInput, 'cat-phone-error'));
    eventTypeSelect.addEventListener('change', () => clearFieldError(eventTypeSelect, 'cat-event-type-error'));
    dateInput.addEventListener('change', () => clearFieldError(dateInput, 'cat-date-error'));
    guestsInput.addEventListener('input', () => clearFieldError(guestsInput, 'cat-guests-error'));
    locationInput.addEventListener('input', () => clearFieldError(locationInput, 'cat-location-error'));

    // Form Submission & Reset
    form.addEventListener('submit', handleFormSubmit);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetForm();
        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast('Inquiry form reset.', 'info');
        }
      });
    }

    // Modal Actions
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
    if (modalResetNewBtn) {
      modalResetNewBtn.addEventListener('click', () => {
        closeModal();
        resetForm();
        const inquirySection = document.getElementById('inquiry-section');
        if (inquirySection) {
          inquirySection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-active')) {
        closeModal();
      }
    });

    // -------------------------------------------------------------
    // Validation Helpers
    // -------------------------------------------------------------
    function validateName() {
      const val = nameInput.value.trim();
      if (!val) {
        showFieldError(nameInput, 'cat-name-error', 'Please enter your full name or organizer name.');
        return false;
      }
      if (val.length < 3) {
        showFieldError(nameInput, 'cat-name-error', 'Name must be at least 3 characters.');
        return false;
      }
      clearFieldError(nameInput, 'cat-name-error');
      return true;
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!val) {
        showFieldError(emailInput, 'cat-email-error', 'Email address is required for our catering proposal.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailInput, 'cat-email-error', 'Please provide a valid email format (e.g., name@domain.com).');
        return false;
      }
      clearFieldError(emailInput, 'cat-email-error');
      return true;
    }

    function validatePhone() {
      const val = phoneInput.value.trim();
      const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!val) {
        showFieldError(phoneInput, 'cat-phone-error', 'Please provide a contact phone number.');
        return false;
      }
      if (!phoneRegex.test(cleaned)) {
        showFieldError(phoneInput, 'cat-phone-error', 'Please enter a sensible phone number (at least 7 digits).');
        return false;
      }
      clearFieldError(phoneInput, 'cat-phone-error');
      return true;
    }

    function validateEventType() {
      const val = eventTypeSelect.value;
      if (!val) {
        showFieldError(eventTypeSelect, 'cat-event-type-error', 'Please select the type of event.');
        return false;
      }
      clearFieldError(eventTypeSelect, 'cat-event-type-error');
      return true;
    }

    function validateDate() {
      const val = dateInput.value;
      if (!val) {
        showFieldError(dateInput, 'cat-date-error', 'Please select the event date.');
        return false;
      }
      if (val < minDateStr) {
        showFieldError(dateInput, 'cat-date-error', 'Event date cannot be in the past.');
        return false;
      }
      clearFieldError(dateInput, 'cat-date-error');
      return true;
    }

    function validateGuests() {
      const val = parseInt(guestsInput.value, 10);
      if (isNaN(val) || val <= 0) {
        showFieldError(guestsInput, 'cat-guests-error', 'Please specify an estimated guest count (minimum 10).');
        return false;
      }
      if (val < 10) {
        showFieldError(guestsInput, 'cat-guests-error', 'Our catering packages start at a minimum of 10 guests.');
        return false;
      }
      clearFieldError(guestsInput, 'cat-guests-error');
      return true;
    }

    function validatePackage() {
      const val = packageSelect.value;
      if (!val) {
        showFieldError(packageSelect, 'cat-package-error', 'Please select a catering package (Basic, Premium, or Deluxe).');
        return false;
      }
      clearFieldError(packageSelect, 'cat-package-error');
      return true;
    }

    function validateLocation() {
      const val = locationInput.value.trim();
      if (!val) {
        showFieldError(locationInput, 'cat-location-error', 'Please enter the event venue address or city location.');
        return false;
      }
      clearFieldError(locationInput, 'cat-location-error');
      return true;
    }

    function showFieldError(input, errorId, message) {
      input.classList.add('is-invalid');
      const err = document.getElementById(errorId);
      if (err) {
        err.textContent = message;
        err.hidden = false;
      }
    }

    function clearFieldError(input, errorId) {
      input.classList.remove('is-invalid');
      const err = document.getElementById(errorId);
      if (err) {
        err.textContent = '';
        err.hidden = true;
      }
    }

    // -------------------------------------------------------------
    // Form Submission & Success Modal
    // -------------------------------------------------------------
    function handleFormSubmit(e) {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isEventTypeValid = validateEventType();
      const isDateValid = validateDate();
      const isGuestsValid = validateGuests();
      const isPackageValid = validatePackage();
      const isLocationValid = validateLocation();

      if (
        !isNameValid ||
        !isEmailValid ||
        !isPhoneValid ||
        !isEventTypeValid ||
        !isDateValid ||
        !isGuestsValid ||
        !isPackageValid ||
        !isLocationValid
      ) {
        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast('Please check the required catering fields.', 'error');
        }
        return;
      }

      // Processing feedback
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting Inquiry...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Generate demonstration reference code
        const inquiryCode = 'CAT-' + Math.floor(100000 + Math.random() * 900000);
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const eventTypeVal = eventTypeSelect.options[eventTypeSelect.selectedIndex].text;
        const dateVal = dateInput.value;
        const guestsVal = guestsInput.value;
        const packageVal = packageSelect.value + ' Package';
        const locationVal = locationInput.value.trim();
        const notesVal = notesInput.value.trim() || 'No specific dietary or serving notes provided';

        // Populate Modal Fields
        if (modalCodeEl) modalCodeEl.textContent = inquiryCode;
        if (modalClientName) modalClientName.textContent = nameVal;
        if (modalEventInfo) modalEventInfo.textContent = `${eventTypeVal} • ${formatDisplayDate(dateVal)}`;
        if (modalPackageName) modalPackageName.textContent = packageVal;
        if (modalGuestCount) modalGuestCount.textContent = `${guestsVal} Guests`;
        if (modalLocation) modalLocation.textContent = locationVal;
        if (modalContact) modalContact.textContent = `${emailVal} • ${phoneVal}`;
        if (modalDietary) modalDietary.textContent = notesVal;

        openModal();

        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast(`Inquiry sent! Reference #${inquiryCode}`, 'success');
        }
      }, 500);
    }

    function openModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.add('is-active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (modalCloseBtn) modalCloseBtn.focus();
    }

    function closeModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('is-active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      submitBtn.focus();
    }

    function resetForm() {
      form.reset();
      updateActivePackageBanner('');
      const errors = form.querySelectorAll('.form-error');
      errors.forEach((err) => {
        err.textContent = '';
        err.hidden = true;
      });
      const invalidFields = form.querySelectorAll('.is-invalid');
      invalidFields.forEach((field) => field.classList.remove('is-invalid'));
    }

    function formatDisplayDate(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
})();
