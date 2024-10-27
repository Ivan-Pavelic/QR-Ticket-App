UPUTE za korištenje aplikacije:

1. Adresa početne stranice aplikacije: https://qr-ticket-app-xrrj.onrender.com

2. Pomoću alata Postman
   2.1. POST metodom na URL: https://dev-0srhhjpvz51rz8el.us.auth0.com/oauth/token poslati:
         {
            "client_id": <CLIENT ID>,         // ZAMIJENITI PRAVOM VRIJEDNOŠĆU
            "client_secret": <CLIENT SECRET>, // ZAMIJENITI PRAVOM VRIJEDNOŠĆU
            "audience": "https://qr-ticket-app/api",
            "grant_type": "client_credentials"
          }
   2.2. Kopirati sadržaj "access_token" varijable iz Response
   2.3. POST metodom na URL: https://qr-ticket-app-xrrj.onrender.com/tickets poslati:
         Prije slanja dodati u Headers varijablu Authorization sa vrijednošću: "Bearer <ACCESS_TOKEN>"
         {
            "vatin": "OIB",        // ZAMIJENITI PRAVOM VRIJEDNOŠĆU
            "firstName": "IME",    // ZAMIJENITI PRAVOM VRIJEDNOŠĆU
            "lastName": "PREZIME"  // ZAMIJENITI PRAVOM VRIJEDNOŠĆU
          }
   2.4. Skenirati QR kod koji je prikazan u Response (tab Preview)

3. Prijaviti se s podacima za prijavu kako bi se mogla otvoriti stranica s Detaljima ulaznice:
   Email: test@example.com
   Lozinka: Test1234!
