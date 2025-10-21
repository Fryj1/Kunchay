import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  if (command !== 'serve') {
    // ВАЖНО: Замените 'tea-shop-webapp' на название вашего репозитория на GitHub
    config.base = '/tea-shop-webapp/' 
  }

  return config
})
