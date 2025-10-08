# Guia rápido dos gráficos interativos

Este diretório reúne versões independentes dos quatro gráficos exibidos no mockup do dashboard. Todos eles utilizam [`recharts`](https://recharts.org/en-US/) e aceitam propriedades para personalização de cores, rótulos e legendas. Assim você pode usar cada componente separadamente em qualquer página da aplicação.

## Como instalar dependências

O projeto já possui o `recharts` listado no `package.json`. Caso ainda não tenha instalado as dependências, rode:

```bash
npm install
```

## Como utilizar cada componente

Os exemplos abaixo consideram um arquivo React qualquer (por exemplo, `src/pages/Dashboard.tsx`). Basta importar o gráfico desejado e enviar os dados no formato indicado.

### 1. Gráfico de colunas (`InteractiveBarChart`)
```tsx
import { InteractiveBarChart } from '@/charts';

const barData = [
  { label: 'Q1', value: 120, color: '#f97316' },
  { label: 'Q2', value: 86, color: '#facc15' },
  { label: 'Q3', value: 142, color: '#34d399' },
  { label: 'Q4', value: 98, color: '#38bdf8' }
];

<InteractiveBarChart
  title="Receita por trimestre"
  caption="Ano 20XX"
  data={barData}
  defaultColor="#f97316"
/>;
```

- `color` é opcional em cada item. Se não informar, o componente usará `defaultColor`.
- Passe qualquer string CSS válida (`#hex`, `rgb()`, `hsl()`).

### 2. Gráfico de linhas com múltiplas séries (`MultiSeriesLineChart`)
```tsx
import { MultiSeriesLineChart } from '@/charts';

const lineData = [
  { month: 'Jan', receita: 120, meta: 110, despesas: 70 },
  { month: 'Fev', receita: 135, meta: 120, despesas: 82 },
  // ...
];

<MultiSeriesLineChart
  title="Evolução mensal"
  caption="Últimos 6 meses"
  data={lineData}
  xKey="month"
  lines={[
    { dataKey: 'receita', name: 'Receita', color: '#f97316' },
    { dataKey: 'meta', name: 'Meta', color: '#22d3ee', strokeDasharray: '6 4' },
    { dataKey: 'despesas', name: 'Despesas', color: '#ef4444' }
  ]}
/>;
```

- Use quantas séries quiser. Cada item em `lines` define o rótulo da legenda e a cor correspondente.
- `strokeDasharray` é opcional e aceita qualquer padrão SVG (ex.: `'6 4'`).

### 3. Gráfico de rosca (`DonutBreakdownChart`)
```tsx
import { DonutBreakdownChart } from '@/charts';

const donutData = [
  { name: 'Marketing', value: 40, color: '#f97316' },
  { name: 'Operações', value: 26, color: '#22d3ee' },
  { name: 'Pessoal', value: 22, color: '#a855f7' },
  { name: 'Outros', value: 12, color: '#facc15' }
];

<DonutBreakdownChart
  title="Distribuição de custos"
  caption="Trimestre atual"
  data={donutData}
  centerLabel="R$ 240k"
  helperText="Passe o mouse para destacar cada categoria."
/>;
```

- Se alguma fatia não tiver `color`, o componente utilizará a paleta padrão (`defaultColorPalette`).
- O valor `centerLabel` fica fixo no centro da rosca.

### 4. Mini gráfico de tendência (`SparklineTrendChart`)
```tsx
import { SparklineTrendChart } from '@/charts';

const sparklineData = [
  { label: 'S1', value: 20 },
  { label: 'S2', value: 28 },
  // ...
];

<SparklineTrendChart
  title="Visitas"
  caption="Últimas 8 semanas"
  data={sparklineData}
  lineColor="#34d399"
/>;
```

- Use `lineColor` e `areaColor` para personalizar tanto a linha quanto o gradiente.

## Organização do código

Criamos um arquivo de índice para facilitar os imports:

```ts
// src/charts/index.ts
export * from './InteractiveBarChart';
export * from './MultiSeriesLineChart';
export * from './DonutBreakdownChart';
export * from './SparklineTrendChart';
```

Ao importar usando `@/charts`, verifique se o alias `@` já aponta para a pasta `src` no seu `tsconfig.json` (este projeto já está configurado dessa forma).

## Dica de usabilidade

Todos os gráficos expostos possuem tooltips e animações ativadas por padrão. Caso queira desabilitar algum comportamento, basta clonar o componente e ajustar a partir dos componentes base do `recharts`.

Boas visualizações! 🎉
