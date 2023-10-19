import { Atom } from "./atom";
import "../styles/atomList.scss";

export function AtomList(
    {setHighlight,
    quat_atoms,
    quat_shifts,
    quat_atoms_unmatched,
    quat_shifts_unmatched,
    ter_atoms,
    ter_shifts,
    ter_atoms_unmatched,
    ter_shifts_unmatched,
    sec_atoms,
    sec_shifts,
    sec_atoms_unmatched,
    sec_shifts_unmatched,
    prim_atoms,
    prim_shifts,
    prim_atoms_unmatched,
    prim_shifts_unmatched,
    ter_prim_atoms,
    ter_prim_shifts,
    ter_prim_atoms_unmatched,
    ter_prim_shifts_unmatched,
    no_dept_atoms,
    no_dept_shifts,
    no_dept_atoms_unmatched,
    no_dept_shifts_unmatched})
{
    let all_quat_atoms = []
    let all_ter_atoms = []
    let all_sec_atoms = []
    let all_prim_atoms = []
    let all_ter_prim_atoms = []
    let all_no_dept_atoms = []

    // concaténation et tri des tableaux d'atomes quaternaires

    if((quat_atoms.length !== 0 && quat_shifts.length !== 0) || (quat_atoms_unmatched.length !== 0 && quat_shifts_unmatched.length !== 0))
    {
        all_quat_atoms = quat_atoms.map((quat_atom,index) => (<Atom key={quat_atom} atom={quat_atom} shift={quat_shifts[index]} highlight={true} setHighlight={setHighlight} type="quat"/>))
        all_quat_atoms = all_quat_atoms.concat(quat_atoms_unmatched.map((quat_atom,index) => (<Atom key={quat_atom} atom={quat_atom} shift={quat_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="quat"/>)))

        all_quat_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    // concaténation et tri des tableaux d'atomes tertiaires

    if((ter_atoms.length !== 0 && ter_shifts.length !== 0) || (ter_atoms_unmatched.length !== 0 && ter_shifts_unmatched.length !== 0))
    {
        all_ter_atoms = ter_atoms.map((ter_atom,index) => (<Atom key={ter_atom} atom={ter_atom} shift={ter_shifts[index]} highlight={true} setHighlight={setHighlight} type="ter"/>))
        all_ter_atoms = all_ter_atoms.concat(ter_atoms_unmatched.map((ter_atom,index) => (<Atom key={ter_atom} atom={ter_atom} shift={ter_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="ter"/>)))

        all_ter_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    // concaténation et tri des tableaux d'atomes secondaires

    if((sec_atoms.length !== 0 && sec_shifts.length !== 0) || (sec_atoms_unmatched.length !== 0 && sec_shifts_unmatched.length !== 0))
    {
        all_sec_atoms = sec_atoms.map((sec_atom,index) => (<Atom key={sec_atom} atom={sec_atom} shift={sec_shifts[index]} highlight={true} setHighlight={setHighlight} type="sec"/>))
        all_sec_atoms = all_sec_atoms.concat(sec_atoms_unmatched.map((sec_atom,index) => (<Atom key={sec_atom} atom={sec_atom} shift={sec_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="sec"/>)))

        all_sec_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    // concaténation et tri des tableaux d'atomes primaires

    if((prim_atoms.length !== 0 && prim_shifts.length !== 0) || (prim_atoms_unmatched.length !== 0 && prim_shifts_unmatched.length !== 0))
    {
        all_prim_atoms = prim_atoms.map((prim_atom,index) => (<Atom key={prim_atom} atom={prim_atom} shift={prim_shifts[index]} highlight={true} setHighlight={setHighlight} type="prim"/>))
        all_prim_atoms = all_prim_atoms.concat(prim_atoms_unmatched.map((prim_atom,index) => (<Atom key={prim_atom} atom={prim_atom} shift={prim_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="prim"/>)))

        all_prim_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    // concaténation et tri des tableaux d'atomes tertiaires-primaires

    if((ter_prim_atoms.length !== 0 && ter_prim_shifts.length !== 0) || (ter_prim_atoms_unmatched.length !== 0 && ter_prim_shifts_unmatched.length !== 0))
    {
        all_ter_prim_atoms = ter_prim_atoms.map((ter_prim_atom,index) => (<Atom key={ter_prim_atom} atom={ter_prim_atom} shift={ter_prim_shifts[index]} highlight={true} setHighlight={setHighlight} type="ter_prim"/>))
        all_ter_prim_atoms = all_ter_prim_atoms.concat(ter_prim_atoms_unmatched.map((ter_prim_atom,index) => (<Atom key={ter_prim_atom} atom={ter_prim_atom} shift={ter_prim_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="ter_prim"/>)))

        all_ter_prim_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    // concaténation et tri des tableaux d'atomes

    if((no_dept_atoms.length !== 0 && no_dept_shifts.length !== 0) || (no_dept_atoms_unmatched.length !== 0 && no_dept_shifts_unmatched.length !== 0))
    {
        all_no_dept_atoms = no_dept_atoms.map((no_dept_atom,index) => (<Atom key={no_dept_atom} atom={no_dept_atom} shift={no_dept_shifts[index]} highlight={true} setHighlight={setHighlight} type="no_dept"/>))
        all_no_dept_atoms = all_no_dept_atoms.concat(no_dept_atoms_unmatched.map((no_dept_atom,index) => (<Atom key={no_dept_atom} atom={no_dept_atom} shift={no_dept_shifts_unmatched[index]} highlight={false} setHighlight={setHighlight} type="no_dept"/>)))

        all_no_dept_atoms.sort((a,b) => {return a.props.atom > b.props.atom})
    }

    return(
        <>
            {all_quat_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">Quaternaries</span>
                        {all_quat_atoms}
                    </>
                : <></>
            }
            {all_ter_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">Tertiaries</span>
                        {all_ter_atoms}
                    </>
                : <></>
            }
            {all_sec_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">Secondaries</span>
                        {all_sec_atoms}
                    </>
                : <></>
            }
            {all_prim_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">Primaries</span>
                        {all_prim_atoms}
                    </>
                : <></>
            }
            {all_ter_prim_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">Tertiaries/Primaries</span>
                        {all_ter_prim_atoms}
                    </>
                : <></>
            }
            {all_no_dept_atoms.length !== 0
                ?
                    <>
                        <span className="atomList-span">All carbons</span>
                        {all_no_dept_atoms}
                    </>
                : <></>
            }
        </>
    )
}