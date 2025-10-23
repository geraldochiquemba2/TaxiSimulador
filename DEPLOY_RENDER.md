# 🚀 Deploy no Render (Gratuito + Sem Hibernação)

Este guia mostra como fazer deploy da aplicação no Render de forma **100% gratuita** e manter ela **sempre ativa** (sem hibernação).

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta no Render (gratuita): https://render.com
3. Conta no UptimeRobot (gratuita): https://uptimerobot.com

---

## 🔧 Passo 1: Preparar o Repositório GitHub

1. Crie um repositório no GitHub
2. Faça push do código para o GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

---

## 🌐 Passo 2: Fazer Deploy no Render

### Opção A: Deploy Automático (com render.yaml)

1. Acesse https://render.com e faça login
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o arquivo `render.yaml`
5. Clique em **"Apply"**
6. Aguarde o deploy finalizar (5-10 minutos)

### Opção B: Deploy Manual

1. Acesse https://render.com e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `simulador-preco-taxi-angola`
   - **Region**: Frankfurt (ou Oregon)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
   - **Health Check Path**: `/health`
5. Clique em **"Create Web Service"**
6. Aguarde o deploy finalizar

---

## 🔄 Passo 3: Configurar UptimeRobot (Manter App Sempre Ativa)

O plano gratuito do Render hiberna apps após 15 minutos de inatividade. O UptimeRobot faz "ping" na sua aplicação a cada 5 minutos para mantê-la acordada.

### Configuração:

1. Acesse https://uptimerobot.com e crie uma conta gratuita
2. No dashboard, clique em **"+ Add New Monitor"**
3. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Simulador Taxi Angola`
   - **URL**: `https://SEU-APP.onrender.com/health`
     - _(Substitua pelo URL real do seu app no Render)_
   - **Monitoring Interval**: **5 minutes**
4. Clique em **"Create Monitor"**

### ✅ Pronto!

Agora sua aplicação:
- ✅ Está rodando 24/7 no Render
- ✅ Não hiberna (UptimeRobot mantém ativa)
- ✅ Totalmente gratuito
- ✅ Com 750 horas/mês gratuitas (suficiente para 24/7)

---

## 🔍 Verificar Status

### Endpoint de Health
Visite: `https://SEU-APP.onrender.com/health`

Você deve ver:
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T22:30:00.000Z",
  "uptime": 12345.67
}
```

### Logs no Render
1. Acesse seu dashboard no Render
2. Clique no seu web service
3. Vá em **"Logs"** para ver os logs em tempo real

---

## 🌍 URL da Aplicação

Após o deploy, sua aplicação estará disponível em:
```
https://SEU-APP.onrender.com
```

---

## 💡 Dicas Importantes

### ⚡ Cold Starts
- Na primeira visita após inatividade, pode demorar 25-50 segundos para "acordar"
- Com UptimeRobot configurado, isso não acontece

### 📊 Limites do Plano Gratuito
- **750 horas/mês** (31.25 dias = suficiente para 24/7)
- **512 MB RAM**
- **0.1 CPU**
- Builds ilimitados

### 🔐 Variáveis de Ambiente
Se precisar adicionar variáveis de ambiente:
1. No dashboard do Render, vá em seu web service
2. **Environment** → **Add Environment Variable**

---

## 🆘 Problemas Comuns

### App ainda está hibernando
- Verifique se o UptimeRobot está ativo e fazendo pings
- Confirme que o intervalo está em **5 minutos**
- Verifique se a URL está correta: `https://SEU-APP.onrender.com/health`

### Build falhou
- Verifique os logs no Render
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm run build` localmente para testar

### App não carrega
- Verifique se o endpoint `/health` retorna status 200
- Veja os logs no Render para identificar erros

---

## 📞 Suporte

- Documentação Render: https://render.com/docs
- Comunidade Render: https://community.render.com
- UptimeRobot Docs: https://uptimerobot.com/help/

---

**🎉 Parabéns! Sua aplicação está no ar gratuitamente e sem hibernação!**
