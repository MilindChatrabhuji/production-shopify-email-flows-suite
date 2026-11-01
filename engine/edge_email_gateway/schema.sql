-- Cloudflare D1 SQL Schema for E-Commerce Lifecycle Email Suite
-- Tables: subscribers, cart_sessions, flow_executions, email_events

CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    rfm_cohort TEXT DEFAULT 'ACTIVE_LOYAL',
    clv_tier TEXT DEFAULT 'SILVER',
    lifetime_spend_usd REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_sessions (
    id TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    checkout_token TEXT NOT NULL,
    subtotal_usd REAL NOT NULL,
    items_count INTEGER NOT NULL,
    status TEXT DEFAULT 'ABANDONED',
    abandoned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

CREATE TABLE IF NOT EXISTS flow_executions (
    id TEXT PRIMARY KEY,
    subscriber_id TEXT NOT NULL,
    flow_name TEXT NOT NULL,
    stage_number INTEGER NOT NULL,
    dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

CREATE TABLE IF NOT EXISTS email_events (
    id TEXT PRIMARY KEY,
    execution_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- OPENED, CLICKED, CONVERTED
    revenue_usd REAL DEFAULT 0.0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (execution_id) REFERENCES flow_executions(id)
);
