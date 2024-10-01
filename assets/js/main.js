/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')
     /*=============== MENU SHOW ===============*/
      if(navToggle){
        navToggle.addEventListener('click', ()=>{
            navMenu.classList.add('show-menu')
        })
    }
    /*===============MENU HIDDEN ===============*/
    if(navClose){
        navClose.addEventListener('click', ()=>{
            navMenu.classList.remove('show-menu')
        })
    }

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const LinkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', LinkAction))

/*=============== ADD BLUR TO HEADER ===============*/
const blurHeader = () =>{
    const header = document.getElementById('header')
        this.scrollY >= 50 ? header.classList.add('blur-header')
                           : header.classList.remove('blur-header')
}
window.addEventListener('scroll', blurHeader)


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
const scrollActive = () =>{
    const scrollY = window.pageYOffset
    sections. forEach(current =>{
        const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute('id'),
        sectionClass = document.querySelector('nav__menu a[href*=]' + sectionId)
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
        }else{
            sectionClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)
/*=============== SCROLL REVEAL ANIMATION ===============*/
 const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 3000,
    delay: 400,
    reset: true
 })
 sr.reveal(`.home__data, .explore__data, .explore__user, .footer__container`)
 sr.reveal(`.home__card`, {delay: 600, distance: '100px', interval: 100})
 sr.reveal(`.home__data, .join__image`, {origin: 'right'})
 sr.reveal(`.home__iamge, .join__data`, {origin: 'left'})
 sr.reveal(`.popular__card`, {interval: 200})

// Variáveis globais
let countriesData = [];
let currentPage = 1;
const perPage = 20; // Número de países por página
let allCountriesLoaded = false; // Controle para scroll infinito

// Função para buscar dados da API RestCountries
const getCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countriesData = await response.json();
        displayCountries(countriesData, currentPage, perPage);
        populateFilters(countriesData);
    } catch (error) {
        console.error('Erro ao buscar países:', error);
    }
};

// Função para exibir países
const displayCountries = (countries, page = 1, perPage = 20) => {
    const countriesContainer = document.getElementById('countries-list');
    const start = (page - 1) * perPage;
    const end = page * perPage;
    const paginatedCountries = countries.slice(start, end);

    paginatedCountries.forEach(country => {
        const countryElement = document.createElement('div');
        countryElement.classList.add('country-item');

        countryElement.innerHTML = `
            <h3>${country.name.common}</h3>
            <img src="${country.flags.svg}" alt="${country.name.common}" class="country-flag">
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Região:</strong> ${country.region}</p>
            <p><strong>Sub-região:</strong> ${country.subregion || 'N/A'}</p>
        `;

        countriesContainer.appendChild(countryElement);
    });
};

// Função para implementar scroll infinito
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && !allCountriesLoaded) {
        currentPage++;
        const totalCountries = countriesData.length;
        if (currentPage * perPage >= totalCountries) {
            allCountriesLoaded = true;
        }
        displayCountries(countriesData, currentPage, perPage);
    }
});

// Função para buscar países pelo nome
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredCountries = countriesData.filter(country => 
        country.name.common.toLowerCase().includes(searchValue)
    );
    resetCountriesList();
    displayCountries(filteredCountries, 1, perPage);
});

// Função para filtrar por região
document.getElementById('region-filter').addEventListener('change', (e) => {
    const regionValue = e.target.value;
    const filteredCountries = regionValue ? countriesData.filter(country => country.region === regionValue) : countriesData;
    resetCountriesList();
    displayCountries(filteredCountries, 1, perPage);
    populateSubregionFilter(filteredCountries);
});

// Função para filtrar por sub-região
document.getElementById('subregion-filter').addEventListener('change', (e) => {
    const subregionValue = e.target.value;
    const filteredCountries = subregionValue ? countriesData.filter(country => country.subregion === subregionValue) : countriesData;
    resetCountriesList();
    displayCountries(filteredCountries, 1, perPage);
});

// Função para preencher filtros de sub-região
const populateSubregionFilter = (countries) => {
    const subregionFilter = document.getElementById('subregion-filter');
    subregionFilter.innerHTML = '<option value="">Filtrar por Sub-região</option>';
    const subregions = [...new Set(countries.map(country => country.subregion).filter(Boolean))];
    subregions.forEach(subregion => {
        const option = document.createElement('option');
        option.value = subregion;
        option.textContent = subregion;
        subregionFilter.appendChild(option);
    });
};

// Função para preencher filtros de região
const populateFilters = (countries) => {
    const regions = [...new Set(countries.map(country => country.region).filter(Boolean))];
    const regionFilter = document.getElementById('region-filter');
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });
};

// Função para limpar a lista de países exibidos
const resetCountriesList = () => {
    const countriesContainer = document.getElementById('countries-list');
    countriesContainer.innerHTML = '';
};

// Carregar os países quando a página for carregada
document.addEventListener('DOMContentLoaded', getCountries);
