// import fetch from "node-fetch";

async function getLatLonData(name) {
	let response = await fetch(
		`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=0ef8f50d14aee0ab81ad9bef14aa0d56`
	);
	let data = await response.json();
	console.log(data);
	return {
		name: data[0].name,
		country: data[0].country,
		lat: data[0].lat,
		lon: data[0].lon,
	};
}

async function getWeatherData_OVERALL(obj) {
	let response = await fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${obj.lat}&lon=${obj.lon}&appid=0ef8f50d14aee0ab81ad9bef14aa0d56&units=metric`
	);
	let data = await response.json();
	return { current: data.current, hourly: data.hourly, daily: data.daily };
}

export { getLatLonData, getWeatherData_OVERALL };
