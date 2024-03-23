import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'; 
import { thunkLogout } from '../../redux/session'; 
import logo from '../../../../Photos/Logo.png';
import "./Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const user = useSelector((state) => state.session.user);

  const logout = () => {
    dispatch(thunkLogout()); 
    navigate('/'); 
  };
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        <img src={logo} alt="Stock Savvy Logo" />
      </NavLink>
      <ul className="nav-links">
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
      {!user ? (
        <div className="auth-buttons">
          <li className="login" onClick={() => navigate('/login')}>
            LOG IN
          </li>
          <li className="signup" onClick={() => navigate('/signup')}>
            SIGN UP
          </li>
        </div>
      ) : (
        <div className="user-greeting">
          <span>Welcome, {user.username}!</span>
          <button className="logout" onClick={logout}>
            LOG OUT
          </button>
        </div>
      )}
    </nav>
  );
}
export default Navigation;
