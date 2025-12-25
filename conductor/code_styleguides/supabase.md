# Supabase & Database Style Guide

## General
- Treat the database as the source of truth.
- Use Supabase Client SDKs for data access.

## Naming Conventions (PostgreSQL)
- **Tables:** `snake_case`, plural (e.g., `user_profiles`, `training_sessions`).
- **Columns:** `snake_case` (e.g., `created_at`, `user_id`).
- **Foreign Keys:** `target_table_id` (e.g., `team_id`).
- **Indexes:** `idx_table_column`.

## Security
- **Row Level Security (RLS):** MUST be enabled on all tables.
- Define strict RLS policies for SELECT, INSERT, UPDATE, DELETE.
- Use `auth.uid()` for user-scoped access.
- Never expose service keys in the frontend.

## Data Types
- Use `UUID` for primary keys.
- Use `TIMESTAMPTZ` for date/time columns.
- Use `JSONB` for unstructured data/settings, but prefer normalized tables for core relations.

## Migrations & Management
- Use Supabase CLI for migrations.
- Do not make schema changes directly in the Production dashboard.
- Generate TypeScript types from the database schema automatically.
