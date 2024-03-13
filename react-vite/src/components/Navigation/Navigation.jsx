import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import logo from '../../../../Photos/Logo2.png';
import logo from '../../../../Photos/Logo2.png';
import "./Navigation.css";

function Navigation({ user }) {
  const navigate = useNavigate();
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
      {!user && (
        <div className="auth-buttons">
          <li onClick={() => {
            navigate('/login');
          }}>
            Log In
          </li>
          <li onClick={() => {
            navigate('/signup');
          }}>
            Sign Up
          </li>
        </div>
      )}
      {user && <ProfileButton />}
    </nav>
  );
}

export default Navigation;
