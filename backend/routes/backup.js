const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { client, connectDB } = require('../models/mongoDB'); // Asegúrate de importar MongoDB

router.post('/backup', async (req, res) => {
  const DB_USER = "postgres";
  const DB_HOST = "localhost";
  const DB_DATABASE = "clickalm";
  const DB_PASSWORD = "puce";
  const DB_PORT = "5432";
  const BACKUP_DIR = "/ruta/donde/guardar/respaldo"; // Cambia esto a tu ruta deseada
  const BACKUP_NAME = `clickalm-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
  const BACKUP_PATH = `${BACKUP_DIR}/${BACKUP_NAME}`;

  // Exportar la contraseña para no tener que ingresarla manualmente
  process.env.PGPASSWORD = DB_PASSWORD;

  // Crear el comando pg_dump
  const dumpCommand = `pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -F c -b -v -f ${BACKUP_PATH} ${DB_DATABASE}`;

  exec(dumpCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al crear el respaldo: ${error.message}`);
      return res.status(500).json({ message: 'Error al crear el respaldo de PostgreSQL.' });
    }

    console.log(`Respaldo creado con éxito: ${BACKUP_PATH}`);

    // Conectar a MongoDB y registrar la operación
    try {
      await connectDB();
      const db = client.db("backupData");
      const backupLogsCollection = db.collection("backup_logs");

      await backupLogsCollection.insertOne({
        database: DB_DATABASE,
        backup_file: BACKUP_NAME,
        backup_path: BACKUP_PATH,
        timestamp: new Date(),
        status: 'successful'
      });

      res.status(200).json({ message: 'Respaldo creado y registrado en MongoDB con éxito.' });
    } catch (mongoError) {
      console.error('Error al registrar en MongoDB:', mongoError.message);
      res.status(500).json({ message: 'Respaldo creado, pero falló el registro en MongoDB.' });
    }
  });
});

module.exports = router;
