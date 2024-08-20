import { useParams } from "react-router-dom";
import { apiGet } from "../helpers/axios/config";
import { IMyHotel } from "../types/interfaces";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../states/toastSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import GuestInfoForm from "../components/GuestInfoForm";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<IMyHotel | null>(null);
  const dispatch = useDispatch();

  const fetchHotel = async () => {
    const response = await apiGet({ apiPath: `/hotels/${hotelId}` });

    if (response.status === "success") {
      setHotel(response.data.hotel);
    } else {
      dispatch(
        showToast({
          message: response.errorMessage,
          type: "ERROR",
          isShow: true,
        })
      );
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <FontAwesomeIcon icon={faStar} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image.url}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
