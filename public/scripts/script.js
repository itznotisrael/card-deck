const containerElement = document.querySelector('.container');
const titleEl = document.querySelector('.title');
const searchInput = document.querySelector('#search');
const typeFilter = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort');
const modal = document.querySelector('#card-modal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal');

titleEl.textContent = "Pokémon Card Deck";

let allCards = [];

// Card Class

class Card {
    constructor(id, name, types, lore, image) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.lore = lore;
        this.image = image;
    }

    createCardElement() {
        const card = document.createElement('article');
        card.classList.add('card');

        // Add Pokémon type as a class
        const primaryType = this.types[0].toLowerCase();
        card.classList.add(`type-${primaryType}`);

        // Card header
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        const idEl = document.createElement('span');
        idEl.classList.add('card-id');
        idEl.textContent = `#${String(this.id).padStart(3, '0')}`;

        const typeEl = document.createElement('span');
        typeEl.classList.add('type-badge');
        typeEl.textContent = this.types[0];

        cardHeader.appendChild(idEl);
        cardHeader.appendChild(typeEl);

        // Image
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = this.image;
        img.alt = `${this.name} Pokémon artwork`;
        img.loading = 'lazy';

        imageContainer.appendChild(img);

        // Name
        const nameEl = document.createElement('h2');
        nameEl.textContent = this.name;

        // Types
        const typesEl = document.createElement('div');
        typesEl.classList.add('types');

        this.types.forEach(type => {
            const badge = document.createElement('span');
            badge.classList.add(
                'type-badge',
                `type-${type.toLowerCase()}`
            );

            badge.textContent = type;
            typesEl.appendChild(badge);
        });

        // Lore
        const loreEl = document.createElement('p');
        loreEl.classList.add('card-lore');
        loreEl.textContent = this.lore;

        // View button
        const button = document.createElement('button');
        button.classList.add('view-card');
        button.textContent = 'View Details';

        button.addEventListener('click', () => {
            openModal(this);
        });

        // Assemble card
        card.appendChild(cardHeader);
        card.appendChild(imageContainer);
        card.appendChild(nameEl);
        card.appendChild(typesEl);
        card.appendChild(loreEl);
        card.appendChild(button);

        return card;
    }
}

// Fetch Pokémon Data

async function getData() {
    try {
        const response = await fetch('/data.json');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        allCards = data.map(pokemon => {
            return new Card(
                pokemon.id,
                pokemon.name,
                pokemon.types,
                pokemon.lore,
                pokemon.image
            );
        });

        populateTypeFilter();
        displayCards(allCards);

    } catch (error) {
        console.error("Error loading JSON:", error);

        containerElement.innerHTML = `
            <div class="error-message">
                <h2>Unable to Load Card Deck</h2>
                <p>Please refresh the page and try again.</p>
            </div>
        `;
    }
}


// ==============================
// Display Cards
// ==============================

function displayCards(cards) {
    containerElement.innerHTML = '';

    if (cards.length === 0) {
        containerElement.innerHTML = `
            <div class="no-results">
                <h2>No Pokémon Found</h2>
                <p>Try changing your search or filter.</p>
            </div>
        `;

        return;
    }

    cards.forEach(card => {
        containerElement.appendChild(
            card.createCardElement()
        );
    });
}

// Search + Filter + Sort

function updateCards() {
    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const selectedType =
        typeFilter.value.toLowerCase();

    const sortValue =
        sortSelect.value;

    let filteredCards = allCards.filter(card => {

        const matchesSearch =
            card.name
                .toLowerCase()
                .includes(searchTerm);

        const matchesType =
            selectedType === 'all' ||
            card.types.some(
                type => type.toLowerCase() === selectedType
            );

        return matchesSearch && matchesType;
    });


    // Sorting
    if (sortValue === 'name-asc') {
        filteredCards.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (sortValue === 'name-desc') {
        filteredCards.sort((a, b) =>
            b.name.localeCompare(a.name)
        );
    }

    if (sortValue === 'id-asc') {
        filteredCards.sort((a, b) =>
            a.id - b.id
        );
    }

    if (sortValue === 'id-desc') {
        filteredCards.sort((a, b) =>
            b.id - a.id
        );
    }

    displayCards(filteredCards);
}

// Populate Type Filter

function populateTypeFilter() {

    const types = new Set();

    allCards.forEach(card => {
        card.types.forEach(type => {
            types.add(type);
        });
    });

    [...types]
        .sort()
        .forEach(type => {

            const option =
                document.createElement('option');

            option.value =
                type.toLowerCase();

            option.textContent =
                type;

            typeFilter.appendChild(option);
        });
}

// Modal

function openModal(card) {

    modalContent.innerHTML = `
        <button class="close-modal">&times;</button>

        <img
            src="${card.image}"
            alt="${card.name} Pokémon artwork"
            class="modal-image"
        >

        <p class="modal-id">
            #${String(card.id).padStart(3, '0')}
        </p>

        <h2>${card.name}</h2>

        <div class="modal-types">
            ${card.types
                .map(type => `
                    <span class="type-badge type-${type.toLowerCase()}">
                        ${type}
                    </span>
                `)
                .join('')}
        </div>

        <p class="modal-lore">
            ${card.lore}
        </p>
    `;

    modal.classList.add('active');

    const closeButton =
        modalContent.querySelector('.close-modal');

    closeButton.addEventListener(
        'click',
        closeModalWindow
    );
}


function closeModalWindow() {
    modal.classList.remove('active');
}


// Close modal when clicking outside
modal.addEventListener('click', event => {

    if (event.target === modal) {
        closeModalWindow();
    }

});


// Close modal with Escape
document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {
        closeModalWindow();
    }

});

// Event Listeners

searchInput.addEventListener(
    'input',
    updateCards
);

typeFilter.addEventListener(
    'change',
    updateCards
);

sortSelect.addEventListener(
    'change',
    updateCards
);

//Run the Fetch function
getData();