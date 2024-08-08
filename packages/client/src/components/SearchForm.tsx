import { memo } from "react";

type SearchFormProps = {
  searchQuery: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
};

const SearchForm = ({
  searchQuery,
  handleInputChange,
  clearSearch,
}: SearchFormProps) => {
  return (
    <div className="form">
      <i className="fa fa-search"></i>
      <input
        type="text"
        className="form-control form-input"
        placeholder="Search accommodation..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      {searchQuery.length > 0 && (
        <span className="left-pan" onClick={clearSearch}>
          <i className="fa fa-close"></i>
        </span>
      )}
    </div>
  );
};

const MemoizedSearchForm = memo(SearchForm);
export default MemoizedSearchForm;
