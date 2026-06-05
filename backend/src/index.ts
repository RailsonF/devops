import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'

// Importa os módulos de rotas
import clientesApp from './routes/clientes'
import favoritosApp from './routes/favoritos'
import loginApp from './routes/login'

const app = new Hono()

// Libera acesso para o Frontend
app.use('*', cors())

// Rota de saúde (Healthcheck)
app.get('/', (c) => c.json({ success: true, message: 'API rodando!' }))

// Toda requisição que chegar em "/clientes" será enviada para o arquivo clientes.ts
app.route('/clientes', clientesApp)

app.route('/favoritos', favoritosApp)

app.route('/login', loginApp)

// Tratamento global de erros não capturados
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message }, err.status)
  }
  return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
})

// Rota 404 genérica
app.notFound((c) => c.json({ success: false, error: 'Rota não encontrada' }, 404))

export default app
