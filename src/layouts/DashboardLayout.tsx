import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">{children ?? <Outlet />}</div>
    </div>
  );
}
