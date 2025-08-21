document.addEventListener('DOMContentLoaded', () => {
  const formationSelect = document.getElementById('formation-select');
  const countrySelect = document.getElementById('country-select');
  const leagueSelect = document.getElementById('league-select');
  const logosGrid = document.getElementById('logos-grid');
  const pitch = document.getElementById('pitch');
  const clearBtn = document.getElementById('clear-formation');
  const exportBtn = document.getElementById('export-image');
  const clubSearchInput = document.getElementById('club-search');
  const flagSearchInput = document.getElementById('flag-search');

  let selectedLogoSrc = null;
  let selectedFlagClass = null;

  // --- Configurable Sources --------------------------------------------------
  // Strategy types:
  //   legacySeasonRepo: logos/<League Folder>/<Club>.png
  //   flatCountry: logos/<country>/<slug>.{svg|png} (Leo repo)
  const LOGO_BASES = [
    { name: 'leoSvgRepo', url: 'https://raw.githubusercontent.com/Leo4815162342/football-logos/main/logos', type: 'flatCountry', exts: ['svg','png'] },
    { name: 'githubFootballLogos', url: 'https://raw.githubusercontent.com/luukhopman/football-logos/master/logos', type: 'legacySeasonRepo', exts: ['png'] }
  ];

  // --- Mapping actual GitHub directory names for leagues (folder names are "Country - League")
const leagueFolderMap = {
  england: { 'premier-league': 'England - Premier League' },
  spain: { 'laliga': 'Spain - LaLiga' },
  germany: { 'bundesliga': 'Germany - Bundesliga' },
  italy: { 'serie-a': 'Italy - Serie A' },
  france: { 'ligue-1': 'France - Ligue 1' },
  netherlands: { 'eredivisie': 'Netherlands - Eredivisie' },
  portugal: { 'primeira-liga': 'Portugal - Liga Portugal' },
  belgium: { 'jupiler-pro-league': 'Belgium - Jupiler Pro League' },
  turkey: { 'super-lig': 'Türkiye - Süper Lig' },
  scotland: { 'premiership': 'Scotland - Scottish Premiership' },
  'saudi-arabia': { 'saudi-pro-league': 'Saudi Arabia - Saudi Pro League' }
};

// Explicit filename overrides where repo uses different spacing / suffixes
// Keyed by league folder then club display name -> actual file base name (without .png)
const clubFilenameOverrides = {
  'England - Premier League': {
    'Arsenal': 'Arsenal FC',
    'Aston Villa': 'Aston Villa',
    'Bournemouth': 'AFC Bournemouth',
    'Brentford': 'Brentford FC',
    'Brighton': 'Brighton & Hove Albion',
    'Chelsea': 'Chelsea FC',
    'Crystal Palace': 'Crystal Palace',
    'Everton': 'Everton FC',
    'Fulham': 'Fulham FC',
    'Leicester City': 'Leicester City',
    'Liverpool': 'Liverpool FC',
    'Manchester City': 'Manchester City',
    'Manchester United': 'Manchester United',
    'Newcastle United': 'Newcastle United',
    'Nottingham Forest': 'Nottingham Forest',
    'Southampton': 'Southampton FC',
    'Tottenham Hotspur': 'Tottenham Hotspur',
    'West Ham United': 'West Ham United',
    'Wolverhampton Wanderers': 'Wolverhampton Wanderers',
    'Ipswich Town': 'Ipswich Town',
    'Leeds United': 'Leeds United',
    'Sunderland': 'Sunderland AFC',
  }
};

// Add Spain LaLiga overrides (sample subset, extend as needed)
clubFilenameOverrides['Spain - LaLiga'] = {
  'Athletic Club': 'Athletic Bilbao',
  'Atlético Madrid': 'Atlético de Madrid',
  'Barcelona': 'FC Barcelona',
  'Celta Vigo': 'Celta de Vigo',
  'Espanyol': 'RCD Espanyol Barcelona',
  'Girona': 'Girona FC',
  'Las Palmas': 'UD Las Palmas',
  'Leganés': 'CD Leganés',
  'Mallorca': 'RCD Mallorca',
  'Osasuna': 'CA Osasuna',
  'Rayo Vallecano': 'Rayo Vallecano',
  'Real Betis': 'Real Betis Balompié',
  'Real Madrid': 'Real Madrid',
  'Real Sociedad': 'Real Sociedad',
  'Sevilla': 'Sevilla FC',
  'Valencia': 'Valencia CF',
  'Valladolid': 'Real Valladolid',
  'Villarreal': 'Villarreal CF',
  'Alavés': 'Deportivo Alavés'
};

  // --- Initialization ---

  function initialize() {
    populateFormations();
    populateCountries();
    renderPitch(formationSelect.value);
    loadAllLogos();

    formationSelect.addEventListener('change', () => renderPitch(formationSelect.value));
    countrySelect.addEventListener('change', handleCountryChange);
  leagueSelect.addEventListener('change', handleLeagueChange);
  if (clearBtn) clearBtn.addEventListener('click', clearFormationSlots);
  if (exportBtn) exportBtn.addEventListener('click', exportPitchImage);
  if (clubSearchInput) clubSearchInput.addEventListener('input', handleClubSearch);
  if (flagSearchInput) flagSearchInput.addEventListener('input', handleFlagSearch);
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

  // Map internal country IDs to ISO 3166-1 alpha-2 codes for flag-icons
  const countryIsoMap = {
    england: 'gb-eng', // Use St George's Cross for England
    spain: 'es',
    germany: 'de',
    italy: 'it',
    france: 'fr',
    netherlands: 'nl',
    portugal: 'pt',
    belgium: 'be',
    turkey: 'tr',
    scotland: 'gb-sct', // Scotland saltire
    'saudi-arabia': 'sa'
  };

  const countryFlagSpan = document.getElementById('country-flag');
  const flagsGrid = document.getElementById('flags-grid');

  // Full ISO country list (alpha-2) including FIFA-recognized + common territories, for flag-icons
  const ISO_COUNTRY_CODES = `af ax al dz as ad ao ai aq ag ar am aw au at az bs bh bd bb by be bz bj bm bt bo bq ba bw bv br io bn bg bf bi kh cm ca cv ky cf td cl cn cx cc co km cg cd ck cr ci hr cu cw cy cz dk dj dm do ec eg sv gq er ee sz et fk fo fj fi fr gf pf tf ga gm ge de gh gi gr gl gd gp gu gt gg gn gw gy ht hm va hn hk hu is in id ir iq ie im il it jm jp je jo kz ke ki kp kr kw kg la lv lb ls lr ly li lt lu mo mk mg mw my mv ml mt mh mq mr mu yt mx fm md mc mn me ms ma mz mm na nr np nl nc nz ni ne ng nu nf mp no om pk pw ps pa pg py pe ph pn pl pt pr qa ro ru rw re bl sh kn lc mf pm vc ws sm st sa sn rs sc sl sg sx sk si sb so za gs ss es lk sd sr sj se ch sy tw tj tz th tl tg tk to tt tn tr tm tc tv ug ua ae gb us um uy uz vu ve vn vg vi wf eh ye zm zw gb-eng gb-sct gb-wls`.split(/\s+/);

  // Top 20 (تقريبي) حسب تصنيف FIFA (تحديث تقريبي 2025) – يمكن تعديل القائمة لاحقاً
  const TOP_FIFA_CODES = [
    'ar','fr','gb-eng','be','br','nl','pt','es','hr','it',
    'us','ma','ch','de','mx','uy','co','sn','jp','dk'
  ];

  // Optional Arabic names (fallback to code upper-case)
  const isoDisplayName = (code) => {
    const map = {
      sa: 'السعودية', eg: 'مصر', dz: 'الجزائر', ma: 'المغرب', tn: 'تونس', qa: 'قطر', ae: 'الإمارات', kw: 'الكويت', bh: 'البحرين', om: 'عُمان', iq: 'العراق', sy: 'سوريا', jo: 'الأردن', lb: 'لبنان', ps: 'فلسطين', ye: 'اليمن', ly: 'ليبيا', sd: 'السودان', so: 'الصومال', gb: 'المملكة المتحدة', 'gb-eng': 'إنجلترا', 'gb-sct': 'اسكتلندا', 'gb-wls': 'ويلز', us: 'الولايات المتحدة', fr: 'فرنسا', de: 'ألمانيا', es: 'إسبانيا', it: 'إيطاليا', br: 'البرازيل', ar: 'الأرجنتين', pt: 'البرتغال', nl: 'هولندا', be: 'بلجيكا', tr: 'تركيا', jp: 'اليابان', cn: 'الصين', ru: 'روسيا', in: 'الهند', se: 'السويد', no: 'النرويج', fi: 'فنلندا', dk: 'الدانمارك', ch: 'سويسرا', at: 'النمسا', gr: 'اليونان', mx: 'المكسيك', ca: 'كندا', au: 'أستراليا', za: 'جنوب أفريقيا'
    };
    return map[code] || code.toUpperCase();
  };

  // English names (subset/common); fallback to code
  const englishCountryNames = {
    'gb-eng': 'England', 'gb-sct': 'Scotland', 'gb-wls': 'Wales', gb: 'United Kingdom', sa: 'Saudi Arabia', eg: 'Egypt', dz: 'Algeria', ma: 'Morocco', tn: 'Tunisia', qa: 'Qatar', ae: 'United Arab Emirates', kw: 'Kuwait', bh: 'Bahrain', om: 'Oman', iq: 'Iraq', sy: 'Syria', jo: 'Jordan', lb: 'Lebanon', ps: 'Palestine', ye: 'Yemen', ly: 'Libya', sd: 'Sudan', so: 'Somalia', us: 'United States', fr: 'France', de: 'Germany', es: 'Spain', it: 'Italy', br: 'Brazil', ar: 'Argentina', pt: 'Portugal', nl: 'Netherlands', be: 'Belgium', tr: 'Turkey', jp: 'Japan', cn: 'China', ru: 'Russia', in: 'India', se: 'Sweden', no: 'Norway', fi: 'Finland', dk: 'Denmark', ch: 'Switzerland', at: 'Austria', gr: 'Greece', mx: 'Mexico', ca: 'Canada', au: 'Australia', za: 'South Africa'
  };

  function englishName(code){ return englishCountryNames[code] || code.toUpperCase(); }

  function updateCountryFlag() {
    const val = countrySelect.value;
    if (!val) { countryFlagSpan.className = 'fi'; return; }
    const iso = countryIsoMap[val];
    if (iso) {
      countryFlagSpan.className = 'fi fi-' + iso;
    } else {
      countryFlagSpan.className = 'fi';
    }
  }

  // --- Flags Panel ---------------------------------------------------------
  function buildFlagsPanel() {
    if (!flagsGrid) return;
    flagsGrid.innerHTML = '';
    const filter = flagSearchInput ? flagSearchInput.value.trim().toLowerCase() : '';
    const rendered = new Set();

    function appendFlag(code, top=false){
      if (rendered.has(code)) return; // avoid duplicates
      const arabic = isoDisplayName(code);
      const english = englishName(code);
      const combined = (arabic + ' ' + english + ' ' + code).toLowerCase();
      if (filter && !combined.includes(filter)) return;
      const item = document.createElement('div');
      item.className = 'flag-item' + (top ? ' top-fifa' : '');
      item.innerHTML = `<span class=\"fi fi-${code}\"></span><small><span>${arabic}</span><br><span class=\"en-name\">${english}</span></small>`;
      item.addEventListener('click', () => {
        document.querySelectorAll('.flag-item.selected').forEach(el=>el.classList.remove('selected'));
        item.classList.add('selected');
        selectedFlagClass = 'fi fi-' + code;
        selectedLogoSrc = null;
      });
      flagsGrid.appendChild(item);
      rendered.add(code);
    }

    // First: top FIFA countries (unless filtering breaks them out)
    TOP_FIFA_CODES.forEach(code => appendFlag(code, true));

    // Separator (only if no filter and at least one top item shown)
    if (!filter && rendered.size > 0) {
      const sep = document.createElement('div');
      sep.className = 'flags-separator';
      sep.textContent = 'بقية الأعلام';
      flagsGrid.appendChild(sep);
    }

    // Rest of countries
    ISO_COUNTRY_CODES.forEach(code => appendFlag(code, false));
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

    function normalizeClubName(clubName) {
      return clubName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Strip combining marks (broad browser support)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

  // Generate candidate club filename variants to improve match rate
function clubFilenameCandidates(clubName) {
  const original = clubName;
  const ascii = clubName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ä/g, 'a')
    .replace(/Ä/g, 'A')
    .replace(/ß/g, 'ss');
  const noDots = ascii.replace(/\./g, '');
  const trimmed = ascii.replace(/ (FC|CF)$/i, '');
  const dashed = ascii.replace(/ /g, '-');
  const unique = new Set([original, ascii, noDots, trimmed, dashed]);
  return Array.from(unique);
}

  // SVG repo slug overrides (country -> club display -> slug)
  const svgCountryOverrides = {
    england: {
      'Arsenal': 'arsenal','Aston Villa': 'aston-villa','Bournemouth': 'bournemouth','Brentford': 'brentford','Brighton': 'brighton','Chelsea': 'chelsea','Crystal Palace': 'crystal-palace','Everton': 'everton','Fulham': 'fulham','Ipswich Town': 'ipswich','Leicester City': 'leicester','Leeds United': 'leeds-united','Liverpool': 'liverpool','Manchester City': 'manchester-city','Manchester United': 'manchester-united','Newcastle United': 'newcastle','Nottingham Forest': 'nottingham-forest','Southampton': 'southampton','Tottenham Hotspur': 'tottenham','West Ham United': 'west-ham','Wolverhampton Wanderers': 'wolves'
    },
    spain: {
      'Barcelona': 'barcelona','Real Madrid': 'real-madrid','Atlético Madrid': 'atletico-madrid','Athletic Club': 'athletic-bilbao','Sevilla': 'sevilla','Valencia': 'valencia','Real Sociedad': 'real-sociedad','Villarreal': 'villarreal','Celta Vigo': 'celta-de-vigo','Mallorca': 'rcd-mallorca','Osasuna': 'ca-osasuna','Rayo Vallecano': 'rayo-vallecano','Real Betis': 'real-betis','Alavés': 'deportivo-alaves','Leganés': 'cd-leganes','Las Palmas': 'ud-las-palmas','Girona': 'girona-fc','Espanyol': 'rcd-espanyol','Valladolid': 'real-valladolid'
    }
  };

  function createLogoItem(clubName, countryId, leagueId) {
    const leagueFolder = leagueFolderMap[countryId]?.[leagueId];
    const legacyOverride = leagueFolder ? (clubFilenameOverrides[leagueFolder]?.[clubName]) : undefined;
    const legacyCandidates = legacyOverride ? [legacyOverride, clubName, ...clubFilenameCandidates(clubName)] : clubFilenameCandidates(clubName);
    const svgOverride = svgCountryOverrides[countryId]?.[clubName];
    const normalized = normalizeClubName(clubName);

    const logoItem = document.createElement('div');
    logoItem.className = 'logo-item';
    const logoImg = document.createElement('img');
    logoImg.alt = clubName;
    logoImg.title = clubName;

    function buildPaths(base) {
      const out = [];
      if (base.type === 'legacySeasonRepo') {
        if (!leagueFolder) return out;
        legacyCandidates.forEach(v => out.push(`${encodeURIComponent(leagueFolder)}/${encodeURIComponent(v)}`));
      } else if (base.type === 'flatCountry') {
        const slugs = new Set();
        if (svgOverride) slugs.add(svgOverride);
        slugs.add(normalized);
        slugs.add(normalized.replace(/-(united|town|city|club|wanderers|hotspur)$/,''));
        slugs.add(normalized.replace(/-(fc|afc|cf|ud|cd)$/,''));
        slugs.forEach(s => out.push(`${countryId}/${s}`));
      }
      return out;
    }

    const perBase = LOGO_BASES.map(b => ({ b, paths: buildPaths(b) }));
    let baseIdx = 0, pathIdx = 0, extIdx = 0;

    function advance() {
      const current = LOGO_BASES[baseIdx];
      extIdx++;
      if (extIdx >= current.exts.length) { extIdx = 0; pathIdx++; }
      if (pathIdx >= perBase[baseIdx].paths.length) { pathIdx = 0; baseIdx++; }
    }

    function skipEmptyBases() {
      while (baseIdx < LOGO_BASES.length && perBase[baseIdx].paths.length === 0) baseIdx++;
    }

    function tryNext() {
      skipEmptyBases();
      if (baseIdx >= LOGO_BASES.length) {
        logoItem.innerHTML = `<span style="font-size:10px;text-align:center;line-height:1.1;">${clubName}</span>`;
        return;
      }
      const baseConf = LOGO_BASES[baseIdx];
      const rel = perBase[baseIdx].paths[pathIdx];
      const ext = baseConf.exts[extIdx];
      const src = `${baseConf.url}/${rel}.${ext}`;
      console.debug(`[LogoAttempt] base=${baseConf.name} club='${clubName}' path='${rel}.${ext}' -> ${src}`);
      logoImg.src = src;
      advance();
    }

    logoImg.onerror = () => tryNext();
    logoImg.onload = () => {
      logoItem.addEventListener('click', () => {
        document.querySelectorAll('.logo-item.selected').forEach(el => el.classList.remove('selected'));
        logoItem.classList.add('selected');
        selectedLogoSrc = logoImg.src;
      });
    };

    tryNext();
    logoItem.appendChild(logoImg);
    return logoItem;
  }

  // --- Accordion Logos Rendering ---
  const logosAccordion = document.getElementById('logos-accordion');

  function ensureLeagueSection(folder, displayName) {
    let section = logosAccordion.querySelector(`[data-folder="${folder}"]`);
    if (section) return section;
    section = document.createElement('div');
    section.className = 'league-section';
    section.dataset.folder = folder;
    const headerBtn = document.createElement('button');
    headerBtn.className = 'league-toggle';
    headerBtn.type = 'button';
    headerBtn.innerHTML = `<span>${displayName}</span><span>+</span>`;
    const body = document.createElement('div');
    body.className = 'league-body';
    const grid = document.createElement('div');
    grid.className = 'league-grid';
    body.appendChild(grid);
    headerBtn.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      headerBtn.querySelector('span:last-child').textContent = open ? '−' : '+';
    });
    section.appendChild(headerBtn);
    section.appendChild(body);
    logosAccordion.appendChild(section);
    return section;
  }

  function loadAllLogos() {
    logosAccordion.innerHTML = '';
    for (const countryId in database) {
      for (const leagueId in database[countryId].leagues) {
        const folder = leagueFolderMap[countryId]?.[leagueId];
        if (!folder) continue;
        const leagueDisplay = database[countryId].leagues[leagueId].name;
        const section = ensureLeagueSection(folder, leagueDisplay);
        const grid = section.querySelector('.league-grid');
        database[countryId].leagues[leagueId].clubs.forEach(clubName => {
          grid.appendChild(createLogoItem(clubName, countryId, leagueId));
        });
      }
    }
  }

  // --- Event Handlers ---

  function handleCountryChange() {
    const countryId = countrySelect.value;
  updateCountryFlag();
    populateLeagues(countryId);
    filterLogos();
  }

  function handleLeagueChange() {
    filterLogos();
  }

  function filterLogos() {
    const countryId = countrySelect.value;
    const leagueId = leagueSelect.value;
    const term = clubSearchInput ? clubSearchInput.value.trim().toLowerCase() : '';
    logosAccordion.innerHTML = '';
    for (const cId in database) {
      if (countryId && cId !== countryId) continue;
      for (const lId in database[cId].leagues) {
        if (leagueId && lId !== leagueId) continue;
        const folder = leagueFolderMap[cId]?.[lId];
        if (!folder) continue;
        const leagueDisplay = database[cId].leagues[lId].name;
        const section = ensureLeagueSection(folder, leagueDisplay);
        const grid = section.querySelector('.league-grid');
        const clubs = database[cId].leagues[lId].clubs.slice().sort();
        let added = 0;
        clubs.forEach(clubName => {
          if (term && !clubName.toLowerCase().includes(term)) return;
          grid.appendChild(createLogoItem(clubName, cId, lId));
          added++;
        });
        // If searching: remove empty sections, open sections with matches
        const body = section.querySelector('.league-body');
        const toggle = section.querySelector('.league-toggle span:last-child');
        if (term) {
          if (added === 0) {
            section.remove();
          } else {
            body.classList.add('open');
            if (toggle) toggle.textContent = '−';
          }
        }
      }
    }
  }

  // --- Pitch Rendering ---

  function renderPitch(formation) {
    pitch.innerHTML = '';
    const rows = formations[formation];
    if (!rows) return;

    // Add field lines layer
    const lines = document.createElement('div');
    lines.className = 'field-lines';
    lines.innerHTML = `
      <div class="field-line half-line"></div>
      <div class="center-circle"></div>
      <div class="center-spot"></div>
      <div class="penalty-box top"></div>
      <div class="penalty-box bottom"></div>
      <div class="goal-box top"></div>
      <div class="goal-box bottom"></div>
      <div class="penalty-spot top"></div>
      <div class="penalty-spot bottom"></div>
    `;
    pitch.appendChild(lines);

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
            slot.classList.add('filled-slot');
            slot.innerHTML = `<img src="${selectedLogoSrc}" alt="Selected Logo">`;
          } else if (selectedFlagClass) {
            slot.classList.add('filled-slot');
            slot.innerHTML = `<span class="${selectedFlagClass}" style="font-size:44px;line-height:1"></span>`;
          }
        });
        
        pitch.appendChild(slot);
      }
    });
  }

  // --- Clear Formation (empties all placed images/flags) ---
  function clearFormationSlots() {
    pitch.querySelectorAll('.player-slot').forEach(slot => {
      slot.innerHTML = '';
      slot.classList.remove('filled-slot');
    });
  }

  // --- Export Pitch to Image using html2canvas ---
  function exportPitchImage() {
    if (typeof html2canvas === 'undefined') {
      alert('html2canvas غير محمّل');
      return;
    }
    // Remove selection state temporarily
    const selectedEls = [...document.querySelectorAll('.logo-item.selected')];
    selectedEls.forEach(el => el.classList.remove('selected'));
    html2canvas(pitch, { backgroundColor: null, scale: 3, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `formation-${formationSelect.value}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      selectedEls.forEach(el => el.classList.add('selected'));
    }).catch(err => console.error('Export failed', err));
  }

  function handleClubSearch(){ filterLogos(); }
  function handleFlagSearch(){ buildFlagsPanel(); }

  initialize();
  buildFlagsPanel();
  updateCountryFlag();
});
