const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mt-6 mb-4">
      <input
        type="text"
        placeholder="Search for a team..."
        className="px-4 py-2 border rounded-full w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
