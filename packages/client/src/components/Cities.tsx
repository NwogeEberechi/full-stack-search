import { memo } from "react";
import { Link } from "react-router-dom";
import { City } from "../types";

type CitiesProps = {
  cities: City[];
};

const Cities = ({ cities }: CitiesProps) => {
  return (
    <>
      <h2>Cities</h2>
      {cities?.length ? (
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
    </>
  );
};

const MemoizedCities = memo(Cities);
export default MemoizedCities;
