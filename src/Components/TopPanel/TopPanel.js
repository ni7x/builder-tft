import "./TopPanel.css";
import { useState } from "react";

let TopPanel = (props) => {
    let [ active, setActive ] = useState(false);

    let clear = () => {
        props.clear();
        props.cards.forEach(card => {
            document.getElementById(card.name).innerHTML = "";
            document.getElementById("cardsList").appendChild(document.getElementById(card.name));
        })
        props.setCards(cards => cards.sort((a, b) => a.cost - b.cost));
        props.displayAlert("Cleaning done!", "#edf6f9");
    }

    let save = () => {
        props.displayAlert("Saved!", "#6fffe9");
    }

    let setSwitch = () => {
        props.setShowInactive(prev=>!prev);
        const all = document.getElementById("allTraits");
        const act = document.getElementById("activeTraits");
        if(all.classList.contains("active")){
            all.classList.remove("active");
            act.classList.add("active");
        }else{
            act.classList.remove("active");
            all.classList.add("active");
        }
    }

    return(
        <div className="topPanel">
            <button className="saveButton" onClick={save}>Save</button>
            <button onClick={clear} className="resetButton">Clear</button> 
            
            <div id="alertBox"></div>
            
            <div className="traitsToggle">
            <p id="allTraits" className="active">All Traits</p>
                <label className="switch" htmlFor="checkbox">
                    <input type="checkbox" id="checkbox" onChange={setSwitch}/>
                    <div className="slider round"></div>
                </label>
            <p id="activeTraits">Active Only</p>
            </div>
        </div>
    )
}

export default TopPanel;