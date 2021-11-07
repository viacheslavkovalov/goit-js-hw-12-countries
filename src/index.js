import fetchCountries from './js/fetchCountries.js';
import countryCardTpl from './templates/country-template.hbs';
import countriesListMarkUp from './templates/countries-list.hbs';
import {debounce} from 'lodash'
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
    countriesListRef: document.querySelector('.js_list'),
    searchForm: document.querySelector('.js-input'),
    markup: document.querySelector('.js_markup')

};

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
    event.preventDefault();

    const userCountry = event.target.value;

    if (userCountry) {
        refs.countriesListRef.innerHTML = '';
        refs.markup.innerHTML = '';
    }
    fetchCountries(userCountry)
        .then(renderCountryCard)
        .catch(onFetchError)
    
};

function renderCountryCard(data) {

    if (data.length === 1) {
        return (refs.markup.innerHTML = countryCardTpl(data[0]));
    }
    if (data.length > 1 && data.length < 10) {
        return (refs.countriesListRef.innerHTML = countriesListMarkUp(data));
    }
    if (data.length > 10) {
        onFetchError(error, 'To many matches found. Please enter more specific query!');
        return 
    }
    else {
        onFetchError(info, 'No matches found!')
    }
};

function onFetchError(alert, text) {
    refs.countriesListRef.innerHTML = '';
    alert({
        text: `${text}`,
        delay: 2000,
    })
}