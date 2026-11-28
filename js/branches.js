/**
 * Dine in — Restaurant Branches Directory & Live Search/Filter Logic
 * Group 03 | Section SE-D | Module M4
 *
 * Responsibilities:
 *  - Interactive client-side live search (by branch name, city, area, or address)
 *  - Area/City filtering (dropdown + quick filter pills)
 *  - Real-time card count and active filter indicators
 *  - Dynamic "No branches found. Try another location." empty state with instant reset
 *  - Google Maps search links with explicit demo query parameters opening safely in new tabs
 *  - Integrates seamlessly with window.DineInCart toast notifications
 */

(function () {
  'use strict';

  // Sample demonstration branch catalog
  const BRANCHES = [
    {
      id: 'downtown-flagship',
      name: 'Downtown Flagship',
      city: 'Capital City',
      area: 'Hearth Central',
      address: '125 Warm Hearth Avenue, Suite 100, Capital City',
      phone: '(555) 234-5678',
      hours: 'Mon – Sun: 11:00 AM – 11:00 PM',
      type: 'Flagship & Grill House',
      description: 'Our original flagship location showcasing open brick-oven baking, live wood-fired grill counters, private dining alcoves, and complimentary valet parking.',
      mapQuery: '125 Warm Hearth Avenue Capital City restaurant'
    },
    {
      id: 'riverside-bistro',
      name: 'Riverside Promenade',
      city: 'Riverdale',
      area: 'Waterfront Promenade',
      address: '84 Marina Vista Walk, Pier 4, Riverdale',
      phone: '(555) 345-6789',
      hours: 'Mon – Sun: 12:00 PM – 11:30 PM',
      type: 'Waterfront Dining',
      description: 'Scenic outdoor terrace dining overlooking the marina with evening river breezes, artisan seafood specialties, and an expansive sunset patio.',
      mapQuery: '84 Marina Vista Walk Pier 4 Riverdale restaurant'
    },
    {
      id: 'uptown-culinary',
      name: 'Uptown Pavilion',
      city: 'Capital City',
      area: 'Uptown District',
      address: '410 Grand Pavilion Plaza, 2nd Floor, Capital City',
      phone: '(555) 456-7890',
      hours: 'Sun – Thu: 11:30 AM – 10:30 PM | Fri – Sat: 11:30 AM – 12:00 AM',
      type: 'Banquets & Lounge',
      description: 'Sophisticated modern space featuring cozy booths, a dedicated banquet lounge for corporate events, and full cocktail & mocktail craft bars.',
      mapQuery: '410 Grand Pavilion Plaza Capital City restaurant'
    },
    {
      id: 'highland-meadows',
      name: 'Highland Courtyard',
      city: 'Highland Park',
      area: 'Historic Old Town',
      address: '18 Heritage Court, Historic Old Town, Highland Park',
      phone: '(555) 567-8901',
      hours: 'Tue – Sun: 11:00 AM – 10:00 PM (Closed Mondays)',
      type: 'Garden Courtyard',
      description: 'Charming heritage brick house surrounded by a lush herb garden, offering cozy candlelit dinner tables and weekend brunch platters.',
      mapQuery: '18 Heritage Court Highland Park restaurant'
    },
    {
      id: 'metro-tech-square',
      name: 'Metro Tech Square',
      city: 'Metropolis',
      area: 'Financial Center',
      address: '77 Commerce Boulevard, Concourse B, Metropolis',
      phone: '(555) 678-9012',
      hours: 'Mon – Sat: 11:00 AM – 10:00 PM (Sun: 12:00 PM – 8:00 PM)',
      type: 'Express & Casual Dining',
      description: 'Fast-paced yet upscale casual venue popular for business luncheons, quick pickup platters, and relaxed post-work dinners.',
      mapQuery: '77 Commerce Boulevard Metropolis restaurant'
    }
  ];

  document.addEventListener('DOMContentLoaded', initBranchesPage);

  function initBranchesPage() {
    const grid = document.getElementById('branches-grid');
    const searchInput = document.getElementById('branch-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const cityFilter = document.getElementById('branch-city-filter');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const resultsCountEl = document.getElementById('results-count');
    const filterPillsContainer = document.getElementById('filter-pills-row');

    if (!grid || !searchInput || !cityFilter) return;

    let currentSearchTerm = '';
    let currentCityFilter = 'all';

    // Initial render
    renderBranches();

    // Live search event
    searchInput.addEventListener('input', () => {
      currentSearchTerm = searchInput.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.hidden = currentSearchTerm.length === 0;
      }
      renderBranches();
    });

    // Clear search button
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        clearSearchBtn.hidden = true;
        searchInput.focus();
        renderBranches();
      });
    }

    // City dropdown filter
    cityFilter.addEventListener('change', () => {
      currentCityFilter = cityFilter.value;
      syncFilterPills(currentCityFilter);
      renderBranches();
    });

    // Reset button
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        resetAllFilters();
        if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
          window.DineInCart.showToast('Showing all Dine in branches.', 'info');
        }
      });
    }

    // Quick filter pills delegation
    if (filterPillsContainer) {
      filterPillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        const targetCity = pill.getAttribute('data-city') || 'all';
        currentCityFilter = targetCity;
        cityFilter.value = targetCity;
        syncFilterPills(targetCity);
        renderBranches();
      });
    }

    function syncFilterPills(activeCity) {
      const pills = filterPillsContainer ? filterPillsContainer.querySelectorAll('.filter-pill') : [];
      pills.forEach((p) => {
        const city = p.getAttribute('data-city');
        if (city === activeCity) {
          p.classList.add('is-active');
          p.setAttribute('aria-pressed', 'true');
        } else {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        }
      });
    }

    function resetAllFilters() {
      searchInput.value = '';
      currentSearchTerm = '';
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      currentCityFilter = 'all';
      cityFilter.value = 'all';
      syncFilterPills('all');
      renderBranches();
    }

    function renderBranches() {
      const filtered = BRANCHES.filter((branch) => {
        // City match
        const matchesCity = currentCityFilter === 'all' || branch.city.toLowerCase() === currentCityFilter.toLowerCase();

        // Search match (name, city, area, address)
        const term = currentSearchTerm;
        const matchesSearch =
          !term ||
          branch.name.toLowerCase().includes(term) ||
          branch.city.toLowerCase().includes(term) ||
          branch.area.toLowerCase().includes(term) ||
          branch.address.toLowerCase().includes(term);

        return matchesCity && matchesSearch;
      });

      // Update count badge
      if (resultsCountEl) {
        resultsCountEl.textContent = String(filtered.length);
      }

      // Render cards or empty state
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="no-results-box" role="status">
            <div class="no-results-icon" aria-hidden="true">&#128269;</div>
            <h3>No branches found. Try another location.</h3>
            <p>We couldn't find any Dine in branches matching "${escapeHtml(currentSearchTerm || currentCityFilter)}". Please try adjusting your search terms or view all branches.</p>
            <button type="button" class="btn btn-primary" id="empty-state-reset-btn">
              View All Branches
            </button>
          </div>
        `;

        const emptyResetBtn = document.getElementById('empty-state-reset-btn');
        if (emptyResetBtn) {
          emptyResetBtn.addEventListener('click', resetAllFilters);
        }
        return;
      }

      grid.innerHTML = filtered
        .map((branch) => {
          const encodedQuery = encodeURIComponent(branch.mapQuery);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

          return `
            <article class="branch-card" data-branch-id="${escapeHtml(branch.id)}" aria-labelledby="branch-${escapeHtml(branch.id)}-title">
              <div class="branch-card-header">
                <div class="branch-tag-row">
                  <span class="branch-city-badge">${escapeHtml(branch.city)}</span>
                  <span class="branch-type-badge">${escapeHtml(branch.type)}</span>
                </div>
                <h3 id="branch-${escapeHtml(branch.id)}-title" class="branch-name">${escapeHtml(branch.name)}</h3>
                <div class="branch-area">
                  <span aria-hidden="true">&#128205;</span>
                  <span>${escapeHtml(branch.area)}</span>
                </div>
              </div>

              <div class="branch-card-body">
                <p class="branch-desc">${escapeHtml(branch.description)}</p>

                <ul class="branch-details-list">
                  <li class="branch-details-item">
                    <span class="branch-details-icon" aria-hidden="true">&#127968;</span>
                    <div class="branch-details-text">
                      <strong>Address (Sample)</strong>
                      <span>${escapeHtml(branch.address)}</span>
                    </div>
                  </li>
                  <li class="branch-details-item">
                    <span class="branch-details-icon" aria-hidden="true">&#128222;</span>
                    <div class="branch-details-text">
                      <strong>Contact Number</strong>
                      <span><a href="tel:${escapeHtml(branch.phone.replace(/[^0-9]/g, ''))}">${escapeHtml(branch.phone)}</a></span>
                    </div>
                  </li>
                  <li class="branch-details-item">
                    <span class="branch-details-icon" aria-hidden="true">&#128340;</span>
                    <div class="branch-details-text">
                      <strong>Opening Hours</strong>
                      <span>${escapeHtml(branch.hours)}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="branch-card-footer">
                <a
                  href="${mapsUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline"
                  aria-label="View ${escapeHtml(branch.name)} location on Google Maps (opens in a new tab)"
                >
                  View Location &#8599;
                </a>
                <a
                  href="reservations.html"
                  class="btn btn-primary"
                  aria-label="Reserve a table at ${escapeHtml(branch.name)}"
                >
                  Book Table
                </a>
              </div>
            </article>
          `;
        })
        .join('');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = String(text || '');
      return div.innerHTML;
    }
  }
})();
