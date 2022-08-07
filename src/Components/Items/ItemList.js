import { useEffect } from "react";
import Item from "./Item";
import "./Item.css";
import data from "./itemData.json";

const ItemList = (props) => {
    useEffect(()=>{
        let items = [];
        data.forEach((item)=>{
            items.push({"name": item.name, "description": item.description, "isUnique": item.isUnique, "imgId": item.id, "isActive": false})
        })
        props.setItems(items);
    }, [])

    const activeItems = [];
    for (let i = props.items.length; i--;) {
        if (props.items[i].isActive) {
            activeItems.unshift({index: i, item: props.items[i]});
            props.items.splice(i, 1);
        }
    }

    let sortByType = (a, b) =>{
        if(a.name.includes("Emblem") && !b.name.includes("Emblem")){
            return 1;
        }
        if(!a.name.includes("Emblem") && b.name.includes("Emblem")){
            return -1;
        }
        return 0;  
    }

    props.items.sort((a,b) => sortByType(a,b));

    for (let i = 0; i < activeItems.length; i++)
        props.items.splice(activeItems[i].index, 0, activeItems[i].item);
  
    return(
        <div className="ItemList" id="ItemList">
           {props.items.map((item, i)=>{
                return <Item key={i} name={item.name} id={"i" + i} imgId={item.imgId} description={item.description} isUnique={item.isUnique} isActive={item.isActive}
                 addItemToHex={props.addItemToHex} removeItemFromHex={props.removeItemFromHex} isItemAddable={props.isItemAddable}></Item>
           })}
        </div>
    )

}
export default ItemList;