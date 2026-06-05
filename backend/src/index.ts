import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Importa os módulos de rotas
import clientesApp from './routes/clientes'
import favoritosApp from './routes/favoritos'
import loginApp from './routes/login'

const app = new Hono()

// Libera acesso para o Frontend
app.use('*', cors())

// Rota de saúde (Healthcheck)
app.get('/', (c) => c.json({ mensagem: 'API rodando!' }))

// Toda requisição que chegar em "/clientes" será enviada para o arquivo clientes.ts
app.route('/clientes', clientesApp)

app.route('/favoritos', favoritosApp)

app.route('/login', loginApp)

export default app