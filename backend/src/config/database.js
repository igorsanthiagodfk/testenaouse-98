const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Função para testar a conexão
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma, testConnection };