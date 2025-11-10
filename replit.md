# Simulador de Preços de Táxi

Um aplicativo interativo e visualmente impressionante para simular preços de corridas de táxi baseado em diferentes cenários e condições.

## 📋 Visão Geral

Este simulador permite que usuários explorem como diversos fatores afetam o preço de uma corrida de táxi em tempo real:
- Distância da corrida
- Tipo de veículo (Econômico, Conforto, Premium, XL)
- Hora do dia e horário de pico
- Condições climáticas (chuva e intensidade)
- Intensidade do trânsito
- Eventos especiais e feriados
- Zonas de tarifa dinâmica (surge pricing)

## 🎨 Características

### Interface Intuitiva
- **Controles Deslizantes**: Para distância, hora do dia, intensidade de chuva e trânsito
- **Toggles**: Para horário de pico, feriados, chuva e eventos especiais
- **Presets de Cenários**: Configurações rápidas para situações comuns (segunda de manhã, sexta à noite chovendo, etc.)
- **Layout Responsivo**: Otimizado para desktop, tablet e mobile

### Visualizações em Tempo Real
- **Card de Preço Principal**: Exibe o preço total com badges de surge e comparação com tarifa base
- **Breakdown Detalhado**: Mostra como cada fator contribui para o preço final com indicadores visuais de impacto
- **Gráfico Comparativo**: Visualização interativa comparando o cenário atual com variações

### Design
- Cores inspiradas em apps de táxi (amarelo vibrante como cor primária)
- Animações suaves e feedback visual imediato
- Estados de carregamento elegantes
- Tratamento de erros com mensagens amigáveis

## 🛠️ Tecnologias

### Frontend
- **React** com TypeScript
- **Tailwind CSS** para estilização
- **Shadcn UI** para componentes
- **React Query** para gerenciamento de estado e cache
- **Recharts** para visualização de dados
- **Wouter** para roteamento

### Backend
- **Express.js** para API
- **Zod** para validação de schemas
- **TypeScript** para type safety

## 📁 Estrutura do Projeto

```
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── simulator.tsx          # Página principal
│   │   ├── components/
│   │   │   ├── price-card.tsx         # Card de preço principal
│   │   │   ├── price-breakdown.tsx    # Breakdown detalhado
│   │   │   └── comparison-chart.tsx   # Gráfico comparativo
│   │   └── App.tsx
├── server/
│   ├── routes.ts                      # Endpoint de cálculo de preço
│   └── storage.ts                     # (não utilizado - app não persiste dados)
├── shared/
│   └── schema.ts                      # Schemas TypeScript compartilhados
└── design_guidelines.md               # Diretrizes de design
```

## 🔧 API

### POST /api/calculate-price

Calcula o preço de uma corrida baseado nos parâmetros fornecidos.

**Request Body:**
```typescript
{
  distance: number;           // 0-100 km
  vehicleType: "economy" | "comfort" | "premium" | "xl";
  hour: number;              // 0-23
  isRushHour: boolean;
  isHoliday: boolean;
  hasRain: boolean;
  weatherSeverity: number;   // 0-100
  trafficIntensity: number;  // 0-100
  hasSpecialEvent: boolean;
  surgeZone: "none" | "low" | "medium" | "high";
}
```

**Response:**
```typescript
{
  totalPrice: number;
  baseFare: number;
  breakdown: Array<{
    label: string;
    value: number;
    multiplier?: number;
    impact: "low" | "medium" | "high";
  }>;
  surgeMultiplier: number;
  percentageChange: number;
}
```

## 🧮 Algoritmo de Precificação

O algoritmo considera múltiplos fatores:

1. **Tarifa Base**: Varia por tipo de veículo
   - Econômico: 500 Kz + 180 Kz/km
   - Conforto: 800 Kz + 250 Kz/km
   - Premium: 1200 Kz + 380 Kz/km
   - XL: 1000 Kz + 280 Kz/km

2. **Multiplicadores de Tempo**:
   - Horário de Pico: +35%
   - Tarifa Noturna (0h-6h): +20%
   - Feriado: +25%

3. **Fatores Climáticos**:
   - Chuva: até +40% baseado na intensidade

4. **Trânsito**:
   - Intensidade >30%: até +50% adicional

5. **Eventos Especiais**: +30%

6. **Tarifa Dinâmica (Surge)**:
   - Baixa: 1.2x
   - Média: 1.5x
   - Alta: 2.0x

## 🚀 Como Usar

1. Acesse a aplicação
2. Ajuste os parâmetros usando os controles:
   - Use os sliders para distância, hora, intensidade de chuva e trânsito
   - Ative/desative toggles para cenários especiais
   - Selecione tipo de veículo e zona de surge
3. Observe o preço sendo atualizado em tempo real
4. Explore os presets para cenários comuns
5. Analise o breakdown detalhado e o gráfico comparativo
6. Use o botão "Resetar" para voltar aos valores padrão

## 📊 Cenários de Exemplo

- **Tarde Tranquila**: 10km, econômico, sem fatores extras → ~2.300 Kz
- **Horário de Pico**: +35% no preço
- **Chuva Forte + Evento**: Pode dobrar ou triplicar o preço
- **Premium em Zona de Alta Demanda**: 5-10x o preço base

## ⚠️ Aviso

Este é um simulador educacional. Os preços calculados não refletem tarifas reais de aplicativos de táxi comerciais. A metodologia é baseada em análise de fatores comuns de precificação dinâmica para fins ilustrativos.

## 🔄 Estado do Projeto

**Status**: ✅ MVP Completo e Testado

Todas as funcionalidades principais foram implementadas e testadas:
- ✅ Interface completa com todos os controles
- ✅ Cálculo de preço em tempo real
- ✅ Breakdown detalhado de fatores
- ✅ Gráfico de comparação
- ✅ Presets de cenários
- ✅ Estados de carregamento e erro
- ✅ Layout responsivo
- ✅ Testes end-to-end passando

## 🎯 Próximas Melhorias (Futuro)

- Adicionar mais tipos de veículos (elétricos, motos)
- Implementar mapa interativo para visualizar rotas
- Salvar e comparar múltiplos cenários
- Exportar relatórios em PDF
- Adicionar mais cidades com tarifas regionais
- Histórico de simulações
