import { useLoaderData, useNavigate } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/preview.scss";
import "../styles/error.scss";


function Preview()
{
    const { file } = useLoaderData()
    const { status } = useLoaderData()
    const { message } = useLoaderData()

    const navigate = useNavigate();

    if (file !== undefined) {
        return (
            <div className='file-container'>
                <div className='file-card'>
                    <span> {file.name} </span>
                    <div className='file-info'>
                        <div className='file-date'>
                            <span> {new Date(file.added_at).toLocaleDateString(
                                undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })} </span>
                            <span> {new Date(file.added_at).toLocaleTimeString(
                                undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })} </span>
                        </div>
                        <div className='file-attribution'>
                            <span> Author: <b> {file.author} </b> </span>
                            <span> Added by:&nbsp;
                                <a href={"/profile?u=" + file.added_by} target="_blank" rel="noreferrer">
                                    {file.added_by_name}
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
                <div className='file-content'>
                    {file.file}
                </div>
            </div>
        )
    } else {
        return (
            <div className='error-container'>
                <h1> Error {status} </h1>
                <p> {message} </p>
            </div>
        )
    }
}

export async function getFile() {
    const queryParams = new URLSearchParams(window.location.search)
    let type = queryParams.get("t")
    let id = queryParams.get("f")

    if (id === null || type === null) {
        return {file: undefined, status: 400, message: "Bad request"}
    }

    const requestOptions = {
        method: 'GET'
    };

    const response = await fetch("http://localhost:9000/" + type + "/" + id, requestOptions);
    const json = await response.json();

    if (response.status === 200) {
        return {file: json}
    } else {
        return {file: undefined, status: response.status, message: json.message}
    }
}

export default Preview;
