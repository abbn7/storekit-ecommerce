-- Login attempts table for persistent rate limiting
CREATE TABLE login_attempts (
    ip VARCHAR(45) PRIMARY KEY,
    count INT NOT NULL DEFAULT 1,
    last_attempt TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Processed webhook events for idempotency
CREATE TABLE processed_webhook_events (
    event_id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add timestamps to collections table (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE collections ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE collections ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- RLS policies for new tables
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service_role can access these tables
CREATE POLICY "Service role full access login_attempts" ON login_attempts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access processed_webhook_events" ON processed_webhook_events FOR ALL USING (auth.role() = 'service_role');
