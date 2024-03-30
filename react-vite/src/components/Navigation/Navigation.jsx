import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'; 
import { thunkLogout } from '../../redux/session'; 
import { useState, useEffect } from 'react'; 
import { fetchInitialBalance } from '../../redux/transferActions';
import TransferModal from "../TransferModal/TransferModal";
import logo from '../../../../Photos/Logo.png';
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      dispatch(fetchInitialBalance(user.id));
    }
  }, [user, dispatch]);

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
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const loggedInLinks = (
    <ul className="nav-links-authorized">
      <li>
        <NavLink to="/investing" className="Investing">INVESTING</NavLink>
      </li>
      <li>
        <NavLink to="/stocks" className="Stocks">STOCKS</NavLink>
      </li>
      <li>
        <NavLink to="/watchlists" className="Watchlists">WATCHLISTS</NavLink>
      </li>
      <li>
        <NavLink to="/portfolios" className="Portfolios">PORTFOLIOS</NavLink>
      </li>
      <li>
      <button className="Transfer" onClick={openTransferModal}>TRANSFER</button>
      </li>
      <li>
        <NavLink to="/notifications" className="Notifications">NOTIFICATIONS</NavLink>
      </li>
      <li className="account-nav-item">
        <button onClick={toggleDropdown} className="Account">
          ACCOUNT 
          <div className="hamburger-menu"></div></button>
        {showDropdown && (
          <div className="account-dropdown show-dropdown">
            {/* Dropdown menu items here */}
            <button onClick={logout} className="logout">LOG OUT</button>
          </div>
        )}
      </li>
    </ul>
  );

  const loggedOutLinks = (
    <ul className="nav-links-unauthorized">
      <li>
        <NavLink to="/what-we-offer" className="What">WHAT WE OFFER</NavLink>
      </li>
      <li>
        <NavLink to="/gold" className="Gold">GOLD</NavLink>
      </li>
      <li>
        <NavLink to="/learn" className="Learn">LEARN</NavLink>
      </li>
      <li>
        <NavLink to="/snacks" className="Snacks">SNACKS</NavLink>
      </li>
      <li>
        <NavLink to="/support" className="Support">SUPPORT</NavLink>
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
