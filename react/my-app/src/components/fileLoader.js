import "../styles/fileLoader.scss"
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { useState } from 'react';

export function FileLoader({filetype,setFile,setFileIsLoading,sdfIsSetPointer,c13IsSetPointer,dept135IsSetPointer,deleteFile,sendcheckRequest,setTitle,titles})
{
  /***
   * 
   * Each time input file is changing, call this function to retry the file upload on it
   * and set the loading variable to true until the uploading is done 
   * 
   ***/ 
  let labelClass="";
  let buttonClass = "";

  labelClass =  'grid-'+filetype+'_input'; 
  buttonClass = 'grid-'+filetype+'_Button';


  const [showButtons,showButtonsPointer] = useState(false);
  const [LabelNameValue,setLabelNameValue] = useState(`${filetype} file`)

    const readFile = (file) => {
        if (file===undefined)
        {
          setFileIsLoading(false)
          return 
        }

        setLabelNameValue(file.name)

        try {
          const reader = new FileReader();
          reader.onload = (res) =>
          {
            setFileIsLoading(false)
            switch(filetype)
            {
              case 'sdf':
                setFile(res.target.result)
                sdfIsSetPointer(true)
                showButtonsPointer(true)
                titles.sdf=file.name
                setTitle({...titles})
                break
              case 'spectrum':
                setFile(res.target.result)
                c13IsSetPointer(true)
                showButtonsPointer(true)
                titles.spectrum=file.name
                setTitle({...titles})
                break
              case 'dept135':
                setFile(res.target.result)
                dept135IsSetPointer(true)
                showButtonsPointer(true)
                titles.dept135=file.name
                setTitle({...titles})
                break
              default :
                setFile(res.target.result)
                showButtonsPointer(true)
                titles.dept90=file.name
                setTitle({...titles})
                break
            }
            alertify.success(`The ${filetype} file has been loaded.`);
          };

          reader.readAsText(file);
        }
        catch (error)
        {
            alertify.error('Error, try again.');
        }
    }


    function onDeletePress()
    {
      deleteFile(filetype);
      document.getElementById(filetype).value='';
      showButtonsPointer(false);
      setLabelNameValue(`${filetype} file`);
    }

    function onCheckPress()
    {
      sendcheckRequest(filetype);
    }

    return (

            <>              
              <label className="custom-file-upload"  id = {labelClass}>
                <label className="label-file" htmlFor={filetype}>{LabelNameValue}</label>
                <input type="file" className="input-file" onChange={(e) => {setFileIsLoading(true); readFile(e.target.files[0])}} id={filetype}></input>
              </label>
            {
              showButtons ? 
              <div id = {buttonClass}> 
                <button  className="fileLoader-button fileLoader-deleteButton" onClick={()=> onDeletePress()}>Delete</button> 
                <button className="fileLoader-button fileLoader-checkButton" onClick={()=> onCheckPress()}>Check</button>
               </div> 
              : <></>
            }
            </>
      )    
}

