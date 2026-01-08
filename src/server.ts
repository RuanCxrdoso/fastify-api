import { app } from './app.js'
import { env } from './env.js'

// Somente o listen aqui pois tive que mover todo o código referente 
// aos plugins para o arquivo app.ts, para poder importar a instância 
// do fastify dentro dos testes tem que ele tente executar o servidor.

app
  .listen({
    port: env.PORT,
    host: ('RENDER' in process.env) ? '0.0.0.0' : 'localhost',
  }).then(() => {
    console.log('HTTP Server is Running!')
  })
