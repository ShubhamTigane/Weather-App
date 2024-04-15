// import axios from "axios";

// interface WeatherDetail {
//   dt: number;
//   main: {
//     temp: number;
//     feels_like: number;
//     temp_min: number;
//     temp_max: number;
//     pressure: number;
//     sea_level: number;
//     grnd_level: number;
//     humidity: number;
//     temp_kf: number;
//   };
//   weather: {
//     id: number;
//     main: string;
//     description: string;
//     icon: string;
//   }[];
//   clouds: {
//     all: number;
//   };
//   wind: {
//     speed: number;
//     deg: number;
//     gust: number;
//   };
//   visibility: number;
//   pop: number;
//   sys: {
//     pod: string;
//   };
//   dt_txt: string;
// }

// interface WeatherData {
//   cod: string;
//   message: number;
//   cnt: number;
//   list: WeatherDetail[];
//   city: {
//     id: number;
//     name: string;
//     coord: {
//       lat: number;
//       lon: number;
//     };
//     country: string;
//     population: number;
//     timezone: number;
//     sunrise: number;
//     sunset: number;
//   };
// }

// export async function fetchWeatherData(city: string): Promise<WeatherData> {
//   const { data } = await axios.get(
//     `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
//   );
//   return data;
// }

import axios from "axios";
import { format, parseISO, fromUnixTime } from "date-fns";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Container from "./Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "./WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNight";
import WeatherDetails from "./WeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "./ForecastWeatherDetail";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
  );
  return data;
}

export default function WeatherComponent() {
  const [city, setCity] = useState("YourCity"); // Set your default city here
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData(city);
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      {/* Navbar with city name */}
      <Navbar location={weatherData?.city.name} />
      
      {/* Main content */}
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Display weather data or skeleton while loading */}
        {loading ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* Display today's weather */}
            <section className="space-y-4">
              {/* Date */}
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(weatherData?.list[0]?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">{format(parseISO(weatherData?.list[0]?.dt_txt ?? ""), "dd.MM.yyyy")}</p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    {/* Temperature */}
                    <span className="text-5xl">
                      {convertKelvinToCelsius(weatherData?.list[0]?.main.temp ?? 0)}°
                    </span>
                    {/* Feels like temperature */}
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {convertKelvinToCelsius(weatherData?.list[0]?.main.feels_like ?? 0)}°
                      </span>
                    </p>
                    {/* Min and max temperature */}
                    <p className="text-xs space-x-1">
                      <span>
                        {convertKelvinToCelsius(weatherData?.list[0]?.main.temp_min ?? 0)}°↓
                      </span>
                      <span>
                        {convertKelvinToCelsius(weatherData?.list[0]?.main.temp_max ?? 0)}°↑
                      </span>
                    </p>
                  </div>
                  {/* Time and weather icon */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {weatherData?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                        />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              {/* Weather details */}
              <div className="flex gap-4">
                {/* Left side */}
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {weatherData?.list[0]?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      weatherData?.list[0]?.weather[0].icon ?? "",
                      weatherData?.list[0]?.dt_txt ?? ""
                    )}
                  />
                </Container>
                {/* Right side */}
                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visibility={metersToKilometers(weatherData?.list[0]?.visibility ?? 10000)}
                    airPressure={`${weatherData?.list[0]?.main.pressure} hPa`}
                    humidity={`${weatherData?.list[0]?.main.humidity}%`}
                    sunrise={format(fromUnixTime(weatherData?.city.sunrise ?? 0), "H:mm")}
                    sunset={format(fromUnixTime(weatherData?.city.sunset ?? 0), "H:mm")}
                    windSpeed={convertWindSpeed(weatherData?.list[0]?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>
            {/* Display 5 days forecast */}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">5 Days Forecast</p>
              {weatherData?.list.slice(1).map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d.dt_txt), "dd.MM")}
                  day={format(parseISO(d.dt_txt), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(fromUnixTime(weatherData?.city.sunrise ?? 0), "H:mm")}
                  sunset={format(fromUnixTime(weatherData?.city.sunset ?? 0), "H:mm")}
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}



function WeatherSkeleton() {
    return (
      <section className="space-y-8 ">
        {/* Today's data skeleton */}
        <div className="space-y-2 animate-pulse">
          {/* Date skeleton */}
          <div className="flex gap-1 text-2xl items-end ">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
          </div>
  
          {/* Time wise temperature skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
  
        {/* 7 days forecast skeleton */}
        <div className="flex flex-col gap-4 animate-pulse">
          <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>
  
          {[1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
              <div className="h-8 w-28 bg-gray-300 rounded"></div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="h-8 w-28 bg-gray-300 rounded"></div>
              <div className="h-8 w-28 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  