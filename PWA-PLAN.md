# PWA Implementation Plan

## Overview
Convert RaftGuru to a Progressive Web App (PWA) with minimal complexity. Strategy: cache app shell, use network-first for API calls, rely on `location.reload()` in `appInit.ts` for data freshness.

## Implementation Steps

### 1. Create `public/manifest.json`
```json
{
  "name": "RaftGuru",
  "short_name": "RaftGuru",
  "description": "Raft testing and monitoring application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1d2630",
  "theme_color": "#2a4b50",
  "scope": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

### 2. Create `public/sw.js` (Service Worker)
- Cache app shell: index.html, JS bundles, CSS
- Network-first strategy for API calls to `/api/*`
- Fallback to cached version if offline
- Skip caching Directus WebSocket connections

### 3. Update `index.html`
```html
<!-- Add manifest link -->
<link rel="manifest" href="/manifest.json">

<!-- PWA Meta Tags -->
<meta name="theme-color" content="#1a1a1a">
<meta name="description" content="Raft testing and monitoring application">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="RaftGuru">

<!-- Register Service Worker (in script tag) -->
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
</script>
```

### 4. Create App Icons
- **192x192**: `public/icon-192.png`
- **512x512**: `public/icon-512.png`
- User will create these

### 5. Update `vite.config.js` (if needed)
- Verify `public/` folder is served at root
- Standard Vite setup should handle this by default

## Why This Approach Works

✅ Installable on mobile home screen  
✅ Works offline (cached shell loads instantly)  
✅ `location.reload()` ensures data always fresh  
✅ No complex cache invalidation needed  
✅ Simple to maintain  

## Data Freshness Strategy

Since `appInit.ts` triggers `location.reload()` on `visibilitychange`, the complete app reloads when user returns from background. This guarantees:
- WebSocket subscriptions are reset
- Latest batch data is fetched
- No stale updates in the background
- Users always see current state

## Next Steps

1. Create icons (192x192, 512x512)
2. Add manifest.json to public/
3. Create Service Worker at public/sw.js
4. Update index.html with meta tags and SW registration
5. Test on mobile: Add to home screen → Use app
