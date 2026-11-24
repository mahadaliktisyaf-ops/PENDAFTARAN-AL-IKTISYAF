/**
 * Supabase Client Configuration & Helpers
 * Ma'had Al-Iktisyaf PPDB
 */

const SUPABASE_URL = "https://aahvbnpqriilqyapkkdl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_cC0iZznM7I01g-DFCtR2fQ_ueLn_sE6";

// Initialize client if library is loaded, or use REST fetch API
let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Supabase SDK init notice:", err);
  }
}

/**
 * Standard headers for direct REST fetch
 */
function getSupabaseHeaders() {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

/**
 * Insert new registration to Supabase
 */
async function dbInsertRegistration(data) {
  const payload = {
    reg_code: data.regCode,
    student_name: data.studentName,
    student_nickname: data.studentNickname || "",
    student_gender: data.studentGender,
    birth_place: data.birthPlace,
    birth_date: data.birthDate,
    nik: data.nik,
    nisn: data.nisn,
    address: data.address,
    kelurahan: data.kelurahan,
    kecamatan: data.kecamatan,
    kota: data.kota,
    provinsi: data.provinsi,
    ayah: data.ayah,
    pekerjaan_ayah: data.pekerjaanAyah,
    hp_ayah: data.hpAyah,
    ibu: data.ibu,
    pekerjaan_ibu: data.pekerjaanIbu,
    hp_ibu: data.hpIbu || "",
    wali: data.wali || "-",
    pekerjaan_wali: data.pekerjaanWali || "-",
    hp_wali: data.hpWali || "-",
    jenjang: data.jenjang,
    asal_sekolah: data.asalSekolah,
    no_ijazah: data.noIjazah,
    tahun_lulus: data.tahunLulus,
    status: data.status || "Menunggu"
  };

  // Try via SDK first
  if (supabaseClient) {
    try {
      const { data: result, error } = await supabaseClient
        .from('pendaftar_ppdb')
        .insert([payload])
        .select();
      if (!error) return { success: true, data: result };
      console.warn("SDK insert error, falling back to REST:", error);
    } catch (e) {
      console.warn("SDK insert exception:", e);
    }
  }

  // Fallback direct REST
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pendaftar_ppdb`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json().catch(() => []);
      return { success: true, data: json };
    } else {
      const errText = await res.text();
      console.error("Supabase REST Insert Failed:", res.status, errText);
      return { success: false, error: errText };
    }
  } catch (err) {
    console.error("Supabase Network error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all registrations from Supabase
 */
async function dbGetRegistrations() {
  // Try via SDK
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('pendaftar_ppdb')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return transformSupabaseRows(data);
      }
    } catch (e) {
      console.warn("SDK select error:", e);
    }
  }

  // Fallback direct REST
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pendaftar_ppdb?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: getSupabaseHeaders()
    });
    if (res.ok) {
      const rows = await res.json();
      return transformSupabaseRows(rows);
    }
  } catch (err) {
    console.error("Failed to fetch from Supabase:", err);
  }
  return null; // Signals failure, use local backup
}

/**
 * Update registration status in Supabase
 */
async function dbUpdateStatus(regCode, newStatus) {
  if (supabaseClient) {
    try {
      await supabaseClient
        .from('pendaftar_ppdb')
        .update({ status: newStatus })
        .eq('reg_code', regCode);
      return true;
    } catch (e) {}
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pendaftar_ppdb?reg_code=eq.${encodeURIComponent(regCode)}`, {
      method: 'PATCH',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * Delete registration from Supabase
 */
async function dbDeleteRegistration(regCode) {
  if (supabaseClient) {
    try {
      await supabaseClient
        .from('pendaftar_ppdb')
        .delete()
        .eq('reg_code', regCode);
      return true;
    } catch (e) {}
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pendaftar_ppdb?reg_code=eq.${encodeURIComponent(regCode)}`, {
      method: 'DELETE',
      headers: getSupabaseHeaders()
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * Helper to map snake_case columns back to camelCase used by dashboard UI
 */
function transformSupabaseRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(r => ({
    id: r.id,
    regCode: r.reg_code,
    studentName: r.student_name,
    studentNickname: r.student_nickname,
    studentGender: r.student_gender,
    birthPlace: r.birth_place,
    birthDate: r.birth_date,
    nik: r.nik,
    nisn: r.nisn,
    address: r.address,
    kelurahan: r.kelurahan,
    kecamatan: r.kecamatan,
    kota: r.kota,
    provinsi: r.provinsi,
    ayah: r.ayah,
    pekerjaanAyah: r.pekerjaan_ayah,
    hpAyah: r.hp_ayah,
    ibu: r.ibu,
    pekerjaanIbu: r.pekerjaan_ibu,
    hpIbu: r.hp_ibu,
    wali: r.wali,
    pekerjaanWali: r.pekerjaan_wali,
    hpWali: r.hp_wali,
    jenjang: r.jenjang,
    asalSekolah: r.asal_sekolah,
    noIjazah: r.no_ijazah,
    tahunLulus: r.tahun_lulus,
    status: r.status || "Menunggu",
    createdAt: r.created_at
  }));
}
