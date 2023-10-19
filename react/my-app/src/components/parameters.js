import { useState } from "react"
import "../styles/parameters.scss"
import { MolecularWeightParam } from "./molecularWeightParam";

export function Parameters({params,setParams})
{
    // UseState to show or hide the parametres
    const [isOpen, setIsOpen] = useState(false)        
    // Since we have differnet values for Molecular wieghts, this UseState is to show or hide the Molecular Wieght component
    const [MolecularWightIsShown,setMolecularWightIsShown] = useState(params.molecular_weight)
    // Function to change the values of useStates after the user changes a value of an input 

    function setParameters(e)
    {
                let id  = e.id;
                let tempParams = params;

                switch(id)
                {
                  case 'looseness_factor':
                        tempParams.looseness_factor=e.value.toString();
                        setParams(tempParams)
                        break;

                   case 'looseness_incr':
                        tempParams.looseness_incr=e.checked;
                        setParams(tempParams)
                        break;

                    case 'heuristic_sorting':
                        tempParams.heuristic_sorting=e.checked;
                        setParams(tempParams)
                        break;

                    case 'minimal_score':
                        tempParams.minimal_score=e.value.toString();
                        setParams(tempParams)
                        break;
                    
                    case 'dept135_alignment':
                        tempParams.dept135_alignment=e.value.toString();
                        setParams(tempParams)
                        break;  

                    case 'dept90_alignment':
                        tempParams.dept90_alignment=e.value.toString();
                        setParams(tempParams)
                        break;

                    case 'carbon_equivalent':
                        tempParams.carbon_equivalent=e.checked;
                        setParams(tempParams)
                        break;
                        
                    case 'molecular_weight':
                        if (e.checked===false)
                        {
                            tempParams.molecular_weight='';
                            setParams(tempParams)
                        }
                        setMolecularWightIsShown(e.checked);
                        break;

                    case 'number_results':
                        tempParams.number_results=e.value.toString();
                        setParams(tempParams)
                        break;

                    case 'number_results_page':
                        tempParams.number_results_page=e.value.toString();
                        setParams(tempParams)
                        break;
                }

    }

    return (
        <>
            <div className="parameters-button-div"> <button className="parameter-button" onClick={() => setIsOpen(!isOpen)}>Parameters</button></div>
            
            {isOpen ?
            <div className="parameters-list">
                    <div className="parameter">
                        <label htmlFor="looseness_factor">Looseness Factor :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="looseness_factor"  min="0.0" max="100.0" size="5" step={0.1} defaultValue={params.looseness_factor}></input>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="looseness_incr">Looseness Incr :</label>           
                        <input type="checkbox" onChange={(e) => {setParameters(e.target)}} id="looseness_incr" name="looseness_incr"  defaultChecked={params.looseness_incr}/>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="heuristic_sorting">Heuristic Sorting :</label>
                        <input type="checkbox" onChange={(e) => {setParameters(e.target)}} id="heuristic_sorting" name="heuristic_sorting" defaultChecked={params.heuristic_sorting} />  
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="minimal_score">Minimal Score :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="minimal_score"  min="0.0" max="100.0" size="5" step={0.01} defaultValue={params.minimal_score}></input>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="dept135_alignment">DEPT135 Alignment :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="dept135_alignment"  min="0.0" max="100.0" size="5" step={0.01} defaultValue={params.dept135_alignment}></input>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="dept90_alignment">DEPT90 Alignment :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="dept90_alignment"  min="0.0" max="100.0" size="5" step={0.01} defaultValue={params.dept90_alignment}></input>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="carbon_equivalent">Carbon Equivalent :</label>
                        <input type="checkbox" onChange={(e) => {setParameters(e.target)}} id="carbon_equivalent" name="carbon_equivalent" defaultChecked={params.carbon_equivalent}/>
                        <br/>
                    </div>


                    <div className="parameter">
                        <label htmlFor="molecular_weight">Molecular Weight :</label>
                        <input type="checkbox" onChange={(e) => {setParameters(e.target)}} id="molecular_weight" name="molecular_weight"  defaultChecked={params.molecular_weight}/>
                        {MolecularWightIsShown ? <MolecularWeightParam params={params} setParams={setParams}/> : <></>}
                                                
                        <br/>
                    </div>


                    <div className="parameter">
                        <label htmlFor="number_results">Number Results :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="number_results"  min="0" max="100" size="5" step={1}  defaultValue={params.number_results}></input>
                        <br/>
                    </div>

                    <div className="parameter">
                        <label htmlFor="number_results_page">Number Results Page :</label>
                        <input type="number" onChange={(e) => {setParameters(e.target)}} id="number_results_page"  min="0" max="100" size="5" step={1} defaultValue={params.number_results_page}></input>
                        <br/>
                    </div>

            </div> 
            : <></>}
        </>
    )
}