import React, { useState } from "react";

const Item = (props) => {

    const [ descState, setDescState ] = useState(false);

    let allowDrop = (e) =>{
        e.preventDefault();
    }

    let drop = (e) => {
        let placeNewItemComesFrom = e.dataTransfer.getData("comingFrom");
        if(placeNewItemComesFrom !== "ItemList" && e.target.parentElement.parentElement.id !== "ItemList"){
            let newItem = JSON.parse(e.dataTransfer.getData("item"));
            let newItemId = e.dataTransfer.getData("id");
            let newItemElement = document.getElementById(newItemId);

            let thisItem = ({"name": props.name, "id": props.id, "isActive": props.isActive, "imgId":props.imgId, isUnique:props.isUnique});
            let thisHex = e.target.parentNode.parentNode.id;
            let thisItemElement = document.getElementById(e.target.id);
            
            props.removeItemFromHex(thisHex, thisItem);
            props.removeItemFromHex(placeNewItemComesFrom, newItem);
            if(props.isItemAddable(thisHex, newItem, "hexNum") && props.isItemAddable(placeNewItemComesFrom, thisItem, "hexNum")){
                    props.addItemToHex(thisHex, newItem);
                    props.addItemToHex(placeNewItemComesFrom, thisItem);
                    swapElements(newItemElement, thisItemElement);
            }else{
                props.addItemToHex(thisHex, thisItem);
                props.addItemToHex(placeNewItemComesFrom, newItem);
            }

        }  
    }

    let swapElements = (el1, el2) => {
        var temp = document.createElement("div");
        el1.parentNode.insertBefore(temp, el1);
        el2.parentNode.insertBefore(el1, el2);
        temp.parentNode.insertBefore(el2, temp);
        temp.parentNode.removeChild(temp);
    }

    let drag = (e) => {
        e.dataTransfer.setData("item", JSON.stringify({"name":props.name, "id": props.id, "isUnique": props.isUnique, "imgId":props.imgId, "isActive": props.isActive, "description": props.description}));
        e.dataTransfer.setData("type", "item");
        e.dataTransfer.setData("id", props.id);
        e.dataTransfer.setData("comingFrom", e.target.parentNode.parentNode.id)
    }
    

    return(
        <div onMouseEnter={e=>setDescState(true)} onMouseLeave={e=>setDescState(false)} className="itemContainer">
            <div 
                className="item"
                style={{backgroundImage: "url(" + process.env.PUBLIC_URL + "/static/items/" + props.imgId + ".png"}}
                id={props.id}
                draggable={true}
                onDragStart={(e)=>drag(e)} onDragOver={(e)=>allowDrop(e)} onDrop={(e)=>drop(e)}>
            </div>
            <span className={"itemDesc descState" + descState}>
                <p>{props.name}</p>
                {props.description}
                {props.isUnique?<i>[Unique - Only One Per Champion]</i>:""}
                {props.imgId===99?<i>[Consumes 3 Item Slots]</i>:""}
            </span>
        </div>
    )
}
export default Item;