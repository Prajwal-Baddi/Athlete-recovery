import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-apex-bg">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar pathname={location.pathname} />

        <main
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}