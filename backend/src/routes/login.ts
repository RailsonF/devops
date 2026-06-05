/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
}

const loginApp = new Hono<{ Bindings: Bindings }>()

loginApp.post('/', async (c) => {
  try {
    const { email, senha } = await c.req.json()

    if (!email || !senha) {
      return c.json({ success: false, error: 'E-mail e senha são obrigatórios' }, 400)
    }

    const { results } = await c.env.DB.prepare(
      `SELECT ID_CLIENTE, SENHA FROM clientes WHERE EMAIL = ?`
    ).bind(email).all() as { results: { ID_CLIENTE: number; SENHA: string }[] }

    if (results.length === 0) {
      return c.json({ success: false, error: 'E-mail ou senha inválidos' }, 401)
    }

    const usuario = results[0]
    const senhaValida = await bcrypt.compare(senha, usuario.SENHA)

    if (!senhaValida) {
      return c.json({ success: false, error: 'E-mail ou senha inválidos' }, 401)
    }

    return c.json({ success: true, data: { id: usuario.ID_CLIENTE } })
  } catch {
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

export default loginApp
