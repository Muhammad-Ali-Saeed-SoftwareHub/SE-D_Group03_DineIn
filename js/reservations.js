/**
 * Dine in — Table Reservations Front-End Logic
 * Group 03 | Section SE-D | Module M4
 *
 * Responsibilities:
 *  - Real-time client-side validation (names, email format, phone digits/length)
 *  - Date restrictions: Prevents past dates and dates past 60 days
 *  - Time slot selection and guest count handling
 *  - Front-end table availability simulation with meaningful responses
 *  - Polished confirmation modal display with unique demo reference code
 *  - Working accessible modal close actions (close button, Escape key, backdrop click)
 *  - Syncs seamlessly with window.DineInCart toast notifications
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initReservationsPage);

  function initReservationsPage() {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    // Elements
    const dateInput = document.getElementById('res-date');
    const timeSlotsWrap = document.getElementById('time-slots-container');
    const guestsSelect = document.getElementById('res-guests');
    const nameInput = document.getElementById('res-name');
    const emailInput = document.getElementById('res-email');
    const phoneInput = document.getElementById('res-phone');
    const notesInput = document.getElementById('res-notes');
    const checkAvailabilityBtn = document.getElementById('check-availability-btn');
    const availabilityAlert = document.getElementById('availability-alert');
    const submitBtn = document.getElementById('submit-reservation-btn');

    // Modal Elements
    const modalBackdrop = document.getElementById('reservation-modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDoneBtn = document.getElementById('modal-done-btn');
    const modalCodeEl = document.getElementById('modal-booking-code');
    const modalGuestName = document.getElementById('modal-guest-name');
    const modalDateTime = document.getElementById('modal-datetime');
    const modalPartySize = document.getElementById('modal-partysize');
    const modalSeating = document.getElementById('modal-seating');
    const modalContact = document.getElementById('modal-contact');
    const modalRequests = document.getElementById('modal-requests');

    // Set Date restrictions (min: today, max: today + 60 days)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
    const maxYyyy = maxDate.getFullYear();
    const maxMm = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDd = String(maxDate.getDate()).padStart(2, '0');
    const maxDateStr = `${maxYyyy}-${maxMm}-${maxDd}`;

    dateInput.min = minDateStr;
    dateInput.max = maxDateStr;

    // Default to today if empty
    if (!dateInput.value) {
      dateInput.value = minDateStr;
    }

    // Input Sanitization & Live Feedback
    nameInput.addEventListener('input', () => clearFieldError(nameInput, 'res-name-error'));
    emailInput.addEventListener('input', () => clearFieldError(emailInput, 'res-email-error'));
    phoneInput.addEventListener('input', () => clearFieldError(phoneInput, 'res-phone-error'));
    dateInput.addEventListener('change', () => {
      clearFieldError(dateInput, 'res-date-error');
      hideAvailabilityAlert();
    });
    guestsSelect.addEventListener('change', () => {
      clearFieldError(guestsSelect, 'res-guests-error');
      hideAvailabilityAlert();
    });

    if (timeSlotsWrap) {
      timeSlotsWrap.addEventListener('change', () => {
        clearTimeSlotError();
        hideAvailabilityAlert();
      });
    }

    // Availability Check Interaction
    checkAvailabilityBtn.addEventListener('click', handleCheckAvailability);

    // Form Submission / Confirmation
    form.addEventListener('submit', handleFormSubmit);

    // Modal Close Listeners
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
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
        showFieldError(nameInput, 'res-name-error', 'Please enter your full name.');
        return false;
      }
      if (val.length < 3) {
        showFieldError(nameInput, 'res-name-error', 'Name must be at least 3 characters.');
        return false;
      }
      clearFieldError(nameInput, 'res-name-error');
      return true;
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!val) {
        showFieldError(emailInput, 'res-email-error', 'Email address is required for confirmation.');
        return false;
      }
      if (!emailRegex.test(val)) {
        showFieldError(emailInput, 'res-email-error', 'Please enter a valid email address (e.g., name@domain.com).');
        return false;
      }
      clearFieldError(emailInput, 'res-email-error');
      return true;
    }

    function validatePhone() {
      const val = phoneInput.value.trim();
      // Allow clean formats with digits, hyphens, spaces, parens, or +
      const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!val) {
        showFieldError(phoneInput, 'res-phone-error', 'Please provide a contact phone number.');
        return false;
      }
      if (!phoneRegex.test(cleaned)) {
        showFieldError(phoneInput, 'res-phone-error', 'Please enter a sensible phone number (at least 7 digits).');
        return false;
      }
      clearFieldError(phoneInput, 'res-phone-error');
      return true;
    }

    function validateDate() {
      const val = dateInput.value;
      if (!val) {
        showFieldError(dateInput, 'res-date-error', 'Please choose a reservation date.');
        return false;
      }
      if (val < minDateStr) {
        showFieldError(dateInput, 'res-date-error', 'Reservation date cannot be in the past.');
        return false;
      }
      if (val > maxDateStr) {
        showFieldError(dateInput, 'res-date-error', 'Bookings can only be made up to 60 days in advance.');
        return false;
      }
      clearFieldError(dateInput, 'res-date-error');
      return true;
    }

    function getSelectedTimeSlot() {
      const selected = form.querySelector('input[name="reservationTime"]:checked');
      return selected ? selected.value : '';
    }

    function validateTimeSlot() {
      const time = getSelectedTimeSlot();
      const errorEl = document.getElementById('res-time-error');
      if (!time) {
        if (errorEl) {
          errorEl.textContent = 'Please choose a preferred dining time slot.';
          errorEl.hidden = false;
        }
        return false;
      }
      clearTimeSlotError();
      return true;
    }

    function clearTimeSlotError() {
      const errorEl = document.getElementById('res-time-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    }

    function validateGuests() {
      const val = guestsSelect.value;
      if (!val) {
        showFieldError(guestsSelect, 'res-guests-error', 'Please select party size.');
        return false;
      }
      clearFieldError(guestsSelect, 'res-guests-error');
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

    function hideAvailabilityAlert() {
      if (availabilityAlert) {
        availabilityAlert.hidden = true;
        availabilityAlert.innerHTML = '';
      }
    }

    // -------------------------------------------------------------
    // Check Availability Handler
    // -------------------------------------------------------------
    function handleCheckAvailability() {
      const isDateValid = validateDate();
      const isTimeValid = validateTimeSlot();
      const isGuestsValid = validateGuests();

      if (!isDateValid || !isTimeValid || !isGuestsValid) {
        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast('Please select date, time, and guest count first.', 'error');
        }
        return;
      }

      const dateVal = dateInput.value;
      const timeVal = getSelectedTimeSlot();
      const guestsVal = guestsSelect.options[guestsSelect.selectedIndex].text;
      const seatingOption = form.querySelector('input[name="seatingArea"]:checked');
      const seatingText = seatingOption ? seatingOption.value : 'Main Dining';

      // Provide visual feedback during check
      const originalText = checkAvailabilityBtn.textContent;
      checkAvailabilityBtn.disabled = true;
      checkAvailabilityBtn.textContent = 'Checking tables...';

      setTimeout(() => {
        checkAvailabilityBtn.disabled = false;
        checkAvailabilityBtn.textContent = originalText;

        // Front-end dynamic availability response
        // Certain weekend peak times simulate high demand but offer available adjoining tables
        const dateObj = new Date(dateVal + 'T00:00:00');
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const isPeak = (timeVal === '7:30 PM' || timeVal === '8:00 PM') && (dayOfWeek === 'Friday' || dayOfWeek === 'Saturday');

        availabilityAlert.hidden = false;
        if (isPeak) {
          availabilityAlert.className = 'alert alert-warning availability-banner';
          availabilityAlert.innerHTML = `
            <div>
              <strong>High Demand for ${dayOfWeek} at ${timeVal}:</strong>
              <div>Only 2 prime tables left for ${guestsVal} in ${seatingText}. Instant confirmation is guaranteed upon submission!</div>
            </div>
          `;
        } else {
          availabilityAlert.className = 'alert alert-success availability-banner';
          availabilityAlert.innerHTML = `
            <div>
              <strong>Tables Readily Available!</strong>
              <div>Excellent choice. We have comfortable seating for ${guestsVal} on ${dayOfWeek}, ${formatDisplayDate(dateVal)} at ${timeVal} (${seatingText}).</div>
            </div>
          `;
        }

        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast(`Table available for ${guestsVal} at ${timeVal}!`, 'success');
        }
      }, 450);
    }

    // -------------------------------------------------------------
    // Form Submission & Confirmation Modal Handler
    // -------------------------------------------------------------
    function handleFormSubmit(e) {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isDateValid = validateDate();
      const isTimeValid = validateTimeSlot();
      const isGuestsValid = validateGuests();

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isDateValid || !isTimeValid || !isGuestsValid) {
        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast('Please correct the highlighted fields before confirming.', 'error');
        }
        return;
      }

      // Provide feedback while processing
      submitBtn.disabled = true;
      const originalSubmitText = submitBtn.textContent;
      submitBtn.textContent = 'Processing Reservation...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalSubmitText;

        // Generate a realistic demo booking code
        const bookingCode = 'DIN-' + Math.floor(100000 + Math.random() * 900000);
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const dateVal = dateInput.value;
        const timeVal = getSelectedTimeSlot();
        const guestsText = guestsSelect.options[guestsSelect.selectedIndex].text;
        const seatingOption = form.querySelector('input[name="seatingArea"]:checked');
        const seatingText = seatingOption ? seatingOption.value : 'Main Dining Hall';
        const notesVal = notesInput.value.trim() || 'No special requests specified';

        // Populate modal
        if (modalCodeEl) modalCodeEl.textContent = bookingCode;
        if (modalGuestName) modalGuestName.textContent = nameVal;
        if (modalDateTime) modalDateTime.textContent = `${formatDisplayDate(dateVal)} at ${timeVal}`;
        if (modalPartySize) modalPartySize.textContent = guestsText;
        if (modalSeating) modalSeating.textContent = seatingText;
        if (modalContact) modalContact.textContent = `${emailVal} • ${phoneVal}`;
        if (modalRequests) modalRequests.textContent = notesVal;

        // Open Modal
        openModal();

        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast(`Table confirmed! Reference #${bookingCode}`, 'success');
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
