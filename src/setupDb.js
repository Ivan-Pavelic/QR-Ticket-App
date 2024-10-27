require('dotenv').config();
const db = require('./db');

const createTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS tickets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vatin VARCHAR(20) NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(queryText);
  console.log("Tablica 'tickets' je kreirana ili već postoji.");
};

createTable().catch(console.error);