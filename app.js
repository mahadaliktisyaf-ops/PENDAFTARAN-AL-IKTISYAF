/**
 * Web PPDB Ma'had Al-Iktisyaf Cirebon
 * Script Interaktivitas & Formulir Pendaftaran Online
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Init Theme (Dark / Light)
  initTheme();

  // Mobile navigation drawer
  initMobileMenu();

  // Setup input listeners to remove error state on input
  initFormValidationListeners();

  // Initialize On-Scroll Animations
  initScrollAnimations();
});

/* ==================== THEME TOGGLE (DARK / LIGHT) ==================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
    });
  }
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

/* ==================== MOBILE NAVIGATION ==================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
      });
    });
  }
}

/* ==================== SALIN NO REKENING ==================== */
function copyRekening() {
  const noRek = "415201013217536";
  const copyText = document.getElementById('copyText');
  
  navigator.clipboard.writeText(noRek).then(() => {
    if (copyText) {
      copyText.textContent = "Tersalin!";
      setTimeout(() => {
        copyText.textContent = "Salin";
      }, 2000);
    }
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = noRek;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    if (copyText) {
      copyText.textContent = "Tersalin!";
      setTimeout(() => {
        copyText.textContent = "Salin";
      }, 2000);
    }
  });
}

/* ==================== MULTI-STEP FORM GOOGLE-STYLE ==================== */
let currentActiveStep = 1;

function updateStepUI(step) {
  currentActiveStep = step;

  const sec1 = document.getElementById('stepSection1');
  const sec2 = document.getElementById('stepSection2');
  const sec3 = document.getElementById('stepSection3');

  const titleDisplay = document.getElementById('stepTitleDisplay');
  const percentDisplay = document.getElementById('stepPercentDisplay');
  const progressBar = document.getElementById('stepProgressBar');

  const label1 = document.getElementById('step1Label');
  const label2 = document.getElementById('step2Label');
  const label3 = document.getElementById('step3Label');

  if (!sec1 || !sec2 || !sec3) return;

  sec1.classList.add('hidden');
  sec2.classList.add('hidden');
  sec3.classList.add('hidden');

  if (step === 1) {
    sec1.classList.remove('hidden');
    if (titleDisplay) titleDisplay.textContent = "Bagian 1 dari 3: Data Diri Calon Santri";
    if (percentDisplay) percentDisplay.textContent = "33%";
    if (progressBar) progressBar.style.width = "33.33%";
    if (label1) label1.className = "font-bold text-brand-600 dark:text-brand-400";
    if (label2) label2.className = "text-slate-500 dark:text-slate-400";
    if (label3) label3.className = "text-slate-500 dark:text-slate-400";
  } else if (step === 2) {
    sec2.classList.remove('hidden');
    if (titleDisplay) titleDisplay.textContent = "Bagian 2 dari 3: Data Orang Tua / Wali";
    if (percentDisplay) percentDisplay.textContent = "66%";
    if (progressBar) progressBar.style.width = "66.66%";
    if (label1) label1.className = "text-slate-500 dark:text-slate-400";
    if (label2) label2.className = "font-bold text-brand-600 dark:text-brand-400";
    if (label3) label3.className = "text-slate-500 dark:text-slate-400";
  } else if (step === 3) {
    sec3.classList.remove('hidden');
    if (titleDisplay) titleDisplay.textContent = "Bagian 3 dari 3: Data Akademik Calon Santri";
    if (percentDisplay) percentDisplay.textContent = "100%";
    if (progressBar) progressBar.style.width = "100%";
    if (label1) label1.className = "text-slate-500 dark:text-slate-400";
    if (label2) label2.className = "text-slate-500 dark:text-slate-400";
    if (label3) label3.className = "font-bold text-brand-600 dark:text-brand-400";
  }

  // Smooth scroll to top of form
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function showFieldError(card, isError) {
  if (!card) return;
  const errorMsg = card.querySelector('.error-msg');
  if (isError) {
    card.classList.add('has-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
  } else {
    card.classList.remove('has-error');
    if (errorMsg) errorMsg.classList.add('hidden');
  }
}

function initFormValidationListeners() {
  const form = document.getElementById('googleStyleForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const card = input.closest('.form-card');
      if (card && card.classList.contains('has-error')) {
        showFieldError(card, false);
      }
    });
    input.addEventListener('change', () => {
      const card = input.closest('.form-card');
      if (card && card.classList.contains('has-error')) {
        showFieldError(card, false);
      }
    });
  });
}

