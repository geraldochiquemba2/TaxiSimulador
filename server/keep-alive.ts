import cron from 'node-cron';

export function startKeepAlive() {
  // Apenas ativa o keep-alive em produção
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Keep-Alive] Desativado em desenvolvimento');
    return;
  }

  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  
  if (!RENDER_URL) {
    console.log('[Keep-Alive] RENDER_EXTERNAL_URL não configurado');
    return;
  }

  console.log('[Keep-Alive] Iniciado - ping a cada 10 minutos');
  console.log('[Keep-Alive] URL:', RENDER_URL);

  // Faz ping a cada 10 minutos para evitar hibernação (Render hiberna após 15 min)
  cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await fetch(`${RENDER_URL}/health`);
      const data = await response.json();
      
      console.log(`[Keep-Alive] ✓ Ping enviado - Status: ${data.status}, Uptime: ${Math.floor(data.uptime)}s`);
    } catch (error) {
      console.error('[Keep-Alive] ✗ Erro ao fazer ping:', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  });

  // Ping inicial após 1 minuto
  setTimeout(async () => {
    try {
      const response = await fetch(`${RENDER_URL}/health`);
      const data = await response.json();
      console.log(`[Keep-Alive] ✓ Ping inicial - Status: ${data.status}`);
    } catch (error) {
      console.error('[Keep-Alive] ✗ Erro no ping inicial');
    }
  }, 60000);
}
