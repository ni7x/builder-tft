import CardList from "../Components/Card/CardList";
import Grid from "../Components/Grid/Grid";
import TraitList from "../Components/Trait/TraitList";
import { useEffect, useState } from "react";
import TopPanel from "../Components/TopPanel/TopPanel";

let Builder = () => {
    const [hexes, setHexes] = useState(new Array(28).fill(null));
    const [teamName, setTeamName] = useState("");
    const [cards, setCards] = useState([]);
    const [traitsMap, setTraitsMap] = useState(new Map());

    const addCardToHex = (cardName, hexNumber) => {
        hexNumber = parseInt(hexNumber);
        setHexes(existingItems => {
          return [
            ...existingItems.slice(0, hexNumber),
            cardName,
            ...existingItems.slice(hexNumber + 1, 28),
          ]
        })
    }

    const swapHexes = (firstHex, firstCard,  secondHex, secondCard) => {
        
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

    const clearHexesAndName = () => {
        setHexes(new Array(28).fill(null));
        setTeamName("");
    }

    let getFreeHex = (hexes) => {
        for(let i=0; i<28; i++){
            if(hexes[i] === null){
                return i;
            }
        }
    }

    let appendSpecialElement = (hex, name) =>{
        let element = document.getElementById(name);
        if(element!==null){
            if(isNameInHexes(name) === false){
                document.getElementById(hex).append(element);
                element.style.display = "block";
            
                addCardToHex({name:name, traits:[], cost:0}, hex);
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

        if(trainerState===2){
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

    return (
        <div className="App">
            <TopPanel hexes={hexes} 
            setTeamName={setTeamName} teamName={teamName}
            setCards={setCards} cards={cards}
            clear={clearHexesAndName}>    
            </TopPanel>

            <Grid addCardToHex={addCardToHex} hexes={hexes} swapHexes={swapHexes}></Grid>

            <CardList removeCardFromHex={removeCardFromHex} addCardToHex={addCardToHex} swapHexes={swapHexes} 
             cards={cards} setCards={setCards}
             ></CardList>

            <TraitList hexes={hexes} traitsMap={traitsMap} setTraitsMap={setTraitsMap}></TraitList>
        </div>
    );
}

export default Builder;
