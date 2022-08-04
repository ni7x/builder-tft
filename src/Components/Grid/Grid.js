import { useState, useEffect } from "react";
import Hex from "./Hex";
import "./Grid.css";

const Grid = (props) => {

    return(
        <div className="grid">
            {props.hexes.map((card, i)=>{
                return <Hex key={i} id={i} card={card} swapHexes={props.swapHexes} addCardToHex={props.addCardToHex}></Hex>
            }) }
        </div>
    )
}

export default Grid;