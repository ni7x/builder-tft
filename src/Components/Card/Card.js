import "./Card.css";

const Card = (props) => {

    let allowDrag = (e) =>{
        e.preventDefault();
    }
    
    let drag = (e) => {
        if(props.draggable){
            e.dataTransfer.setData("text", JSON.stringify(props));
            e.dataTransfer.setData("id", e.target.id);
            e.dataTransfer.setData("parent", e.target.parentNode.className);
            e.dataTransfer.setData("comingFrom", e.target.parentNode.id);

            let image =  document.createElement("div");
            image.className = "card costMoving"; 
            image.style.position = "absolute";
            image.style.left = "-200px";
            image.style.top = "-200px";
            image.style.backgroundImage = "url(/static/champions/"+ nameForUrl + ".png)"
            document.body.appendChild(image);
            e.dataTransfer.setDragImage(image, 34, 34);
            setTimeout(()=>image.remove(), 50);
        }else{
            e.preventDefault();
        }
    }
    
    let drop = (e) => {
        e.preventDefault();

        let newCard = JSON.parse(e.dataTransfer.getData("text"));
        let cartId = e.dataTransfer.getData("id");
        let parentClass = e.dataTransfer.getData("parent");
        let comingFrom = e.dataTransfer.getData("comingFrom");
        let thisCard = ({"name": props.name, "id": props.id, "traits": props.traits, "cost": props.cost});
        let thisParent = e.target.parentNode.className;
        
        if(parentClass === "hexagon"){
            if(thisParent === "hexagon"){
                props.swapHexes(comingFrom, newCard, e.target.parentNode.id, thisCard);
                swapElements(document.getElementById(comingFrom).firstChild, document.getElementById(e.target.parentNode.id).firstChild);
            }
            else if(thisParent === "cards"){
                props.removeCardFromHex(comingFrom);
                props.addCardToHex(thisCard, comingFrom);
                swapElements(document.getElementById(comingFrom).firstChild, document.getElementById(e.target.id));   
            }
            else if(e.target.id === "remove"){
                document.getElementById("recentlyUsed").append(document.getElementById(comingFrom).firstChild);
                props.removeCardFromHex(comingFrom);
             
            }
        }
        else if(parentClass === "cards"){
            if(thisParent === "hexagon"){
                props.removeCardFromHex(e.target.parentNode.id);
                props.addCardToHex(newCard, e.target.parentNode.id);
                swapElements(document.getElementById(e.target.parentNode.id).firstChild, document.getElementById(cartId));
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

    let nameForUrl = props.name.replaceAll(" ", "%20").replace(/'/g, '%27');

    return(

        <div id={props.name} 
            className={"card cost" + props.cost} 
            draggable={props.draggable} 
            onDragStart={e=>drag(e)} 
            onDrop={e=>drop(e)} 
            onDragOver={e=>allowDrag(e)}
            style={{backgroundImage: "url(/static/champions/"+ nameForUrl + ".png)"}}
        >   
        </div>
    )
}

export default Card;