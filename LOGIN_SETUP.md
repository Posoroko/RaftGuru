# Login & Session Setup

## What's been created:

1. **useAuth.ts** - Auth composable with:
   - `login(email, password)` - sends credentials to Directus `/auth/login`
   - `autoLogin()` - checks if user has valid session cookie
   - `logout()` - clears session
   - Reactive state: `user`, `isLoggedIn`, `isLoading`, `error`

2. **LoginForm.vue** - Simple login form component (email + password inputs)

3. **appInit.js** - Updated to call `autoLogin()` on app startup

## How it works:

1. User opens app → `appInit` calls `autoLogin()`
2. If user has session cookie → Directus `/auth/me` returns user data → logged in ✓
3. If no session cookie → fails silently and stays on login page
4. User fills in login form → calls `login(email, password)`
5. Directus sets session cookie in browser
6. Cookie is sent automatically with all fetch requests (already set up with `credentials: 'include'`)
7. Next time user visits → autoLogin works with existing cookie

## Dev Server Setup (for db.raftguru.posoroko.com)

Your Directus and this Vue app must run on **same domain** for cookies to work across them.

### Option 1: Local Development (Recommended for testing)

Edit your **hosts file** and add:
```
127.0.0.1 db.raftguru.posoroko.com
```

Windows: `C:\Windows\System32\drivers\etc\hosts`
Mac/Linux: `/etc/hosts`

Then install a local proxy like Caddy or use Node's Built-in Server Proxy.

### Option 2: Use Vite Config Proxy

Update vite.config.js to proxy Directus requests:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'db.raftguru.posoroko.com', // or 0.0.0.0
    port: 3000,
    open: true,
    // Proxy Directus API calls
    proxy: {
      '/api': {
        target: 'http://your-directus-server.com',
        changeOrigin: true,
        // Keep cookies
        credentials: 'include'
      },
      '/auth': {
        target: 'http://your-directus-server.com',
        changeOrigin: true,
        credentials: 'include'
      },
      '/files': {
        target: 'http://your-directus-server.com',
        changeOrigin: true,
        credentials: 'include'
      }
    }
  }
})
```

Then update appConfig.ts to use local paths:
```typescript
export default {
    dbUrl: 'http://db.raftguru.posoroko.com:3000' // or just ''
}
```

### Option 3: Docker Compose (Production-like)

Create `docker-compose.yml`:
```yaml
version: '3'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://db.raftguru.posoroko.com:8055
    networks:
      - raftguru

  directus:
    image: directus/directus:latest
    ports:
      - "8055:8055"
    networks:
      - raftguru
    # ... other config

networks:
  raftguru:
    driver: bridge
```

## How Cookies Work

- Directus sends back `Set-Cookie` with session token after login
- Browser stores cookie for domain `db.raftguru.posoroko.com`
- All your fetch helpers already have `credentials: 'include'` so cookies are sent automatically
- Image requests to `/files` also include the cookie ✓

## Next Steps

1. Update vite.config.js based on your setup
2. Update appConfig.ts with correct dbUrl
3. Import & use LoginForm in your Overlay or TopBar component
4. Test login with Directus credentials
5. Verify cookies are being sent (check DevTools → Application → Cookies)
