import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getFeed, getDiary, getRecipes, getProfile, type ApiPost, type ApiDiary, type ApiRecipe, type ApiProfile } from '@/services/api';

type DataState = {
  feed:     ApiPost[]    | null;
  diary:    ApiDiary     | null;
  recipes:  ApiRecipe[]  | null;
  profile:  ApiProfile   | null;
  loading:  boolean;
  refresh:  () => void;
};

const DataContext = createContext<DataState>({
  feed: null, diary: null, recipes: null, profile: null,
  loading: true, refresh: () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [feed,    setFeed]    = useState<ApiPost[]   | null>(null);
  const [diary,   setDiary]   = useState<ApiDiary    | null>(null);
  const [recipes, setRecipes] = useState<ApiRecipe[] | null>(null);
  const [profile, setProfile] = useState<ApiProfile  | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      getFeed().then(setFeed).catch(() => {}),
      getDiary().then(setDiary).catch(() => {}),
      getRecipes().then(setRecipes).catch(() => {}),
      getProfile().then(setProfile).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <DataContext.Provider value={{ feed, diary, recipes, profile, loading, refresh: fetchAll }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
