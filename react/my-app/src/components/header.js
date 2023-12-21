import { Logo } from "./logo"
import { Link } from "react-router-dom"
import "../styles/header.scss"
import Cookies from 'universal-cookie';

export function Header()
{
    const cookies = new Cookies();

    return (
        <>
            <Logo/>
            <div className="header-container">
                <ul>
                    <li>
                        <a href={"/"} className="header-link">
                            <span>RMN Motor</span>
                        </a>
                    </li>
                    <li>
                    <a href={"/sdf"} className="header-link">
                            <span>SDF Database</span>
                        </a>
                    </li>
                    <li>
                        <a href={"/rmnDB"} className="header-link">
                            <span>RMN Database</span>
                        </a>
                    </li>
                    <li>
                        {cookies.get("authentication_token") ? (
                            <a href={"/"} className="header-link">
                                <span onClick={() =>
                                    cookies.remove("authentication_token")}
                                >Sign Out</span>
                            </a>
                        ) : (
                            <a href={"/sign-in"} className="header-link">
                                <span>Sign In</span>
                            </a>
                        )}
                    </li>
                </ul>
            </div>
        </>
    )
}