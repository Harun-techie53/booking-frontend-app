import {
  faBuilding,
  faCircleExclamation,
  faHotel,
  faLocationDot,
  faMoneyCheckDollar,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { apiDelete, apiGet } from "../helpers/axios/config";
import { useEffect, useState } from "react";
import { IMyHotel } from "../types/interfaces";
import { useDispatch } from "react-redux";
import { showToast } from "../states/toastSlice";

type DeleteHotel = {
  hotelId: string;
  imagePublicIds: string[];
};

const MyHotels = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myHotels, setMyHotels] = useState<IMyHotel[]>([]);

  const handleDeleteHotel = async ({
    hotelId,
    imagePublicIds,
  }: DeleteHotel) => {
    const response = await apiDelete({
      apiPath: `/my-hotels/${hotelId}`,
      config: { params: { imagePublicIds } },
      withCredentials: true,
    });

    if (response.status === "success") {
      setMyHotels((prevState) =>
        prevState.filter((hotel) => hotel._id !== hotelId)
      );

      dispatch(
        showToast({ message: response.message, type: "SUCCESS", isShow: true })
      );
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

  const fetchMyHotels = async () => {
    setIsLoading(true);

    const response = await apiGet({
      apiPath: "/my-hotels",
      withCredentials: true,
    });

    if (response.status === "success") {
      setMyHotels([...response.data.hotels]);
    } else {
      setMyHotels([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMyHotels();
    console.log("token", localStorage.getItem("auth"));
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/create-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {myHotels.length > 0 ? (
          myHotels.map((hotel) => (
            <div
              key={hotel._id}
              data-testid="hotel-card"
              className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
            >
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <div className="whitespace-pre-line">{hotel.description}</div>
              <div className="grid grid-cols-5 gap-2">
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                  {hotel.city}, {hotel.country}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                  {hotel.type}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <FontAwesomeIcon icon={faMoneyCheckDollar} className="mr-2" />
                  £ {hotel.pricePerNight} per night
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <FontAwesomeIcon icon={faHotel} className="mr-2" />
                  {hotel.adultCount} adults, {hotel.childCount} children
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  {hotel.starRating} Star Rating
                </div>
              </div>
              <span className="flex justify-end space-x-3">
                <Link
                  to={`/edit-hotel/${hotel._id}`}
                  className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                  View Details
                </Link>
                <button
                  className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500"
                  onClick={() =>
                    handleDeleteHotel({
                      hotelId: hotel?._id,
                      imagePublicIds: hotel?.imageUrls?.map(
                        (img) => img.public_id
                      ),
                    })
                  }
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        ) : (
          <div className="bg-red-500 p-3 mt-12 w-[50%] rounded-sm mx-auto text-xl text-white flex items-center justify-center">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="mr-2"
              fontSize={"1.5rem"}
            />
            <p>No hotels found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHotels;
