document.addEventListener('DOMContentLoaded', () => {
  const formationSelect = document.getElementById('formation-select');
  const countrySelect = document.getElementById('country-select');
  const leagueSelect = document.getElementById('league-select');
  const logosGrid = document.getElementById('logos-grid');
  const pitch = document.getElementById('pitch');

  let selectedLogoSrc = null;

  // --- Initialization ---

  function initialize() {
    populateFormations();
    populateCountries();
    renderPitch(formationSelect.value);
    loadAllLogos();

    formationSelect.addEventListener('change', () => renderPitch(formationSelect.value));
    countrySelect.addEventListener('change', handleCountryChange);
    leagueSelect.addEventListener('change', handleLeagueChange);
  }

  // --- Populating Selects ---

  function populateFormations() {
    for (const formation in formations) {
      const option = document.createElement('option');
      option.value = formation;
      option.textContent = formation;
      formationSelect.appendChild(option);
    }
  }

  function populateCountries() {
    for (const countryId in database) {
      const option = document.createElement('option');
      option.value = countryId;
      option.textContent = database[countryId].name;
      countrySelect.appendChild(option);
    }
  }

  function populateLeagues(countryId) {
    leagueSelect.innerHTML = '<option value="">-- كل الدوريات --</option>';
    if (countryId && database[countryId]) {
      for (const leagueId in database[countryId].leagues) {
        const option = document.createElement('option');
        option.value = leagueId;
        option.textContent = database[countryId].leagues[leagueId].name;
        leagueSelect.appendChild(option);
      }
      leagueSelect.disabled = false;
    } else {
      leagueSelect.disabled = true;
    }
  }

  // --- Logo Rendering ---

  function createLogoItem(clubName, countryId, leagueId) {
    const logoItem = document.createElement('div');
    logoItem.className = 'logo-item';
    const logoImg = document.createElement('img');
    const clubId = clubName.toLowerCase().replace(/ /g, '-');
    const logoSrc = `https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/${countryId}/${leagueId}/${clubId}.png`;
    logoImg.src = logoSrc;
    logoImg.alt = clubName;
    logoImg.title = clubName;
    logoImg.onerror = () => { logoItem.style.display = 'none'; }; // Hide if logo fails to load
    logoItem.appendChild(logoImg);

    logoItem.addEventListener('click', () => {
      document.querySelectorAll('.logo-item.selected').forEach(el => el.classList.remove('selected'));
      logoItem.classList.add('selected');
      selectedLogoSrc = logoSrc;
    });

    return logoItem;
  }

  function renderLogos(logos) {
    logosGrid.innerHTML = '';
    logos.forEach(logo => logosGrid.appendChild(logo));
  }

  function loadAllLogos() {
    const allLogoItems = [];
    for (const countryId in database) {
      for (const leagueId in database[countryId].leagues) {
        database[countryId].leagues[leagueId].clubs.forEach(clubName => {
          allLogoItems.push(createLogoItem(clubName, countryId, leagueId));
        });
      }
    }
    renderLogos(allLogoItems);
  }

  // --- Event Handlers ---

  function handleCountryChange() {
    const countryId = countrySelect.value;
    populateLeagues(countryId);
    filterLogos();
  }

  function handleLeagueChange() {
    filterLogos();
  }

  function filterLogos() {
    const countryId = countrySelect.value;
    const leagueId = leagueSelect.value;
    const filteredLogoItems = [];

    if (!countryId) {
      loadAllLogos();
      return;
    }

    for (const cId in database) {
      if (cId === countryId) {
        for (const lId in database[cId].leagues) {
          if (!leagueId || lId === leagueId) {
            database[cId].leagues[lId].clubs.forEach(clubName => {
              filteredLogoItems.push(createLogoItem(clubName, cId, lId));
            });
          }
        }
      }
    }
    renderLogos(filteredLogoItems);
  }

  // --- Pitch Rendering ---

  function renderPitch(formation) {
    pitch.innerHTML = '';
    const rows = formations[formation];
    if (!rows) return;

    const pitchW = pitch.offsetWidth;
    const pitchH = pitch.offsetHeight;
    const rowHeight = pitchH / rows.length;

    rows.forEach((row, i) => {
      const n = row[0];
      for (let j = 0; j < n; j++) {
        const slot = document.createElement('div');
        slot.className = 'player-slot';
        slot.style.top = `${i * rowHeight + rowHeight / 2 - 30}px`;
        slot.style.left = `${(pitchW / (n + 1)) * (j + 1) - 30}px`;
        
        slot.addEventListener('click', () => {
          if (selectedLogoSrc) {
            slot.innerHTML = `<img src="${selectedLogoSrc}" alt="Selected Logo">`;
            slot.style.borderStyle = 'solid';
          }
        });
        
        pitch.appendChild(slot);
      }
    });
  }

  initialize();
});
