"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface City {
  geoname_id: string;
  name: string;
  population: number;
  cou_name_en: string;
  timezone: string;
}

const CityTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiUrl =
    // "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?";
    "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100";
  // "https://public.opendatasoft.com/explore/embed/dataset/geonames-all-cities-with-a-population-1000/table/?disjunctive.cou_name_en&sort=name";

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allCities: City[] = [];
        let url = apiUrl;
        while (url) {
          const response = await axios.get(url);
          allCities = [...allCities, ...response.data.results];
          url = response.data.next_page; // Assuming the API provides a 'next_page' property for pagination
        }
        setCities(allCities);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  
  
  const handleCityClick = (cityName: string) => {
    // Redirect to weather details page for the selected city
    window.location.href = `/weather/${encodeURIComponent(cityName)}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cities</h2>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Population</th>
            <th className="border px-4 py-2">Country</th>
            <th className="border px-4 py-2">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr
              key={city.geoname_id}
              onClick={() => handleCityClick(city.name)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{city.name}</td>
              <td className="border px-4 py-2">{city.population}</td>
              <td className="border px-4 py-2">{city.cou_name_en}</td>
              <td className="border px-4 py-2">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
