# MCP Store Configuration - Linktree Clone

## Overview
This document outlines the Model Context Protocol (MCP) store configuration for the personal link sharing application, defining data models, storage requirements, and API structure.

## Data Models

### User Model
```
User {
  id: string (UUID)
  email: string (unique)
  password_hash: string
  username: string (unique, 3-50 chars, alphanumeric + underscore)
  google_id: string? (optional, for OAuth)
  created_at: timestamp
  updated_at: timestamp
  is_active: boolean
  subscription_tier: enum ['free', 'premium']
  theme_preference: enum ['light', 'dark', 'auto']
}
```

### Profile Model
```
Profile {
  id: string (UUID)
  user_id: string (foreign key to User.id)
  display_name: string (max 100 chars)
  bio: string (max 500 chars)
  profile_image_url: string?
  background_color: string (hex code)
  text_color: string (hex code)
  button_style: enum ['rounded', 'square', 'pill']
  is_public: boolean
  custom_domain: string? (premium feature)
  seo_title: string?
  seo_description: string?
  created_at: timestamp
  updated_at: timestamp
}
```

### Link Model
```
Link {
  id: string (UUID)
  user_id: string (foreign key to User.id)
  title: string (max 100 chars)
  description: string? (max 200 chars)
  url: string (validated URL)
  icon_type: enum ['emoji', 'font_awesome', 'lucide', 'custom_image']
  icon_value: string (emoji, icon name, or image URL)
  button_text: string (default: "Visit", max 20 chars)
  is_active: boolean
  sort_order: integer
  click_count: integer (default: 0)
  background_color: string? (hex code)
  text_color: string? (hex code)
  created_at: timestamp
  updated_at: timestamp
}
```

### Analytics Model
```
LinkClick {
  id: string (UUID)
  link_id: string (foreign key to Link.id)
  user_id: string (foreign key to User.id)
  clicked_at: timestamp
  ip_address: string (hashed for privacy)
  user_agent: string
  referrer: string?
  country: string?
  device_type: enum ['mobile', 'tablet', 'desktop']
}
```

### Session Model
```
Session {
  id: string (UUID)
  user_id: string (foreign key to User.id)
  token: string (JWT or session token)
  expires_at: timestamp
  created_at: timestamp
  last_accessed: timestamp
  ip_address: string
  user_agent: string
}
```

## Storage Requirements

### Database Schema Considerations
- **Primary Database**: PostgreSQL (recommended for ACID compliance and JSON support)
- **Caching Layer**: Redis for session management and frequently accessed profiles
- **File Storage**: AWS S3 or equivalent for profile images and custom icons
- **CDN**: CloudFront or similar for global image delivery

### Indexing Strategy
```sql
-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Profile table indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_custom_domain ON profiles(custom_domain);

-- Link table indexes
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_sort_order ON links(user_id, sort_order);
CREATE INDEX idx_links_is_active ON links(is_active);

-- Analytics indexes
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_clicked_at ON link_clicks(clicked_at);
CREATE INDEX idx_link_clicks_user_id_date ON link_clicks(user_id, clicked_at);
```

## API Endpoints Structure

### Authentication Endpoints
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### User Management Endpoints
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/upload-avatar` - Upload profile image
- `DELETE /api/user/account` - Delete user account
- `GET /api/user/settings` - Get user preferences
- `PUT /api/user/settings` - Update user preferences

### Link Management Endpoints
- `GET /api/links` - Get user's links (sorted by sort_order)
- `POST /api/links` - Create new link
- `PUT /api/links/:id` - Update specific link
- `DELETE /api/links/:id` - Delete specific link
- `PUT /api/links/reorder` - Bulk update sort_order for links
- `PUT /api/links/:id/toggle` - Toggle link active status

### Public Profile Endpoints
- `GET /api/public/:username` - Get public profile data
- `GET /api/public/domain/:domain` - Get profile by custom domain
- `POST /api/public/click/:linkId` - Track link click (analytics)

### Analytics Endpoints
- `GET /api/analytics/overview` - Dashboard analytics summary
- `GET /api/analytics/links` - Per-link analytics
- `GET /api/analytics/clicks` - Detailed click data with filters
- `GET /api/analytics/export` - Export analytics data (CSV/JSON)

## Data Validation Rules

### Username Validation
- 3-50 characters
- Alphanumeric characters and underscore only
- Cannot start or end with underscore
- Reserved usernames: admin, api, www, mail, support, help, about, privacy, terms

### URL Validation
- Must be valid HTTP/HTTPS URL
- Domain whitelist/blacklist support
- Malicious URL detection
- Link shortener detection and expansion

### Profile Image Validation
- Max file size: 5MB
- Supported formats: JPEG, PNG, WebP
- Automatic resizing to 400x400px
- Image optimization and compression

## Caching Strategy

### Redis Cache Keys
- `user:session:{sessionId}` - User session data (TTL: 7 days)
- `profile:public:{username}` - Public profile cache (TTL: 1 hour)
- `links:user:{userId}` - User's links cache (TTL: 30 minutes)
- `analytics:summary:{userId}:{date}` - Daily analytics cache (TTL: 24 hours)

### Cache Invalidation
- Profile updates: Clear `profile:public:{username}`
- Link changes: Clear `links:user:{userId}` and `profile:public:{username}`
- User settings: Clear all user-related caches

## Security Considerations

### Data Protection
- Password hashing: bcrypt with salt rounds ≥ 12
- JWT tokens: Short-lived access tokens (15min) + refresh tokens (7 days)
- API rate limiting: Per-user and per-IP limits
- Input sanitization: All user inputs sanitized and validated
- SQL injection prevention: Parameterized queries only

### Privacy Controls
- IP address hashing for analytics
- GDPR compliance: Data export and deletion capabilities
- Cookie consent management
- Optional analytics opt-out for profile visitors

## Backup and Recovery

### Database Backups
- Daily automated backups with 30-day retention
- Point-in-time recovery capability
- Cross-region backup replication for disaster recovery

### File Storage Backups
- S3 versioning enabled for profile images
- Cross-region replication for critical assets
- Automated backup verification and integrity checks