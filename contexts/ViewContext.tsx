import React, { createContext, useContext, useState } from 'react';
import type { AppView } from '../types';

type ViewContextValue = {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
};

const ViewContext = createContext<ViewContextValue | undefined>(undefined);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('LANDING');

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) throw new Error('useView must be used within a ViewProvider');
  return context;
};
