import MoleculeStructure from "./moleculeStructure";
import { Buffer } from 'buffer';
import "../styles/moleculeCard.scss";



export function MoleculeCard({molecule})
{
    // Get the molecule from the base64 value from the Json object 
    let myUni8Arr = Buffer.from(molecule.base64, 'base64')

    return(
        <>            
            <h2>Rank: {molecule.rank}</h2>
            <div>{molecule.name}</div>
            <div>MW: {molecule.mw}</div>
            <div>Score match:{molecule.score} Error: {molecule.error}</div>

            
            <MoleculeStructure
                id={molecule.id.toString()}
                structure={molecule.smile}
                Uint8Array = {myUni8Arr}
                extraDetails={{'atoms' :molecule.matched_sdf_atoms_idx,'addAtomIndices':true,'atomLabels':false,'highlightRadius' : 0.3 }}
                width={350}
                height={300}
            />
        </>
    )
}