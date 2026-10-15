-- Supabase Database Schema for Rishi Internal Forms Hub
-- Run this in your Supabase Project -> SQL Editor -> Click 'Run'

-- 1. Create hub_forms table
create table if not exists hub_forms (
  id text primary key,
  center_id text not null,
  number text not null,
  title_ta text not null,
  title_en text not null,
  drive_url text not null,
  type text default 'PDF',
  size text default 'A4',
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- 2. Enable Row Level Security (RLS)
alter table hub_forms enable row level security;

-- 3. Drop existing policy if any
drop policy if exists "Allow internal staff full access" on hub_forms;

-- 4. Create Policy allowing full access with anon key (Internal Staff Use)
create policy "Allow internal staff full access"
on hub_forms
for all
to anon, authenticated
using (true)
with check (true);

-- 5. Enable Realtime updates
alter publication supabase_realtime add table hub_forms;

-- 6. Insert Initial Seed Data (if empty)
insert into hub_forms (id, center_id, number, title_ta, title_en, drive_url, type, size, sort_order)
values
  -- Rishi Acupuncture
  ('acu-01', 'acupuncture', '01', 'பணியாளர் முன்பண விண்ணப்பம்', 'Staff Advance Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 1),
  ('acu-02', 'acupuncture', '02', 'விடுப்பு விண்ணப்பப் படிவம்', 'Leave Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 2),
  ('acu-03', 'acupuncture', '03', 'அனுமதி விண்ணப்பப் படிவம்', 'Permission Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 3),
  ('acu-04', 'acupuncture', '04', 'பணம் செலுத்துகை வவுச்சர் (A5)', 'Payment Voucher (A5 Portrait)', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A5', 4),
  ('acu-05', 'acupuncture', '05', 'தினசரி செலவு கணக்கு படிவம்', 'Daily Expense Statement Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 5),
  ('acu-06', 'acupuncture', '06', 'வாடிக்கையாளர் கருத்துப் படிவம்', 'Customer Feedback Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 6),

  -- Rishi Wellness
  ('wel-01', 'wellness', '01', 'பணியாளர் முன்பண விண்ணப்பம்', 'Staff Advance Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 1),
  ('wel-02', 'wellness', '02', 'விடுப்பு விண்ணப்பப் படிவம்', 'Leave Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 2),
  ('wel-03', 'wellness', '03', 'அனுமதி விண்ணப்பப் படிவம்', 'Permission Application Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 3),
  ('wel-04', 'wellness', '04', 'பணம் செலுத்துகை வவுச்சர் (A5)', 'Payment Voucher (A5 Portrait)', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A5', 4),
  ('wel-05', 'wellness', '05', 'தினசரி செலவு கணக்கு படிவம்', 'Daily Expense Statement Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 5),
  ('wel-06', 'wellness', '06', 'வாடிக்கையாளர் கருத்துப் படிவம்', 'Customer Feedback Form', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A4', 6),

  -- Irai Academy
  ('irai-01', 'irai', '01', 'பணம் செலுத்துகை வவுச்சர் (A5)', 'Payment Voucher (A5 Portrait)', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', 'PDF', 'A5', 1)
on conflict (id) do nothing;
