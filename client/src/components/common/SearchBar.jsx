const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}) => {
  return (
    <input
      type="text"
      className="form-control mb-3"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />
  );
};

export default SearchBar;