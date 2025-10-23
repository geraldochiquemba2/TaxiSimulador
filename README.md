# 🚕 Simulador de Preços de Táxi - Angola

Aplicação web educacional para entender como funcionam os preços dinâmicos em aplicativos de transporte, adaptada para o mercado angolano com valores em **Kwanza (Kz)**.

## 💰 Preços Baseados no Mercado Angolano

Os valores foram calibrados com base em pesquisas do mercado real de táxis em Angola (2025):
- **Bandeirada**: 800-1.800 Kz (dependendo da categoria)
- **Por km**: 700-1.500 Kz/km (dependendo da categoria)
- Valores alinhados com táxis privados em Luanda

## ✨ Funcionalidades

- 🎯 Simulador interativo de preços
- 📊 Visualização detalhada dos fatores que afetam o preço
- 🔄 Comparação de diferentes cenários
- 📈 Gráficos e estatísticas em tempo real
- 🌙 Suporte a modo claro/escuro
- 💵 Moeda em Kwanza Angolana (AOA)

## 🚀 Deploy no Render (Gratuito + Sempre Ativo)

✨ **Sistema de Keep-Alive Nativo** - A aplicação se mantém acordada sozinha, sem precisar de serviços externos!

Siga o guia completo em **[DEPLOY_RENDER.md](./DEPLOY_RENDER.md)** para fazer deploy gratuito no Render e manter a aplicação sempre ativa 24/7.

### Resumo Rápido:

1. **Fazer Push para GitHub**
2. **Conectar no Render** (deploy automático com render.yaml)
3. **Configurar variável `RENDER_EXTERNAL_URL`** (keep-alive automático)
4. **Pronto!** App rodando 24/7 gratuitamente, sem hibernação

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse: http://localhost:5000

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm start        # Rodar produção
npm run check    # Verificar tipos TypeScript
```

## 🏗️ Estrutura do Projeto

```
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   └── lib/         # Utilitários
│
├── server/              # Backend Express
│   ├── index.ts         # Servidor principal
│   └── routes.ts        # Rotas da API
│
├── shared/              # Código compartilhado
│   └── schema.ts        # Schemas Zod
│
└── render.yaml          # Configuração Render
```

## 🔧 Tecnologias

### Frontend
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- Recharts
- Wouter (roteamento)

### Backend
- Node.js
- Express
- TypeScript
- Zod (validação)

## 📊 Fatores que Afetam o Preço

O simulador considera:

- 📍 **Distância** da viagem
- 🚗 **Categoria do veículo** (Econômico, Conforto, Premium, XL)
- ⏰ **Horário** (pico, noturno)
- 🌧️ **Condições climáticas** (chuva e intensidade)
- 🚦 **Trânsito** intenso
- 🎉 **Eventos especiais**
- 📅 **Feriados**
- 📈 **Zonas de demanda** (tarifa dinâmica)

## 📝 Licença

MIT

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**🎓 Projeto Educacional** - Os preços são baseados em dados reais do mercado angolano mas podem variar.
