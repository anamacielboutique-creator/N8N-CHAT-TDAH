const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando N8N no Render...');

// Configurações do N8N para produção no Render
process.env.N8N_HOST = '0.0.0.0';
process.env.N8N_PORT = process.env.PORT || '10000';
process.env.N8N_PROTOCOL = 'https';
process.env.WEBHOOK_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'false';
process.env.DB_TYPE = 'sqlite';
process.env.DB_SQLITE_DATABASE = 'database.sqlite';
process.env.N8N_BASIC_AUTH_ACTIVE = 'false';
process.env.N8N_DISABLE_PRODUCTION_MAIN_PROCESS = 'true';

console.log('✅ Variáveis de ambiente configuradas');
console.log(`📡 Host: ${process.env.N8N_HOST}`);
console.log(`🔌 Porta: ${process.env.N8N_PORT}`);
console.log(`🌐 Protocolo: ${process.env.N8N_PROTOCOL}`);

// Iniciar N8N
const n8n = spawn('npx', ['n8n'], {
  stdio: 'inherit',
  env: process.env
});

n8n.on('error', (error) => {
  console.error('❌ Erro ao iniciar N8N:', error);
  process.exit(1);
});

n8n.on('close', (code) => {
  console.log(`🔄 N8N encerrou com código ${code}`);
  if (code !== 0) {
    console.error('❌ N8N falhou');
    process.exit(code);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando N8N...');
  n8n.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, encerrando N8N...');
  n8n.kill('SIGINT');
});

console.log('🎉 N8N está iniciando...');
