import "./styles/normalize.css";
import "./styles/styles.css";

import format from "date-fns/format";

import prevSvg from "./assets/svg/prev.svg";
import nextSvg from "./assets/svg/next.svg";
import rainSvg from "./assets/svg/rain.svg";
import tempSvg from "./assets/svg/temp.svg";

import { getLatLonData, getWeatherData_OVERALL } from "./APIfuncs";

const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const errorMsg = document.querySelector("#error-msg");
const loadingMsg = document.querySelector("#loading");

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#nxt-btn");

prevBtn.src = prevSvg;
nextBtn.src = nextSvg;

const rainyIcon = document.querySelector("#rainy-icon");
const tempIcon = document.querySelector("#temp-icon");

rainyIcon.src = rainSvg;
tempIcon.src = tempSvg;

// searchBtn.addEventListener("click", init);
searchBtn.addEventListener("click", preInit);

prevBtn.addEventListener("click", prevBtnInit);
nextBtn.addEventListener("click", nextBtnInit);

function disappear() {
	const elems = document.querySelectorAll("[data-appear]");
	elems.forEach((elem) => elem.classList.toggle("hidden"));
}

// get data from input
async function getDataFromInput() {
	let latLon = await getLatLonData(searchBar.value);
	let name = `${latLon.name}, ${latLon.country}`;
	let dataObj = await getWeatherData_OVERALL(latLon);
	return { name, ...dataObj };
}

async function getDataFromInput_withDUM() {
	let data = await getLatLonData(searchBar.value);
	return data;
}

async function getDataFromInput_2(latLon) {
	if (latLon.state == null) latLon.state = latLon.country;
	let name = `${latLon.name}, ${latLon.state}, ${latLon.country}`;
	let dataObj = await getWeatherData_OVERALL(latLon);
	return { name, ...dataObj };
}

function hideDUM() {
	const dum = document.querySelector("#dum");
	dum.classList.add("hidden");
}

function showDUM() {
	const dum = document.querySelector("#dum");
	dum.classList.remove("hidden");
}

function spawnDUM(data) {
	const innerDum = document.querySelector("#inner-dum");
	while (innerDum.firstChild) {
		innerDum.removeChild(innerDum.firstChild);
	}

	data.forEach((item) => {
		const div = document.createElement("li");
		div.classList.add("dum-list");

		let { name, country, lat, lon, state } = item;
		if (state == null) state = country;
		const h1 = document.createElement("p");
		h1.innerText = `${name}, ${state}, ${country}`;
		// const latP = document.createElement('p');
		// latP.innerText = `${lat}`;
		// const lonP = document.createElement('p');
		// lonP.innerText = `${lon}`;

		div.append(h1);
		innerDum.append(div);

		div.addEventListener("click", () => init_2(item));
	});

	showDUM();
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
	const adjustedTime = format(new Date(toSeconds(obj.dt)), "PPP, pp");

	time.innerText = `as at ${adjustedTime} (your local time)`;

	// set icon
	icon.src = `http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`;

	desc.innerText = `${obj.weather[0].description}`;

	// make an array of infos
	let infoArray = [
		format(new Date(toSeconds(obj.sunrise)), "p"),
		format(new Date(toSeconds(obj.sunset)), "p"),
		`${obj.temp.toFixed(1)}℃`,
		`${obj.feels_like.toFixed(1)}℃`,
		`${obj.pressure} hPA`,
		`${obj.humidity}%`,
		`${obj.wind_speed} m/s`,
		`${obj.uvi}`,
	];

	miscInfo.forEach((tile, index) => {
		miscInfo[index].innerText = `${infoArray[index]}`;
	});
}

function populateDailySection(daily) {
	let infoArray = [];
	const icons = document.querySelectorAll(".d-cell-info img");
	const cells = document.querySelectorAll(".d-cell-info p");

	daily.forEach((day, i) => {
		infoArray.push(
			format(new Date(toSeconds(daily[i].dt)), "cccc"),
			format(new Date(toSeconds(daily[i].dt)), "dd/MM"),
			daily[i].weather[0].description,
			`${toPercentage(daily[i].pop)}%`,
			`${daily[i].temp.min.toFixed(1)}℃`,
			`${daily[i].temp.max.toFixed(1)}℃`
		);
	});

	cells.forEach((cell, index) => {
		cells[index].innerText = `${infoArray[index]}`;
	});

	icons.forEach((icon, index) => {
		icons[
			index
		].src = `http://openweathermap.org/img/wn/${daily[index].weather[0].icon}@2x.png`;
	});
}

