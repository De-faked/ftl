import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface PlacementTestContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const PlacementTestContext = createContext<PlacementTestContextType | undefined>(undefined);

export const PlacementTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handler = () => open();
    window.addEventListener('open-placement-test', handler);
    return () => window.removeEventListener('open-placement-test', handler);
  }, [open]);

  return (
    <PlacementTestContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </PlacementTestContext.Provider>
  );
};

export const usePlacementTest = () => {
  const context = useContext(PlacementTestContext);
  if (!context) {
    throw new Error('usePlacementTest must be used within a PlacementTestProvider');
  }
  return context;
};
