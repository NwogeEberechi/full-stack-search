import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { getCodeSandboxHost } from "@codesandbox/utils";
import AppLayout from "./AppLayout";

type Hotel = {
  _id: string;
  chain_name: string;
  hotel_name: string;
  city: string;
  country: string;
};
type City = { name: string };
type Country = { country: string };

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

const fetchFilteredData = async (value: string) => {
  if (value === "") {
    return { hotels: [], cities: [], countries: [] };
  }

  const response = await fetch(`${API_URL}/search?query=${value}`);
  return response.json();
};

function SearchHotel() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedFetchData = useCallback(
    debounce(async (value: string) => {
      const { hotels, cities, countries } = await fetchFilteredData(value);
      setHotels(hotels);
      setCities(cities);
      setCountries(countries);
      setShowClearBtn(value !== "");
    }, 300),
    []
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
      debouncedFetchData(value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setHotels([]);
    setCities([]);
    setCountries([]);
    setSearchQuery("");
    setShowClearBtn(false);
  }, []);

  return (
    <AppLayout>
      <div className="dropdown">
        <div className="form">
          <i className="fa fa-search"></i>
          <input
            type="text"
            className="form-control form-input"
            placeholder="Search accommodation..."
            value={searchQuery}
            onChange={handleChange}
          />
          {showClearBtn && (
            <span className="left-pan" onClick={clearSearch}>
              <i className="fa fa-close"></i>
            </span>
          )}
        </div>
        {!!hotels.length || !!cities.length || !!countries.length ? (
          <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
            <h2>Hotels</h2>
            {hotels.length ? (
              hotels.map((hotel, index) => (
                <li key={index}>
                  <Link to={`/hotels/${hotel._id}`} className="dropdown-item">
                    <i className="fa fa-building mr-2"></i>
                    {hotel.hotel_name}
                  </Link>
                  <hr className="divider" />
                </li>
              ))
            ) : (
              <p>No hotels matched</p>
            )}
            <h2>Countries</h2>
            {countries.length ? (
              countries.map((country, index) => (
                <li key={index}>
                  <Link
                    to={`/countries/${country.country}`}
                    className="dropdown-item"
                  >
                    <i className="fa fa-flag mr-2"></i>
                    {country.country}
                  </Link>
                  <hr className="divider" />
                </li>
              ))
            ) : (
              <p>No countries matched</p>
            )}
            <h2>Cities</h2>
            {cities.length ? (
              cities.map((city, index) => (
                <li key={index}>
                  <Link to={`/cities/${city.name}`} className="dropdown-item">
                    <i className="fa fa-city mr-2"></i>
                    {city.name}
                  </Link>
                  <hr className="divider" />
                </li>
              ))
            ) : (
              <p>No cities matched</p>
            )}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}

export default SearchHotel;
