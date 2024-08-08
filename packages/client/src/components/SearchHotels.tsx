import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { API_URL } from "../constants";
import { Hotel, City, Country } from "../types";
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import AppLayout from "./AppLayout";

const fetchFilteredData = async (value: string) => {
  if (!value) {
    return { hotels: [], cities: [], countries: [] };
  }

  const response = await fetch(`${API_URL}/search?query=${value}`);
  return response.json();
};

const SearchHotel = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedFetchData = useCallback(
    debounce(async (value: string) => {
      const { hotels, cities, countries } = await fetchFilteredData(value);
      setHotels(hotels);
      setCities(cities);
      setCountries(countries);
    }, 300),
    []
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
      debouncedFetchData(value);
    },
    [debouncedFetchData]
  );

  const clearSearch = useCallback(() => {
    setHotels([]);
    setCities([]);
    setCountries([]);
    setSearchQuery("");
  }, []);

  return (
    <AppLayout>
      <div className="dropdown">
        <SearchForm
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          clearSearch={clearSearch}
        />
        <SearchResult hotels={hotels} countries={countries} cities={cities} />
      </div>
    </AppLayout>
  );
};

export default SearchHotel;
