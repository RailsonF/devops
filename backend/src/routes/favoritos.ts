import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const favoritosApp = new Hono<{ Bindings: Bindings }>()

// ==========================================
// ROTAS DE FAVORITOS
// ==========================================

// 1. Adicionar Favorito (POST /)
favoritosApp.post('/', async (c) => {
  const { cliente_id, produto_id } = await c.req.json()

  if (!cliente_id || !produto_id) {
    return c.json({ success: false, error: 'ID do cliente e ID do produto são obrigatórios' }, 400)
  }

  try {
    // Consumir API Externa
    const response = await fetch(`https://fakestoreapi.com/products/${produto_id}`)

    // A Fake Store API retorna texto vazio ou 'null' se o ID do produto não existir
    if (!response.ok) {
      return c.json({ success: false, error: 'Produto não encontrado na API externa' }, 404)
    }

    const produto = await response.json() as any

    if (!produto || Object.keys(produto).length === 0) {
      return c.json({ success: false, error: 'Produto não encontrado na API externa' }, 404)
    }

    // Extrai os dados exatos do produto
    const titulo = produto.title
    const imagem = produto.image
    const preco = produto.price
    const avaliacao = produto.rating?.rate || null // Se existir review, pega a nota, senão null

    // Salva no banco D1 local
    const { success } = await c.env.DB.prepare(
      `INSERT INTO favoritos (ID_CLIENTE, ID_PRODUTO, TITULO, IMAGEM, PRECO, AVALIACAO) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(cliente_id, produto_id, titulo, imagem, preco, avaliacao).run()

    if (success) {
      return c.json({ success: true, message: 'Produto adicionado aos favoritos!' }, 201)
    }

    return c.json({ success: false, error: 'Erro ao salvar favorito' }, 500)
  } catch (error: any) {
    // Trata a regra de não permitir produto duplicado para o mesmo cliente
    if (error.message?.includes('UNIQUE') || error.message?.includes('constraint')) {
      return c.json({ success: false, error: 'Este produto já está nos favoritos' }, 400)
    }
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

// 2. Listar Favoritos do Cliente (GET /:clienteId)
favoritosApp.get('/:clienteId', async (c) => {
  const clienteId = Number(c.req.param('clienteId'))

  if (isNaN(clienteId)) {
    return c.json({ success: false, error: 'ID do cliente inválido' }, 400)
  }

  try {
    const { results } = await c.env.DB.prepare(
      `SELECT ID, TITULO, IMAGEM, PRECO, AVALIACAO 
       FROM favoritos 
       WHERE ID_CLIENTE = ? 
       ORDER BY CRIADO_EM DESC`
    ).bind(clienteId).all()

    return c.json({ success: true, data: results })
  } catch {
    return c.json({ success: false, error: 'Erro ao buscar favoritos' }, 500)
  }
})

// 3. Remover Favorito (DELETE /:id)
favoritosApp.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  if (isNaN(id)) {
    return c.json({ success: false, error: 'ID do favorito inválido' }, 400)
  }

  try {
    const { success } = await c.env.DB.prepare(
      `DELETE FROM favoritos WHERE ID = ?`
    ).bind(id).run()

    if (success) {
      return c.json({ success: true, message: 'Favorito removido com sucesso!' })
    }

    return c.json({ success: false, error: 'Favorito não encontrado' }, 404)
  } catch {
    return c.json({ success: false, error: 'Erro interno do servidor' }, 500)
  }
})

export default favoritosApp
