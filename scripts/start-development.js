
// Este arquivo serve como um wrapper para iniciar o servidor de desenvolvimento Next.js.
// Você pode executá-lo com 'node scripts/start-development.js' ou usando o script 'npm run start-from-file'.

const { spawn } = require('child_process');

console.log('Iniciando o servidor de desenvolvimento Next.js a partir de start-development.js...');

// O comando abaixo é o mesmo que está no script "dev" do seu package.json.
// Usamos 'npx' para garantir que 'next' seja encontrado, mesmo que não esteja instalado globalmente.
const child = spawn('npx', ['next', 'dev', '--turbopack', '-p', '9002'], {
  stdio: 'inherit', // Isso garante que a saída do servidor Next.js (logs, erros) seja mostrada no seu terminal.
  shell: true      // 'shell: true' pode ser útil para compatibilidade entre diferentes sistemas operacionais.
});

child.on('close', (code) => {
  console.log(`Servidor de desenvolvimento Next.js encerrado com código ${code}.`);
});

child.on('error', (err) => {
  console.error('Falha ao iniciar o servidor de desenvolvimento Next.js:', err);
});
