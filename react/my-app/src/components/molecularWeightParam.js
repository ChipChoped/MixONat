//import Radio from '@material-ui/core/Radio';
//import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import "../styles/molecularWeightParams.scss";
//import FormControlLabel from '@material-ui/core/FormControlLabel';


export function MolecularWeightParam({params,setParams})
{               
    // the molecularweight has a multiple possible values in motor which are False ,["1","2"...] or even stuff like this <'1','2'>, which causes a problem 
    
    const [isInterval,setIsInterval] = useState(false)
    const [value, setValue] = useState(getSavedValus()[1]);
    // Function called when user changes the Radio buttons
    function changeRadio (e)
    {
        let MwInput = document.getElementById("molecular_weightValue");
       
        // empty the input
        MwInput.value=''

        let tempParams = params;

        // set the default of molecularWeight value  ''
        tempParams.molecular_weight='';

        setParams(tempParams);
      
        setValue(e);    

        if (e==='Specific values')
        {
            MwInput.placeholder='v1;v2;...'
        }
        else 
        {
            MwInput.placeholder='min;max'
        }
    }

    // Function to return the already saved values of mol weights
    function getSavedValus()  
    {
        let defaultValues = params.molecular_weight;
        if (defaultValues!=='')
        {
            if (defaultValues[0]==="[")
            {
                return  [defaultValues.substring(1, defaultValues.length - 1),"Specific values" ,"v1;v2;..."];
            }
            else 
            {
                return  [defaultValues.substring(1, defaultValues.length - 1),"Interval","min;max"];
            }
        }
        else
            return ['',"Specific values" ,"v1;v2;..."];
    }
    // Function called when user writes values in input fields 
    function changeMolecularWeightParam(e)
    {
        let tempParams = params;
        let inputText = e.value;

        if (inputText==='')
        {
            tempParams.molecular_weight='';
        }
        else 
        {
           let finalText='';
           
            if (value==='Specific values')
            {
                finalText ="[";
                inputText = inputText.split(";");
                
                for (let i = 0 ; i <inputText.length ; ++i)
                {
                    if (inputText[i]!=='')              // to remove empty values 
                    {
                        if (i!==0)
                        {
                            finalText += ";"+inputText[i]; 
                        }
                        else 
                        {
                            finalText +=inputText[i]; 
                        }
                    }
                }
                finalText +="]";
            }
            else 
            {
                finalText ="<";
                inputText = inputText.split(";");
                for (let i = 0 ; i <2 ; ++i)             // loop over the first 2 values only and ignore other values 
                {
                    if (inputText[i]!=='' && inputText[i]!==undefined) // to remove empty values
                    {
                        if (i!==0)
                        {
                            finalText += ";"+inputText[i]; 
                        }
                        else 
                        {
                            finalText += inputText[i]; 
                        }
                    }
                }
                finalText +=">";
            }
            tempParams.molecular_weight=finalText;
            setParams(tempParams)
        }

    }

    return (
        <div>
            <div onChange={(e) => changeRadio(e.target.value)} className="molecularWeightParams-div-radio">
                <div>
                    <label className="molecularWeightParams-label-radio">Specific values :</label>
                    <input type="radio" value="Specific values" name="molecularWeight" onClick={() => {setIsInterval(false)}} checked={!isInterval}/>
                </div>
                <div>
                    <label className="molecularWeightParams-label-radio">Interval :</label>
                    <input type="radio" value="Interval" name="molecularWeight" onClick={() => {setIsInterval(true)}} checked={isInterval}/>
                </div>
            </div>
            {/*<RadioGroup onChange={e => changeRadio(e.target.value)} value={value}>
                <FormControlLabel
                    value="Specific values"
                    control={<Radio />}
                    label="Specific values"
                />
                <FormControlLabel
                    value="Interval"
                    control={<Radio />}
                    label="Interval"    
                />
    </RadioGroup>*/}
            <input type="text" onChange={(e) => {changeMolecularWeightParam(e.target)}} id="molecular_weightValue" name="molecular_weightValue" size="10" placeholder={getSavedValus()[2]} defaultValue={getSavedValus()[0]}/>
        </div>
    )
}

