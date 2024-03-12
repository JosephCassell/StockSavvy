import './LandingPage.css';
import landingPageImage from '../../../../Photos/Landing_page.png';
import cardImage from '../../../../Photos/Login_background.png';

const LandingPage = () => {
    return (
        <div className="container">
            <img className="main-image" src={landingPageImage} alt="Landing Page" />
            <div className="cards-container">
                <div className="card">
                    <img src={cardImage} alt="Sub Image" />
                </div>
                <div className="card">
                    <img src={cardImage} alt="Sub Image" />
                </div>
                <div className="card">
                    <img src={cardImage} alt="Sub Image" />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
