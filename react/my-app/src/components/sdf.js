import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import alertify from 'alertifyjs';
import ClipLoader from "react-spinners/ClipLoader";
import 'alertifyjs/build/css/alertify.css';
import "../styles/sdf.scss";
import red_cross from "../assets/img/red-cross.png";
import Cookies from "universal-cookie";


function Sdf()
{
    const [sdfName,setSdfName] = useState('')
    const [file,setFile] = useState(undefined)
    const [fileIsLoading,setFileIsLoading] = useState(false)
    const [upload,setUpload] = useState(false)
    const [deleteFileUuid,setDeleteFileUuid] = useState(undefined)
    const [deleteFile,setDeleteFile] = useState(false)
    const navigate = useNavigate();

    const options = { year: 'numeric', month: '2-digit', day: '2-digit'}

    const { sdfList } = useLoaderData()

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
        if(file !== undefined && sdfName !== '')
        {
            if(sdfList.includes(sdfName))
            {
                alertify.confirm("Confirm","Are you sure to continue ? You will overwrite a SDF file.",
      
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
        alertify.confirm("Confirm","Are you sure to continue ? You will delete this SDF file.",
      
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
                    body: JSON.stringify({ name: sdfName, sdf_file: file})
                };

                // Send it to Spring server
                fetch("http://localhost:9000/rmn/sdf",requestOptions).then((response) => {
                    if(response.status === 200)
                    {
                        navigate("/sdf")
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
                fetch("http://localhost:9000/rmn/sdf",requestOptions).then((response) => {
                    if(response.status === 204)
                    {
                        navigate("/sdf")
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
        <div className='sdf-container'>
            <div className='sdf-upload'>
                <span>ADD SDF FILE IN THE DATABASE</span>
                <div>
                    <label htmlFor='sdfFile'>SDF FILE</label>
                    <input type="file" id="sdfFile" onChange={(e) => {setFileIsLoading(true); readFile(e.target.files[0])}}></input>
                </div>
                <div>
                    <label htmlFor='sdfName'>FILE'S NAME</label>
                    <input type="text" id="sdfName" value={sdfName} placeholder="Enter the name of the SDF's file" onChange={(e) => {setSdfName(e.target.value)}}></input>
                </div>
                <div className='sdf-button'>
                    {fileIsLoading 
                    ? <button>
                        <ClipLoader className="sdf-loader" color={"#ffffff"}/>
                      </button>
                    : <button onClick={() => {checkFile()}}>Add to the database</button>}
                </div>
            </div>

            <div className='sdf-files'>
                <span>All SDF FILES IN THE DATABASE</span>
                { sdfList.sdfList.map((sdf) => (
                    <div className='sdf-file'>
                        <div className='sdf-info' key={ sdf.uuid }>
                            <div className='sdf-name-date'>
                                <span>
                                    <a href={ "/sdf/preview/" + sdf.uuid }>
                                        { sdf.name }
                                    </a>
                                </span>
                                <span> { new Date(sdf.added_at).toLocaleDateString(undefined, options) } </span>
                            </div>
                            <div className='sdf-attribution'>
                                <span> Author: <b> { sdf.author } </b> </span>
                                <span> Added by:&nbsp;
                                    <a href={ "/profile?u=" + sdf.added_by } target="_blank" rel="noreferrer">
                                        { sdf.added_by_name }
                                    </a>
                                </span>
                            </div>
                        </div>
                        <input className="sdf-input-image" type="image" src={ red_cross } onClick={() => { deleteFileButton(sdf.uuid) }}/>
                    </div>)) }
            </div>
        </div>
    )
}

export async function getSdfFilesNames()
{
    const requestOptions = {
        method: 'GET'
    };

    // Send request to Spring server

    const response = await fetch("http://localhost:9000/rmn/sdf/names",requestOptions);

    const json = await response.json();

    return {sdfList: json};
}

export default Sdf;
