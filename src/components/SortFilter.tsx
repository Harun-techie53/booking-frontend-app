interface Props {
  handleSelectedSortBy: (value: string) => void;
  sortBy: string;
}

const SortFilter = ({ handleSelectedSortBy, sortBy }: Props) => {
  return (
    <select
      value={sortBy}
      onChange={(event) => handleSelectedSortBy(event.target.value)}
      className="p-2 border rounded-md"
    >
      <option value="">Sort By</option>
      <option value="starRating">Star Rating</option>
      <option value="pricePerNightAsc">Price Per Night (low to high)</option>
      <option value="pricePerNightDesc">Price Per Night (high to low)</option>
    </select>
  );
};

export default SortFilter;
