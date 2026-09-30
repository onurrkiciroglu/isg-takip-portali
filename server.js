const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./isg_database.db', (err) => {
    if (err) console.error("Veritabanı hatası:", err.message);
    else console.log("PaperWork Tipi İSG Veritabanına bağlandı.");
});

db.serialize(() => {
    // 1. Personel & Yetkinlik / Sertifika Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS personel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_soyad TEXT,
        tc_no TEXT,
        departman TEXT,
        gorev TEXT,
        myk_belgesi TEXT,
        sertifikalar TEXT,
        saglik_raporu_tarihi TEXT,
        durum TEXT DEFAULT 'Aktif'
    )`);

    // 2. Saha Denetim & Uygunsuzluk Formu Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS denetimler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lokasyon TEXT,
        denetci TEXT,
        ekipman_alan TEXT,
        kategori TEXT,
        uygunsuzluk_tanimi TEXT,
        tespit_tarihi TEXT,
        durum TEXT DEFAULT 'Açık'
    )`);

    // 3. Aksiyon & DÖF (Düzeltici Önleyici Faaliyet) Takip Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS aksiyonlar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        denetim_id INTEGER,
        sorumlu_kisi TEXT,
        alınacak_aksiyon TEXT,
        termin_tarihi TEXT,
        oncelik TEXT,
        durum TEXT DEFAULT 'Devam Ediyor'
    )`);

    // 4. Ramak Kala & Olay Bildirim Tablosu
    db.run(`CREATE TABLE IF NOT EXISTS ramak_kala (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        olay_yeri TEXT,
        tanim TEXT,
        tehlike_seviyesi TEXT,
        bildiren TEXT,
        tarih TEXT,
        durum TEXT DEFAULT 'İncelemede'
    )`);
});

// --- API ENDPOINTLERİ ---

// Personel API
app.get('/api/personel', (req, res) => {
    db.all("SELECT * FROM personel ORDER BY id DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/personel', (req, res) => {
    const { ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi } = req.body;
    db.run("INSERT INTO personel (ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [ad_soyad, tc_no, departman, gorev, myk_belgesi, sertifikalar, saglik_raporu_tarihi],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/personel/:id', (req, res) => {
    db.run("DELETE FROM personel WHERE id = ?", [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

// Denetim API
app.get('/api/denetimler', (req, res) => {
    db.all("SELECT * FROM denetimler ORDER BY id DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/denetimler', (req, res) => {
    const { lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi } = req.body;
    db.run("INSERT INTO denetimler (lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi) VALUES (?, ?, ?, ?, ?, ?)",
        [lokasyon, denetci, ekipman_alan, kategori, uygunsuzluk_tanimi, tespit_tarihi],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/denetimler/:id', (req, res) => {
    db.run("DELETE FROM denetimler WHERE id = ?", [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

// Aksiyon / DÖF API
app.get('/api/aksiyonlar', (req, res) => {
    db.all("SELECT * FROM aksiyonlar ORDER BY id DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/aksiyonlar', (req, res) => {
    const { denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik } = req.body;
    db.run("INSERT INTO aksiyonlar (denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik) VALUES (?, ?, ?, ?, ?)",
        [denetim_id, sorumlu_kisi, alınacak_aksiyon, termin_tarihi, oncelik],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/aksiyonlar/:id', (req, res) => {
    db.run("DELETE FROM aksiyonlar WHERE id = ?", [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

// Ramak Kala API
app.get('/api/ramak-kala', (req, res) => {
    db.all("SELECT * FROM ramak_kala ORDER BY id DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/ramak-kala', (req, res) => {
    const { olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih } = req.body;
    db.run("INSERT INTO ramak_kala (olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih) VALUES (?, ?, ?, ?, ?)",
        [olay_yeri, tanim, tehlike_seviyesi, bildiren, tarih],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/ramak-kala/:id', (req, res) => {
    db.run("DELETE FROM ramak_kala WHERE id = ?", [req.params.id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Portala erişilebilir: http://localhost:${PORT}`);
});