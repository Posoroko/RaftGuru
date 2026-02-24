# RaftGuru Vue.js Project

A simple Vue.js 3 project with Vite build tool.

## Project Structure

```
src/
├── App.vue                 # Root component
├── main.js                 # Application entry point
├── components/             # Reusable Vue components
│   └── ExampleComponent.vue
├── composables/            # Reusable logic
│   └── useCounter.js
└── css/                    # Stylesheets
    └── main.css
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

This starts a development server at `http://localhost:3000` with hot module replacement.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

- **Vue 3** - Latest Vue framework
- **Vite** - Ultra-fast build tool
- **Components** - Folder for reusable Vue components
- **Composables** - Folder for reusable logic and hooks
- **CSS** - Global stylesheet folder

## Next Steps

1. Edit `src/App.vue` to customize your app
2. Add new components in `src/components/`
3. Create new composables in `src/composables/`
4. Import and use components and composables in your application
