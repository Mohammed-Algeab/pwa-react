import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { App } from './App.tsx'
import './index.css'

// ponytail: staleTime معتدل (5 دقائق) — يقلل طلبات الشبكة المتكررة لنفس
// البيانات (مشاريع/منشورات لا تتغيّر كل ثانية)، بينما refetchOnWindowFocus
// يبقي المحتوى محدثاً عند رجوع الزائر للتبويب بعد غياب.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </StrictMode>,
)
