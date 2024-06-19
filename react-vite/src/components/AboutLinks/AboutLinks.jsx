import { SiRedux, SiPostgresql, SiFlask } from "react-icons/si";
import "./AboutLinks.css";

function AboutLinks() {
    return (
        <div className='footer'>
            <div className='footer-heading'>
                <div className="dev-heading" >Developers
                    <div className='devs'>
                        <div className="aDev">
                            <div className="devLogos">
                                <a href='https://www.linkedin.com/in/joseph-cassell-9465a1309//' target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-linkedin fa-lg"></i>
                                    </span>
                                </a>
                                <a href="https://github.com/JosephCassell" target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-github fa-lg"></i>
                                    </span>
                                </a>
                            </div>
                            <span className="names">Joseph Cassell</span>
                        </div>
                        <div className="aDev">
                            <div className="devLogos">
                                <a href='https://www.linkedin.com/in/landon-hurst-863b87295//' target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-linkedin fa-lg"></i>
                                    </span>
                                </a>
                                <a href="https://github.com/LANDNh" target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-github fa-lg"></i>
                                    </span>
                                </a>
                            </div>
                            <span className="names">Landon Hurst</span>
                        </div>
                        <div className="aDev">
                            <div className="devLogos">
                                <a href='https://www.linkedin.com/in/nipaporn-muenseeprom-814506ba/' target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-linkedin fa-lg"></i>
                                    </span>
                                </a>
                                <a href="https://github.com/Nooklier" target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-github fa-lg"></i>
                                    </span>
                                </a>
                            </div>
                            <span className="names">Nook Muenseeprom</span>
                        </div>
                    </div>
                </div>
                <div className='dev-heading'>Technologies
                    <div className='techs'>
                        <div className='backend'>
                            <a href='https://docs.python.org/3/' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-python fa-lg"></i>
                            </a>
                            <a href='https://flask.palletsprojects.com/en/3.0.x/' target="_blank" rel="noopener noreferrer">
                                <SiFlask />
                            </a>
                            <a className="postgres" href='https://www.postgresql.org/docs/' target="_blank" rel="noopener noreferrer">
                                <SiPostgresql />
                            </a>
                            <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-js fa-lg"></i>
                            </a>
                            <a href='https://react.dev/' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-react fa-lg"></i>
                            </a>
                            <a href='https://redux.js.org/' target="_blank" rel="noopener noreferrer">
                                <SiRedux />
                            </a>
                            <a href='https://developer.mozilla.org/en-US/docs/Web/HTML' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-html5 fa-lg"></i>
                            </a>
                            <a href='https://www.w3.org/Style/CSS/Overview.en.html' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-css3-alt fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='dev-heading'>Docs
                    <div className='docs'>
                        <a className="docs-links" href='https://github.com/JosephCassell/StockSavvy' target="_blank" rel="noopener noreferrer">
                            Repository
                        </a>
                        <a className="docs-links" href='https://github.com/JosephCassell/StockSavvy/wiki' target="_blank" rel="noopener noreferrer">
                            Wiki
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutLinks;
