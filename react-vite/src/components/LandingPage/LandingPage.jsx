import landingPageImage from '../../../../Photos/landing_page_large_banner_2.png';
import cardImage1 from '../../../../Photos/landing_page_small_banner_1.png';
import cardImage2 from '../../../../Photos/landing_page_small_banner_2.png';
import cardImage3 from '../../../../Photos/landing_page_small_banner_3.png';
import './LandingPage.css';


const LandingPage = () => {
    // const user = useSelector((state) => state.session.user);
    // console.log(user); // Check if the user is defined
    return (
        <div className="container">
            <img className="main-image" src={landingPageImage} alt="Landing Page" />
            <div className="cards-container">
                <div className="card">
                    <img src={cardImage1} alt="Sub Image" />
                </div>
                <div className="card">
                    <img src={cardImage2} alt="Sub Image" />
                </div>
                <div className="card">
                    <img src={cardImage3} alt="Sub Image" />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
