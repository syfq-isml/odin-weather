import "./styles/normalize.css";
import "./styles/styles.css";

import { getLatLonData, getWeatherData_OVERALL } from "./APIfuncs";

const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", init);

const test = document.querySelector("#test");
test.addEventListener("click", disappear);

function disappear() {
	const elems = document.querySelectorAll("[data-appear]");
	console.log(elems);
	elems.forEach((elem) => elem.classList.toggle("hidden"));
}

// get data from input
async function getDataFromInput() {
	let latLon = await getLatLonData(searchBar.value);
	let name = `${latLon.name}, ${latLon.country}`;
	let dataObj = await getWeatherData_OVERALL(latLon);
	return { name, weatherData: dataObj };
}

const displayWrapper = document.querySelector("#display-wrapper");

function populateDisplayHeader(obj) {
	const h1 = document.querySelector("#search-value");
	console.log(h1);
	console.log(obj.name);
	h1.innerText = obj.name;
}

async function init() {
	let first = await getDataFromInput();
	populateDisplayHeader(first);
}
