class Api {
  url = '';
  constructor(url) {
    this.url = url;
  }

  create(data) {
    /* Konverterar datan från input till sträng som servern kan läsa */
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);

    /* Skapar request att skicka till server med rätt innehåll med metoden POST */
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    return (
      fetch(request)
      /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result. Det avkodas med hjälp av metoden 
         json som finns på result-objektet. result.json() är också asynkron */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, 
        där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
         /* Om något i förfrågan eller svaret går fel, fångas det upp i catch, där information om felet skrivs ut till loggen */
        .catch((err) => console.log(err))
    );
  }

  /* Säger åt servern att hämta lista */
  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, 
      där data då alltså är resultatet av den asynkrona metoden result.json(). */
      .then((data) => data)
      /* Om något i förfrågan eller svaret går fel, fångas det upp i catch, där information om felet skrivs ut till loggen */
      .catch((err) => console.log(err));
  }

  /* Skickar vidare mottaget id med DELETE */
  remove(id) {
    /* Log för att se att rätt vara är på väg att tas bort */
    console.log(`Removing item with id ${id}`);

    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      /* Resulterande lista skickas tillbaka */
      .then((result) => result)
      /* Om något i förfrågan eller svaret går fel, fångas det upp i catch, där information om felet skrivs ut till loggen */
      .catch((err) => console.log(err));
  }
}
