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

    return(
        <div className="topPanel">
            <button className="saveButton" onClick={save}>Save</button>
            <button onClick={clear} className="resetButton">Clear</button>
            <div id="alertBox"></div>
        </div>
    )
}

export default TopPanel;