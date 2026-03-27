-- TJKT LMS Seed Data (Run AFTER schema.sql)
-- This seeds default school year, classes, subjects, badges
-- and the initial admin user profile.

-- 1. School Year
INSERT INTO school_years (id, name, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', '2025/2026', true)
ON CONFLICT DO NOTHING;

-- 2. Semester
INSERT INTO semesters (id, school_year_id, name, start_date, end_date)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ganjil', '2025-07-15', '2025-12-20')
ON CONFLICT DO NOTHING;

-- 3. Classes for 2025/2026 (Grade 10, 11, 12 × TJKT 1/2/3)
INSERT INTO classes (id, name, grade_level, school_year_id) VALUES
  ('10000000-0000-0000-0000-000000000001', 'X TJKT 1',   10, '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'X TJKT 2',   10, '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000003', 'X TJKT 3',   10, '00000000-0000-0000-0000-000000000001'),
  ('11000000-0000-0000-0000-000000000001', 'XI TJKT 1',  11, '00000000-0000-0000-0000-000000000001'),
  ('11000000-0000-0000-0000-000000000002', 'XI TJKT 2',  11, '00000000-0000-0000-0000-000000000001'),
  ('11000000-0000-0000-0000-000000000003', 'XI TJKT 3',  11, '00000000-0000-0000-0000-000000000001'),
  ('12000000-0000-0000-0000-000000000001', 'XII TJKT 1', 12, '00000000-0000-0000-0000-000000000001'),
  ('12000000-0000-0000-0000-000000000002', 'XII TJKT 2', 12, '00000000-0000-0000-0000-000000000001'),
  ('12000000-0000-0000-0000-000000000003', 'XII TJKT 3', 12, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 4. Subjects
INSERT INTO subjects (id, name, code, description, category) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Komputer dan Jaringan Dasar', 'KJD', 'Dasar hardware dan networking', 'Dasar Kejuruan'),
  ('00000000-0000-0000-0000-000000000006', 'Administrasi Infrastruktur Jaringan', 'AIJ', 'Routing, Switching, Firewall', 'Produktif'),
  ('00000000-0000-0000-0000-000000000007', 'Teknologi Layanan Jaringan', 'TLJ', 'VoIP, PBX, Streaming', 'Produktif'),
  ('00000000-0000-0000-0000-000000000008', 'Administrasi Sistem Jaringan', 'ASJ', 'Linux Server, DNS, Web Server', 'Produktif')
ON CONFLICT DO NOTHING;

-- 5. Badges
INSERT INTO badges (id, name, description, icon, xp_required, category) VALUES
  ('00000000-0000-0000-0000-000000000010', 'First Blood',      'Menyelesaikan pelajaran pertama',         '🏆', 100,  'Achievement'),
  ('00000000-0000-0000-0000-000000000011', 'Ping Master',      'Berhasil troubleshoot koneksi jaringan',  '🏓', 500,  'Skill'),
  ('00000000-0000-0000-0000-000000000012', 'Subnet Master',    'Lulus kuis Subnetting nilai >90',         '🧮', 1000, 'Skill'),
  ('00000000-0000-0000-0000-000000000013', 'Terminal Hacker',  'Ketik 100 perintah aktif di terminal',    '💻', 750,  'Skill'),
  ('00000000-0000-0000-0000-000000000014', 'Network Savior',   'Selesaikan 5 skenario troubleshooting',   '🛡️', 2000, 'Achievement')
ON CONFLICT DO NOTHING;

-- 6. Admin Profile for UUID f018f229-5c7b-48e9-81f4-8d8402b86075
-- NOTE: This user must FIRST be created in Supabase Auth → Users → "Add User"
-- with the same UUID and email, then this INSERT will create the profile.
INSERT INTO profiles (id, email, full_name, role, xp, level)
VALUES (
  'f018f229-5c7b-48e9-81f4-8d8402b86075',
  'admin@smkn1liwa.sch.id',
  'Administrator',
  'admin',
  0,
  1
) ON CONFLICT (id) DO UPDATE SET role = 'admin';
