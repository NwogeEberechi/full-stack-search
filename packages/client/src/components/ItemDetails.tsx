// ItemDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const fetchItemDetail = async (
  type: string | undefined,
  id: string | undefined
) => {
  const response = await fetch(`http://localhost:3001/${type}/${id}`);
  return response.json();
};

const ItemDetail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [item, setItem] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const data = await fetchItemDetail(type, id);
      setItem(data);
    };

    fetchItem();
  }, [type, id]);

  if (!item) return <p>Loading...</p>;

  return (
    <AppLayout>
      <div className="bg-white p-4 rounded shadow-md">
        <div
          onClick={() => navigate(-1)}
          className="cursor-pointer text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          <i className="fa fa-arrow-left mr-2"></i> Back
        </div>
        <h1 className="text-center">
          {type === "hotels"
            ? item?.hotel_name
            : type === "cities"
            ? item?.name
            : item?.country}
        </h1>
      </div>
    </AppLayout>
  );
};

export default ItemDetail;
