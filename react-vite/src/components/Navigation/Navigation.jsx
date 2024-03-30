import { NavLink, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thunkLogout } from '../../redux/session';
import { useState, useEffect, useRef } from 'react';
import { fetchInitialBalance } from '../../redux/transferActions';
import TransferModal from "../TransferModal/TransferModal";
import SearchBar from "../SearchBar/SearchBar";
import logo from '../../../../Photos/Logo.png';
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const dropdownRef = useRef(null);
  const accountButtonRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchInitialBalance(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !(accountButtonRef.current && accountButtonRef.current.contains(event.target)) &&
        showDropdown
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const openTransferModal = () => {
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
  };

  const handleTransferSuccess = (message) => {
    setSuccessMessage(message);
  };

  const logout = () => {
    dispatch(thunkLogout());
    setShowDropdown(false);
    navigate('/');
  };

  const profile = () => {
    setShowDropdown(false);
    navigate('profile')
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const loggedInLinks = user && (
    <ul className="nav-links-authorized">
      <SearchBar />
      <li>
        <NavLink to="/profile?tab=stock" className="Investing">INVESTING</NavLink>
      </li>
      <li>
        <NavLink to="/profile?tab=stock" className="Stocks">STOCKS</NavLink>
      </li>
      <li>
        <NavLink to="/profile?tab=watchlist" className="Watchlists">WATCHLISTS</NavLink>
      </li>
      <li>
        <NavLink to="/profile?tab=portfolio" className="Portfolios">PORTFOLIOS</NavLink>
      </li>
      <li>
        <button className="Transfer" onClick={openTransferModal}>TRANSFER</button>
      </li>
      <li>
        <NavLink to="/profile?tab=stock" className="Notifications">NOTIFICATIONS</NavLink>
      </li>
      <li className="account-nav-item">
        <button ref={accountButtonRef} onClick={toggleDropdown} className="Account">
          ACCOUNT
          <div className="hamburger-menu"></div>
        </button>
        {showDropdown && (
          <div ref={dropdownRef} className="account-dropdown show-dropdown">
            <button onClick={profile} className="profile">{user.first_name} {user.last_name}</button>
            <button onClick={logout} className="logout">LOG OUT</button>
          </div>
        )}
      </li>
    </ul>
  );

  const loggedOutLinks = (
    <ul className="nav-links-unauthorized">
      <li>
        <NavLink to="/" className="What">WHAT WE OFFER</NavLink>
      </li>
      <li>
        <NavLink to="/" className="Gold">GOLD</NavLink>
      </li>
      <li>
        <NavLink to="/" className="Learn">LEARN</NavLink>
      </li>
      <li>
        <NavLink to="/" className="Snacks">SNACKS</NavLink>
      </li>
      <li>
        <NavLink to="/" className="Support">SUPPORT</NavLink>
      </li>
    </ul>
  );

  const logoClass = user ? "logo-image-only" : "logo";

  return (
    <nav className="navbar">
      <NavLink to="/" className={logoClass}>
        <img src={logo} alt="Stock Savvy Logo" />
      </NavLink>
      {user ? loggedInLinks : loggedOutLinks}
      {!user && (
        <div className="auth-buttons">
          <li className="login" onClick={() => navigate('/login')}>
            LOG IN
          </li>
          <li className="signup" onClick={() => navigate('/signup')}>
            SIGN UP
          </li>
        </div>
      )}
      {showTransferModal && (
        <TransferModal onClose={closeTransferModal} userId={user.id} onSuccess={handleTransferSuccess} />
      )}
      {successMessage && (
        <div className="popup-overlay" onClick={() => setSuccessMessage('')}>
          <div className="popup-message">
            {successMessage}
            <div>(click to close)</div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
