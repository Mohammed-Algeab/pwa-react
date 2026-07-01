// contexts/FavoritesContext.tsx
// ponytail: نفس سبب SettingsContext — توحيد الحالة بمكان واحد بدل نسخة
// منفصلة بكل مكوّن، لضمان تزامن فوري (تبديل المفضّلة من بطاقة بالرئيسية
// ينعكس فوراً بصفحة المفضّلة لو مفتوحة بتبويب آخر... إلخ).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const FAVORITES_KEY = 'favorites_v1';

interface FavoritesContextValue {
  favorites: string[];
  loaded: boolean;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(FAVORITES_KEY);
    if (data) setFavorites(JSON.parse(data));
    setLoaded(true);
  }, []);

  const persist = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    persist(next);
  };

  const removeFavorite = (id: string) => {
    persist(favorites.filter((f) => f !== id));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loaded,
        toggleFavorite,
        removeFavorite,
        isFavorite: (id: string) => favorites.includes(id),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
