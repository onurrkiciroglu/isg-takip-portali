let riskChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadPersonel();
    loadDenetimler();
    loadAksiyonlar();
    loadRamakKala();
});

// SAYFA GEÇİŞ MANTIĞI (Single Page Application)
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// --- PERSONEL İŞLEMLERİ ---
document.getElementById('formPersonel').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        ad_soyad: document.getElementById('pAd').value,
        tc_no: document.getElementById('pTc').value,
        departman: document.getElementById('pDepartman').value,
        gorev: document.getElementById('pGorev').value,
        myk_belgesi: document.getElementById('pMyk').value,
        sertifikalar: document.getElementById('pSertifika').value,
        saglik_raporu_tarihi: document.getElementById('pTarih').value
    };
    await fetch('/api/personel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    e.target.reset();
    loadPersonel();
});

async function loadPersonel() {
    const res = await fetch('/api/personel');
    const data = await res.json();
    document.getElementById('kpiPersonel').innerText = data.length;
    const tbody = document.getElementById('tablePersonel');
    tbody.innerHTML = '';
    data.forEach(p => {
        tbody.innerHTML += `<tr>
            <td><strong>${p.ad_soyad}</strong><br><small class="text-muted">TC: ${p.tc_no || '-'}</small></td>
            <td>${p.departman || '-'}<br><small class="text-muted">${p.gorev}</small></td>
            <td><span class="badge bg-secondary">${p.myk_belgesi || '-'}</span></td>
            <td>${p.sertifikalar || '-'}</td>
            <td>${p.saglik_raporu_tarihi}</td>
            <td class="text-end">
                <button onclick="deleteRecord('personel', ${p.id})" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Sil</button>
            </td>
        </tr>`;
    });
}

// --- DENETİM İŞLEMLERİ ---
document.getElementById('formDenetim').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        lokasyon: document.getElementById('dLokasyon').value,
        denetci: document.getElementById('dDenetci').value,
        ekipman_alan: document.getElementById('dAlan').value,
        kategori: document.getElementById('dKategori').value,
        uygunsuzluk_tanimi: document.getElementById('dTanim').value,
        tespit_tarihi: new Date().toLocaleDateString('tr-TR')
    };
    await fetch('/api/denetimler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    e.target.reset();
    loadDenetimler();
});

async function loadDenetimler() {
    const res = await fetch('/api/denetimler');
    const data = await res.json();
    document.getElementById('kpiDenetim').innerText = data.length;
    const tbody = document.getElementById('tableDenetim');
    const selectBox = document.getElementById('aDenetimId');
    
    tbody.innerHTML = '';
    selectBox.innerHTML = '<option value="">Seçiniz...</option>';

    data.forEach(d => {
        selectBox.innerHTML += `<option value="${d.id}">#${d.id} - ${d.lokasyon} (${d.kategori})</option>`;
        tbody.innerHTML += `<tr>
            <td><strong>${d.lokasyon}</strong></td>
            <td>${d.denetci}</td>
            <td>${d.ekipman_alan}</td>
            <td><span class="badge bg-info text-dark">${d.kategori}</span></td>
            <td>${d.uygunsuzluk_tanimi}</td>
            <td>${d.tespit_tarihi}</td>
            <td class="text-end">
                <button onclick="deleteRecord('denetimler', ${d.id})" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Sil</button>
            </td>
        </tr>`;
    });
}

// --- AKSİYON İŞLEMLERİ ---
document.getElementById('formAksiyon').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        denetim_id: document.getElementById('aDenetimId').value,
        sorumlu_kisi: document.getElementById('aSorumlu').value,
        alınacak_aksiyon: document.getElementById('aAksiyon').value,
        termin_tarihi: document.getElementById('aTermin').value,
        oncelik: document.getElementById('aOncelik').value
    };
    await fetch('/api/aksiyonlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    e.target.reset();
    loadAksiyonlar();
});

async function loadAksiyonlar() {
    const res = await fetch('/api/aksiyonlar');
    const data = await res.json();
    document.getElementById('kpiAksiyon').innerText = data.length;
    const tbody = document.getElementById('tableAksiyon');
    tbody.innerHTML = '';
    data.forEach(a => {
        const badgeClass = a.oncelik.includes('Yüksek') ? 'bg-danger' : 'bg-warning text-dark';
        tbody.innerHTML += `<tr>
            <td><strong>${a.sorumlu_kisi}</strong></td>
            <td>${a.alınacak_aksiyon}</td>
            <td>${a.termin_tarihi}</td>
            <td><span class="badge ${badgeClass}">${a.oncelik}</span></td>
            <td><span class="badge bg-secondary">${a.durum}</span></td>
            <td class="text-end">
                <button onclick="deleteRecord('aksiyonlar', ${a.id})" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Sil</button>
            </td>
        </tr>`;
    });
}

// --- RAMAK KALA İŞLEMLERİ ---
document.getElementById('formRamakKala').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        olay_yeri: document.getElementById('rYere').value,
        tanim: document.getElementById('rTanim').value,
        tehlike_seviyesi: document.getElementById('rSeviye').value,
        bildiren: document.getElementById('rBildiren').value,
        tarih: new Date().toLocaleDateString('tr-TR')
    };
    await fetch('/api/ramak-kala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    e.target.reset();
    loadRamakKala();
});

async function loadRamakKala() {
    const res = await fetch('/api/ramak-kala');
    const data = await res.json();
    document.getElementById('kpiRamakKala').innerText = data.length;

    let dusuk = 0, orta = 0, yuksek = 0;
    const tbody = document.getElementById('tableRamakKala');
    tbody.innerHTML = '';

    data.forEach(r => {
        if (r.tehlike_seviyesi.includes('Düşük')) dusuk++;
        else if (r.tehlike_seviyesi.includes('Orta')) orta++;
        else if (r.tehlike_seviyesi.includes('Yüksek')) yuksek++;

        tbody.innerHTML += `<tr>
            <td><strong>${r.olay_yeri}</strong></td>
            <td>${r.tanim}</td>
            <td><span class="badge bg-warning text-dark">${r.tehlike_seviyesi}</span></td>
            <td>${r.bildiren || '-'}</td>
            <td>${r.tarih}</td>
            <td class="text-end">
                <button onclick="deleteRecord('ramak-kala', ${r.id})" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Sil</button>
            </td>
        </tr>`;
    });

    updateChart(dusuk, orta, yuksek);
}

// --- ORTAK SİLME FONKSİYONU ---
async function deleteRecord(endpoint, id) {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
        await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
        if (endpoint === 'personel') loadPersonel();
        else if (endpoint === 'denetimler') loadDenetimler();
        else if (endpoint === 'aksiyonlar') loadAksiyonlar();
        else if (endpoint === 'ramak-kala') loadRamakKala();
    }
}

function updateChart(dusuk, orta, yuksek) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    if (riskChartInstance) riskChartInstance.destroy();

    riskChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Düşük Risk', 'Orta Risk', 'Yüksek Risk'],
            datasets: [{
                data: [dusuk, orta, yuksek],
                backgroundColor: ['#f1c40f', '#e67e22', '#e74c3c']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}