import { memo } from "react";
import { Link } from "react-router-dom";
import { Country } from "../types";

type CountriesProps = {
  countries: Country[];
};

const Countries = ({ countries }: CountriesProps) => {
  return (
    <>
      <h2>Countries</h2>
      {countries?.length ? (
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
    </>
  );
};

const MemoizedCountries = memo(Countries);
export default MemoizedCountries;
