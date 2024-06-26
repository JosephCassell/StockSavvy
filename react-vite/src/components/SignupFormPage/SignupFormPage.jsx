import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import logo from '../../../../Photos/Logo.png'
import astronaut from '../../../../Photos/astronaut_icon.png'
import moon from '../../../../Photos/Moon.png'
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};

    if (!first_name.trim()) {
      newErrors.first_name = "First name is required.";
    }
    if (!last_name.trim()) {
      newErrors.last_name = "Last name is required.";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serverResponse = await dispatch(thunkSignup({
      first_name,
      last_name,
      email,
      username,
      password
    }));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };



  return (
    <div className="signup-container">
      <img src={moon} className="moon"></img>

      <div className="signup-left-container">
        <img src={logo} alt="website logo" className="stock-savvy" onClick={() => { navigate('/') }}></img>

        <div className="signup-left-side-words">
          <div className="signup-left-side-title">CREATE YOUR LOGIN</div>
          <div className="signup-left-side-line-sub-title">
            <div>WE&apos;LL NEED YOUR NAME, EMAIL ADDRESS, AND A UNIQUE PASSWORD.</div>
            <div>YOU&apos;LL USE THIS LOGIN TO ACCESS STOCK SAVVY NEXT TIME.</div>
          </div>
        </div>

        <img src={astronaut} alt="astronaut image" className="astro-image"></img>
      </div>

      <div className="signup-right-container">
        <h1 className="signup-title">ENTER YOUR FIRST AND LAST NAME AS THEY APPEAR ON YOUR GOVERNMENT ID.</h1>

        <div className="signup-form-container">

          <form onSubmit={handleSubmit}>

            <div className="name-container">
              <label>
                <input
                  className='names-input'
                  type="text"
                  name="first_name"
                  placeholder="FIRST NAME"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
              </label>
              <label>
                <input
                  className='names-input'
                  type="text"
                  name="last_name"
                  placeholder="LAST NAME"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.last_name && <p className="error-message">{errors.last_name}</p>}
              </label>
            </div>

            <div className='email-container'>
              <label>
                <input
                  type="text"
                  placeholder='EMAIL'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </label>
            </div>

            <div className='username-container'>
              <label>
                <input
                  type="text"
                  placeholder='USERNAME'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
              </label>
            </div>

            <div className='password-container'>
              <label>
                <input
                  type="password"
                  placeholder='PASSWORD (MIN. 10 CHARACTERS)'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </label>
            </div>

            <div className='confirm-container'>
              <label>
                <input
                  type="password"
                  placeholder='CONFIRM PASSWORD'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </label>
            </div>
            <div className='bottom-text'>
              <div>ALREADY HAVE AN ACCOUNT?</div>
              <p onClick={() => navigate('/login')}>LOG IN TO COMPLETE YOUR APPLICATION</p>
            </div>
            <div className='button-container'>
              <button className='signup-button' type="submit">SIGN UP</button>
            </div>
          </form>

          <div className='signup-footer'>
            <div onClick={() => alert('Thanks for clicking!')}>BY CONTINUING, YOU AGREE TO THE STOCK SAVVY USER ACCOUNT</div>
            <div onClick={() => alert('Thanks for clicking!')}>AGREEMENT AND PRIVACY POLICY.</div>
          </div>
        </div>
        {errors.server && <p>{errors.server}</p>}
        {errors.email && <p>{errors.email}</p>}
        {errors.username && <p>{errors.username}</p>}
        {errors.password && <p>{errors.password}</p>}
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      </div>

    </div>
  );
}

export default SignupFormPage;
