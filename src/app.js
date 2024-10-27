require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

app.use(auth(config));
app.use(express.json());

app.get('/', async (req, res) => {
   try {
     const result = await db.query('SELECT COUNT(*) FROM tickets');
     const ticketCount = result.rows[0].count;
     res.send(`Broj dosad generiranih ulaznica: ${ticketCount}`);
   } catch (error) {
     console.error(error);
     res.status(500).send('Došlo je do greške prilikom učitavanja broja ulaznica.');
   }
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});

app.post('/tickets', async (req, res) => {
   const { vatin, firstName, lastName } = req.body;
   if (!vatin || !firstName || !lastName) {
     return res.status(400).send('Nedostaju potrebni podaci (vatin, firstName, lastName).');
   }
 
   try {
     const checkTicketCount = await db.query(
       'SELECT COUNT(*) FROM tickets WHERE vatin = $1',
       [vatin]
     );
 
     if (parseInt(checkTicketCount.rows[0].count) >= 3) {
       return res.status(400).send('Već su generirane 3 ulaznice za ovaj OIB.');
     }
 
     const ticketId = uuidv4();
     await db.query(
       'INSERT INTO tickets (id, vatin, first_name, last_name) VALUES ($1, $2, $3, $4)',
       [ticketId, vatin, firstName, lastName]
     );
 
     const ticketUrl = `http://localhost:${PORT}/tickets/${ticketId}`;
     const qrCodeImage = await QRCode.toDataURL(ticketUrl);
 
     res.status(201).send(`<img src="${qrCodeImage}" alt="QR Code" />`);
   } catch (error) {
     res.status(500).send('Došlo je do greške prilikom generiranja ulaznice.');
   }
});

app.get('/tickets/:id', requiresAuth(), async (req, res) => {
   const { id } = req.params;
   try {
     const result = await db.query('SELECT * FROM tickets WHERE id = $1', [id]);
     const ticket = result.rows[0];
     if (!ticket) {
       return res.status(404).send('Ulaznica nije pronađena.');
     }
 
     res.send(`
       <h1>Detalji ulaznice</h1>
       <p>OIB: ${ticket.vatin}</p>
       <p>Ime: ${ticket.first_name}</p>
       <p>Prezime: ${ticket.last_name}</p>
       <p>Vrijeme kreiranja: ${ticket.created_at}</p>
       <p>Prijavljeni korisnik: ${req.oidc.user.name}</p>
     `);
   } catch (error) {
     console.error(error);
     res.status(500).send('Došlo je do greške prilikom dohvaćanja podataka o ulaznici.');
   }
});