import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['localhost', 'gestor-docker-1.onrender.com'], // Mantenha os hosts permitidos
    watch: {
      usePolling: true
    },
    // Configuração do proxy para redirecionar requisições para o backend
    proxy: {
      // Redireciona todas as requisições que começam com '/auth'
      '/auth': {
        // O endereço do seu servidor back-end
        // Use o nome do serviço do Docker Compose aqui, não 'localhost'
        target: 'gestor-docker.onrender.com',
        // Necessário para que o proxy funcione corretamente em ambientes de produção
        changeOrigin: true,
        // Reescreve o caminho para que a parte '/auth' seja mantida
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      },
      // Adicione aqui a configuração para o endpoint de logistica, se necessário
      '/api/logistica': {
        target: 'gestor-docker.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist'
  }
})