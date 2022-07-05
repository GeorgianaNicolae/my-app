import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function TodayWeatherPage() {
  const location = [
    "London,uk",
    "Berlin",
    "Bucharest",
    "New York",
    "Los Angeles",
  ];
  let nextLocation = location[Math.floor(Math.random() * location.length)];
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    nextLocation +
    "&limit=5&APPID=20a80322473fec1acf735178e1b0525c";
  const [weather, setWeather] = useState([]);
  const [daily, setDaily] = useState([]);
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const temperatureC = useRef(0);
  let placeName = useRef("");

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setWeather(res.data);
        setLon(res.data.coord.lon);
        setLat(res.data.coord.lat);
        temperatureC.current = (res.data.main.temp - 273.15).toFixed();
        placeName.current = res.data.name;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(["weather", weather]);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=20a80322473fec1acf735178e1b0525c`
      )
      .then((res) => {
        setDaily(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(["lon", lon]);
  console.log(["lat", lat]);
  console.log(["daily", daily]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let listItems = useRef(0);
  console.log(["damn", listItems]);
  if (typeof daily.daily == "undefined") {
    listItems = "No data";
  } else {
    listItems = daily.daily.map((day) => {
      var t = new Date(day.dt * 1000).getDay();

      return (
        <li className="list-group-item">
          {days[t]} - {(day.temp.day - 273.15).toFixed(2)} º C
        </li>
      );
    });
  }

  return (
    <div>
      <h1>
        The temperature in {placeName.current} is {temperatureC.current} º C
      </h1>
      <div>
        <h2>The weather for the next 7 days</h2>
        <ul className="list-group">{listItems}</ul>
      </div>
    </div>
  );
}
