const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Public klasörü veya ana dizinden statik dosyaları sunma
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

const db = new Database('./isg_database.db');

// Tabloları Oluştur
db.exec(`
    CREATE TABLE IF NOT EXISTS personel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_soyad TEXT,
        tc_no TEXT,
        departman TEXT,
        gorev TEXT,
        myk_belgesi TEXT,
        sertifikalar TEXT,
        saglik_raporu_tarihi TEXT,
        durum TEXT DEFAULT 'Aktif'
    );

    CREATE TABLE IF NOT EXISTS denetimler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lokasyon TEXT,
        denetci TEXT,
        ekipman_alan TEXT,
        kategori TEXT,
        uygunsuzluk_tanimi TEXT,
        tespit_tarihi TEXT,
        durum TEXT DEFAULT 'Açık'
    );

    CREATE TABLE IF NOT EXISTS aksiyonlar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        denetim_id INTEGER,
        sorumlu_kisi TEXT,
        alınacak_aksiyon TEXT,
        termin_tarihi TEXT,
        oncelik TEXT,
        durum TEXT DEFAULT 'Devam Ediyor'
    );

    CREATE TABLE IF NOT EXISTS ramak_kala (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        olay_yeri TEXT,
        tanim TEXT,
        tehlike_seviyesi TEXT,
        bildiren TEXT,
        tarih TEXT,
        durum TEXT DEFAULT 'İncelemede'
    );
`);

// --- API ENDPOINTLERİ ---

// Personel API
app.get('/api/personel', (req, res) => {
    const rows = db.prepare("SELECT * FROM personel ORDER BY id DESC").all();
    res.json(rows);
});

app.post('/api/personel', (req, res) => {
    const { ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi } = req.body;
    const stmt = db.prepare("INSERT INTO personel (ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const info = stmt.run(ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi);
    res.json({ id: info.lastInsertRowid });
});

app.delete('/api/personel/:id', (req, res) => {
    const stmt = db.prepare("DELETE FROM personel WHERE id = ?");
    const info = stmt.run(req.params.id);
    res.json({ deleted: info.changes });
});

// Denetim API
app.get('/api/denetimler', (req, res) => {
    const rows = db.prepare("SELECT * FROM denetimler ORDER BY id DESC").all();
    res.json(rows);
});

app.post('/api/denetimler', (req, res) => {
    const { lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi } = req.body;
    const stmt = db.prepare("INSERT INTO denetimler (lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi);
    res.json({ id: info.lastInsertRowid });
});

app.delete('/api/denetimler/:id', (req, res) => {
    const stmt = db.prepare("DELETE FROM denetimler WHERE id = ?");
    const info = stmt.run(req.params.id);
    res.json({ deleted: info.changes });
});

// Aksiyon API
app.get('/api/aksiyonlar', (req, res) => {
    const rows = db.prepare("SELECT * FROM aksiyonlar ORDER BY id DESC").all();
    res.json(rows);
});

app.post('/api/aksiyonlar', (req, res) => {
    const { denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik } = req.body;
    const stmt = db.prepare("INSERT INTO aksiyonlar (denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik);
    res.json({ id: info.lastInsertRowid });
});

app.delete('/api/aksiyonlar/:id', (req, res) => {
    const stmt = db.prepare("DELETE FROM aksiyonlar WHERE id = ?");
    const info = stmt.run(req.params.id);
    res.json({ deleted: info.changes });
});

// Ramak Kala API
app.get('/api/ramak-kala', (req, res) => {
    const rows = db.prepare("SELECT * FROM ramak_kala ORDER BY id DESC").all();
    res.json(rows);
});

app.post('/api/ramak-kala', (req, res) => {
    const { olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih } = req.body;
    const stmt = db.prepare("INSERT INTO ramak_kala (olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih);
    res.json({ id: info.lastInsertRowid });
});

app.delete('/api/ramak-kala/:id', (req, res) => {
    const stmt = db.prepare("DELETE FROM ramak_kala WHERE id = ?");
    const info = stmt.run(req.params.id);
    res.json({ deleted: info.changes });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
