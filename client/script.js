/* Eventlyssnare för validering av inputfält */
itemForm.item.addEventListener('input', (e) => validateField(e.target));
itemForm.item.addEventListener('blur', (e) => validateField(e.target));

itemForm.brand.addEventListener('input', (e) => validateField(e.target));
itemForm.brand.addEventListener('blur', (e) => validateField(e.target));

itemForm.size.addEventListener('input', (e) => validateField(e.target));
itemForm.size.addEventListener('blur', (e) => validateField(e.target));

itemForm.color.addEventListener('input', (e) => validateField(e.target));
itemForm.color.addEventListener('blur', (e) => validateField(e.target));

itemForm.price.addEventListener('input', (e) => validateField(e.target));
itemForm.price.addEventListener('blur', (e) => validateField(e.target));

/* Eventlyssnare för inputfältets submitknapp */
itemForm.addEventListener('submit', onSubmit);

/* Variabel för varulistan */
const itemListElement = document.getElementById('itemList');

/* Initiala värden för validering */
let itemValid = true;
let brandValid = true;
let sizeValid = true;
let colorValid = true;
let priceValid = true;

/* Adress */
const api = new Api('http://localhost:5000/items');

/* Validering av input */
function validateField(field) {
  const { name, value } = field;

  /* Variabel för texten i html */
  let = validationMessage = '';

  switch (name) {
    /* För inputfält "Vara" */
    case 'item': {
      /* Om input är under 2 tecken, faila valideringen och sätt text till felmeddelande 1 */
      if (value.length < 2) {
        itemValid = false;
        validationMessage = "Fältet 'Vara' måste innehålla minst 2 tecken.";
      } else if (value.length > 50) { /* Om det är över 50 tecken, faila valideringen och sätt text till felmeddelande 2 */
        itemValid = false;
        validationMessage =
          "Fältet 'Vara' får inte innehålla mer än 50 tecken.";
      } else { /* Annars låt gå */
        itemValid = true;
      }
      break;
    }
    /* Samma princip gäller validering av alla fält */
    case 'brand': {
    if (value.length < 2) {
      brandValid = false;
      validationMessage = "Fältet 'Märke' måste innehålla minst 2 tecken.";
    } else if (value.length > 50) {
      brandValid = false;
      validationMessage =
        "Fältet 'Märke' får inte innehålla mer än 50 tecken.";
    } else {
      brandValid = true;
    }
      break;
    }
    case 'size': {
      if (value.length < 1) {
        sizeValid = false;
        validationMessage = "Fältet 'Storlek' måste innehålla minst 1 tecken.";
      } else if (value.length > 10) {
        sizeValid = false;
        validationMessage =
        "Fältet 'Storlek' får inte innehålla mer än 10 tecken.";
      } else {
        sizeValid = true;
      }
      break;
    }
    case 'color': {
      if (value.length < 2) {
        colorValid = false;
        validationMessage = "Fältet 'Färg' måste innehålla minst 2 tecken.";
      } else if (value.length > 50) {
        colorValid = false;
        validationMessage =
          "Fältet 'Färg' får inte innehålla mer än 50 tecken.";
      } else {
        colorValid = true;
      }
      break;
    }
    case 'price': {
      if (value.length < 1) {
        priceValid = false;
        validationMessage = "Fältet 'Pris' måste innehålla minst 1 tecken.";
      } else if (value.length > 50) {
        priceValid = false;
        validationMessage =
          "Fältet 'Pris' får inte innehålla mer än 50 tecken.";
      } else {
        priceValid = true;
      }
      break;
    }
  }
  /* Sätter html-elementets text till variabeln ovan */
  field.previousElementSibling.innerText = validationMessage;
  /* Om valideringen ej lyckas, ta bort 'hidden' från felmeddelandets element för att visa felet */
  field.previousElementSibling.classList.remove('hidden');
}

/* När submit-event upptäcks, kolla så valideringen är True för alla fält innan det skickas vidare */
function onSubmit(e) {
  e.preventDefault();
  if (itemValid && brandValid && sizeValid && colorValid && priceValid) {
    console.log('Submit');
    saveItem();
  }
}

function saveItem() {
  /* Vid sparning till server, spara data från alla fält till variabel */
  const item = {
    item: itemForm.item.value,
    brand: itemForm.brand.value,
    size: itemForm.size.value,
    color: itemForm.color.value,
    price: itemForm.price.value,
  };

  /* Skicka variabeln till api:n och skicka sen svaret till rendering */
  api.create(item).then((item) => {
    if (item) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');

  /* Hämta listan från servern innan rendering */
  api.getAll().then((items) => {
    itemListElement.innerHTML = '';

    /* Förutsatt att det finns något att rendera, iterera genom varje objekt i listan och generera html för det med renderItem */
    if (items && items.length > 0) {
      items.forEach((item) => {
        itemListElement.insertAdjacentHTML('beforeend', renderItem(item));
      });
    }
  });
}

/* För varje objekt i listan, hämta relevanta values och lägg in i vad som blir nytt listobjekt
Dessa hämtas individuellt för att göra det mer läsligt när de läggs in i html */
function renderItem({ id, item, brand, size, color, price }) {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-dashed border-orange-500">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-xl font-bold text-cyan-700 uppercase">${item}</h3>
        <div>
          <span>${price}kr</span>
          <!-- Ta bort-knapp som anropar delete-funktionen med elementets id -->
          <button onclick="deleteItem(${id})" class="inline-block bg-orange-500 text-xs border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>
      <div class="flex items-center">
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${brand}</p>
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${size}</p>
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${color}</p>
      </div>`;
  return html;
}

/* Tar emot id från elementet vars knapp trycks på och skickar vidare till api:n 
Skickar svaret till renderList */
function deleteItem(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

/* renderList anropas direkt, så att listan visas när man först kommer in på webbsidan */
renderList();