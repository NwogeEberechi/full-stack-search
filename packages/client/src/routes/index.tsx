import { Route, Routes, Navigate } from "react-router-dom";
import SearchHotel from "../components/SearchHotels";
import ItemDetail from "../components/ItemDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchHotel />} />
      <Route path="/:type/:id" element={<ItemDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
