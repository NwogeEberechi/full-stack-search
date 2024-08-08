import { memo } from "react";
import { City, Country, Hotel } from "../types";
import Hotels from "./Hotels";
import Countries from "./Countries";
import Cities from "./Cities";

type SearchResultProps = {
  cities: City[];
  countries: Country[];
  hotels: Hotel[];
};

const SearchResult = ({ cities, countries, hotels }: SearchResultProps) => {
  return (
    <>
      {hotels.length || cities.length || countries.length ? (
        <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
          <Hotels hotels={hotels} />
          <Countries countries={countries} />
          <Cities cities={cities} />
        </div>
      ) : null}
    </>
  );
};

const MemoizedSearchResult = memo(SearchResult);
export default MemoizedSearchResult;
