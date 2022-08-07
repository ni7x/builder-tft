import "./Grid.css";

const Hex = (props) => {

    let drop = (e) => {
        if(e.dataTransfer.getData("type")==="card"){
            e.preventDefault();

            let newCard = JSON.parse(e.dataTransfer.getData("card"));
            let cartId = e.dataTransfer.getData("id");
            let parentClass = e.dataTransfer.getData("parent");
            let comingFrom = e.dataTransfer.getData("comingFrom");
            
            if(parentClass !== "hexagon"){
                props.addCardToHex(e.target.id, newCard);
            }else{
                props.swapHexes(comingFrom, newCard, e.target.id, props.card);
            } 
            e.target.appendChild(document.getElementById(cartId));
        }
    }

    let allowDrop = (e) => {
        e.preventDefault();
    }

    return(
        <div className={"outerHexagon level" + (props.card !== null ? props.card.cost : "")} draggable={false}>
            <div className="hexagon" id={props.id} onDrop={e=>drop(e)} onDragOver={e=>allowDrop(e)}>

            </div>
        </div>
    )
}

export default Hex;