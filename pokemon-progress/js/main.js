window.addEventListener('load', init);

//Globals
let apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
let gallery;
let modal;
let modalCloseButton;
let pokemonData = {};


/**
 * Initialize after the DOM is ready
 */
function init(){
  //Retrieve gallery
  gallery = document.getElementById('pokemon-gallery');

  let pokemonGallery = document.getElementById('pokemon-gallery');
  pokemonGallery.addEventListener('click', buttonClickHandler);

  let modalCloseButton = document.getElementById('modal-close');
  modalCloseButton.addEventListener('click', modalClose);

  modal = document.getElementById('pokemon-detail');

  //Start the application with loading the API data
  getPokemonData();
}

/**
 * AJAX-call to retrieve Pokémon from the API
 */
function getPokemonData()
{
  ajaxRequest(apiUrl, createPokemonCards);
}

/**
 * Create initial Pokémon cards based on initial API data
 *
 * @param data
 */
function createPokemonCards(data){
  //Loop through the list of Pokémon

  for (let pokemon of data.results) {
    //Wrapper element for every Pokémon card. We need the wrapper now, because adding it later
    //will result in Pokémon being ordered based on the load times of the API instead of chronically
    let pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.dataset.name = pokemon.name;

    //Append Pokémon card to the actual HTML
    gallery.appendChild(pokemonCard);

    //Retrieve the detail information from the API

    ajaxRequest(pokemon.url, fillPokemonCard);
  }
}

/**
 * Create the actual contents of the card based on the loaded API information
 *
 * @param pokemon
 */
function fillPokemonCard(pokemon){

  //Wrapper element for every Pokémon card
  let pokemonCard = document.querySelector(`.pokemon-card[data-name='${pokemon.name}']`);

  //Element for the name of the Pokémon
  let title = document.createElement('h2');
  title.innerHTML = `${pokemon.name} (#${pokemon.id})`;
  pokemonCard.appendChild(title);

  //Element for the image of the Pokémon
  let image = document.createElement('img');
  image.src = pokemon.sprites.other.home.front_default;
  pokemonCard.appendChild(image);

  let button = document.createElement('button');
  button.innerHTML = 'Show Shiny';
  button.dataset.id = pokemon.id;
  pokemonCard.appendChild(button);

  pokemonData[pokemon.id] = pokemon;


}

/**
 * Show an error message to inform the API isn't working correctly
 *
 * @param data
 */
function ajaxErrorHandler(data){
  let error = document.createElement('div');
  error.classList.add('error');
  error.innerHTML = 'Er is helaas iets fout gegaan met de API, probeer het later opnieuw';
  gallery.before(error);
}

function ajaxRequest(url, successHandler){
  fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(successHandler)
      .catch(ajaxErrorHandler);
}

function buttonClickHandler (e){
  let clickedItem = e.target;

  if (clickedItem.nodeName !== 'BUTTON') {
    return;
  }
  modal.classList.add('open');

  let pokemon = pokemonData[clickedItem.dataset.id]
  console.log(pokemon);

  let modalContent = document.querySelector('.modal-content');

  modalContent.innerHTML = '';

  let title = document.createElement('h2');
  title.innerHTML = `${pokemon.name} (#${pokemon.id})`;
  modalContent.appendChild(title);

  let image = document.createElement('img');
  image.src = pokemon.sprites.other.home.front_shiny;
  modalContent.appendChild(image);

}

function modalClose(){
  modal.classList.remove('open');
}