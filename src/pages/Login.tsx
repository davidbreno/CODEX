import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-aurora-end/30 backdrop-blur">
        <div className="mx-auto h-16 w-16 rounded-full bg-aurora-gradient" />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Bem-vindo de volta</h1>
          <p className="text-sm text-white/70">
            Faça login para acessar o painel financeiro personalizado.
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-white/80">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-aurora-start focus:outline-none focus:ring-2 focus:ring-aurora-start/60"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-white/80">Senha</label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-aurora-end focus:outline-none focus:ring-2 focus:ring-aurora-end/60"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-aurora-gradient px-4 py-3 font-semibold text-midnight shadow-lg shadow-aurora-end/40 transition hover:opacity-90"
          >
            Entrar
          </button>
        </form>
        <p className="text-xs text-white/60">
          Ainda não possui conta? <Link to="/dashboard" className="text-aurora-start">Solicite acesso</Link>
        </p>
      </div>
    </div>
  );
}
