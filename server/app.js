
const express = require('express');
const app = express();
const fs = require('fs/promises');

const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
 
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
   
    next();
  });

app.get('/items', async (req, res) => {
  try {
    const items = await fs.readFile('./items.json');
   
    res.send(JSON.parse(items));
  } catch (error) {
   
    res.status(500).send({ error });
  }
});

app.post('/items', async (req, res) => {
  try {
    const item = req.body;
    const listBuffer = await fs.readFile('./items.json');
    const currentItems = JSON.parse(listBuffer);
   
    let maxItemId = 1;
   
    if (currentItems && currentItems.length > 0) {
      maxItemId = currentItems.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxItemId
      );
    }

    const newItem = { id: maxItemId + 1, ...item };
    const newList = currentItems ? [...currentItems, newItem] : [newItem];
   
    await fs.writeFile('./items.json', JSON.stringify(newList));
   
    res.send(newItem);
  } catch (error) {
   
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/items/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./items.json');
    const currentItems = JSON.parse(listBuffer);
   
    if (currentItems.length > 0) {
      await fs.writeFile(
        './items.json',
        JSON.stringify(currentItems.filter((item) => item.id != id))
      );
     
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
   
    res.status(500).send({ error: error.stack });
  }
});


app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
