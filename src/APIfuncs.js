// import fetch from "node-fetch";

async function getLatLonData(name) {
	try {
		let response = await fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=0ef8f50d14aee0ab81ad9bef14aa0d56`
		);
		let data = await response.json();
		return {
			name: data[0].name,
			country: data[0].country,
			lat: data[0].lat,
			lon: data[0].lon,
		};
	} catch (err) {
		if (name === "") throw "Type something!";
		throw "Oops, can't find that location.";
	}
}

async function getWeatherData_OVERALL(obj) {
	try {
		let response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${obj.lat}&lon=${obj.lon}&appid=0ef8f50d14aee0ab81ad9bef14aa0d56&units=metric`
		);
		let data = await response.json();
		return { current: data.current, hourly: data.hourly, daily: data.daily };
	} catch (err) {
		throw "Oops, something went wrong. Try again";
	}
}

export { getLatLonData, getWeatherData_OVERALL };
