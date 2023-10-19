import { MoleculeCard } from "./moleculeCard";

export function MoleculesList({data ,setData, chooseMolecule,deleteData,setDeleteData})
{
    /*********************/
    /*     FUNCTIONS     */
    /*********************/

    /***
     * 
     * Function to update the rank of a molecule, which is equal to the element index in the Array + 1
     * 
     ***/

    function updateRanking(temp)  
    {
        for (let i = 0 ; i < temp.ranking.length; ++i)
        {
            temp.ranking[i].rank = i+1;
        }
    }


    /***
     * 
     * Function to delete a molecule, save it in deleteData's array and update the ranking of others
     * 
     ***/

    function deleteMolecule(id)
    {
        for (let i = 0 ; i < data.ranking.length; ++i)
        {
            if (data.ranking[i].id===id)
            {
                let temp = {...data};
                let deleted=temp.ranking[i];
                setDeleteData([...deleteData,deleted])
                temp.ranking.splice([i],1);
                updateRanking(temp);
                setData(temp);    

                break;
            }
        }
    }

   return (
   <div className="parent"> 
        { data.ranking.map((molecule,index) => (
                <div key={molecule.id} className="molecule-card">
                    <MoleculeCard  molecule={molecule}/>
                    <div>
                        <button onClick={() => {chooseMolecule(index)}}>Show shifts</button>
                        <button  onClick={() => {deleteMolecule(molecule.id)}}>Delete</button>
                    </div>
                </div>
        ))}
    </div>)
}