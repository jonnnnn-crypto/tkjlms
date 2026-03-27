-- TJKT LMS Database Seed Data

-- Insert Roles (Since roles are enum, no table needed)

-- 1. Insert School Year
INSERT INTO school_years (id, name, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', '2025/2026', true);

-- 2. Insert Semester
INSERT INTO semesters (id, school_year_id, name, start_date, end_date)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ganjil', '2025-07-15', '2025-12-20');

-- 3. Insert Classes
INSERT INTO classes (id, name, grade_level, school_year_id)
VALUES ('00000000-0000-0000-0000-000000000003', 'X TJKT 1', 10, '00000000-0000-0000-0000-000000000001'),
       ('00000000-0000-0000-0000-000000000004', 'XI TJKT 1', 11, '00000000-0000-0000-0000-000000000001');

-- 4. Insert Subjects
INSERT INTO subjects (id, name, code, description, category)
VALUES ('00000000-0000-0000-0000-000000000005', 'Komputer dan Jaringan Dasar', 'KJD', 'Dasar-dasar hardware dan networking', 'Dasar Kejuruan'),
       ('00000000-0000-0000-0000-000000000006', 'Administrasi Infrastruktur Jaringan', 'AIJ', 'Routing, Switching, Firewalling', 'Produktif');

-- Insert Badges
INSERT INTO badges (id, name, description, icon, xp_required, category)
VALUES 
    ('00000000-0000-0000-0000-000000000010', 'First Blood', 'Completed the first lesson', '🏆', 100, 'Achievement'),
    ('00000000-0000-0000-0000-000000000011', 'Ping Master', 'Successfully troubleshooted network connectivity', '🏓', 500, 'Skill');

-- Note: Seed data for users (profiles) typically requires Supabase Auth users to be created first,
-- so profile insertion depends on auth.users mapping.
