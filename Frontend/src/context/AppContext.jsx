import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleNotif = () => setNotifOpen(v => !v);
  const toggleSidebar = () => setSidebarCollapsed(v => !v);

  const role =
    user?.role === 'physiotherapist'
      ? 'physio'
      : user?.role || 'athlete';

  return (
    <AppContext.Provider
      value={{
        role,
        notifOpen,
        toggleNotif,
        setNotifOpen,
        sidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      'useAppContext must be used inside AppProvider'
    );
  }

  return ctx;
}