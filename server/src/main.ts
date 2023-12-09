import { server } from './utils/server';

async function main() {
  const app = await server();

  await app.listen({
    port: 3000,
    host: '0.0.0.0'
  });
}
main();