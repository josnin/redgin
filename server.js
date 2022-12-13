const fastify = require('fastify')({ logger: true })
const path = require('path');

fastify.register(require('@fastify/static'), {
	  root: path.join(__dirname, 'src'),
	  wildcard: false
})

// Declare route
fastify.get('/*', async (request, reply) => {
	  return await reply.sendFile("index.html");
})

// run server
const start = async () => {
  try {
    await fastify.listen( { port: 5068 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

