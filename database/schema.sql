CREATE DATABASE IF NOT EXISTS ongc_machine_monitoring;
USE ongc_machine_monitoring;

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Equipment / Machinery
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    section_id INT, -- Keep for backward compat if used
    section VARCHAR(100), -- Displayed in table
    location VARCHAR(100),
    model VARCHAR(100),
    present_status VARCHAR(50) DEFAULT 'Working',
    class VARCHAR(50),
    sub_class VARCHAR(50),
    make VARCHAR(50),
    oem_sl_no VARCHAR(100),
    ongc_asset_no VARCHAR(100),
    last_received_from VARCHAR(100),
    remarks TEXT
);

-- Budget (Updated to match existing DB PK: id)
CREATE TABLE IF NOT EXISTS budget (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year VARCHAR(20) NOT NULL,
    section VARCHAR(50),
    capital_assigned DECIMAL(15, 2) DEFAULT 0,
    capital_utilized DECIMAL(15, 2) DEFAULT 0,
    contractual_assigned DECIMAL(15, 2) DEFAULT 0,
    contractual_utilized DECIMAL(15, 2) DEFAULT 0,
    store_assigned DECIMAL(15, 2) DEFAULT 0,
    store_utilized DECIMAL(15, 2) DEFAULT 0,
    spare_assigned DECIMAL(15, 2) DEFAULT 0,
    spare_utilized DECIMAL(15, 2) DEFAULT 0,
    others_assigned DECIMAL(15, 2) DEFAULT 0,
    others_utilized DECIMAL(15, 2) DEFAULT 0,
    misc_assigned DECIMAL(15, 2) DEFAULT 0,
    misc_utilized DECIMAL(15, 2) DEFAULT 0
);

-- Templates (from admin.py)
CREATE TABLE IF NOT EXISTS templates (
    template_id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(50) UNIQUE NOT NULL,
    template_name VARCHAR(100),
    route VARCHAR(100),
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert Default Admin (password: admin)
-- SHA256('admin') = 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
INSERT IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

-- Insert Sample Data for Budget
INSERT IGNORE INTO budget (year, section, capital_assigned, capital_utilized)
VALUES ('2023-24', 'DRILLING', 5000000, 2500000);

-- Procurement
CREATE TABLE IF NOT EXISTS procurement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(100),
    head VARCHAR(100),
    sl_no VARCHAR(50),
    year_procurement VARCHAR(20),
    item_details TEXT,
    procurement_agency VARCHAR(100),
    value DECIMAL(15, 2) DEFAULT 0,
    last_status VARCHAR(100),
    last_status_date DATE
);

-- Drill Sites Status
CREATE TABLE IF NOT EXISTS drill_sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planning_year VARCHAR(50),
    location_release_name VARCHAR(100),
    basin_name VARCHAR(100),
    block_name VARCHAR(100),
    block_allotment_details VARCHAR(255),
    block_validity VARCHAR(50),
    stacking_date DATE,
    laq_status VARCHAR(100),
    civil_work_start_date DATE,
    civil_work_end_date DATE,
    rfd_date DATE,
    drill_site_name VARCHAR(100),
    image_url VARCHAR(255)
);

-- New Initiatives
CREATE TABLE IF NOT EXISTS initiatives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year VARCHAR(50),
    category VARCHAR(100),
    year_used_at VARCHAR(50),
    used_at VARCHAR(100),
    description_brief TEXT,
    description_detail TEXT,
    pros TEXT,
    cons TEXT,
    benefits TEXT,
    cost_effectiveness TEXT,
    remarks TEXT
);

-- Audit Status (Updated)
CREATE TABLE IF NOT EXISTS audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_category VARCHAR(100),
    audit_year VARCHAR(50),
    auditing_agency VARCHAR(100),
    section VARCHAR(100),
    paras_raised INT DEFAULT 0,
    paras_complied_today INT DEFAULT 0,
    paras_complied_3m INT DEFAULT 0,
    paras_complied_6m INT DEFAULT 0,
    paras_complied_9m INT DEFAULT 0,
    paras_complied_beyond_9m INT DEFAULT 0,
    remarks TEXT
);

-- Certifications (Updated)
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    certified_on VARCHAR(50),
    certified_by VARCHAR(100),
    description_brief TEXT,
    validity VARCHAR(50),
    status VARCHAR(50),
    responsible_section VARCHAR(100),
    remarks TEXT
);

-- Upcoming Events (Updated)
CREATE TABLE IF NOT EXISTS upcoming_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100),
    status VARCHAR(50),
    event_date VARCHAR(50),
    duration VARCHAR(50),
    place VARCHAR(100),
    eligibility VARCHAR(100),
    description_brief TEXT,
    action_to_be_taken TEXT,
    nominated_persons TEXT,
    my_space_link TEXT
);

-- Drilling References (Updated)
CREATE TABLE IF NOT EXISTS drilling_references (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_type VARCHAR(100),
    event VARCHAR(100),
    date_of_event VARCHAR(50),
    brief TEXT,
    my_space_link TEXT,
    pass_key TEXT,
    remarks TEXT
);
