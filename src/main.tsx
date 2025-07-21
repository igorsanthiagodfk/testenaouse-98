import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SystemDataProvider } from './contexts/SystemDataContext'

// Pre-load data in background
import { googleSheetsService } from './services/googleSheetsService'

// Start background data loading as soon as the app loads
console.log('[Main] Iniciando pre-load de dados das planilhas...')
googleSheetsService.fetchAllData().then(() => {
  console.log('[Main] Pre-load de dados concluído!')
}).catch(error => {
  console.error('[Main] Erro no pre-load:', error)
})

createRoot(document.getElementById("root")!).render(
  <SystemDataProvider>
    <App />
  </SystemDataProvider>
);
