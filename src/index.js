import "./styles/normalize.css";
import "./styles/styles.css";

import format from "date-fns/format";

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
	return { name, ...dataObj };
}

const displayWrapper = document.querySelector("#display-wrapper");

function populateDisplayHeader(str) {
	const h1 = document.querySelector("#search-value");
	h1.innerText = str;
}

function populateCurrentSection(obj) {
	// select all elements
	const time = document.querySelector(".c-time p");
	const icon = document.querySelector(".c-icon img");
	const desc = document.querySelector(".c-desc .description");
	const miscInfo = document.querySelectorAll(".c-misc ul li .info-here");

	const options = { timeZone: obj.timezone };
	// set time
	const adjustedTime = format(new Date(obj.dt * 1000), "PPP, pp");
	console.log(adjustedTime);
	time.innerText = `Current weather report as at ${adjustedTime}`;

	// set icon
	icon.src = `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`;

	desc.innerText = `${obj.weather[0].description}`;

	// make an array of infos
	let infoArray = [
		format(new Date(obj.sunrise * 1000), "p"),
		format(new Date(obj.sunset * 1000), "p"),
		`${obj.temp}℃`,
		`${obj.feels_like}℃`,
		`${obj.pressure} hPA`,
		`${obj.humidity}%`,
		`${obj.wind_speed} m/s`,
		`${obj.uvi}`,
	];

	miscInfo.forEach((tile, index) => {
		miscInfo[index].innerText = `${infoArray[index]}`;
	});
}

async function init() {
	let { name, current, hourly, daily } = await getDataFromInput();
	console.log(name);
	console.log(current);
	populateDisplayHeader(name);
	populateCurrentSection(current);

	disappear();
}