function nextStep(currentStep) {
  let hasError = false;
  let firstErrorElem = null;

  if (currentStep === 1) {
    // Validate Step 1 fields
    const requiredStep1 = [
      { id: 'namaLengkap', type: 'text' },
      { name: 'jenisKelamin', type: 'radio' },
      { id: 'tempatLahir', type: 'text' },
      { id: 'tanggalLahir', type: 'text' },
      { id: 'nik', type: 'regex', regex: /^[0-9]{16}$/ },
      { id: 'nisn', type: 'regex', regex: /^[0-9]{10}$/ },
      { id: 'alamat', type: 'text' },
      { id: 'kelurahan', type: 'text' },
      { id: 'kecamatan', type: 'text' },
      { id: 'kotaKabupaten', type: 'text' },
      { id: 'provinsi', type: 'text' }
    ];

    for (const item of requiredStep1) {
      if (item.type === 'radio') {
        const checked = document.querySelector(`input[name="${item.name}"]:checked`);
        const card = document.querySelector(`[data-field="${item.name}"]`);
        if (!checked) {
          showFieldError(card, true);
          hasError = true;
          if (!firstErrorElem) firstErrorElem = card;
        } else {
          showFieldError(card, false);
        }
      } else if (item.type === 'regex') {
        const input = document.getElementById(item.id);
        const card = document.querySelector(`[data-field="${item.id}"]`);
        if (!input || !item.regex.test(input.value.trim())) {
          showFieldError(card, true);
          hasError = true;
          if (!firstErrorElem) firstErrorElem = card;
        } else {
          showFieldError(card, false);
        }
      } else {
        const input = document.getElementById(item.id);
        const card = document.querySelector(`[data-field="${item.id}"]`);
        if (!input || !input.value.trim()) {
          showFieldError(card, true);
          hasError = true;
          if (!firstErrorElem) firstErrorElem = card;
        } else {
          showFieldError(card, false);
        }
      }
    }

    if (hasError) {
      if (firstErrorElem) {
        firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    updateStepUI(2);

  } else if (currentStep === 2) {
    // Validate Step 2 fields
    const requiredStep2 = [
      'namaAyah',
      'pekerjaanAyah',
      'noTelpAyah',
      'namaIbu',
      'pekerjaanIbu',
      'noTelpIbu'
    ];

    for (const fieldId of requiredStep2) {
      const input = document.getElementById(fieldId);
      const card = document.querySelector(`[data-field="${fieldId}"]`);
      if (!input || !input.value.trim()) {
        showFieldError(card, true);
        hasError = true;
        if (!firstErrorElem) firstErrorElem = card;
      } else {
        showFieldError(card, false);
      }
    }

    if (hasError) {
      if (firstErrorElem) {
        firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    updateStepUI(3);
  }
}

function prevStep(currentStep) {
  if (currentStep > 1) {
    updateStepUI(currentStep - 1);
  }
}

function resetFormConfirmation() {
  if (confirm("Kosongkan semua isian formulir pendaftaran?")) {
    const form = document.getElementById('googleStyleForm');
    if (form) form.reset();
    document.querySelectorAll('.form-card').forEach(card => showFieldError(card, false));
    updateStepUI(1);
  }
}

/* ==================== SUBMIT FORMULIR PPDB ==================== */
function handleFormSubmission(event) {
  event.preventDefault();

  let hasError = false;
  let firstErrorElem = null;

  // Validate Step 3 fields
  const requiredStep3 = [
    'jenjangPilihan',
    'asalSekolah',
    'noIjazah',
    'tahunLulus'
  ];

  for (const fieldId of requiredStep3) {
    const input = document.getElementById(fieldId);
    const card = document.querySelector(`[data-field="${fieldId}"]`);
    if (!input || !input.value.trim()) {
      showFieldError(card, true);
      hasError = true;
      if (!firstErrorElem) firstErrorElem = card;
    } else {
      showFieldError(card, false);
    }
  }

  if (hasError) {
    if (firstErrorElem) {
      firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Gather all form fields
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const getRadio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };

  const studentName = getVal('namaLengkap');
  const studentNickname = getVal('namaPanggilan');
  const studentGender = getRadio('jenisKelamin');
  const birthPlace = getVal('tempatLahir');
  const birthDate = getVal('tanggalLahir');
  const nik = getVal('nik');
  const nisn = getVal('nisn');
  const address = getVal('alamat');
  const kelurahan = getVal('kelurahan');
  const kecamatan = getVal('kecamatan');
  const kota = getVal('kotaKabupaten');
  const provinsi = getVal('provinsi');

  const ayah = getVal('namaAyah');
  const pekerjaanAyah = getVal('pekerjaanAyah');
  const hpAyah = getVal('noTelpAyah');
  const ibu = getVal('namaIbu');
  const pekerjaanIbu = getVal('pekerjaanIbu');
  const hpIbu = getVal('noTelpIbu');
  const wali = getVal('namaWali');
  const pekerjaanWali = getVal('pekerjaanWali');
  const hpWali = getVal('noTelpWali');

  const jenjang = getVal('jenjangPilihan');
  const asalSekolah = getVal('asalSekolah');
  const noIjazah = getVal('noIjazah');
  const tahunLulus = getVal('tahunLulus');

  // Generate unique registration code
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const regCode = `REG-2027-${randomSuffix}`;

  const registrationData = {
    regCode,
    studentName,
    studentNickname,
    studentGender,
    birthPlace,
    birthDate,
    nik,
    nisn,
    address,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    ayah,
    pekerjaanAyah,
    hpAyah,
    ibu,
    pekerjaanIbu,
    hpIbu,
    wali,
    pekerjaanWali,
    hpWali,
    jenjang,
    asalSekolah,
    noIjazah,
    tahunLulus,
    createdAt: new Date().toISOString()
  };

  // Save to Supabase Cloud Database if configured
  if (typeof dbInsertRegistration === 'function') {
    dbInsertRegistration(registrationData).then(res => {
      if (res && res.success) {
        console.log("Data pendaftaran berhasil tersimpan di Supabase Cloud!");
      } else {
        console.warn("Gagal simpan ke Supabase, tersimpan lokal:", res?.error);
      }
    }).catch(err => console.error("Supabase insert error:", err));
  }

  // Backup to localStorage
  const existingList = JSON.parse(localStorage.getItem('ppdb_registrations') || '[]');
  existingList.unshift(registrationData);
  localStorage.setItem('ppdb_registrations', JSON.stringify(existingList));

  // Populate Modal UI
  document.getElementById('modalRegCode').textContent = regCode;
  document.getElementById('modalStudentName').textContent = `${studentName} (${studentGender})`;
  document.getElementById('modalJenjang').textContent = jenjang;
  document.getElementById('modalAsalSekolah').textContent = asalSekolah;
  document.getElementById('modalNisnNik').textContent = `${nisn} / ${nik}`;
  document.getElementById('modalOrtu').textContent = `${ayah} (${hpAyah || hpIbu})`;

  // WhatsApp Pre-filled message
  const waMessage = encodeURIComponent(
    `Assalamualaikum Admin PPDB Ma'had Al-Iktisyaf,\n\n` +
    `Saya telah mengisi Formulir Pendaftaran Santri Baru secara online:\n\n` +
    `• *Nomor Registrasi:* ${regCode}\n` +
    `• *Jenjang Pilihan:* ${jenjang}\n` +
    `• *Nama Santri:* ${studentName}\n` +
    `• *Jenis Kelamin:* ${studentGender}\n` +
    `• *Tempat, Tgl Lahir:* ${birthPlace}, ${birthDate}\n` +
    `• *NISN:* ${nisn}\n` +
    `• *NIK:* ${nik}\n` +
    `• *Asal Sekolah:* ${asalSekolah}\n` +
    `• *Nama Orang Tua:* Ayah (${ayah}) / Ibu (${ibu})\n` +
    `• *No. WhatsApp/HP:* ${hpAyah || hpIbu}\n` +
    `• *Alamat:* ${address}, ${kelurahan}, ${kecamatan}, ${kota}, ${provinsi}\n\n` +
    `Mohon konfirmasi dan informasi tahapan seleksi serta tes masuk. Terima kasih.`
  );

  const waConfirmLink = document.getElementById('waConfirmLink');
  if (waConfirmLink) {
    waConfirmLink.href = `https://wa.me/628979832312?text=${waMessage}`;
  }

  // Show Modal
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Reset form
  const form = document.getElementById('googleStyleForm');
  if (form) form.reset();
  updateStepUI(1);
}

function copyRegCode() {
  const regCode = document.getElementById('modalRegCode').textContent;
  const copyBtnText = document.getElementById('copyBtnText');
  navigator.clipboard.writeText(regCode).then(() => {
    if (copyBtnText) {
      copyBtnText.textContent = "Tersalin!";
      setTimeout(() => {
        copyBtnText.textContent = "Salin Nomor ID";
      }, 2000);
    }
  }).catch(() => {
    alert(`Nomor Registrasi: ${regCode}`);
  });
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/* ==================== HOMEPAGE INTERACTIVE TABS & ACCORDION ==================== */
function switchTab(tabId) {
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(p => p.classList.add('hidden'));

  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.remove('hidden');
  }

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.className = "tab-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
  });

  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) {
    activeBtn.className = "tab-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition shadow-sm bg-brand-600 text-white";
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function toggleFaq(faqId) {
  const faqContent = document.getElementById(faqId);
  const iconId = faqId.replace('faq-', 'faq-icon-');
  const icon = document.getElementById(iconId);

  if (faqContent) {
    const isHidden = faqContent.classList.contains('hidden');
    faqContent.classList.toggle('hidden');
    if (icon) {
      icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }
}

/* ==================== DASHBOARD ADMIN CONTROLLER ==================== */
let selectedStudentIndex = null;

const sampleDemoApplicants = [
  {
    regCode: "REG-2027-8492",
    studentName: "Muhammad Ihsan Fathurrahman",
    studentNickname: "Ihsan",
    studentGender: "Laki-Laki",
    birthPlace: "Cirebon",
    birthDate: "2014-05-14",
    nik: "3209121405140002",
    nisn: "0134892150",
    address: "Blok Manis RT 02 / RW 01",
    kelurahan: "Ender",
    kecamatan: "Pangenan",
    kota: "Cirebon",
    provinsi: "Jawa Barat",
    ayah: "H. Abdullah Syakur",
    pekerjaanAyah: "Wiraswasta",
    hpAyah: "081222334455",
    ibu: "Hj. Maryam",
    pekerjaanIbu: "Guru",
    hpIbu: "081333445566",
    wali: "-",
    pekerjaanWali: "-",
    hpWali: "-",
    jenjang: "SMP",
    asalSekolah: "SDN 1 Ender",
    noIjazah: "DN-02/D-SD/13/00821",
    tahunLulus: "2027",
    status: "Terverifikasi",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    regCode: "REG-2027-5120",
    studentName: "Fatimah Az-Zahra",
    studentNickname: "Zahra",
    studentGender: "Perempuan",
    birthPlace: "Indramayu",
    birthDate: "2014-08-20",
    nik: "3212056008140001",
    nisn: "0137749102",
    address: "Jl. Raya Gedongan No. 45",
    kelurahan: "Gedongan",
    kecamatan: "Pangenan",
    kota: "Cirebon",
    provinsi: "Jawa Barat",
    ayah: "Ahmad Rifai",
    pekerjaanAyah: "PNS",
    hpAyah: "085211998877",
    ibu: "Siti Nurjanah",
    pekerjaanIbu: "Ibu Rumah Tangga",
    hpIbu: "085299887766",
    wali: "-",
    pekerjaanWali: "-",
    hpWali: "-",
    jenjang: "SMP",
    asalSekolah: "MI Al-Hidayah Gedongan",
    noIjazah: "MI-32/09/2027/041",
    tahunLulus: "2027",
    status: "Menunggu",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    regCode: "REG-2027-9214",
    studentName: "Ahmad Zaky Mubarok",
    studentNickname: "Zaky",
    studentGender: "Laki-Laki",
    birthPlace: "Kuningan",
    birthDate: "2011-11-03",
    nik: "3208110311110003",
    nisn: "0109823411",
    address: "Dusun Kliwon RT 04 / RW 02",
    kelurahan: "Ciawigebang",
    kecamatan: "Ciawigebang",
    kota: "Kuningan",
    provinsi: "Jawa Barat",
    ayah: "Drs. H. Mamat Rohimat",
    pekerjaanAyah: "Pensiunan",
    hpAyah: "087822991144",
    ibu: "Hj. Eli Roslina",
    pekerjaanIbu: "Wiraswasta",
    hpIbu: "087822991155",
    wali: "-",
    pekerjaanWali: "-",
    hpWali: "-",
    jenjang: "MA/SMK",
    asalSekolah: "SMP Gedongan",
    noIjazah: "DN-02/D-SMP/13/09912",
    tahunLulus: "2027",
    status: "Lolos",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

async function initAdminDashboard() {
  const dbStatusEl = document.getElementById('dbSyncStatusText');
  if (dbStatusEl) {
    dbStatusEl.innerHTML = `<span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-cyan-500 animate-ping"></span>Menyinkronkan data dengan Supabase Cloud...</span>`;
  }

  // Fetch from Supabase Cloud
  if (typeof dbGetRegistrations === 'function') {
    try {
      const cloudData = await dbGetRegistrations();
      if (cloudData !== null) {
        if (cloudData.length > 0) {
          saveRegistrations(cloudData);
        } else {
          // Table exists but no records yet, keep local backup if available
          let stored = localStorage.getItem('ppdb_registrations');
          if (!stored || JSON.parse(stored).length === 0) {
            saveRegistrations(sampleDemoApplicants);
          }
        }
        if (dbStatusEl) {
          dbStatusEl.innerHTML = `<span class="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">● Terhubung ke Supabase Cloud (Live: ${cloudData.length} data pendaftar tersinkronisasi)</span>`;
        }
        renderTable();
        return;
      }
    } catch (e) {
      console.warn("Could not sync with Supabase:", e);
    }
  }

  // Fallback to local
  let stored = localStorage.getItem('ppdb_registrations');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('ppdb_registrations', JSON.stringify(sampleDemoApplicants));
  }
  if (dbStatusEl) {
    dbStatusEl.innerHTML = `<span class="text-slate-600 dark:text-slate-300 font-semibold">● Mode Penyimpanan Browser (Lokal)</span>`;
  }
  renderTable();
}

function resetDataDemo() {
  initAdminDashboard();
}

function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem('ppdb_registrations') || '[]');
  } catch (e) {
    return [];
  }
}

function saveRegistrations(data) {
  localStorage.setItem('ppdb_registrations', JSON.stringify(data));
}

function renderTable() {
  const list = getRegistrations();
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const jenjangFilter = document.getElementById('filterJenjang')?.value || 'ALL';
  const statusFilter = document.getElementById('filterStatus')?.value || 'ALL';

  // Stats calculation
  let totalCount = list.length;
  let pendingCount = 0;
  let acceptedCount = 0;
  let smpCount = 0;
  let maCount = 0;

  list.forEach(item => {
    const status = item.status || 'Menunggu';
    if (status === 'Menunggu') pendingCount++;
    if (status === 'Lolos') acceptedCount++;
    if (item.jenjang === 'SMP') smpCount++;
    if (item.jenjang === 'MA/SMK') maCount++;
  });

  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statAccepted = document.getElementById('statAccepted');
  const statSmp = document.getElementById('statSmp');
  const statMa = document.getElementById('statMa');

  if (statTotal) statTotal.textContent = totalCount;
  if (statPending) statPending.textContent = pendingCount;
  if (statAccepted) statAccepted.textContent = acceptedCount;
  if (statSmp) statSmp.textContent = `${smpCount} SMP`;
  if (statMa) statMa.textContent = `${maCount} MA`;

  // Filtering
  const filtered = list.filter((item, idx) => {
    item._originalIndex = idx;
    const nameMatch = (item.studentName || '').toLowerCase().includes(search);
    const nisnMatch = (item.nisn || '').toLowerCase().includes(search);
    const ortuMatch = (item.ayah || '').toLowerCase().includes(search) || (item.ibu || '').toLowerCase().includes(search);
    const matchesSearch = nameMatch || nisnMatch || ortuMatch;

    const matchesJenjang = (jenjangFilter === 'ALL') || (item.jenjang === jenjangFilter);
    const itemStatus = item.status || 'Menunggu';
    const matchesStatus = (statusFilter === 'ALL') || (itemStatus === statusFilter);

    return matchesSearch && matchesJenjang && matchesStatus;
  });

  const tbody = document.getElementById('registrationsTableBody');
  const emptyState = document.getElementById('emptyState');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  filtered.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition";

    const dateFormatted = item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
    const status = item.status || 'Menunggu';

    let statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Menunggu</span>`;
    if (status === 'Terverifikasi') {
      statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"><span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>Terverifikasi</span>`;
    } else if (status === 'Lolos') {
      statusBadge = `<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Lolos Seleksi</span>`;
    }

    const waPhone = item.hpAyah || item.hpIbu || item.hpWali || '';
    const cleanWa = waPhone.replace(/[^0-9]/g, '');
    const waUrl = cleanWa.startsWith('0') ? `https://wa.me/62${cleanWa.substring(1)}` : `https://wa.me/${cleanWa}`;

    tr.innerHTML = `
      <td class="px-5 py-4 text-slate-400 font-mono">${index + 1}</td>
      <td class="px-5 py-4">
        <span class="block font-mono font-bold text-slate-800 dark:text-slate-200">${item.regCode || '-'}</span>
        <span class="block text-[11px] text-slate-400">${dateFormatted}</span>
      </td>
      <td class="px-5 py-4">
        <span class="block font-bold text-slate-900 dark:text-white">${item.studentName || '-'}</span>
        <span class="block text-[11px] text-slate-400">NISN: ${item.nisn || '-'} • ${item.studentGender || '-'}</span>
      </td>
      <td class="px-5 py-4">
        <span class="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">${item.jenjang || '-'}</span>
      </td>
      <td class="px-5 py-4 text-slate-600 dark:text-slate-300">${item.asalSekolah || '-'}</td>
      <td class="px-5 py-4">
        <span class="block font-medium text-slate-800 dark:text-slate-200">${item.ayah || item.ibu || '-'}</span>
        <span class="block text-[11px] text-slate-400">${waPhone || '-'}</span>
      </td>
      <td class="px-5 py-4">${statusBadge}</td>
      <td class="px-5 py-4 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="viewDetail(${item._originalIndex})" class="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" title="Lihat Berkas">
            <i data-lucide="eye" class="h-4 w-4"></i>
          </button>
          ${waPhone ? `<a href="${waUrl}" target="_blank" class="rounded-lg bg-emerald-500 p-1.5 text-white shadow-sm transition hover:bg-emerald-600" title="Chat WhatsApp"><i data-lucide="message-circle" class="h-4 w-4"></i></a>` : ''}
          <button onclick="deleteStudent(${item._originalIndex})" class="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800" title="Hapus Data">
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function viewDetail(originalIndex) {
  const list = getRegistrations();
  const item = list[originalIndex];
  if (!item) return;

  selectedStudentIndex = originalIndex;

  document.getElementById('detName').textContent = item.studentName || '-';
  document.getElementById('detRegCode').textContent = item.regCode || '-';
  document.getElementById('detNickname').textContent = item.studentNickname || '-';
  document.getElementById('detGender').textContent = item.studentGender || '-';
  document.getElementById('detTtl').textContent = `${item.birthPlace || '-'}, ${item.birthDate || '-'}`;
  document.getElementById('detNisnNik').textContent = `${item.nisn || '-'} / ${item.nik || '-'}`;
  document.getElementById('detAddress').textContent = `${item.address || '-'}, Kel. ${item.kelurahan || '-'}, Kec. ${item.kecamatan || '-'}, ${item.kota || '-'}, ${item.provinsi || '-'}`;

  document.getElementById('detAyah').textContent = item.ayah || '-';
  document.getElementById('detAyahJob').textContent = `${item.pekerjaanAyah || '-'} (${item.hpAyah || '-'})`;
  document.getElementById('detIbu').textContent = item.ibu || '-';
  document.getElementById('detIbuJob').textContent = `${item.pekerjaanIbu || '-'} (${item.hpIbu || '-'})`;
  document.getElementById('detWali').textContent = item.wali && item.wali !== '-' ? `${item.wali} (${item.pekerjaanWali || '-'} - ${item.hpWali || '-'})` : 'Tidak Ada (Tinggal dengan Orang Tua Kandung)';

  document.getElementById('detJenjang').textContent = item.jenjang || '-';
  document.getElementById('detAsalSekolah').textContent = item.asalSekolah || '-';
  document.getElementById('detNoIjazah').textContent = item.noIjazah || '-';
  document.getElementById('detTahunLulus').textContent = item.tahunLulus || '-';

  const statusSelect = document.getElementById('changeStatusSelect');
  if (statusSelect) {
    statusSelect.value = item.status || 'Menunggu';
  }

  const waPhone = item.hpAyah || item.hpIbu || item.hpWali || '';
  const cleanWa = waPhone.replace(/[^0-9]/g, '');
  const waUrl = cleanWa.startsWith('0') ? `https://wa.me/62${cleanWa.substring(1)}?text=Halo%20Bapak/Ibu%20Wali%20dari%20${encodeURIComponent(item.studentName)},%20kami%20dari%20Panitia%20PPDB%20Ma'had%20Al-Iktisyaf` : '#';
  const detWaLink = document.getElementById('detWaLink');
  if (detWaLink) {
    detWaLink.href = waUrl;
  }

  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function updateCurrentStatus() {
  if (selectedStudentIndex === null) return;
  const list = getRegistrations();
  const newStatus = document.getElementById('changeStatusSelect').value;
  if (list[selectedStudentIndex]) {
    const item = list[selectedStudentIndex];
    item.status = newStatus;
    saveRegistrations(list);
    renderTable();

    // Sync to Supabase Cloud
    if (typeof dbUpdateStatus === 'function' && item.regCode) {
      dbUpdateStatus(item.regCode, newStatus);
    }
  }
}

function deleteStudent(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data calon santri ini?")) {
    const list = getRegistrations();
    const item = list[index];
    list.splice(index, 1);
    saveRegistrations(list);
    renderTable();

    // Delete from Supabase Cloud
    if (typeof dbDeleteRegistration === 'function' && item && item.regCode) {
      dbDeleteRegistration(item.regCode);
    }
  }
}

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  selectedStudentIndex = null;
}

function exportToCSV() {
  const list = getRegistrations();
  if (list.length === 0) {
    alert("Tidak ada data untuk diexport!");
    return;
  }

  const headers = ["No Registrasi", "Tanggal", "Nama Santri", "Gender", "Tempat Lahir", "Tgl Lahir", "NISN", "NIK", "Jenjang", "Asal Sekolah", "Nama Ayah", "HP Ayah", "Nama Ibu", "HP Ibu", "Alamat", "Status"];
  const rows = list.map(item => [
    `"${item.regCode || ''}"`,
    `"${item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : ''}"`,
    `"${item.studentName || ''}"`,
    `"${item.studentGender || ''}"`,
    `"${item.birthPlace || ''}"`,
    `"${item.birthDate || ''}"`,
    `"${item.nisn || ''}"`,
    `"${item.nik || ''}"`,
    `"${item.jenjang || ''}"`,
    `"${item.asalSekolah || ''}"`,
    `"${item.ayah || ''}"`,
    `"${item.hpAyah || ''}"`,
    `"${item.ibu || ''}"`,
    `"${item.hpIbu || ''}"`,
    `"${item.address || ''}"`,
    `"${item.status || 'Menunggu'}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `data-pendaftar-ppdb-al-iktisyaf-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==================== ADMIN AUTHENTICATION / PINTU MASUK ==================== */
function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('ppdb_admin_authenticated') === 'true' || 
                 localStorage.getItem('ppdb_admin_authenticated') === 'true';

  const loginGate = document.getElementById('loginGateSection');
  const dashboardMain = document.getElementById('dashboardMainSection');

  if (isAuth) {
    if (loginGate) loginGate.classList.add('hidden');
    if (dashboardMain) {
      dashboardMain.classList.remove('hidden');
      dashboardMain.classList.add('flex');
    }
    initAdminDashboard();
  } else {
    if (dashboardMain) {
      dashboardMain.classList.add('hidden');
      dashboardMain.classList.remove('flex');
    }
    if (loginGate) loginGate.classList.remove('hidden');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getAdminCredentials() {
  const custom = localStorage.getItem('ppdb_admin_custom_credentials');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch(e) {}
  }
  // Default credentials jika belum pernah diubah
  return {
    username: "admin",
    password: "admin2027"
  };
}

function handleAdminLogin(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('adminUsername')?.value.trim();
  const passwordInput = document.getElementById('adminPassword')?.value.trim();
  const rememberMe = document.getElementById('rememberMe')?.checked;

  const errorAlert = document.getElementById('loginErrorAlert');
  const loginCard = document.getElementById('loginCard');

  const creds = getAdminCredentials();

  // Cek apakah cocok dengan kredensial aktif
  const isValidUsername = usernameInput.toLowerCase() === creds.username.toLowerCase();
  const isValidPassword = passwordInput === creds.password;

  if (isValidUsername && isValidPassword) {
    if (errorAlert) errorAlert.classList.add('hidden');
    
    if (rememberMe) {
      localStorage.setItem('ppdb_admin_authenticated', 'true');
    } else {
      sessionStorage.setItem('ppdb_admin_authenticated', 'true');
    }

    checkAdminAuth();
  } else {
    if (errorAlert) {
      errorAlert.classList.remove('hidden');
      errorAlert.classList.add('flex');
    }
    if (loginCard) {
      loginCard.classList.remove('shake');
      void loginCard.offsetWidth; // trigger reflow
      loginCard.classList.add('shake');
    }
  }
}

function openChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  const creds = getAdminCredentials();
  const userField = document.getElementById('newAdminUsername');
  const passField = document.getElementById('newAdminPassword');
  const confField = document.getElementById('confirmAdminPassword');
  const msg = document.getElementById('changePasswordMsg');

  if (userField) userField.value = creds.username;
  if (passField) passField.value = '';
  if (confField) confField.value = '';
  if (msg) msg.classList.add('hidden');

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeChangePasswordModal() {
  const modal = document.getElementById('changePasswordModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleSaveNewCredentials(event) {
  event.preventDefault();
  const newUser = document.getElementById('newAdminUsername')?.value.trim();
  const newPass = document.getElementById('newAdminPassword')?.value;
  const confPass = document.getElementById('confirmAdminPassword')?.value;
  const msg = document.getElementById('changePasswordMsg');

  if (!newUser || !newPass) {
    if (msg) {
      msg.className = "text-xs font-semibold text-rose-500";
      msg.textContent = "Username dan password tidak boleh kosong!";
      msg.classList.remove('hidden');
    }
    return;
  }

  if (newPass !== confPass) {
    if (msg) {
      msg.className = "text-xs font-semibold text-rose-500";
      msg.textContent = "Konfirmasi password tidak cocok!";
      msg.classList.remove('hidden');
    }
    return;
  }

  // Simpan kredensial baru
  localStorage.setItem('ppdb_admin_custom_credentials', JSON.stringify({
    username: newUser,
    password: newPass
  }));

  if (msg) {
    msg.className = "text-xs font-semibold text-emerald-600";
    msg.textContent = "Berhasil! Akun dan password baru telah tersimpan.";
    msg.classList.remove('hidden');
  }

  setTimeout(() => {
    closeChangePasswordModal();
    alert(`Akun berhasil diperbarui!\n\nUsername Baru: ${newUser}\nPassword baru sudah aktif digunakan.`);
  }, 800);
}

function handleAdminLogout() {
  if (confirm("Apakah Anda yakin ingin keluar dari Dashboard Admin?")) {
    sessionStorage.removeItem('ppdb_admin_authenticated');
    localStorage.removeItem('ppdb_admin_authenticated');
    checkAdminAuth();
  }
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('adminPassword');
  const eyeIcon = document.getElementById('eyeIcon');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye-off');
  } else {
    passInput.type = 'password';
    if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

/* ==================== ON-SCROLL ANIMATIONS (INTERSECTION OBSERVER) ==================== */
function initScrollAnimations() {
  // Inject CSS rules for smooth on-scroll reveal
  const styleId = 'scroll-animation-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .scroll-reveal {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
      }
      .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      .scroll-reveal-left {
        opacity: 0;
        transform: translateX(-35px);
        transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
      }
      .scroll-reveal-left.revealed {
        opacity: 1;
        transform: translateX(0);
      }
      .scroll-reveal-right {
        opacity: 0;
        transform: translateX(35px);
        transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
      }
      .scroll-reveal-right.revealed {
        opacity: 1;
        transform: translateX(0);
      }
      .scroll-reveal-scale {
        opacity: 0;
        transform: scale(0.93);
        transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
      }
      .scroll-reveal-scale.revealed {
        opacity: 1;
        transform: scale(1);
      }

      /* Stagger Delays for Grid Cards */
      .delay-100 { transition-delay: 100ms !important; }
      .delay-200 { transition-delay: 200ms !important; }
      .delay-300 { transition-delay: 300ms !important; }
      .delay-400 { transition-delay: 400ms !important; }
      .delay-500 { transition-delay: 500ms !important; }
      .delay-600 { transition-delay: 600ms !important; }

      /* Sticky Navbar scroll shadow */
      header.scrolled {
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
      }
      .dark header.scrolled {
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
      }
    `;
    document.head.appendChild(style);
  }

  // Setup Navbar scroll listener
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  // Auto-discover cards and sections in main
  const autoTargets = document.querySelectorAll('main section, main .rounded-3xl, main .rounded-2xl:not(#mobileMenuDrawer):not(header *):not(.doc-chk)');
  autoTargets.forEach((el) => {
    // Avoid double tagging and modal/inner cards
    if (!el.classList.contains('scroll-reveal') && 
        !el.classList.contains('scroll-reveal-left') && 
        !el.classList.contains('scroll-reveal-right') && 
        !el.classList.contains('scroll-reveal-scale') &&
        !el.closest('#detailModal') &&
        !el.closest('#successModal') &&
        !el.closest('.form-card')) {
      el.classList.add('scroll-reveal');
      
      // Auto stagger grid children
      if (el.parentElement && el.parentElement.classList.contains('grid')) {
        const siblings = Array.from(el.parentElement.children);
        const childIndex = siblings.indexOf(el);
        if (childIndex > 0 && childIndex <= 6) {
          el.classList.add(`delay-${childIndex * 100}`);
        }
      }
    }
  });

  // Intersection Observer
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe all animated elements
  const allElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
  allElements.forEach(el => observer.observe(el));
}



