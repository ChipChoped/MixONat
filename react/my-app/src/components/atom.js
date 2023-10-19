import { useState } from "react";
import "../styles/atom.scss";

export function Atom({atom,shift,highlight,setHighlight,type})
{
    const [highlightAtom,setHighlightAtom] = useState(highlight)

    return(
        <div className="atom-div">
            <span className="atom-span">{atom}</span>
            <button className="atom-button" disabled={!highlightAtom} onClick={() => {setHighlightAtom(false);setHighlight(atom,shift,false,type)}}>-</button>
            <span className="atom-span">{shift}</span>
            <button className="atom-button" disabled={highlightAtom} onClick={() => {setHighlightAtom(true);setHighlight(atom,shift,true,type)}}>+</button>
        </div>
    )
}