itemForm.item.addEventListener('keyup', (e) => validateField(e.target));
itemForm.item.addEventListener('blur', (e) => validateField(e.target));

itemForm.brand.addEventListener('input', (e) => validateField(e.target));
itemForm.brand.addEventListener('blur', (e) => validateField(e.target));

itemForm.size.addEventListener('input', (e) => validateField(e.target));
itemForm.size.addEventListener('blur', (e) => validateField(e.target));

itemForm.color.addEventListener('input', (e) => validateField(e.target));
itemForm.color.addEventListener('blur', (e) => validateField(e.target));

itemForm.price.addEventListener('input', (e) => validateField(e.target));
itemForm.price.addEventListener('blur', (e) => validateField(e.target));

itemForm.addEventListener('submit', onSubmit);

const itemListElement = document.getElementById('itemList');

let itemValid = true;
let brandValid = true;
let sizeValid = true;
let colorValid = true;
let priceValid = true;

const api = new Api('http://localhost:5000/items');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'item': {
      if (value.length < 2) {
        itemValid = false;
        validationMessage = "Fältet 'Vara' måste innehålla minst 2 tecken.";
      } else if (value.length > 50) {
        itemValid = false;
        validationMessage =
          "Fältet 'Vara' får inte innehålla mer än 50 tecken.";
      } else {
        itemValid = true;
      }
      break;
    }
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
  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (itemValid && brandValid && sizeValid && colorValid && priceValid) {
    console.log('Submit');
    saveItem();
  }
}

function saveItem() {
  const item = {
    item: itemForm.item.value,
    brand: itemForm.brand.value,
    size: itemForm.size.value,
    color: itemForm.color.value,
    price: itemForm.price.value,
  };

  api.create(item).then((item) => {
    if (item) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');

  api.getAll().then((items) => {
    itemListElement.innerHTML = '';

    if (items && items.length > 0) {
      items.forEach((item) => {
        itemListElement.insertAdjacentHTML('beforeend', renderItem(item));
      });
    }
  });
}

function renderItem({ id, item, brand, size, color, price }) {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-300">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${item}</h3>
        <div>
          <span>${price}kr</span>
          <button onclick="deleteItem(${id})" class="inline-block bg-amber-900 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>
      <div class="flex items-center">
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${brand}</p>
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${size}</p>
        <p class="ml-8 mt-2 text-xs italic basis-1/3">${color}</p>
      </div>`;
  return html;
}

function deleteItem(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

renderList();