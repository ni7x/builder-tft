import "./Card.css";

const Card = (props) => {

    let allowDrag = (e) =>{
        e.preventDefault();
        if(e.target.id === "remove"){
            e.target.parentElement.parentElement.style.background = "#dd1843";
        }  
    }

    let onDragLeave = (e) =>{
        if(e.target.id === "remove"){
            e.target.parentElement.parentElement.style.background = "#343a40";
        }  
    }
    
    let drag = (e) => {
        if(props.draggable){
            e.dataTransfer.setData("card", JSON.stringify({name: props.name, id: props.id, traits: props.traits, cost: props.cost, items: props.items}));
            e.dataTransfer.setData("id", e.target.id);
            e.dataTransfer.setData("parent", e.target.parentNode.className);
            e.dataTransfer.setData("type", "card");
            e.dataTransfer.setData("comingFrom", e.target.parentNode.id);

            let image =  document.createElement("div");
            image.className = "card costMoving"; 
            image.style.position = "absolute";
            image.style.left = "-200px";
            image.style.top = "-200px";
            image.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"/static/champions/"+ nameForUrl + ".png)"
            document.body.appendChild(image);
            
            e.dataTransfer.setDragImage(image, 34, 34);
            setTimeout(()=>image.remove(), 50);
        }else{
            e.preventDefault();
        }
    }
    
    let drop = (e) => {
        e.preventDefault();

        let thisCard = ({"name": props.name, "id": props.id, "traits": props.traits, "cost": props.cost, "items": props.items});
        let thisHex = e.target.parentNode.id;
        let thisCardParent = e.target.parentNode.className;
        let thisCardId = e.target.id;

        let thisCardElement = document.getElementById(thisCardId);

        let type = e.dataTransfer.getData("type");
        
        if(e.target.id === "remove"){
            e.target.parentElement.parentElement.style.background = "#343a40";
        }

        if(type === "item"){
            let item = JSON.parse(e.dataTransfer.getData("item"));
            let itemId = e.dataTransfer.getData("id");
            let placeItemComesFrom = e.dataTransfer.getData("comingFrom");
            let itemElement = document.getElementById(itemId);
            if(e.target.id === "remove"){
                if(placeItemComesFrom !== "ItemList"){
                    props.removeItemFromHex(placeItemComesFrom, item);
                    itemElement.remove();
                }
                e.target.parentElement.parentElement.style.background = "#343a40";
            }
            if(thisCardParent === "hexagon"){
                if(placeItemComesFrom === "ItemList"){
                    if(props.addItemToHex(thisHex, item)){
                        itemElement.parentElement.remove();
                        thisCardElement.append(itemElement);

                        item.isActive = true;
                        let index = parseInt(item.id.slice(1));
                        props.setItems(existingItems => {
                            return [
                            ...existingItems.slice(0, index),
                            item,
                            ...existingItems.slice(index + 1, existingItems.length)
                            ]
                        })
                        const itemCopy = structuredClone(item);
                        itemCopy.id = "i" + (index+1);
                        itemCopy.isActive = false;
                        props.setItems(items=>[...items, itemCopy]);
                    }
                    
                } else{
                      if(props.addItemToHex(thisHex, item)){
                            props.removeItemFromHex(placeItemComesFrom, item);
                            thisCardElement.append(itemElement);
                        } 
                    }
             }
            
        }
        if(type === "card"){
            let newCard = JSON.parse(e.dataTransfer.getData("card"));
            let newCardId = e.dataTransfer.getData("id");
            let hexNewCardComesFrom = e.dataTransfer.getData("comingFrom");
            let newCardParent = e.dataTransfer.getData("parent");

            let newCardElement = document.getElementById(newCardId);
          
            if(props.cost === 0 || newCard.cost === 0){
                if(newCardParent === "hexagon"){
                    if(thisCardParent === "hexagon"){
                        props.swapHexes(hexNewCardComesFrom, newCard, thisHex, thisCard);
                        swapElements(newCardElement, thisCardElement);
                    }
                 }
            }else{
                if(newCardParent === "hexagon"){
                    if(thisCardParent === "hexagon"){
                        props.swapHexes(hexNewCardComesFrom, newCard, thisHex, thisCard);
                        swapElements(newCardElement, thisCardElement);
                    }
                    else if(thisCardParent === "cards"){
                        props.removeItemFromHex(hexNewCardComesFrom, "allItems");
                        newCardElement.innerHTML = "";
                        
                        props.removeCardFromHex(hexNewCardComesFrom);
                        props.addCardToHex(hexNewCardComesFrom, thisCard);
                        swapElements(newCardElement, thisCardElement);
                    }
                    else if(e.target.id === "remove"){
                        props.removeItemFromHex(hexNewCardComesFrom, "allItems");
                        newCardElement.innerHTML = "";
                        
                        document.getElementById("recentlyUsed").append(newCardElement);    
                        props.removeCardFromHex(hexNewCardComesFrom);
                    }
                }
                else if(newCardParent === "cards"){
                    if(thisCardParent === "hexagon"){
                        props.removeItemFromHex(thisHex, "allItems");
                        thisCardElement.innerHTML = "";

                        props.removeCardFromHex(thisHex);
                        props.addCardToHex(thisHex, newCard);
                        swapElements(thisCardElement, newCardElement);
                        
                    }
                }
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

    let nameForUrl = props.name.toLowerCase().replaceAll(" ", "%20").replace(/'/g, '%27');

    return(
        <div id={props.name} 
            className={"card cost" + props.cost} 
            draggable={props.draggable} 
            onDragStart={e=>drag(e)} 
            onDrop={e=>drop(e)} 
            onDragOver={e=>allowDrag(e)}
            onDragLeave={e=>onDragLeave(e)}
            style={{backgroundImage: "url("+process.env.PUBLIC_URL+"/static/champions/"+ nameForUrl + ".png)"}}>   
        </div>
    )
}

export default Card;