import { useMemo, useState } from "react";
import { FilterParams } from "../pages/Search";
import { useDispatch, useSelector } from "react-redux";
import { resetFilterParams, saveFilterParams } from "../states/filterSlice";
import { utils } from "../helpers/utils";
import { RootState } from "../states/reducer";

export const useFilterHotels = () => {
  const { filter: filterState } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    starRatings: [],
    hotelTypes: [],
    hotelFacilities: [],
    maxPrice: null,
    sortBy: "",
  });

  const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (filterParams.starRatings.includes(inputValue)) {
      setFilterParams({
        ...filterParams,
        starRatings: filterParams.starRatings.filter(
          (star) => star !== inputValue
        ),
      });
    } else {
      setFilterParams({
        ...filterParams,
        starRatings: [...filterParams.starRatings, inputValue],
      });
    }
  };

  const handleHotelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (filterParams.hotelTypes.includes(inputValue)) {
      setFilterParams({
        ...filterParams,
        hotelTypes: filterParams.hotelTypes.filter(
          (type) => type !== inputValue
        ),
      });
    } else {
      setFilterParams({
        ...filterParams,
        hotelTypes: [...filterParams.hotelTypes, inputValue],
      });
    }
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (filterParams.hotelFacilities.includes(inputValue)) {
      setFilterParams({
        ...filterParams,
        hotelFacilities: filterParams.hotelFacilities.filter(
          (facility) => facility !== inputValue
        ),
      });
    } else {
      setFilterParams({
        ...filterParams,
        hotelFacilities: [...filterParams.hotelFacilities, inputValue],
      });
    }
  };

  const handleSelectedMaxPrice = (value: number) => {
    setFilterParams({
      ...filterParams,
      maxPrice: value,
    });
  };

  const handleSelectedSortBy = (value: string) => {
    setFilterParams({
      ...filterParams,
      sortBy: value,
    });

    dispatch(
      saveFilterParams({
        isFilterEnable: true,
        filterParams: { ...filterParams, sortBy: value },
      })
    );
  };

  const isResetFilterEnable = useMemo(
    () =>
      filterParams.starRatings.length !== 0 ||
      filterParams.hotelTypes.length !== 0 ||
      filterParams.hotelFacilities.length !== 0 ||
      filterParams.maxPrice !== null ||
      filterParams.sortBy !== "",
    [filterParams]
  );

  const handleResetFilter = () => {
    dispatch(resetFilterParams());
    setFilterParams({
      ...filterParams,
      starRatings: [],
      hotelTypes: [],
      hotelFacilities: [],
      sortBy: "",
      maxPrice: 0,
    });
  };

  const handleApplyFilter = () => {
    dispatch(saveFilterParams({ isFilterEnable: true, filterParams }));
  };

  const isApplyFilterEnable = useMemo(
    () =>
      isResetFilterEnable &&
      !utils.isTwoObjectEqual(filterParams, filterState.filterParams),
    [filterParams, filterState.filterParams, isResetFilterEnable]
  );

  return {
    handleStarsChange,
    handleFacilityChange,
    handleHotelTypeChange,
    handleSelectedMaxPrice,
    handleSelectedSortBy,
    filterParams,
    handleResetFilter,
    isResetFilterEnable,
    handleApplyFilter,
    isApplyFilterEnable,
  };
};
