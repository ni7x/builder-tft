import "./TopPanel.css";
import { useState } from "react";

let TopPanel = (props) => {
    let [ active, setActive ] = useState(false);

    let saveTeamcomp = () =>{
        console.log(props.teamName);
        console.log(props.hexes)
        setActive(false);
    }

    let clear = () => {
        props.clear();
        props.cards.forEach(card=>{
            document.getElementById("cardsList").appendChild(document.getElementById(card.name));

        })
        props.setCards(cards=> cards.sort((a, b) => a.cost - b.cost));  
    }

    return(
        <div className="topPanel">
            <div className={"saveModal isActive" + active}>
                <div className="saveBox">
                    <button className="close" onClick={e=>setActive(false)}><i className="fa-solid fa-x"></i></button>
                    <label>Name: </label>
                    <input onChange={e=>props.setTeamName(e.target.value)} value={props.teamName}></input>
                    <button className="confirm" onClick={saveTeamcomp}>Confirm</button>
                </div>
            </div>
          
            <button onClick={e=>setActive(true)} className="saveButton">Save Board  </button>
            <button onClick={clear} className="resetButton">Clear Board</button>
        </div>
    )
}

export default TopPanel;