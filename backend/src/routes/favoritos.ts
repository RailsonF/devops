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
    console.log("passou aqui 1")
    const { cliente_id, produto_id } = await c.req.json()
    console.log("passou aqui 2")
    if (!cliente_id || !produto_id) {
        return c.json({ erro: 'ID do cliente e ID do produto são obrigatórios' }, 400 as const)
    }

    try {
        // Consumir API Externa 
        const response = await fetch(`https://fakestoreapi.com/products/${produto_id}`)
        console.log("A api retornou:", response)
        // A Fake Store API retorna texto vazio ou 'null' se o ID do produto não existir
        if (!response.ok) {
            return c.json({ erro: 'Erro ao consultar a Fake Store API' }, 500 as const)
        }

        const produto = await response.json() as any

        if (!produto || Object.keys(produto).length === 0) {
            return c.json({ erro: 'O produto informado não existe na API externa' }, 404 as const)
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
            return c.json({ mensagem: 'Produto adicionado aos favoritos com sucesso!' }, 201 as const)
        }

        return c.json({ erro: 'Erro ao salvar favorito no banco' }, 500 as const)

    } catch (error: any) {
        console.error("Erro nos favoritos:", error.message)

        //  Trata a regra de não permitir produto duplicado para o mesmo cliente
        if (error.message.includes('UNIQUE') || error.message.includes('constraint')) {
            return c.json({ erro: 'Este produto já está na lista de favoritos deste cliente' }, 400 as const)
        }

        return c.json({ erro: 'Erro interno no servidor', motivo: error.message }, 500 as const)
    }
})

// 2. Listar Favoritos do Cliente (GET /:clienteId)
favoritosApp.get('/:clienteId', async (c) => {
    const clienteId = Number(c.req.param('clienteId'))

    if (isNaN(clienteId)) {
        return c.json({ erro: 'ID do cliente inválido.' }, 400 as const)
    }

    try {
        const { results } = await c.env.DB.prepare(
            `SELECT ID, TITULO, IMAGEM, PRECO, AVALIACAO 
       FROM favoritos 
       WHERE ID_CLIENTE = ? 
       ORDER BY CRIADO_EM DESC`
        ).bind(clienteId).all()

        return c.json(results)

    } catch (error: any) {
        return c.json({ erro: 'Erro ao buscar favoritos', detalhe: error.message }, 500 as const)
    }
})

// 3. Remover Favorito (DELETE /:id)
favoritosApp.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
        return c.json({ erro: 'ID do favorito inválido.' }, 400 as const)
    }

    try {
        const { success } = await c.env.DB.prepare(
            `DELETE FROM favoritos WHERE ID = ?`
        ).bind(id).run()

        if (success) {
            return c.json({ mensagem: 'Favorito removido com sucesso!' })
        }
        return c.json({ erro: 'Favorito não encontrado' }, 404 as const)

    } catch (error: any) {
        return c.json({ erro: 'Erro ao remover favorito', detalhe: error.message }, 500 as const)
    }
})

export default favoritosApp