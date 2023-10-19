import logo from "../assets/img/logo2.png"
import "../styles/logo.scss"

export function Logo()
{
    // Component for the Image logo 
    return (
        <div className="logo-container">
            <img src={logo} alt="Logo"/>
        </div>
    )
}