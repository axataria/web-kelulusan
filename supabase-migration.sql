-- ============================================================
-- SUPABASE MIGRATION — SMAN 1 Glagah Graduation Portal
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Profile table (site configuration)
CREATE TABLE IF NOT EXISTS "Profile" (
    id SERIAL PRIMARY KEY,
    npsn VARCHAR(20),
    nama_sekolah VARCHAR(255),
    judul_web VARCHAR(255),
    button_label VARCHAR(100),
    "isOpen" INTEGER DEFAULT 0,
    kepsek VARCHAR(255)
);

-- 2. User table (admin accounts)
CREATE TABLE IF NOT EXISTS "User" (
    username VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Student table
CREATE TABLE IF NOT EXISTS "Student" (
    nisn VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    kelas VARCHAR(50) NOT NULL,
    jurusan VARCHAR(100),
    status INTEGER DEFAULT 0,
    "isOpen" INTEGER DEFAULT 0,
    "openDate" TIMESTAMP,
    tgl_lahir DATE,
    nama_ortu VARCHAR(255)
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default site profile
INSERT INTO "Profile" (npsn, nama_sekolah, judul_web, button_label, "isOpen", kepsek)
VALUES ('20526890', 'SMAN 1 Glagah', 'Pengumuman Kelulusan SMAN 1 Glagah', 'Cek Kelulusan', 1, 'Nama Kepala Sekolah')
ON CONFLICT (id) DO NOTHING;

-- Default admin user
-- Username: admin | Password: admin123
INSERT INTO "User" (username, name, password, role)
VALUES ('admin', 'Administrator', 'f1f49aecabe15f160b1ace484ba77d64', 'super')
ON CONFLICT (username) DO NOTHING;
