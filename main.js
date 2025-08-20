// قائمة شعارات أندية وأعلام منتخبات (روابط مباشرة + أعلام)
const logos = [
  // شعارات أندية
  { name: 'ريال مدريد', src: 'https://football-logos.cc/spain/real-madrid.png', type: 'logo' },
  { name: 'برشلونة', src: 'https://football-logos.cc/spain/barcelona.png', type: 'logo' },
  { name: 'الهلال', src: 'https://football-logos.cc/saudi-arabia/al-hilal.png', type: 'logo' },
  { name: 'النصر', src: 'https://football-logos.cc/saudi-arabia/al-nassr.png', type: 'logo' },
  // أعلام منتخبات
  { name: 'السعودية', code: 'sa', type: 'flag' },
  { name: 'البرازيل', code: 'br', type: 'flag' },
  { name: 'الأرجنتين', code: 'ar', type: 'flag' },
  { name: 'فرنسا', code: 'fr', type: 'flag' },
];

const formations = {
  '4-4-2': [ [1], [4], [4], [2] ],
  '4-4-1-1': [ [1], [4], [4], [1], [1] ],
  '4-1-2-1-2': [ [1], [4], [1], [2], [1], [2] ], // Diamond
  '4-1-3-2': [ [1], [4], [1], [3], [2] ],
  '4-2-3-1': [ [1], [4], [2], [3], [1] ],
  '4-2-2-2': [ [1], [4], [2], [2], [2] ],
  '4-2-4': [ [1], [4], [2], [4] ],
  '4-3-3': [ [1], [4], [3], [3] ],
  '4-1-4-1': [ [1], [4], [1], [4], [1] ],
  '4-3-2-1': [ [1], [4], [3], [2], [1] ],
  '4-5-1': [ [1], [4], [5], [1] ],
  '4-6-0': [ [1], [4], [6] ],
  '3-4-3': [ [1], [3], [4], [3] ],
  '3-4-2-1': [ [1], [3], [4], [2], [1] ],
  '3-4-1-2': [ [1], [3], [4], [1], [2] ],
  '3-2-4-1': [ [1], [3], [2], [4], [1] ],
  '3-1-3-3': [ [1], [3], [1], [3], [3] ],
  '5-2-2-1': [ [1], [5], [2], [2], [1] ],
  '5-4-1': [ [1], [5], [4], [1] ],
  '3-5-2': [ [1], [3], [5], [2] ],
  '3-5-1-1': [ [1], [3], [5], [1], [1] ],
  '5-3-2': [ [1], [5], [3], [2] ],
};

const pitch = document.getElementById('pitch');
const formationSelect = document.getElementById('formation-select');
const logosDiv = document.getElementById('logos');
let selectedLogo = null;

function renderLogos() {
  logosDiv.innerHTML = '';
  logos.forEach((logo, idx) => {
    const div = document.createElement('div');
    div.className = 'logo-item';
    div.title = logo.name;
    if (logo.type === 'logo') {
      div.innerHTML = `<img src="${logo.src}" alt="${logo.name}" />`;
    } else if (logo.type === 'flag') {
      div.innerHTML = `<span class="fi fi-${logo.code}" style="font-size:32px;"></span>`;
    }
    div.onclick = () => {
      document.querySelectorAll('.logo-item').forEach(e => e.classList.remove('selected'));
      div.classList.add('selected');
      selectedLogo = logo;
    };
    logosDiv.appendChild(div);
  });
}

function renderPitch(formation) {
  pitch.innerHTML = '';
  const rows = formations[formation];
  const pitchW = pitch.offsetWidth;
  const pitchH = pitch.offsetHeight;
  const rowHeight = pitchH / rows.length;
  let slotIdx = 0;
  rows.forEach((row, i) => {
    const n = row[0];
    for (let j = 0; j < n; j++) {
      const slot = document.createElement('div');
      slot.className = 'player-slot';
      slot.style.top = `${i * rowHeight + rowHeight/2 - 28}px`;
      slot.style.left = `${(pitchW/(n+1)) * (j+1) - 28}px`;
      slot.dataset.idx = slotIdx;
      slot.onclick = () => {
        if (selectedLogo) {
          if (selectedLogo.type === 'logo') {
            slot.innerHTML = `<img src="${selectedLogo.src}" alt="${selectedLogo.name}" title="${selectedLogo.name}" />`;
          } else if (selectedLogo.type === 'flag') {
            slot.innerHTML = `<span class="fi fi-${selectedLogo.code}" style="font-size:40px;" title="${selectedLogo.name}"></span>`;
          }
        }
      };
      pitch.appendChild(slot);
      slotIdx++;
    }
  });
}

formationSelect.onchange = (e) => {
  renderPitch(e.target.value);
};

window.onload = () => {
  renderLogos();
  renderPitch(formationSelect.value);
};
