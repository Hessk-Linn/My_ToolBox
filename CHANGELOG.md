# Changelog

## [2.0.0] - 2026-05-27

### 🚀 Major Changes

#### Removed PIN Authentication System
- **Removed**: 4-user PIN authentication system
- **Removed**: `PinScreen` component
- **Removed**: `UserContext` and user management
- **Removed**: `recordedBy`, `createdBy`, `updatedBy` fields from all database tables
- **Removed**: `/api/auth/users` and `/api/auth/verify-pin` endpoints
- **Result**: App now accessible to everyone without login

#### Fully Responsive Design
- **Updated**: All pages now work seamlessly on mobile, tablet, and desktop
- **Updated**: `TabLayout` with responsive padding and sizing
- **Updated**: `BatteryStatus` page with flexible layouts
- **Updated**: `HomeSolar` page with adaptive components
- **Updated**: Tailwind CSS classes for breakpoint-based styling
- **Result**: Perfect experience on all screen sizes

### ✨ New Features

#### Error Handling
- **Added**: `ErrorBoundary` component for graceful error handling
- **Added**: User-friendly error screen with reload option
- **Added**: Error details in collapsible section for debugging

#### Backend Validation
- **Added**: Input validation for 24V battery readings (18-32V range)
- **Added**: Input validation for 48V battery readings (40-58V range)
- **Added**: Percentage validation (0-100%)
- **Result**: Prevents invalid data from entering the database

#### Code Organization
- **Added**: `constants.ts` file with voltage ranges and system configs
- **Added**: Centralized configuration for easy maintenance
- **Result**: Cleaner, more maintainable codebase

### ⚡ Performance Improvements

#### React Query Optimization
- **Added**: `staleTime: 5_000` - Data considered fresh for 5 seconds
- **Added**: `gcTime: 30_000` - Cache garbage collection after 30 seconds
- **Result**: Better caching, fewer unnecessary API calls

### 🎨 UI/UX Improvements

#### Responsive Layout
- **Updated**: Maximum width increased to `4xl` (896px) for better desktop experience
- **Updated**: Responsive padding: `px-3` on mobile, `px-4` on tablet, `px-6` on desktop
- **Updated**: Font sizes scale with screen size
- **Updated**: Battery cards stack vertically on mobile, horizontal on desktop

#### Simplified Interface
- **Removed**: User name display and logout button
- **Removed**: "Shared across 4 users" messaging
- **Updated**: Cleaner header with more space

### 📝 Documentation

#### README Updates
- **Updated**: Removed PIN authentication setup instructions
- **Updated**: Removed user seeding SQL commands
- **Updated**: Added new features section
- **Updated**: Updated project structure
- **Updated**: Removed auth endpoints from API documentation

### 🗄️ Database Changes

#### Schema Simplification
- **Note**: Existing `recordedBy`, `createdBy`, `updatedBy` columns still exist in database
- **Note**: Backend no longer populates these fields
- **Recommendation**: Run migration to drop these columns (optional)

### 🔧 Technical Improvements

- **Improved**: API client simplified (removed user header)
- **Improved**: Server endpoints cleaned up
- **Improved**: Better error messages
- **Improved**: Type safety maintained throughout

---

## Migration Guide

### For Existing Installations

1. **Pull latest code**
2. **Install dependencies** (no new dependencies added)
3. **Optional**: Clean up database columns:
   ```sql
   ALTER TABLE battery_readings_24v DROP COLUMN IF EXISTS recorded_by;
   ALTER TABLE home_solar_readings_48v DROP COLUMN IF EXISTS recorded_by;
   ALTER TABLE fuel_trips DROP COLUMN IF EXISTS created_by;
   ALTER TABLE fuel_trips DROP COLUMN IF EXISTS updated_by;
   ALTER TABLE fuel_prices DROP COLUMN IF EXISTS recorded_by;
   DROP TABLE IF EXISTS app_users;
   ```
4. **Restart servers**: `npm run dev`

### Breaking Changes

- ❌ PIN authentication no longer works
- ❌ User tracking removed from all features
- ❌ Auth API endpoints removed
- ✅ All existing data preserved
- ✅ All core features still work

---

## What's Next?

Future improvements could include:
- PWA support for offline functionality
- Data export/import features
- Charts and graphs for trend analysis
- Notification system for critical battery levels
- Multi-language support
