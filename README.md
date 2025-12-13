
# 🚕 Simulador de Preços de Táxi - Angola

## Mini-Projecto \#1 - Aplicações Web e Modelagem de Preços

### Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC)

### Departamento de Engenharia e Tecnologias

### Licenciatura em Engenharia Informática

### 2025/2026

-----

### 🔗 URL de Acesso

Acesse o simulador interativo em produção aqui:
**[https://simulador-taxi-ao.onrender.com](https://www.google.com/search?q=https://simulador-taxi-ao.onrender.com)**

-----

### 👥 Autores

| Nome Completo | Número de Matrícula | Curso e Instituição |
| :--- | :--- | :--- |
| **Geraldo Abreu Leão Chiquemba** | 20230043 | Engenharia Informática, ISPTEC |
| **Kialenguluka Kialenguluka Tuavile** | 20231633 | Engenharia Informática, ISPTEC |
| **Nvemba Silva** |  | Engenharia Informática, ISPTEC |

-----

## 📋 Descrição do Projecto

Este projeto consiste numa **aplicação web educacional** desenvolvida para simular e visualizar a **modelagem de preços dinâmicos** em serviços de transporte por aplicativo, com foco específico no **mercado angolano**. O objetivo é desmistificar o cálculo de tarifas, permitindo aos utilizadores explorar como múltiplos fatores (distância, categoria, demanda, horário, clima) interagem para determinar o preço final em Kwanza (Kz).

### Problema Modelado

Como calcular, de forma transparente e adaptável, o preço de uma viagem que considera fatores estáticos (Bandeirada, Preço/km) e fatores dinâmicos (Trânsito, Demanda/Surge, Horário de Pico)?

### Solução e Metodologia

O sistema desenvolvido utiliza uma arquitetura **Full-Stack** moderna para:

1.  **Backend (Node/Express):** Implementar a lógica de cálculo de preços baseada em um modelo paramétrico.
2.  **Frontend (React/TypeScript):** Fornecer uma interface interativa para a entrada de fatores e visualização detalhada da composição do preço.
3.  **Dados:** Os parâmetros base (Bandeirada e Preço por km) foram calibrados com base em pesquisas do mercado real de táxis privados em Luanda (2025).

## 💰 Preços Base e Fatores de Modelação

Os valores iniciais foram alinhados com o mercado angolano:

| Parâmetro | Valor Base (Kz) | Fatores de Modelação |
| :--- | :--- | :--- |
| **Bandeirada** | 800 - 1.800 Kz | Categoria do Veículo (Económico, Premium) |
| **Preço por km** | 700 - 1.500 Kz/km | Categoria do Veículo, Horário |
| **Moeda** | Kwanza Angolana (AOA / Kz) | --- |

### 📊 Fatores Dinâmicos no Cálculo

O simulador integra os seguintes fatores para aplicar tarifas dinâmicas (multiplicadores):

  * 📍 **Distância** da viagem
  * 🚗 **Categoria do veículo** (Económico, Conforto, Premium, XL)
  * ⏰ **Horário** (pico, noturno)
  * 🌧️ **Condições climáticas** (chuva e intensidade)
  * 🚦 **Trânsito** intenso
  * 🎉 **Eventos especiais** (multiplicador fixo)
  * 📈 **Zonas de demanda** (tarifa dinâmica / *surge pricing*)

## 🛠️ Tecnologias

| Área | Tecnologia | Função |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript | UI interativa e visualização de dados |
| **Estilo/UI** | TailwindCSS, shadcn/ui | Design responsivo e componentes modernos |
| **Estado/Dados** | TanStack Query, Wouter | Gestão de estado do servidor e roteamento |
| **Visualização** | Recharts | Gráficos e estatísticas em tempo real |
| **Backend** | Node.js, Express, TypeScript | Servidor de API para lógica de cálculo |
| **Validação** | Zod | Validação de *schemas* e tipos de dados |

## 📁 Estrutura do Projecto

```
/simulador-taxi-ao
│
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React (formulário, resultados, gráficos)
│   │   ├── pages/       # Páginas principais
│   │   └── lib/         # Utilitários e constantes de cálculo
│
├── server/              # Backend Express (Lógica de Preços)
│   ├── index.ts         # Servidor principal (ponto de entrada)
│   └── routes.ts        # Rotas da API de cálculo
│
├── shared/              # Código compartilhado entre cliente/servidor
│   └── schema.ts        # Schemas Zod para validação
│
└── render.yaml          # Configuração de Deploy para Render
```

## 🚀 Instalação e Configuração

### Pré-requisitos

  * Node.js 18+
  * npm ou yarn

### 💻 Desenvolvimento Local

1.  **Instalar Dependências:**
    ```bash
    # Instalar dependências (tanto para client como para server)
    npm install
    ```
2.  **Rodar em Modo Desenvolvimento:**
    ```bash
    # Inicia o servidor backend e o servidor de desenvolvimento do React
    npm run dev
    ```
    Acesse: `http://localhost:5000`

### Scripts Disponíveis

| Script | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento e o frontend. |
| `npm run build` | Cria o *build* para produção. |
| `npm start` | Inicia o servidor Node.js em modo de produção. |
| `npm run check` | Verifica tipos TypeScript (`tsc`). |

## 🌐 Deploy (Render)

Este projeto está configurado para **Deploy Contínuo e Gratuito** na plataforma **Render**, utilizando o `render.yaml` e um sistema de **Keep-Alive Nativo** para manter a aplicação sempre ativa (24/7).

Siga o guia completo em **`DEPLOY_RENDER.md`** para o procedimento, que inclui:

1.  Fazer `Push` para o GitHub.
2.  Conectar no Render (deploy automático com `render.yaml`).
3.  Configurar a variável `RENDER_EXTERNAL_URL` (para o sistema de *keep-alive*).

## 🤝 Contribuições

Contribuições são bem-vindas\! Sinta-se à vontade para abrir *issues* ou *pull requests* para melhorias no modelo de cálculo, calibração de preços ou novas funcionalidades.

## 📝 Licença

MIT

-----

**🎓 Nota Educacional:** Os preços são baseados em dados reais do mercado angolano mas representam uma **simulação** e podem variar na prática.

-----
