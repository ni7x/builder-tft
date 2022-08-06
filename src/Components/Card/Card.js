import "./Card.css";

const Card = (props) => {

    let allowDrag = (e) =>{
        e.preventDefault();
    }
    
    let drag = (e) => {
        if(props.draggable){
            e.dataTransfer.setData("card", JSON.stringify({name: props.name, id: props.id, traits: props.traits, cost: props.cost}));
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

        let thisCard = ({"name": props.name, "id": props.id, "traits": props.traits, "cost": props.cost});
        let thisHex = e.target.parentNode.id;
        let thisCardParent = e.target.parentNode.className;
        let thisCardId = e.target.id;

        let thisCardElement = document.getElementById(thisCardId);

        let type = e.dataTransfer.getData("type");

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
                        props.removeCardFromHex(hexNewCardComesFrom);
                        props.addCardToHex(thisCard, hexNewCardComesFrom);
                        swapElements(newCardElement, thisCardElement);   
                    }
                    else if(e.target.id === "remove"){
                        document.getElementById("recentlyUsed").append(newCardElement);
                        props.removeCardFromHex(hexNewCardComesFrom);
                    }
                }
                else if(newCardParent === "cards"){
                    if(thisCardParent === "hexagon"){
                        props.removeCardFromHex(thisHex);
                        props.addCardToHex(newCard, thisHex);
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
            style={{backgroundImage: "url("+process.env.PUBLIC_URL+"/static/champions/"+ nameForUrl + ".png)"}}>   
        </div>
    )
}

export default Card;