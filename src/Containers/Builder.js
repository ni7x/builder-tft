import CardList from "../Components/Card/CardList";
import Grid from "../Components/Grid/Grid";
import TraitList from "../Components/Trait/TraitList";
import { useEffect, useState } from "react";
import TopPanel from "../Components/TopPanel/TopPanel";
import ItemList from "../Components/Items/ItemList";

let Builder = () => {
    const [ hexes, setHexes ] = useState(new Array(28).fill(null));
    const [ teamName, setTeamName ] = useState("");
    const [ cards, setCards ] = useState([]);
    const [ traitsMap, setTraitsMap ] = useState(new Map());
    const [ items, setItems ] = useState([]);
    const [ showInactive, setShowInactive ] = useState(true);

    const addCardToHex = (hexNumber, card) => {
        hexNumber = parseInt(hexNumber);
        setHexes(existingItems => {
          return [
            ...existingItems.slice(0, hexNumber),
            card,
            ...existingItems.slice(hexNumber + 1, 28),
          ]
        })
    }

    const swapHexes = (firstHex, firstCard, secondHex, secondCard) => {
        firstHex = parseInt(firstHex);
        secondHex = parseInt(secondHex);
        
        if(secondHex < firstHex){
            let swap = secondHex;
            secondHex = firstHex;
            firstHex = swap;
        }
        else{
            let swap = firstCard;
            firstCard = secondCard;
            secondCard = swap;
        }
        
        if(firstHex !== secondHex){
            setHexes(existingItems => {
                return [
                  ...existingItems.slice(0, firstHex),
                  firstCard,
                  ...existingItems.slice(firstHex + 1, secondHex),
                  secondCard,
                  ...existingItems.slice(secondHex + 1, 28),
                ]
              })
        } 
    }

    const removeCardFromHex = (hexNumber) => {
        hexNumber = parseInt(hexNumber);
        setHexes(existingItems => {
          return [
            ...existingItems.slice(0, hexNumber),
            null,
            ...existingItems.slice(hexNumber + 1, 28),
          ]
        })
    }

    const removeCardByName = (cardName) => {
        for(let i = 0; i<28; i++){
            if(hexes[i]!==null){
                if(hexes[i].name === cardName){
                    removeCardFromHex(i);
                }
            }
        }
    }

    let isNameInHexes = (cardName) => {
        for(let i = 0; i<28; i++){
            if(hexes[i]!==null){
                if(hexes[i].name === cardName){
                    return true;
                }
            }
        }
        return false;
    }

    let isItemAddable = (cardIdOrHexNum, item, type) =>{
        let cardId = null;
        if(type === "hexNum"){
            cardId = hexNumToCardId(cardIdOrHexNum)
        }else{
            cardId = cardIdOrHexNum;
        }
        
        if(cardId === undefined){
            displayAlert("U can't itemize Nomsy and Jade Statue!");
            return false;
        }
        let card = cards[cardId];
        
        if(card !== null){
            let itemsValue = 0;
            let isUnique = true;

            if(item.name.split(" ")[1] === "Emblem"){
                if(card.traits.includes(item.name.split(" ")[0])){
                    displayAlert(card.name +" is " + item.name.split(" ")[0] +" already!");
                    return false;
                }
            }

            for(let i = 0; i<card.items.length; i++){
                if(card.items[i].imgId === 99){
                    itemsValue += 3;
                }else{
                    if(card.items[i].imgId === item.imgId){
                        if(item.isUnique){
                            isUnique = false;
                            displayAlert(item.name +" is unique!");
                            return false;
                        }
                    }
                    itemsValue += 1;
                }
            }

            let itemValue = 1;
            if(item.imgId === 99){
                itemValue = 3;
            }
            const isAmountCorrect = itemsValue + itemValue <= 3;
            if(isAmountCorrect === false){   
                if(card.items.length === 1){
                    displayAlert("Too many items! Keep in mind that TG counts as 3 items.");
                    return false
                }
                else{
                    displayAlert("Too many items!");
                    return false;
                }
            }

            if(isAmountCorrect && isUnique){
                return true;
            }
        }
        
        return false; 
    }

    let hexNumToCardId = (hexNum) => {
        return hexes[hexNum].id;
    }

    let addItemToCard = (cardId, item) => {
            if(isItemAddable(cardId, item)){
                let card = cards[cardId];
                card.items.push(item);
                cardId = parseInt(cardId);
                setCards(existingItems => {
                    return [
                    ...existingItems.slice(0, cardId),
                    card,
                    ...existingItems.slice(cardId + 1, 63)
                    ]
                })

                return true;
            }
        
        return false; 
    }

    let addItemToHex = (hexNumber, item) => {
        let hexObj = hexes[(hexNumber)];
        if(addItemToCard(hexObj.id, item)){     
            hexObj.items.push(item);
            hexNumber = parseInt(hexNumber);
                    
            setHexes(existingItems => {
                return [
                    ...existingItems.slice(0, hexNumber),
                    hexObj,
                    ...existingItems.slice(hexNumber + 1, 28)
                    ]
                })
                return true;
            }
        return false; 
    }

    let removeItemFromHex = (hexNumber, item) => {
        hexNumber = parseInt(hexNumber);
        let hexObj = hexes[(hexNumber)];
       
        if(hexObj!==null){
            if(item === "allItems"){
                hexObj.items = [];
            }else{
                hexObj.items = hexObj.items.filter(i => i.id !== item.id);
            }
            removeItemFromCard(hexObj.id, item);
            hexNumber = parseInt(hexNumber);
            setHexes(existingItems => {
                return [
                ...existingItems.slice(0, hexNumber),
                hexObj,
                ...existingItems.slice(hexNumber + 1, 28)
                ]
            })
         }}

         let removeItemFromCard = (cardId, item) => {
            cardId = parseInt(cardId);
            let card = cards[cardId];
           
            if(card!==null){
                if(item === "allItems"){
                    card.items = [];
                }else{
                    card.items = card.items.filter(i => i.id !== item.id);
                }
                setCards(existingItems => {
                    return [
                    ...existingItems.slice(0, cardId),
                    card,
                    ...existingItems.slice(cardId + 1, 63)
                    ]
                })
        }}


      let getFreeHex = (hexes) => {
        for(let i=0; i<28; i++){
            if(hexes[i] === null){
                return i;
            }
        }
        return null;
    }   

    let appendSpecialElement = (hex, name) =>{
        let element = document.getElementById(name);
        if(element!==null && hex!=null){
            if(isNameInHexes(name) === false){
                document.getElementById(hex).append(element);
                element.style.display = "block";
                addCardToHex(hex, {name:name, traits:[], cost:0});
            }
        }
       
    }

    let removeSpecialElement = (name) =>{
        let element = document.getElementById(name);
        if(element!==null){
            document.getElementById("cardsList").append(element);
            element.style.display = "none";
            removeCardByName(name);
        }
       
    }

    let trainerState = traitsMap.get("Trainer");

    useEffect(()=>{
        let hex = getFreeHex(hexes);

        if(trainerState === 2){
           appendSpecialElement(hex, "Nomsy")
        }
        if(trainerState < 2){
           removeSpecialElement("Nomsy");
        }

    }, [trainerState, hexes])

    let jadeState = traitsMap.get("Jade");

    useEffect(()=>{
        let counter = 0;
        for(let i = 0; i<=jadeState; i++){
            if(i && (i%3 === 0)){
                counter += 1;
            }
        }
        for(let i=1; i<5; i++){
            if(i<=counter){
                let hex = getFreeHex(hexes);
                appendSpecialElement(hex, "Jade Statue" + i);
            }else{
                removeSpecialElement("Jade Statue"+i);
            }
        }

    }, [jadeState, hexes])

    const clearHexesAndName = () => {
        setHexes(new Array(28).fill(null));
        setTeamName("");
        cards.forEach((card) => card.items = []);
    }

    useEffect(()=>{
        console.log(hexes);
    }, [hexes])

    let displayAlert = (message, color) => {
        let box = document.getElementById("alertBox");
        box.innerText = message;
        if(color === undefined){
            color = "#fff23e";
        }
        box.style.backgroundColor = color;
        box.className = "fadeIn";

        setTimeout(()=>{
                box.className = "";
         }, "2600")
    }

    const toggleInfoModal = () => {
        let modal = document.getElementById("basicInfoModal");
        if(modal.style.display === "flex"){
            modal.style.display = "none";
        }else{
            modal.style.display = "flex";
        }
    }


    return (
        <div className="Builder">
            <div id="basicInfoModal">
                <div className="basicInfo">
                    <p>You can drag <span className="championSpan">champion</span> and drop it on any grid hex.</p>
                    <p>Each champion has it's own traits set. Summary of all placed on grid champions' traits is on the left.</p>
                    <p><span className="itemSpan">Items</span> are also draggable. U can drop them on champions that are currently on grid.</p>
                    <p>
                        U can place up to 3 items on each champion. 
                        There are some exceptions though. 
                        Some items are unique and some can take more space than 1.
                        There are also emblems - items that give holder given trait.
                        Emblems can't be placed on champions that have given trait already.
                        Also, you can't place item on special unit.
                    </p>
                    <p>Special units - <span className="specialUnitsSpan">Jade Statues</span> and <span className="specialUnitsSpan">Nomsy</span> are cards that are summoned when respectively Jade and Trainer thresholds are met.</p>
                    <p>To remove <span className="championSpan">champion</span> or <span className="itemSpan">item</span> - drag them on the hex with trash bin image in top right. Removing champion also removes it's items.</p>
                    <small>That was a lot of typing for no reason~~</small>
                   
                    <button onClick={toggleInfoModal}>Got it!</button>
                    <button onClick={toggleInfoModal} className="thankU">Fuck off</button>
                </div>
            </div>
            <button id="showBasicInfo" onClick={toggleInfoModal}><i class="fa-solid fa-question"></i></button>
            <TopPanel hexes={hexes} 
                setTeamName={setTeamName} teamName={teamName}
                setCards={setCards} cards={cards}
                clear={clearHexesAndName}
                displayAlert={displayAlert}
                setShowInactive={setShowInactive}>  
            </TopPanel>

            <Grid addCardToHex={addCardToHex} hexes={hexes} swapHexes={swapHexes}></Grid>
            <CardList removeCardFromHex={removeCardFromHex} addCardToHex={addCardToHex} swapHexes={swapHexes} 
                cards={cards} setCards={setCards} setItems={setItems} addItemToHex={addItemToHex} removeItemFromHex={removeItemFromHex}> 
            </CardList>

            <TraitList hexes={hexes} traitsMap={traitsMap} setTraitsMap={setTraitsMap} showInactive={showInactive}></TraitList>

            <ItemList items={items} setItems={setItems} addItemToHex={addItemToHex} removeItemFromHex={removeItemFromHex} isItemAddable={isItemAddable}></ItemList>
        </div>
    );
}

export default Builder;
