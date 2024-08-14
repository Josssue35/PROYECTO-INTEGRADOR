// mongoDB.js
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/gameData";  // Asegúrate de que el URI incluya el nombre de la base de datos

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();  // Retorna la instancia de la base de datos para uso directo
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    throw e;  // Lanza el error para manejarlo más arriba si es necesario
  }
}

module.exports = { client, connectDB };
