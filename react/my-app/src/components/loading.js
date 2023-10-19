import ClipLoader from "react-spinners/ClipLoader";
import "../styles/loading.scss"

export function Loading()
{
    return (
        <div className="loading">
            <span>Loading results</span>
            <ClipLoader color={"#297085"}/>
        </div>
    )    
}

