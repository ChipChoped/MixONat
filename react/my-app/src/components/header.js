import { Logo } from "./logo"
import "../styles/header.scss"
import Cookies from 'universal-cookie';

export function Header()
{
    const cookies = new Cookies();

    return (
        <>
            <Logo/>
            <div className={cookies.get("authentication_token")
                ? "header-container-signed-in"
                : "header-container-signed-out"}
            >
                <ul>
                    <li>
                        <a href={"/"} className="header-link">
                            <span>RMN Motor</span>
                        </a>
                    </li>
                    {cookies.get("authentication_token")
                        ? <li>
                            <a href={"/file"} className="header-link">
                                <span>File Database</span>
                            </a>
                        </li>
                        : null}
                    {cookies.get("authentication_token")
                        ? <li>
                            <a href={"/profile"} className="header-link">
                                <span>Profile</span>
                            </a>
                        </li>
                        : null}
                    <li>
                        {cookies.get("authentication_token") ? (
                            <a href={"/"} className="header-link">
                                <span onClick={() => {
                                    cookies.remove("authentication_token");
                                    window.location.href = "/"
                                }}
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