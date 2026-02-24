import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    https: {
      key: fs.readFileSync('./raftguru.posoroko.com+2-key.pem'),
      cert: fs.readFileSync('./raftguru.posoroko.com+2.pem')
    },
    host: 'dev.raftguru.posoroko.com',
    port: 3000,
    open: true
  }
})
