import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import alertify from 'alertifyjs';
import ClipLoader from "react-spinners/ClipLoader";
import 'alertifyjs/build/css/alertify.css';
import "../styles/rmn.scss";
import red_cross from "../assets/img/red-cross.png";
import Cookies from "universal-cookie";


function Rmn()
{
    const [rmnName,setRMNName] = useState('')
    const [file,setFile] = useState(undefined)
    const [fileIsLoading,setFileIsLoading] = useState(false)
    const [upload,setUpload] = useState(false)
    const [deleteFileUuid,setDeleteFileUuid] = useState(undefined)
    const [deleteFile,setDeleteFile] = useState(false)
    const navigate = useNavigate();

    const options = { year: 'numeric', month: '2-digit', day: '2-digit'}

    const { rmnList } = useLoaderData()

    const cookies = new Cookies();

    const readFile = (file) => {
        if (file===undefined)
        {
          setFileIsLoading(false)
          return 
        }
     
        try {
          const reader = new FileReader();
          reader.onload = (res) =>
          {
            setFileIsLoading(false)
            setFile(res.target.result)
            alertify.success(`The file has been loaded.`);
          };
    
          reader.readAsText(file);
        }
        catch (error)
        {
            alertify.error('Error, try again');
        }
    }

    const checkFile = () => {
        if(file !== undefined && rmnName !== '')
        {
            if(rmnList.includes(rmnName))
            {
                alertify.confirm("Confirm","Are you sure to continue ? You will overwrite a RMN file.",
      
                function()
                {
                    setUpload(true)
                },
                function(){});
            }
            else
            {
                setUpload(true)
            }
        }
        else if(file !== undefined)
        {
            alertify.error('Error, you have to choose a file to upload.')
        }
        else
        {
            alertify.error('Error, you have to choose a name for your file.')
        }
    }

    const deleteFileButton = (deleteFileUuid) => {
        alertify.confirm("Confirm","Are you sure to continue ? You will delete this RMN file.",
      
                function()
                {
                    setDeleteFileUuid(deleteFileUuid)
                    setDeleteFile(true)
                },
                function(){});
    }

    useEffect(() => {
        if(upload)
        {
            setFileIsLoading(true)

            async function fetchData()
            {
                // Put in the request the file and its name

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                               'Authorization': 'Bearer ' + cookies.get("authentication_token") },
                    body: JSON.stringify({ name: rmnName, rmn_file: file})
                };

                // Send it to Spring server
                fetch("http://localhost:9000/rmn/rmnDB",requestOptions).then((response) => {
                    if(response.status === 200)
                    {
                        navigate("/rmnDB")
                    }
                    else
                    {
                        alertify.error('Error, problem to upload the file on the database.')
                    }
                }).catch((err) => {
                  console.log(err);
                }).finally(() => {setFileIsLoading(false);setUpload(false)})

                // At the end, pass the loading parameter to false
            }
        
            fetchData()
        }
    },[upload])

    useEffect(() => {
        if(deleteFile)
        {
            async function fetchData()
            {
                // Put in the request the name of the file which going to be deleted

                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json',
                               'Authorization': 'Bearer ' + cookies.get("authentication_token") },
                    body: JSON.stringify({ uuid: deleteFileUuid })
                };

                // Send it to Spring server
                fetch("http://localhost:9000/rmn/rmnDB",requestOptions).then((response) => {
                    if(response.status === 204)
                    {
                        navigate("/rmnDB")
                    }
                    else
                    {
                        alertify.error('Error, problem to delete the file on the database.')
                    }
                }).catch((err) => {
                  console.log(err);
                }).finally(() => {setDeleteFile(undefined)})
            }
        
            fetchData()
        }
    },[deleteFile])

    return(
        <div className='rmn-container'>
            <div className='rmn-upload'>
                <span>ADD RMN FILE IN THE DATABASE</span>
                <div>
                    <label htmlFor='rmnFile'>RMN FILE</label>
                    <input type="file" id="rmnFile" onChange={(e) => {setFileIsLoading(true); readFile(e.target.files[0])}}></input>
                </div>
                <div>
                    <label htmlFor='rmnName'>FILE'S NAME</label>
                    <input type="text" id="rmnName" value={rmnName} placeholder="Enter the name of the RMN's file" onChange={(e) => {setRMNName(e.target.value)}}></input>
                </div>
                <div className='rmn-button'>
                    {fileIsLoading 
                    ? <button>
                        <ClipLoader className="rmn-loader" color={"#ffffff"}/>
                      </button>
                    : <button onClick={() => {checkFile()}}>Add to the database</button>}
                </div>
            </div>

            <div className='rmn-files'>
                <span>All RMN FILES IN THE DATABASE</span>
                { rmnList.rmnList.map((rmn) => (
                    <div className='rmn-file'>
                        <div className='rmn-info' key={ rmn.uuid }>
                            <div className='rmn-name-date'>
                                <span>
                                    <a href={"/sdf/preview/" + rmn.name}>
                                        { rmn.name }
                                    </a>
                                </span>
                                <span> { new Date(rmn.added_at).toLocaleDateString(undefined, options) } </span>
                            </div>
                            <div className='rmn-attribution'>
                                <span> Author: <b> { rmn.author } </b> </span>
                                <span> Added by:&nbsp;
                                    <a href={"/profile?u=" + rmn.added_by}>
                                        <b> { rmn.added_by_name } </b>
                                    </a>
                                </span>
                            </div>
                        </div>
                        <input className="rmn-input-image" type="image" src={ red_cross } onClick={() => { deleteFileButton(rmn.uuid) }}/>
                    </div> ))}
            </div>
        </div>
    )
}

export async function getRmnFilesNames()
{
    const requestOptions = {
        method: 'GET'
    };

    // Send request to Spring server

    const response = await fetch("http://localhost:9000/rmn/rmnDB/names",requestOptions);

    const json = await response.json();

    return {rmnList: json};
}

export default Rmn;
