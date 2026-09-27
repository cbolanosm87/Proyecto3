const search1 = document.getElementById("search1");
const search2 = document.getElementById("search2");

const suggestions1 = document.getElementById("suggestions1");
const suggestions2 = document.getElementById("suggestions2");

const pokemon1 = document.getElementById("pokemon1");
const pokemon2 = document.getElementById("pokemon2");

const battleMessage = document.getElementById("battle-message");

let fighter1 = null;
let fighter2 = null;

let pokemonList = [];

let timer1;
let timer2;


// Cargar la lista de Pokémon desde PokéAPI
async function loadPokemonList() {

    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
    );

    const data = await response.json();

    pokemonList = data.results;
}


// Buscar Pokémon para el luchador 1
search1.addEventListener("input", function () {

    clearTimeout(timer1);

    timer1 = setTimeout(function () {

        searchPokemon(
            search1.value,
            suggestions1,
            1
        );

    }, 500);
});


// Buscar Pokémon para el luchador 2
search2.addEventListener("input", function () {

    clearTimeout(timer2);

    timer2 = setTimeout(function () {

        searchPokemon(
            search2.value,
            suggestions2,
            2
        );

    }, 500);
});


// Buscar Pokémon que coincidan con el texto
function searchPokemon(text, suggestions, fighterNumber) {

    suggestions.innerHTML = "";

    if (text.length < 2) {
        return;
    }

    const matches = pokemonList.filter(function (pokemon) {

        return pokemon.name.includes(
            text.toLowerCase()
        );

    });

    const firstMatches = matches.slice(0, 5);


    firstMatches.forEach(function (pokemon) {

        const button = document.createElement("button");

        button.textContent = pokemon.name;

        button.addEventListener("click", function () {

            selectPokemon(
                pokemon.name,
                fighterNumber
            );

        });

        suggestions.appendChild(button);

    });
}


// Cargar el Pokémon seleccionado
async function selectPokemon(name, fighterNumber) {

    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/" + name
    );

    const data = await response.json();


    const pokemon = {

        name: data.name,

        hp: data.stats[0].base_stat,

        currentHp: data.stats[0].base_stat,

        image: data.sprites.front_default,

        moves: data.moves.slice(0, 4)

    };


    if (fighterNumber === 1) {

        fighter1 = pokemon;

        suggestions1.innerHTML = "";

        showPokemon(
            fighter1,
            pokemon1,
            1
        );

    } else {

        fighter2 = pokemon;

        suggestions2.innerHTML = "";

        showPokemon(
            fighter2,
            pokemon2,
            2
        );
    }


    checkBattle();
}


// Mostrar la información del Pokémon
function showPokemon(pokemon, container, fighterNumber) {

    container.innerHTML = "";


    const name = document.createElement("h3");

    name.textContent = pokemon.name;


    const image = document.createElement("img");

    image.src = pokemon.image;

    image.alt = pokemon.name;


    const hp = document.createElement("p");

    hp.id = "hp" + fighterNumber;

    hp.textContent =
        "HP: " +
        pokemon.currentHp +
        " / " +
        pokemon.hp;


    const hpBar = document.createElement("progress");

    hpBar.id = "hpBar" + fighterNumber;

    hpBar.max = pokemon.hp;

    hpBar.value = pokemon.currentHp;


    const moves = document.createElement("div");


    pokemon.moves.forEach(function (move) {

        const button = document.createElement("button");

        button.textContent = move.move.name;


        button.addEventListener("click", function () {

            attack(fighterNumber);

        });


        moves.appendChild(button);

    });


    container.appendChild(name);

    container.appendChild(image);

    container.appendChild(hp);

    container.appendChild(hpBar);

    container.appendChild(moves);
}


// Iniciar la batalla cuando ambos Pokémon estén seleccionados
function checkBattle() {

    if (fighter1 !== null && fighter2 !== null) {

        battleMessage.textContent =
            "Battle started! Choose a move.";

    }
}


// Atacar al oponente
function attack(fighterNumber) {

    if (fighter1 === null || fighter2 === null) {
        return;
    }


    if (
        fighter1.currentHp === 0 ||
        fighter2.currentHp === 0
    ) {
        return;
    }


    const damage =
        Math.floor(Math.random() * 20) + 5;


    if (fighterNumber === 1) {

        fighter2.currentHp =
            fighter2.currentHp - damage;


        if (fighter2.currentHp < 0) {

            fighter2.currentHp = 0;

        }


        document.getElementById("hp2").textContent =
            "HP: " +
            fighter2.currentHp +
            " / " +
            fighter2.hp;


        document.getElementById("hpBar2").value =
            fighter2.currentHp;


        if (fighter2.currentHp === 0) {

            battleMessage.textContent =
                fighter1.name + " wins!";

        } else {

            battleMessage.textContent =
                fighter1.name +
                " dealt " +
                damage +
                " damage!";

        }

    } else {

        fighter1.currentHp =
            fighter1.currentHp - damage;


        if (fighter1.currentHp < 0) {

            fighter1.currentHp = 0;

        }


        document.getElementById("hp1").textContent =
            "HP: " +
            fighter1.currentHp +
            " / " +
            fighter1.hp;


        document.getElementById("hpBar1").value =
            fighter1.currentHp;


        if (fighter1.currentHp === 0) {

            battleMessage.textContent =
                fighter2.name + " wins!";

        } else {

            battleMessage.textContent =
                fighter2.name +
                " dealt " +
                damage +
                " damage!";

        }
    }
}


// Cargar la lista de Pokémon cuando inicia la página
loadPokemonList();