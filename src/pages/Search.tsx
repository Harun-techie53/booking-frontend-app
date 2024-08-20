import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states/reducer";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import Pagination from "../components/Pagination";
import { apiGet } from "../helpers/axios/config";
import { IMyHotel } from "../types/interfaces";
import { showToast } from "../states/toastSlice";
import SearchResultsCard from "../components/SearchResultsCard";
import { getSortByQueryString } from "../helpers/utils/filterUtils";
import { useFilterHotels } from "../customHooks/useFilterHotels";
import SortFilter from "../components/SortFilter";

type IMetaData = {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_documents: number;
};

export type FilterParams = {
  starRatings: string[];
  hotelTypes: string[];
  hotelFacilities: string[];
  maxPrice: number | null;
  sortBy?: string;
};

const Search = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hotelsData, setHotelsData] = useState<IMyHotel[]>([]);
  const [hotelsMetaData, setHotelsMetaData] = useState<IMetaData | null>(null);
  const [page, setPage] = useState<number>(1);
  const { search: searchState, filter: filterState } = useSelector(
    (state: RootState) => state
  );
  const dispatch = useDispatch();
  const {
    filterParams,
    handleStarsChange,
    handleFacilityChange,
    handleHotelTypeChange,
    handleSelectedSortBy,
    handleSelectedMaxPrice,
    handleResetFilter,
    isResetFilterEnable,
    handleApplyFilter,
    isApplyFilterEnable,
  } = useFilterHotels();

  const page_size = 5;

  const fetchAllHotels = async () => {
    let queryObj: { [key: string]: any } = {};

    if (filterState.filterParams.starRatings.length !== 0) {
      queryObj.starRatings = filterState.filterParams.starRatings;
    }

    if (filterState.filterParams.hotelTypes.length !== 0) {
      queryObj.hotelTypes = filterState.filterParams.hotelTypes;
    }

    if (filterState.filterParams.hotelFacilities.length !== 0) {
      queryObj.hotelFacilities = filterState.filterParams.hotelFacilities;
    }

    if (
      filterState.filterParams.maxPrice !== null &&
      filterState.filterParams.maxPrice !== undefined
    ) {
      queryObj.maxPrice = filterState.filterParams.maxPrice;
    }

    if (searchState.searchParam?.city !== "") {
      queryObj.city = searchState.searchParam?.city;
    }

    if (searchState.searchParam?.country !== "") {
      queryObj.country = searchState.searchParam?.country;
    }

    if (searchState.searchParam?.adultCount !== 0) {
      queryObj.adultCount = searchState.searchParam?.adultCount;
    }

    if (searchState.searchParam?.childCount !== 0) {
      queryObj.childCount = searchState.searchParam?.childCount;
    }

    const params = {
      page,
      limit: page_size,
      fields: "-adultCount,-childCount,-__v",
      filter: queryObj,
      sort: getSortByQueryString(filterParams.sortBy),
    };

    setIsLoading(true);
    const response = await apiGet({
      apiPath: "/hotels",
      config: { params },
      withCredentials: true,
    });

    if (response.status === "success") {
      setHotelsData(response.data.hotels);
      setHotelsMetaData(response.meta);
      setIsLoading(false);
    } else {
      dispatch(
        showToast({
          message: response.errorMessage,
          type: "ERROR",
          isShow: true,
        })
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHotels();
  }, [page, filterState.filterParams, searchState.searchParam]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10 space-y-5">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={filterParams.starRatings}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={filterParams.hotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={filterParams.hotelFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={filterParams.maxPrice as number}
            onChange={handleSelectedMaxPrice}
          />
        </div>
        <div className="space-x-3">
          <button
            className={`bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500 ${
              !isApplyFilterEnable ? "opacity-90" : "opacity-100"
            }`}
            onClick={handleApplyFilter}
            disabled={!isApplyFilterEnable}
          >
            Apply
          </button>
          <button
            className={`bg-red-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-red-500 ${
              !isResetFilterEnable ? "opacity-90" : "opacity-100"
            }`}
            onClick={handleResetFilter}
            disabled={!isResetFilterEnable}
          >
            Reset
          </button>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelsMetaData?.total_documents} Hotels found
              {searchState?.searchParam?.city
                ? ` in ${searchState?.searchParam?.city}`
                : ""}
            </span>
            <SortFilter
              handleSelectedSortBy={handleSelectedSortBy}
              sortBy={filterParams.sortBy as string}
            />
          </div>
          {hotelsData?.map((hotel) => (
            <SearchResultsCard hotel={hotel} />
          ))}
          <div>
            <Pagination
              page={hotelsMetaData?.current_page || 1}
              pages={hotelsMetaData?.total_pages || 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
