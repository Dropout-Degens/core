# Dev Sync - 2025-12-02 Summary

## Overview

Technical working session between Zack (Bellcube) and Dax (AsiaD) focused on understanding the SuperBase database schema and setting up PostHog analytics event tracking.

## Participants

- **Zack (Bellcube)** - Lead developer
- **Dax (AsiaD)** - Founder

## Main Topics Covered

1. **Database Schema Walkthrough** - Walked through SuperBase tables to understand where user data lives
2. **User Journey Mapping** - Traced data flow from user joining server through subscription
3. **PostHog Analytics Setup** - Decided what Discord events to pipe into PostHog
4. **Bot Interactions Review** - Catalogued all bot interactions and what data each captures

## Key Outcomes

- Added `created_at` column to users table (wasn't being tracked before)
- Created `manual` schema for human-managed data (separate from code-managed private/public schemas)
- Established rule: Database = current state, PostHog = historical/time-based analytics
- Identified all Discord events to track in PostHog
- Pushed initial PostHog integration live

## Action Items Identified

- Add `is_banned` flag to users table (noted for Notion)
- Track when user actually joins Discord (separate from created_at)
- Investigate membership expiration bug (more subscribers than actual subscriptions)
