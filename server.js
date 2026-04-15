const Fastify = require('fastify')
const cors = require('@fastify/cors')

const app = Fastify()

app.register(cors, { origin: true })

app.get('/', async () => {
  return { status: 'ok' }
})

app.post('/api/recommend', async () => {
  return {
    results: [
      { name: "Top Place", rating: 4.9 },
      { name: "Best Choice", rating: 4.8 }
    ]
  }
})

app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
