import { useEffect, useState } from "react";
import { apiGet } from "../helpers/axios/config";
import { useParams } from "react-router-dom";
import { IMyHotel } from "../types/interfaces";
import CreateHotelForm, { FormMode } from "../components/CreateHotelForm";

const EditHotel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myHotel, setMyHotel] = useState<IMyHotel | null>(null);
  const { hotelId } = useParams();
  const fetchMyHotel = async () => {
    setIsLoading(true);
    const response = await apiGet({
      apiPath: `/my-hotels/${hotelId}`,
      withCredentials: true,
    });

    if (response.status === "success") {
      setMyHotel(response.data.hotel);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMyHotel();
  }, [hotelId]);

  return (
    <div>
      <CreateHotelForm
        hotel={myHotel as IMyHotel}
        isFetchHotelLoading={isLoading}
        formMode={FormMode["EDIT"]}
      />
    </div>
  );
};

export default EditHotel;
