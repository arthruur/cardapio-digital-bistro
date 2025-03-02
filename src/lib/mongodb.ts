import { MongoClient, ServerApiVersion } from 'mongodb'

// Use variáveis de ambiente para armazenar a URI com suas credenciais
const uri = process.env.MONGODB_URI || "undefined"

// Cria uma instância do MongoClient com as opções de configuração
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Função para conectar e testar a conexão com o banco
export async function connectToDatabase() {
  try {
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log("Conectado com sucesso ao MongoDB!")
    return client
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error)
    throw error
  }
}
