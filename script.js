// insert card elements here
const containerElement = document.querySelector('.container');

class Card {
    // your code goes here
    constructor(id, name, types, lore, image) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.lore = lore;
        this.image = image;
    }

    // add your class functions here

    createCardElement() {

        // Create outer card container
        const card = document.createElement('div');
        card.classList.add('card');

        // Pokémon image
        const img = document.createElement('img');
        img.src = this.image;
        img.alt = this.name;
        card.appendChild(img);

        // Pokémon name
        const nameEl = document.createElement('h2');
        nameEl.innerText = this.name;
        card.appendChild(nameEl);

        // Pokémon ID
        const idEl = document.createElement('p');
        idEl.classList.add('card-id');
        idEl.innerText = `#${this.id}`;
        card.appendChild(idEl);

        // Pokémon Types
        const typesEl = document.createElement('p');
        typesEl.classList.add('card-types');
        typesEl.innerText = `Type: ${this.types.join(', ')}`;
        card.appendChild(typesEl);

        // Pokémon Lore
        const loreEl = document.createElement('p');
        loreEl.classList.add('card-lore');
        loreEl.innerText = this.lore;
        card.appendChild(loreEl);

        return card;
    }
}

function getData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            displayCards(data);
        })
        .catch(err => console.error("Error loading JSON:", err));
}

function displayCards(cards) {
    // your code goes here
    containerElement.innerHTML = '';
    cards.forEach(pokemon => {
        const card = new Card(
            pokemon.id,
            pokemon.name,
            pokemon.types,
            pokemon.lore,
            pokemon.image
        );
        containerElement.appendChild(card.createCardElement());
    })
}

//Run the Fetch function
getData();




