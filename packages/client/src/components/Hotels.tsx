import { memo } from "react";
import { Link } from "react-router-dom";
import { Hotel } from "../types";

type HotelsProps = {
  hotels: Hotel[];
};
const Hotels = ({ hotels }: HotelsProps) => {
  return (
    <>
      <h2>Hotels</h2>
      {hotels?.length ? (
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
    </>
  );
};

const MemoizedHotels = memo(Hotels);
export default MemoizedHotels;
