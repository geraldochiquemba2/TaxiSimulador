# 🚀 Deploy no Render (Gratuito + Sem Hibernação)

Este guia mostra como fazer deploy da aplicação no Render de forma **100% gratuita** e manter ela **sempre ativa** (sem hibernação).

✨ **A aplicação possui sistema de keep-alive NATIVO** que se mantém acordada automaticamente, sem precisar de serviços externos!

## 📋 Pré-requisitos

1. Conta no GitHub
2. Conta no Render (gratuita): https://render.com

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

## 🔄 Passo 3: Configurar Variável de Ambiente (Keep-Alive Automático)

A aplicação possui um sistema **nativo de keep-alive** que se mantém acordada sozinha! Você só precisa configurar uma variável de ambiente:

### Configuração:

1. No dashboard do Render, acesse seu web service
2. Vá em **"Environment"** no menu lateral
3. Adicione a variável:
   - **Key**: `RENDER_EXTERNAL_URL`
   - **Value**: Cole a URL do seu app (ex: `https://simulador-preco-taxi-angola.onrender.com`)
4. Clique em **"Save Changes"**
5. O app vai fazer redeploy automaticamente

### ✅ Como Funciona

A aplicação faz ping em si mesma a cada 10 minutos usando `node-cron`:
- ✅ Evita hibernação após 15 minutos
- ✅ Totalmente automático
- ✅ Não precisa de serviços externos
- ✅ Logs no console para acompanhar

### Verificar nos Logs

Após configurar, você verá mensagens assim nos logs:
```
[Keep-Alive] Iniciado - ping a cada 10 minutos
[Keep-Alive] ✓ Ping inicial - Status: ok
[Keep-Alive] ✓ Ping enviado - Status: ok, Uptime: 600s
```

### ✅ Pronto!

Agora sua aplicação:
- ✅ Está rodando 24/7 no Render
- ✅ Não hiberna (keep-alive automático)
- ✅ Totalmente gratuito
- ✅ Com 750 horas/mês gratuitas (suficiente para 24/7)
- ✅ Sem dependências externas

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
- Com o keep-alive configurado, isso não acontece mais

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
- Verifique se a variável `RENDER_EXTERNAL_URL` está configurada corretamente
- Veja os logs no Render - deve aparecer `[Keep-Alive] Iniciado`
- Confirme que a URL não tem `/` no final (ex: `https://seu-app.onrender.com` ✓)
- Aguarde 10 minutos e verifique se aparecem mensagens de ping nos logs

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
