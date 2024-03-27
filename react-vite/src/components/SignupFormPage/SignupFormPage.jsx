import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import logo from '../../../../Photos/Logo.png'
import astronaut from '../../../../Photos/astronaut_icon.png'
import moon from '../../../../Photos/Moon.png'
import './SignupForm.css';

function SignupFormPage({hideNavbar}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  useEffect(()=> {
    if(hideNavbar){
      document.body.classList.add("hide-navbar");

    }
    return () => {
      document.body.classList.remove("hide-navbar")
    }
  },[hideNavbar])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="signup-page-container">
      <img src={moon} className="signup-moon"></img>
      <div className="signup-page-left-side-container">
        <img src={logo} alt="website logo" className="signup-logo" onClick={() => {navigate('/')}}></img>
        <div className="signup-left-side-words">
          <div className="signup-left-side-title">CREATE YOUR LOGIN</div>
          <div className="signup-left-side-line-sub-title">
            <div>WE'LL NEED YOUR NAME, EMAIL ADDRESS, AND A UNIQUE PASSWORD.</div>
            <div>YOU'LL USE THIS LOGIN TO ACCESS STOCK SAVVY NEXT TIME.</div>
          </div>
        </div>
        <img src={astronaut} alt="astronaut image" className="astro-image"></img>
      </div>
      <div className="signup-page-right-side-container">
        <h1 className="signup-right-title">ENTER YOUR FIRST AND LAST NAME AS THEY APPEAR ON YOUR GOVERNMENT ID.</h1>
        {errors.server && <p>{errors.server}</p>}
        <div className="signup-form-container">
          <form onSubmit={handleSubmit}>
            <div className="signup-first-last-name-container">
              <label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="FIRST NAME"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="LAST NAME"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </label>
            </div>
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && <p>{errors.email}</p>}
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            {errors.username && <p>{errors.username}</p>}
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p>{errors.password}</p>}
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;
