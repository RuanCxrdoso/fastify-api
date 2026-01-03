import fastify from "fastify";

const app = fastify();

app.get('/users', () => {
  return 'Hello World'
})

app.listen({
  port: 3333
}).then(() => {
  console.log('HTTP Server is Running!')
})