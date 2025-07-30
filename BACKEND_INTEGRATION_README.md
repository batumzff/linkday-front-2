# Backend Integration - LinkDay Frontend

Bu dokümantasyon, LinkDay frontend uygulamasının backend API'si ile nasıl entegre edildiğini açıklar.

## 🚀 Kurulum

### 1. Environment Variables
`.env.local` dosyasını oluşturun:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
```

### 2. Backend API Çalıştırma
Backend API'nin çalıştığından emin olun:
```bash
# Backend API'yi başlatın (port 3000'de)
cd backend
npm run dev
```

### 3. Frontend Uygulamasını Başlatma
```bash
npm run dev
```

## 📁 Proje Yapısı

### API Client (`src/lib/api.ts`)
- Backend API ile iletişim için merkezi client
- JWT token yönetimi
- Otomatik error handling
- Request/response type safety

### State Management
- **Zustand Stores**: Client-side state yönetimi
  - `useAuthStore`: Authentication state
  - `useLinksStore`: Links state (opsiyonel)
- **React Query**: Server state yönetimi
  - Caching ve background updates
  - Optimistic updates
  - Error handling

### Hooks
- `useAuth`: Authentication işlemleri
- `useLinks`: Links CRUD işlemleri
- `useAuthCheck`: Authentication kontrolü

## 🔐 Authentication Flow

### 1. Login
```typescript
const { login } = useAuth()
await login(email, password)
```

### 2. Register
```typescript
const { register } = useAuth()
await register({ name, email, username, password })
```

### 3. Token Management
- JWT token localStorage'da saklanır
- Cookie olarak da set edilir (SSR için)
- Otomatik token refresh
- 401 durumunda otomatik logout

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user

### User Management
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/username` - Update username

### Links Management
- `GET /api/links` - Get user links
- `POST /api/links` - Create link
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link
- `PATCH /api/links/reorder` - Reorder links

### Public Profiles
- `GET /u/:username` - Get public profile
- `POST /api/click/:linkId` - Track click

## 🎯 Özellikler

### ✅ Tamamlanan
- [x] Authentication (login/register)
- [x] JWT token yönetimi
- [x] Protected routes
- [x] Links CRUD operations
- [x] Public profile pages
- [x] Click tracking
- [x] Error handling
- [x] Loading states
- [x] Type safety

### 🔄 Devam Eden
- [ ] Profile image upload
- [ ] Advanced analytics
- [ ] Theme customization
- [ ] Link scheduling
- [ ] Custom domains

## 🛠️ Development

### API Client Kullanımı
```typescript
import { apiClient } from '@/lib/api'

// Login
const response = await apiClient.login(email, password)

// Get links
const links = await apiClient.getLinks()

// Create link
const newLink = await apiClient.createLink({
  title: 'My Link',
  url: 'https://example.com',
  description: 'Description'
})
```

### React Query Hooks
```typescript
import { useLinks, useCreateLink } from '@/hooks/useLinks'

// Get links with caching
const { data: links, isLoading } = useLinks()

// Create link with optimistic updates
const createLink = useCreateLink()
await createLink.mutateAsync(linkData)
```

### Error Handling
```typescript
try {
  await login(email, password)
} catch (error) {
  // Error is automatically handled by the store
  console.error('Login failed:', error.message)
}
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Backend'de CORS ayarlarını kontrol edin
   - Frontend URL'ini backend CORS listesine ekleyin

2. **Token Issues**
   - localStorage'da token var mı kontrol edin
   - Token'ın geçerliliğini kontrol edin
   - Network tab'ında request headers'ı kontrol edin

3. **API Connection**
   - Backend API'nin çalıştığından emin olun
   - `NEXT_PUBLIC_API_URL` environment variable'ını kontrol edin
   - Network tab'ında request'leri kontrol edin

### Debug Commands
```bash
# Backend API status
curl http://localhost:3000/api-docs

# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Clear localStorage
localStorage.clear()
```

## 📈 Performance

### Optimizations
- React Query ile caching
- Optimistic updates
- Background refetching
- Error retry logic
- Loading skeletons

### Bundle Size
- Tree shaking ile unused code elimination
- Dynamic imports for large components
- Image optimization

## 🔒 Security

### Best Practices
- JWT token'ları güvenli şekilde saklama
- HTTPS enforcement
- Input validation
- XSS protection
- CSRF protection

### Token Security
- Short-lived access tokens
- Secure cookie settings
- Automatic token refresh
- Session invalidation

## 🚀 Deployment

### Environment Variables
Production'da environment variables'ları ayarlayın:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-frontend-domain.com
```

### Build Commands
```bash
npm run build
npm start
```

Bu entegrasyon ile frontend uygulamanız backend API'si ile tam uyumlu çalışacaktır. Herhangi bir sorun yaşarsanız, console'da hata mesajlarını kontrol edin ve network tab'ında request'leri inceleyin. 