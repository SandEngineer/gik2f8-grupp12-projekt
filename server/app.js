/* Importrerar nodemodulen express */
const express = require('express');
/* Skapar upp ett express-objekt, som i stort representerar en webbserver */
const app = express();
/* Importerar den inbyggda modulen fs */
const fs = require('fs/promises');

const PORT = 5000;
/* Expressobjektet, kallat app, har metoden "use" som används för att sätta inställningar hos vår server */
app
  /* Säger till att vi använder Express */
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
 
  /* Tillåter åtkomst från alla adresser */
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
   
    next();
  });

/* Läser in json-filen och skickar tillbaka innehållet */
app.get('/items', async (req, res) => {
  try {
    const items = await fs.readFile('./items.json');
   
    res.send(JSON.parse(items));
  } catch (error) {
    /* Om annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet */
    res.status(500).send({ error });
  }
});

/* Skriver mottagen data till fil */
app.post('/items', async (req, res) => {
  try {
    /* Sparar mottagen data-body i variabel */
    const item = req.body;
    /* Läser in filen till variabel */
    const listBuffer = await fs.readFile('./items.json');
    /* Parsear innehållet */
    const currentItems = JSON.parse(listBuffer);
   
    let maxItemId = 1;
   
    /* Förutsatt att filen har innehåll, jämför varje elements id från listan med nuvarande högsta id (maxId)
    Det som är högst av de två sätts som maxItemId för att beräkna nytt id för nya element */
    if (currentItems && currentItems.length > 0) {
      maxItemId = currentItems.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxItemId
      );
    }

    /* Ge nya list items ett id som är ett högre än maxItemId */
    const newItem = { id: maxItemId + 1, ...item };
    /* Lägg ihop inläst lista med nya list items, eller lägg bara in det nya om den är tom */
    const newList = currentItems ? [...currentItems, newItem] : [newItem];
   
    /* Skriv till fil */
    await fs.writeFile('./items.json', JSON.stringify(newList));
   
    /* Skicka tillbaka */
    res.send(newItem);
  } catch (error) {
    /* Om annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet */
    res.status(500).send({ error: error.stack });
  }
});

/* Tar bort list item för mottaget id */
app.delete('/items/:id', async (req, res) => {
  console.log(req);
  try {
    /* Spara mottaget id till variabel */
    const id = req.params.id;
    /* Läst in existerande lista */
    const listBuffer = await fs.readFile('./items.json');
    const currentItems = JSON.parse(listBuffer);
   
    /* Om listan har innehåll, skriv ny lista till fil */
    if (currentItems.length > 0) {
      await fs.writeFile(
        './items.json',
        /* Skriv ner items vad id INTE matchar det mottagna id:t till fil;  */
        JSON.stringify(currentItems.filter((item) => item.id != id))
      );
      /* När den nya listan skrivits till fil skickas ett success-response */
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      /* Om det inte fanns något i filen sedan tidigare skickas statuskod 404, "not found" */
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    /* Om annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet */
    res.status(500).send({ error: error.stack });
  }
});

/* Med app.listen säger man åt servern att starta. Första argumentet är port (det portnummer man vill att servern ska köra på, här sätts det till 5000).
   Andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs ett 
   meddelande ut som säger att servern kör. Man får feedback på att allt körts igång som det skulle. */
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
