-- Cloudflare D1 SQL Schema for E-Commerce Email Retainer Contracts
-- Tables: retainer_clients, contracts, flow_deployments, retainer_invoices

CREATE TABLE IF NOT EXISTS retainer_clients (
    id TEXT PRIMARY KEY,
    brand_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    store_url TEXT NOT NULL,
    retainer_tier TEXT DEFAULT 'growth',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    monthly_rate_usd REAL NOT NULL,
    start_date DATE NOT NULL,
    sla_hours INTEGER DEFAULT 48,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (client_id) REFERENCES retainer_clients(id)
);

CREATE TABLE IF NOT EXISTS flow_deployments (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    flow_type TEXT NOT NULL, -- WELCOME, ABANDONED_CART, POST_PURCHASE, WINBACK
    esp_platform TEXT DEFAULT 'KLAVIYO',
    status TEXT DEFAULT 'LIVE',
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES retainer_clients(id)
);

CREATE TABLE IF NOT EXISTS retainer_invoices (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES retainer_clients(id)
);
