const mtgApi = 'https://api.magicthegathering.io/v1/cards?'
let variableApi = mtgApi;

const whiteCheckbox = document.querySelector('.white');
const blueCheckbox = document.querySelector('.blue');
const blackCheckbox = document.querySelector('.black');
const redCheckbox = document.querySelector('.red');
const greenCheckbox = document.querySelector('.green');

const typeDropdown = document.querySelector('.type__selector');

const commonCheckbox = document.querySelector('.common');
const uncommonCheckbox = document.querySelector('.uncommon');
const rareCheckbox = document.querySelector('.rare');
const mythicCheckbox = document.querySelector('.mythic');

const powerDropdown = document.querySelector('.power__selector');

const toughnessDropdown = document.querySelector('.toughness__selector');

const filterBtn = document.querySelector('.filters__accept');

const nameSearch = document.querySelector('.search__type--name');
const typeSearch = document.querySelector('.search__type--subtype');
const cmcSearch = document.querySelector('.search__type--cmc');
const idSearch = document.querySelector('.search__type--id');

const searchDropdown = document.querySelector('.search--types');

const searchBar = document.querySelector('.search__form--entry');
const searchBtn = document.querySelector('.search__btn');

const clearFilter = document.querySelector('.filter__clear');
const loadBtn = document.querySelector('.load-more');

const cardsContainer = document.querySelector('.cards__container');
const filterContainer = document.querySelector('.filter__container');
const cardLoadingState = document.querySelector('.cards__loading');

let searchType = 'name='

let resultCards = 6;

let cardUrl = './assets/mtg_back.png'

filterBtn.addEventListener('click', () => {
    console.log('filter apply');
    filterContainer.innerHTML = '';
    const filter = buildSearchQuery();
    variableApi += filter;
    cardLoadingState.style.display = 'flex'
    commonCheckbox.checked = false;
    uncommonCheckbox.checked = false;
    rareCheckbox.checked = false;
    mythicCheckbox.checked = false;
    whiteCheckbox.checked = false;
    blueCheckbox.checked = false;
    blackCheckbox.checked = false;
    redCheckbox.checked = false;
    greenCheckbox.checked = false;
    typeDropdown.value = 'null';
    powerDropdown.value = 'null';
    toughnessDropdown.value = 'null';
    renderCards();
});

nameSearch.addEventListener('click', () => {
    searchBar.placeholder = 'Search by Card Name';
    searchType = 'name='
});

typeSearch.addEventListener('click', () => {
    searchBar.placeholder = 'Search by Card Subtype'
    searchType = 'subtypes='
});

cmcSearch.addEventListener('click', () => {
    searchBar.placeholder = 'Search by Converted Mana Cost'
    searchType = 'cmc='
});

idSearch.addEventListener('click', () => {
    searchBar.placeholder = 'Search by Multiverse ID'
    searchType = 'multiverseid='
});

searchDropdown.addEventListener('change', () => {
    searchBar.placeholder = searchDropdown.textContent;
    if(searchDropdown.value === 'multiverseid='){
        idSearch.click();
    }
    if(searchDropdown.value === 'cmc='){
        cmcSearch.click();
    }
    if(searchDropdown.value === 'subtypes='){
        typeSearch.click();
    }
    if(searchDropdown.value === 'name='){
        nameSearch.click();
    }
})

function openFilters(){
    document.body.classList.toggle('modal');
    document.querySelector('.filter--icon').classList.toggle('fa-filter');
    document.querySelector('.filter--icon').classList.toggle('fa-x');
    document.body.classList.remove('active');
}

function showActive(){
    document.body.classList.toggle('active')
    document.querySelector('.active--icon').classList.toggle('fa-circle-chevron-down');
    document.querySelector('.active--icon').classList.toggle('fa-x');
    document.body.classList.remove('modal')
}

function closeActive(){

}

function closeFilters(){
    document.body.classList.remove('modal');
}

searchBtn.addEventListener('click', () => {
    
    if(document.body.clientWidth <= 800){
        searchType = searchDropdown.value;
    }

    console.log(searchType);
    console.log('run search');
    resultCards = 6;
    variableApi = mtgApi + searchType + searchBar.value;
    filterContainer.innerHTML = '';
    cardLoadingState.style.display = 'flex'
    renderCards();
});

loadBtn.addEventListener('click', () => {
    console.log('load more cards');
    resultCards = 50;
    renderCards();
    loadBtn.style.display = 'none';
});

