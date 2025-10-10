import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const sections = [
  { label: 'Visão geral', target: 'overview' },
  { label: 'Entradas', target: 'incomes' },
  { label: 'Saídas', target: 'expenses' },
  { label: 'Relatórios', target: 'reports' }
];

export function Sidebar(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    const section = document.getElementById(target);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__brand">
          <div className="sidebar__logo">FD</div>
          <div>
            <p className="sidebar__caption">Finance Suite</p>
            <h2 className="sidebar__title">David Pro</h2>
          </div>
        </div>
        <div className="sidebar__user">
          <span>Bem-vindo,</span>
          <strong>{user?.fullName ?? user?.username ?? 'Convidado'}</strong>
        </div>
      </div>

      <nav className="sidebar__nav">
        {sections.map((section) => (
          <a
            key={section.target}
            href={`#${section.target}`}
            className="sidebar__link"
            onClick={(event) => handleNavigate(event, section.target)}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="sidebar__logout">
        <button type="button" onClick={handleLogout}>
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
