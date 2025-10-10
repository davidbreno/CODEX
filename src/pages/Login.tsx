import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register';

export function LoginPage(): JSX.Element {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const resetErrors = () => setError(null);

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    resetErrors();
  };

  const mapError = (code: string): string => {
    const messages: Record<string, string> = {
      'invalid-credentials': 'Usuário ou senha inválidos. Tente novamente.',
      'user-exists': 'Este usuário já está cadastrado.',
      'weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
      'incomplete-data': 'Preencha todos os campos obrigatórios.'
    };

    return messages[code] ?? 'Não foi possível concluir a solicitação.';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login(username, password);
        if (!result.success) {
          setError(mapError(result.error));
          return;
        }
      } else {
        const result = await register(username, password, fullName);
        if (!result.success) {
          setError(mapError(result.error));
          return;
        }
      }

      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__badge">Financeiro inteligente</span>
          <h1 className="auth-card__title">Finance David Pro</h1>
          <p className="auth-card__subtitle">Acompanhe o caixa com um visual moderno em azul marinho e detalhes dourados.</p>
        </div>

        <div className="auth-toggle">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => handleModeChange('login')}>
            Entrar
          </button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => handleModeChange('register')}>
            Cadastrar
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Nome completo (opcional)
              <input
                type="text"
                placeholder="Como deseja ser chamado"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
          )}

          <label>
            Usuário
            <input
              type="text"
              placeholder="nome de usuário"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onFocus={resetErrors}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={resetErrors}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : mode === 'login' ? 'Acessar painel' : 'Criar conta' }
          </button>
        </form>

        <p className="auth-hint">
          {mode === 'login'
            ? 'Ainda não possui acesso? Use a aba cadastrar para criar sua conta.'
            : 'Se já possui cadastro, volte para Entrar com seu usuário e senha.'}
        </p>
      </div>
    </div>
  );
}
