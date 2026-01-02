-- =====================================================
-- Migration: Enable PostgreSQL Extensions
-- Version: 20260102010000
-- Description: Enable required PostgreSQL extensions
-- Author: TBS Group Backend Team
-- =====================================================

-- UUID support for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search support
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Unaccent for Vietnamese text search
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- PostGIS for geographical data (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Extensions enabled successfully';
END $$;
