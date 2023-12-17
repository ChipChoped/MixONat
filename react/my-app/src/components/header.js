import { Logo } from "./logo"
import { Link } from "react-router-dom"
import "../styles/header.scss"

export function Header()
{
    return (
        <>
            <Logo/>
            <div className="header-container">
                <ul>
                    <li>
                        <Link to={"/"} className="header-link">
                            <span>RMN Motor</span>
                        </Link>
                    </li>
                    <li>
                    <Link to={"/sdf"} className="header-link">
                            <span>SDF Database</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/sign-in"} className="header-link">
                            <span>Sign In</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}