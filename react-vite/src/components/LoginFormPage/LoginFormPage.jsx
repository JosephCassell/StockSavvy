import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import logo from '../../../../Photos/Logo.png'
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const loginDemoUser = () => {
    setCredential('Demo');
    setPassword('password1234');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!credential.trim()) {
      newErrors.credential = "Username or email is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serverResponse = await dispatch(thunkLogin({ credential, password }));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };


  return (
    <div className="login-container">

      <div className="left-container">
        <img className='stock-savvy' src={logo} alt="website logo" onClick={() => navigate('/')}></img>
      </div>

      <div className="right-container">

        <h1 className="title">LOG IN TO STOCK SAVVY</h1>

        <form className='form-container' onSubmit={handleSubmit}>

          <label className="form-label">
            <input
              type="text"
              placeholder="EMAIL OR USERNAME"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
            {errors.credential && <p className="error-message">{errors.credential}</p>}
          </label>
          <label className="form-label">
            <input
              type="password"
              placeholder="PASSWORD (MIN. 10 CHARACTERS)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </label>

          <div className="checkbox-container">
            <input type="checkbox" />
            <span>KEEP ME LOGGED IN FOR UP TO 30 DAYS</span>
          </div>

          <div className="forgot-cred">
            <div onClick={() => alert('Account recovery feature coming soon!')}>FORGOT YOUR PASSWORD?</div>
            <div onClick={() => alert('Account recovery feature coming soon!')}>FORGOT YOUR EMAIL ADDRESS?</div>
          </div>

          <div className="login-button">
            <button className='submit-button' type='button' onClick={loginDemoUser}>DEMO USER</button>
            <button className='submit-button' type="submit">LOG IN</button>
          </div>
        </form>

        <div className="footer-container">
          <div>NOT ON STOCK SAVVY?</div>
          <span onClick={() => navigate('/signup')}>CREATE AN ACCOUNT</span>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