const buildSearchQuery = () => {
    let filters = '';
    let colorVar = 'null';
    let whiteVar = '';
    let blueVar = '';
    let blackVar = '';
    let redVar = '';
    let greenVar = '';
    let rarityVar = 'null';
    let commonVar = '';
    let uncommonVar = '';
    let rareVar = '';
    let mythicVar = '';
    let typeVar = typeDropdown.value;
    let powerVar = powerDropdown.value;
    let toughVar = toughnessDropdown.value;
    let colorFilter;
    if(whiteCheckbox.checked || blueCheckbox.checked || blackCheckbox.checked || redCheckbox.checked || greenCheckbox.checked){
        const white = whiteCheckbox.checked;
        const blue = blueCheckbox.checked;
        const black = blackCheckbox.checked;
        const red = redCheckbox.checked;
        const green = greenCheckbox.checked;
        
            whiteVar = white ? 'w|' : '';
            blueVar = blue ? 'u|' : '';
            blackVar = black ? 'b|' : '';
            redVar = red ? 'r|' : '';
            greenVar = green ? 'g' : '';
            colorVar = whiteVar + blueVar + blackVar + redVar + greenVar
            colorVar = green ? colorVar : colorVar.substring(0, colorVar.length - 1);

        colorFilter = colorVar;
        colorFilter = colorFilter.split('|');
        colorFilter = colorFilter.map(color => {
            let fullString = '';
            color === 'w' ? fullString += "White" : fullString += '';
            color === 'u' ? fullString += "Blue" : fullString += '';
            color === 'b' ? fullString += "Black" : fullString += '';
            color === 'r' ? fullString += "Red" : fullString += '';
            color === 'g' ? fullString += "Green" : fullString += '';
            return fullString;
        })
                console.log(colorFilter)

    }
    if(commonCheckbox.checked || uncommonCheckbox.checked || rareCheckbox.checked || mythicCheckbox.checked){
        commonVar = commonCheckbox.checked ? 'common' : null;
        uncommonVar = uncommonCheckbox.checked ? 'uncommon' : null;
        rareVar = rareCheckbox.checked ? 'rare' : null;
        mythicVar = mythicCheckbox ? 'mythic' : null;
        rarityVar = commonVar || uncommonVar || rareVar || mythicVar;
    }

    if(colorVar !== 'null'){
        filters = filters + '&colors=' + colorVar;
        filterContainer.innerHTML += `<div class="filter">
                        <h3 class='filter__title'>Color: </h3>
                        ${colorFilter.map(color => {
                            return `<h5 class="filter__name label__${color.toLowerCase()}">${color}</h5>`
                        }).join('')} 
                    </div>`
    }
    if(typeVar !== 'null'){
        filters = filters + "&types=" + typeVar;
        filterContainer.innerHTML += `<div class="filter">
                        <h3 class='filter__title'>Type: </h3>
                        <h5 class="filter__name">${typeVar.charAt(0).toUpperCase() + typeVar.slice(1)}</h5>
                    </div>`
    }
    if(rarityVar !== 'null'){
        filters = filters + '&rarity=' + rarityVar;
        filterContainer.innerHTML += `<div class="filter">
                        <h3 class='filter__title'>Rarity: </h3>
                        <h5 class="filter__name ${rarityVar}__label">${rarityVar.charAt(0).toUpperCase() + rarityVar.slice(1)}</h5>
                    </div>`
    }
    if(powerVar !== 'null'){
        filters = filters + '&power=' + powerVar;
        filterContainer.innerHTML += `<div class="filter">
                  <h3 class='filter__title'>Power: </h3>
                  <h5 class="filter__name">${powerVar}</h5>
                    </div>`
    }
    if(toughVar !== 'null'){
        filters = filters + '&toughness=' + toughVar;
        filterContainer.innerHTML += `<div class="filter">
                                <h3 class='filter__title'>Toughness: </h3>
                        <h5 class="filter__name">${toughVar}</h5>
                    </div>`
    }    
    return filters;
}



const renderManaSymbols = (manaCostString) => {
    let manaHTML = ''
    let manaCostArray = [];
    
        for(let i = 0; i < manaCostString.length; i++){
            if(manaCostString[i + 1] === '/'){
                manaCostArray.push(manaCostString[i] + manaCostString[i + 2]);
                i += 3
            } else {
                manaCostArray.push(manaCostString[i]);
            }
        }
        for(let i = 0; i < manaCostArray.length; i++){
            manaHTML +=`<i class="ms ms-${manaCostArray[i].toLowerCase()} ms-cost ms-shadow"></i>`
        }


    return manaHTML;
}

async function renderCards(filterArr){
    const data = await fetch(variableApi);
    const res = await data.json();
    console.log(res.cards);
    const cards = res.cards;
    let j = 0;
    cardsContainer.innerHTML = '';
    for(let i = 0; j < resultCards; i++){
        const card = cards[i];
        if(!card){
            return;
        }
        if(!card.imageUrl || (i > 0 && card.name === cards[i - 1].name)){
            continue;
        } else {
            let manaCost = card.manaCost ? card.manaCost.replaceAll('{', "").replaceAll('}', '').split("") : '';
            cardUrl = card.imageUrl;
            let cardName = card.name;
            cardName = card.name.slice(0, 20) + '&shy;' + card.name.slice(20)
            cardsContainer.innerHTML += `<div class="card__wrapper">
                        <figure class="card__image">
                            <img class="card__image" src="${cardUrl}" alt="card__image">
                        </figure>
                        <div class="card__info">
                            <div class="card__info--header">
                                <h3 class="card__name">
                                    ${cardName}
                                </h3>
                                <h4 class="card--types">${card.type}</h4>
                            </div>
                            <div class="card__info--filler">
                                <div class="mana__cost">
                                    ${renderManaSymbols(manaCost)}  
                                </div>
                                <p class="card__info--stats">${card.power ? card.power + '/' + card.toughness : ''}</p>
                            </div>
                        </div>
                    </div>`
                    j++;
        }
        
    }
    cardLoadingState.style.display = 'none';
}