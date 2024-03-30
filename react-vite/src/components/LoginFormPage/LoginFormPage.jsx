import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, redirect, useNavigate } from "react-router-dom";
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
  
  const demoUser = () => {
    setCredential('Demo')
    setPassword('password')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        credential,
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
    <div className="login-container">

      <div className="left-container">
        <img className='stock-savvy' src={logo} alt="website logo" onClick={() => navigate('/')}></img>
      </div>

      <div className="right-container">

        <h1 className="title">LOG IN TO STOCK SAVVY</h1>

        <div className="errors-container">
         {errors.credential || errors.password && <p>{errors.credential}</p>}
        </div>

        <form className='form-container' onSubmit={handleSubmit}>

          <label className="form-label">
            <input
              type="text"
              placeholder="EMAIL OR USERNAME"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              />
          </label>
          <label className="form-label">
            <input
              type="text"
              placeholder="PASSWORD (MIN. 10 CHARACTERS)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
          </label>

          <div className="checkbox-container">
            <input type="checkbox"/>
            <span>KEEP ME LOGGED IN FOR UP TO 30 DAYS</span>
          </div>

          <div className="forgot-cred">
            <div onClick={() => alert('WOMP WOMP')}>FORGOT YOUR PASSWORD?</div>
            <div onClick={() => alert('SUCK TO SUCK!!!')}>FORGOT YOUR EMAIL ADDRESS?</div>
          </div>

          <div className="login-button">
            <button className='submit-button' type='submit' onClick={demoUser}>DEMO USER</button>
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

{/* {errors.length > 0 && errors.map((message) => <p key={message}>{message}</p>)} */}
{/* {errors.password && <p className="login-errors">{errors.password}</p>}  */}