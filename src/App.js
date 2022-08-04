import CardList from "./Components/Card/CardList";
import Grid from "./Components/Grid/Grid";
import TraitList from "./Components/Trait/TraitList";
import { useState } from "react";
import TopPanel from "./Components/TopPanel/TopPanel";

let App = () => {
    const [hexes, setHexes] = useState(new Array(28).fill(null));
    const [teamName, setTeamName] = useState("");
    const [cards, setCards] = useState([]);

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

    const clearHexesAndName = () => {
        setHexes(new Array(28).fill(null));
        setTeamName("");
    }
    
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

            <TraitList hexes={hexes}></TraitList>
        </div>
    );
}

export default App;
