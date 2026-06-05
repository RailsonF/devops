/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'

// Tipagem do banco para o TypeScript não reclamar
type Bindings = {
  DB: D1Database
}

// Cria uma "mini-instância" do Hono só para essa rota
const clientesApp = new Hono<{ Bindings: Bindings }>()

// 1. Cadastrar Cliente (POST /)
clientesApp.post('/', async (c) => {
  const { nome, email, senha } = await c.req.json()

  if (!nome || !email || !senha) {
    return c.json({ success: false, error: 'Nome, e-mail e senha são obrigatórios' }, 400)
  }

  try {
    const hash = await bcrypt.hash(senha, 10)
    const { success } = await c.env.DB.prepare(
      `INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)`
    ).bind(nome, email, hash).run()

    if (success) {
      return c.json({ success: true, message: 'Cliente cadastrado com sucesso!' }, 201)
    }
    return c.json({ success: false, error: 'Erro ao cadastrar cliente' }, 500)
  } catch (error: any) {
    // Se o e-mail já existir no banco
    if (error.message?.includes('UNIQUE') || error.message?.includes('constraint')) {
      return c.json({ success: false, error: 'E-mail já cadastrado' }, 400)
    }
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

// 2. Listar Clientes (GET /)
clientesApp.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM clientes ORDER BY criado_em DESC`
    ).all()

    return c.json({ success: true, data: results })
  } catch {
    return c.json({ success: false, error: 'Erro ao buscar clientes' }, 500)
  }
})

// 3. Editar Cliente (PUT /:id)
clientesApp.put('/:id', async (c) => {
  // 1. Tratativa do ID: Garante que é um número válido
  const id = Number(c.req.param('id'))

  if (isNaN(id)) {
    return c.json({ success: false, error: 'ID inválido' }, 400)
  }

  // 2. Tratativa dos dados de entrada
  const { nome, email, senha } = await c.req.json()

  if (!nome || !email) {
    return c.json({ success: false, error: 'Nome e e-mail são obrigatórios' }, 400)
  }

  // 3. Tratativa do Banco de Dados com Try/Catch
  try {
    let query = `UPDATE clientes SET nome = ?, email = ?`
    const params: any[] = [nome, email]

    // Se uma nova senha foi enviada, faz o hash e atualiza também
    if (senha) {
      const hash = await bcrypt.hash(senha, 10)
      query += `, senha = ?`
      params.push(hash)
    }

    query += ` WHERE ID_CLIENTE = ?`
    params.push(id)

    const { success } = await c.env.DB.prepare(query).bind(...params).run()

    if (success) {
      return c.json({ success: true, message: 'Cliente atualizado com sucesso!' })
    }

    return c.json({ success: false, error: 'Cliente não encontrado' }, 404)
  } catch (error: any) {
    // Se o usuário tentar mudar o e-mail para um que já pertence a OUTRO cliente
    if (error.message?.includes('UNIQUE') || error.message?.includes('constraint')) {
      return c.json({ success: false, error: 'Este e-mail já está em uso' }, 400)
    }
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

// 4. Remover Cliente (DELETE /:id)
clientesApp.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  if (isNaN(id)) {
    return c.json({ success: false, error: 'ID inválido' }, 400)
  }

  try {
    const { success } = await c.env.DB.prepare(
      `DELETE FROM clientes WHERE ID_CLIENTE = ?`
    ).bind(id).run()

    if (success) {
      return c.json({ success: true, message: 'Cliente removido com sucesso!' })
    }

    return c.json({ success: false, error: 'Cliente não encontrado' }, 404)
  } catch {
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

// Comentário para forçar o deploy na Cloudflare
export default clientesApp
