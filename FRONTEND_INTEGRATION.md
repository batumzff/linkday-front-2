# Frontend Integration Guide - LinkDay API

Bu dokümantasyon, LinkDay API'sini frontend uygulamanızla entegre etmek için gerekli tüm bilgileri içermektedir.

## 📋 İçindekiler
- [API Base URL](#api-base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Veri Modelleri](#veri-modelleri)
- [Hata Yönetimi](#hata-yönetimi)
- [Önemli Kurallar](#önemli-kurallar)
- [Örnek Kodlar](#örnek-kodlar)

## 🌐 API Base URL

**Docker (Önerilen):** `http://localhost:3000`
**Local Development:** `http://localhost:5000`
**Swagger Documentation:** `http://localhost:3000/api-docs`

## 🔐 Authentication

### JWT Token Authentication
API, JWT (JSON Web Token) tabanlı authentication kullanır.

#### Token Alma
```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { /* user object */ }
}
```

#### Token Kullanımı
Her protected endpoint için header'da token göndermelisiniz:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

## 📊 API Endpoints

### 🔒 Authentication Endpoints

#### 1. Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

### 👤 User Management

#### 1. Update Profile
```
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "name": "John Doe Updated",
  "bio": "Software developer",
  "theme": "dark",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 2. Update Username
```
PUT /api/user/username
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "username": "johnsmith"
}
```

#### 3. Get Public Profile
```
GET /u/{username}
```

### 🔗 Links Management

#### 1. Get User Links
```
GET /api/links
Authorization: Bearer {token}
```

#### 2. Create Link
```
POST /api/links
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "My Portfolio",
  "url": "https://johndoe.dev",
  "description": "Check out my work",
  "icon": "portfolio"
}
```

#### 3. Update Link
```
PUT /api/links/{linkId}
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Updated Portfolio",
  "url": "https://newsite.dev",
  "description": "Updated description",
  "icon": "new-icon",
  "isActive": true
}
```

#### 4. Delete Link
```
DELETE /api/links/{linkId}
Authorization: Bearer {token}
```

#### 5. Reorder Links
```
PATCH /api/links/reorder
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "linkIds": ["linkId1", "linkId2", "linkId3"]
}
```

### 📈 Public Analytics

#### Click Tracking
```
POST /api/click/{linkId}
Content-Type: application/json

Response:
{
  "success": true,
  "message": "Click recorded",
  "redirectUrl": "https://target-url.com"
}
```

## 📋 Veri Modelleri

### User Model
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  theme: 'light' | 'dark' | 'colorful';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Link Model
```typescript
interface Link {
  _id: string;
  userId: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## ⚠️ Hata Yönetimi

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Invalid/Missing Token)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```javascript
{
  "success": false,
  "message": "Error description"
}
```

### Frontend Error Handling
```javascript
try {
  const response = await fetch('/api/endpoint', options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error in UI
}
```

## 🚨 Önemli Kurallar

### 1. Validation Kuralları

#### User Registration
- **name**: Zorunlu, string
- **email**: Zorunlu, geçerli email formatı
- **username**: Zorunlu, 3-30 karakter, benzersiz
- **password**: Zorunlu, minimum 6 karakter

#### User Profile
- **bio**: Maksimum 160 karakter
- **theme**: 'light', 'dark', 'colorful' değerlerinden biri

#### Link Creation
- **title**: Zorunlu, maksimum 100 karakter
- **url**: Zorunlu, geçerli URL formatı
- **description**: Opsiyonel, maksimum 300 karakter

### 2. Token Yönetimi
- Token'ı localStorage'da güvenli şekilde saklayın
- Token'ın süresi dolduğunda kullanıcıyı login sayfasına yönlendirin
- Her request'te token'ın geçerliliğini kontrol edin

### 3. Rate Limiting
- Aşırı request göndermeyin
- Error response'larında retry-after header'ını kontrol edin

### 4. Data Fetching Best Practices
- Loading state'leri gösterin
- Error state'leri handle edin
- Optimistic updates kullanın (link reordering için)

## 💻 Örnek Kodlar

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useAPI = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const apiCall = async (endpoint, options = {}) => {
    const url = `http://localhost:3000${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options
    };
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
      }
      throw new Error(data.message);
    }
    
    return data;
  };
  
  return { apiCall, token, setToken };
};
```

### Links Management Component
```javascript
const LinksManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useAPI();
  
  useEffect(() => {
    fetchLinks();
  }, []);
  
  const fetchLinks = async () => {
    try {
      const data = await apiCall('/api/links');
      setLinks(data.links);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createLink = async (linkData) => {
    try {
      const data = await apiCall('/api/links', {
        method: 'POST',
        body: JSON.stringify(linkData)
      });
      setLinks([...links, data.link]);
      return data.link;
    } catch (error) {
      throw error;
    }
  };
  
  const reorderLinks = async (newOrder) => {
    try {
      await apiCall('/api/links/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ linkIds: newOrder })
      });
      // Update local state optimistically
      const reorderedLinks = newOrder.map(id => 
        links.find(link => link._id === id)
      );
      setLinks(reorderedLinks);
    } catch (error) {
      // Revert on error
      fetchLinks();
      throw error;
    }
  };
  
  return (
    // Your component JSX
  );
};
```

### Public Profile Page
```javascript
const PublicProfile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProfile();
  }, [username]);
  
  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/u/${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Profile not found:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLinkClick = async (linkId, url) => {
    try {
      // Track click
      await fetch(`http://localhost:3000/api/click/${linkId}`, {
        method: 'POST'
      });
      
      // Redirect
      window.open(url, '_blank');
    } catch (error) {
      // Still redirect even if tracking fails
      window.open(url, '_blank');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;
  
  return (
    <div className={`profile-${profile.user.theme}`}>
      <h1>{profile.user.name}</h1>
      <p>{profile.user.bio}</p>
      
      {profile.links.map(link => (
        <button
          key={link._id}
          onClick={() => handleLinkClick(link._id, link.url)}
        >
          {link.title}
        </button>
      ))}
    </div>
  );
};
```

## 🎨 UI/UX Recommendations

### Theme Support
```css
.profile-light { /* Light theme styles */ }
.profile-dark { /* Dark theme styles */ }
.profile-colorful { /* Colorful theme styles */ }
```

### Loading States
- Skeleton loaders for profile pages
- Button loading states during API calls
- Optimistic updates for better UX

### Error Messages
- User-friendly error messages
- Network error handling
- Validation feedback

## 🔧 Development Tips

1. **Environment Variables**: API URL'i environment variable olarak kullanın
2. **API Client**: Axios veya benzeri HTTP client kullanın
3. **State Management**: Redux/Zustand gibi state management araçları kullanın
4. **Type Safety**: TypeScript kullanıyorsanız interface'leri import edin
5. **Testing**: API call'ları mock'layarak test edin

Bu dokümantasyon ile LinkDay API'sini frontend uygulamanızla başarıyla entegre edebilirsiniz. Sorularınız için Swagger documentation sayfasını ziyaret edin: `http://localhost:3000/api-docs`