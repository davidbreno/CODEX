import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.25),_transparent_55%)]">
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Visão geral financeira</h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Acompanhe resultados, metas e eventos financeiros com cartões dinâmicos alimentados pela store centralizada.
          </p>
        </header>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