function populateHourlySection(arr) {
	const card = document.querySelectorAll(".h-card");
	const time = document.querySelectorAll(".h-time p");
	const icon = document.querySelectorAll(".h-icon img");
	const desc = document.querySelectorAll(".h-icon p");
	const temp = document.querySelectorAll(".h-temp p");
	const pop = document.querySelectorAll(".h-pop p");

	const popDiv = document.querySelectorAll(".h-pop");
	const tempDiv = document.querySelectorAll(".h-temp");

	if (FIRST_VISIT) {
		tempDiv.forEach((div) => {
			const img = document.createElement("img");
			img.src = tempSvg;
			div.append(img);
		});

		popDiv.forEach((div) => {
			const img = document.createElement("img");
			img.src = rainSvg;
			div.append(img);
		});
	}

	let hourly = arr.filter((item, index) => index < 24);
	console.log(hourly);

	time.forEach((item, index) => {
		item.innerText = `${format(
			new Date(toSeconds(hourly[index].dt)),
			"dd/MM"
		)}\n ${format(new Date(toSeconds(hourly[index].dt)), "h aa")}`;
	});

	icon.forEach((item, index) => {
		item.src = `http://openweathermap.org/img/wn/${hourly[index].weather[0].icon}@2x.png`;
	});

	desc.forEach((item, index) => {
		item.innerText = `${hourly[index].weather[0].main}`;
	});

	temp.forEach((item, index) => {
		item.innerText = `${hourly[index].temp.toFixed(1)}℃`;
	});

	pop.forEach((item, index) => {
		item.innerText = `${toPercentage(hourly[index].pop)}%`;
	});
}

let FIRST_VISIT = true;
hideDUM();

async function preInit(e) {
	e.preventDefault();
	try {
		errorMsg.innerText = "";
		loadingMsg.innerText = "Fetching data....";
		hideDUM();

		let data = await getDataFromInput_withDUM();
		console.log(data);
		spawnDUM(data);

		loadingMsg.innerText = "";
	} catch (err) {
		let errorText = err.message;
		errorMsg.innerText = errorText;
		console.log("Error in init: " + errorText);
		loadingMsg.innerText = "";
	}
}

async function init_2(data) {
	try {
		hideDUM();
		errorMsg.innerText = "";
		loadingMsg.innerText = "Fetching data....";

		let { name, current, hourly, daily } = await getDataFromInput_2(data);

		populateDisplayHeader(name);
		populateCurrentSection(current);
		populateDailySection(daily);
		populateHourlySection(hourly);

		loadingMsg.innerText = "";

		if (FIRST_VISIT) {
			FIRST_VISIT = false;
			disappear();
		}
	} catch (err) {
		let errorText = await err;
		errorMsg.innerText = errorText;
		console.log("Error in init: " + errorText);
		loadingMsg.innerText = "";
	}
}

async function init() {
	try {
		errorMsg.innerText = "";
		loadingMsg.innerText = "Fetching data....";

		let { name, current, hourly, daily } = await getDataFromInput();
		populateDisplayHeader(name);
		populateCurrentSection(current);
		populateDailySection(daily);
		populateHourlySection(hourly);

		loadingMsg.innerText = "";

		if (FIRST_VISIT) {
			FIRST_VISIT = false;
			disappear();
		}
	} catch (err) {
		let errorText = await err;
		errorMsg.innerText = errorText;
		console.log("Error in init: " + errorText);
		loadingMsg.innerText = "";
	}
}

function toPercentage(num) {
	let result = +num * 100;
	return result.toFixed(0);
}

function toSeconds(num) {
	return +num * 1000;
}

function prevBtnInit() {
	const wrapper = document.querySelector(".h-wrapper");
	const card = document.querySelector(".h-card");

	let dimensions = wrapper.getBoundingClientRect();
	let offset = card.getBoundingClientRect();
	let hWidth = dimensions.width - 1.5 * offset.width;

	wrapper.scrollLeft -= hWidth;
}

function nextBtnInit() {
	const wrapper = document.querySelector(".h-wrapper");
	const card = document.querySelector(".h-card");

	let dimensions = wrapper.getBoundingClientRect();
	let offset = card.getBoundingClientRect();
	let hWidth = dimensions.width - 1.5 * offset.width;

	wrapper.scrollLeft += hWidth;
}
