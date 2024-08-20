import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeSearchParam, saveSearchParam } from "../states/searchSlice";
import { faCity, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";

const Searchbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childCount, setChildCount] = useState<number>(0);
  // const [checkIn, setCheckIn] = useState<Date | null>(null);
  // const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      saveSearchParam({
        isSearched: true,
        searchParam: {
          city,
          country,
          adultCount,
          childCount,
        },
      })
    );

    navigate("/search");
  };

  const handleClearSearch = () => {
    dispatch(removeSearchParam());
    setCity("");
    setCountry("");
    setAdultCount(0);
    setChildCount(0);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <FontAwesomeIcon icon={faCity} className="mr-2" />
        <input
          placeholder="Which city to search?"
          className="text-md w-full focus:outline-none"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
      </div>
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <FontAwesomeIcon icon={faEarthAmericas} className="mr-2" />
        <input
          placeholder="Which country to search?"
          className="text-md w-full focus:outline-none"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={20}
            value={adultCount as number}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <label className="items-center flex">
          Children:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>
      {/* <div>
        <ReactDatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          // minDate={minDate}
          // maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div>
        <ReactDatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          // minDate={minDate}
          // maxDate={maxDate}
          placeholderText="Check-out Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div> */}
      <div className="flex gap-1">
        <button
          className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
          type="submit"
        >
          Search
        </button>
        <button
          className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500"
          onClick={handleClearSearch}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
