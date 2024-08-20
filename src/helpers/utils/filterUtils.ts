export const getSortByQueryString = (value?: string): string => {
  let sortByStr: string = "";
  if (value === "starRating") {
    sortByStr = "-starRating";
  } else if (value === "pricePerNightAsc") {
    sortByStr = "pricePerNight";
  } else if (value === "pricePerNightDesc") {
    sortByStr = "-pricePerNight";
  } else {
    sortByStr = "";
  }

  return sortByStr;
};
