# Kullanıcı Kaydı ve Giriş Test Akışı

## 🧪 Test Senaryosu

### 1. Kullanıcı Kaydı Testi

**Test Kullanıcısı:**
- **Full Name:** Test User 2
- **Email:** test2@example.com
- **Username:** testuser2
- **Password:** TestPass123

**Beklenen Sonuçlar:**
- ✅ Form validation geçerli
- ✅ Backend API'ye POST /api/auth/register isteği
- ✅ Başarılı kayıt sonrası dashboard'a yönlendirme
- ✅ JWT token localStorage'a kaydedilme

### 2. Kullanıcı Girişi Testi

**Test Kullanıcısı:**
- **Email:** test@example.com
- **Password:** TestPass123

**Beklenen Sonuçlar:**
- ✅ Form validation geçerli
- ✅ Backend API'ye POST /api/auth/login isteği
- ✅ Başarılı giriş sonrası dashboard'a yönlendirme
- ✅ JWT token localStorage'a kaydedilme

## 🚀 Test Adımları

### Adım 1: Register Sayfası
1. http://localhost:3002/register adresine git
2. Form'u doldur:
   - Full Name: Test User 2
   - Email: test2@example.com
   - Username: testuser2
   - Password: TestPass123
3. "Create Account" butonuna tıkla
4. Network tab'ında API çağrısını kontrol et
5. Başarılı kayıt sonrası dashboard'a yönlendirildiğini kontrol et

### Adım 2: Login Sayfası
1. http://localhost:3002/login adresine git
2. Form'u doldur:
   - Email: test2@example.com
   - Password: TestPass123
3. "Sign In" butonuna tıkla
4. Network tab'ında API çağrısını kontrol et
5. Başarılı giriş sonrası dashboard'a yönlendirildiğini kontrol et

### Adım 3: Dashboard Kontrolü
1. Dashboard'da kullanıcı bilgilerinin görüntülendiğini kontrol et
2. Header'da kullanıcı adının görüntülendiğini kontrol et
3. Logout butonunun çalıştığını kontrol et

## 🔍 Kontrol Noktaları

### Frontend Validation
- ✅ Email formatı geçerli
- ✅ Username 3-50 karakter, alphanumeric + underscore
- ✅ Password 8+ karakter, uppercase, lowercase, number
- ✅ Form error mesajları görüntüleniyor

### API Integration
- ✅ POST /api/auth/register çağrısı
- ✅ POST /api/auth/login çağrısı
- ✅ GET /api/auth/me çağrısı (login sonrası)
- ✅ JWT token header'da gönderiliyor

### State Management
- ✅ Zustand store'da user state güncelleniyor
- ✅ React Query cache'de data saklanıyor
- ✅ Loading states görüntüleniyor
- ✅ Error states handle ediliyor

### Navigation
- ✅ Başarılı kayıt sonrası /dashboard'a yönlendirme
- ✅ Başarılı giriş sonrası /dashboard'a yönlendirme
- ✅ Protected routes çalışıyor
- ✅ Logout sonrası /login'a yönlendirme

## 🐛 Olası Sorunlar ve Çözümler

### Backend Bağlantı Sorunu
- **Sorun:** "Command find requires authentication" hatası
- **Çözüm:** Backend API'nin MongoDB bağlantısını kontrol et

### CORS Sorunu
- **Sorun:** CORS error'ları
- **Çözüm:** Backend'de CORS ayarlarını kontrol et

### Token Sorunu
- **Sorun:** JWT token localStorage'da saklanmıyor
- **Çözüm:** API client'da token yönetimini kontrol et

### Validation Sorunu
- **Sorun:** Form validation çalışmıyor
- **Çözüm:** Zod schema'larını kontrol et

## 📊 Test Sonuçları

### ✅ Başarılı Testler
- [ ] Register form validation
- [ ] Login form validation
- [ ] API integration
- [ ] State management
- [ ] Navigation flow
- [ ] Error handling
- [ ] Loading states

### ❌ Başarısız Testler
- [ ] Backend connection
- [ ] Database operations
- [ ] Token management
- [ ] Protected routes

## 🎯 Sonraki Adımlar

1. Backend API'yi çalıştır
2. MongoDB bağlantısını kontrol et
3. Test kullanıcısını kaydet
4. Login işlemini test et
5. Dashboard'ı kontrol et
6. Logout işlemini test et 