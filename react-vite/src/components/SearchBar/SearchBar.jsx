import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchStocks } from "../../redux/stockActions";
import './SearchBar.css';
const SearchBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchDropdownRef = useRef(null);

    
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
          dispatch(searchStocks(query))
            .then((action) => {
              if (action?.payload) {
                setSearchResults(action.payload);
              } else {
                console.error('Dispatch did not return an action object.');
              }
            })
            .catch((error) => {
              console.error('Error searching stocks:', error);
            });
        } else {
          setSearchResults([]);
        }
    };
      
    
  
  
      

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(event.target)
            ) {
                setSearchResults([]);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <li className="search-bar">
            <input
                type="text"
                placeholder="Search Stocks..."
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
                <div ref={searchDropdownRef} className="search-results-dropdown">
                    {searchResults.map((stock) => (
                        <div
                            key={stock.symbol}
                            className="search-result-item"
                            onClick={() => navigate(`/stockDetails/${stock.symbol}`)}
                        >
                            {stock.name} ({stock.symbol})
                        </div>
                    ))}
                </div>
            )}
        </li>
    );
};

export default SearchBar;
