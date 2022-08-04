import { useEffect } from "react";
import Card from "./Card";
import championData from "./championData.json";
import "./Card.css";

const CardList = (props) => {
    const data = championData;

    useEffect(()=>{
        let cardList = [];
        let notChampions = ["Nomsy", "Jade Statue"];

        data.forEach((champion, i)=>{
            if(!notChampions.includes(champion.name)){
                    let card = {"name": champion.name, "cost": champion.cost, "traits": champion.traits}
                    cardList.push(card);
            }
        })
        props.setCards(cardList.sort((a, b) => a.cost - b.cost));
        
    }, [])

    return(
        <>
            <div className="rightPanel">
                <div className="outHex">
                    <div className="hex">
                        <Card key={10000} id="remove" name="remove"
                                                traits={[]} cost={0}
                                                draggable={false}
                                                removeCardFromHex={props.removeCardFromHex}
                                                swapHexes={props.swapHexes} addCardToHex={props.addCardToHex} setCards={props.setCards}>
                        </Card>
                    </div>
                </div>
                
                <div id="recentlyUsed">
                </div>
            </div>
        
            <div className="cards" id="cardsList">
                {props.cards.map((champion, i) =>{
                    return <Card key={i} id={i} name={champion.name}
                                        traits={champion.traits} cost={champion.cost}
                                        removeCardFromHex={props.removeCardFromHex}
                                        draggable={true}
                                        swapHexes={props.swapHexes} addCardToHex={props.addCardToHex} setCards={props.setCards}>
                                        </Card>
                })}
            </div>
    </>
    )
}

export default CardList;