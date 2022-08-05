import { useState, useEffect } from "react";
import Trait from "./Trait";
import traitData from "./traitData.json";
import "./Trait.css";

const TraitList = (props) => {
    let [ traitsData, setTraitsData ] = useState(new Map())
    let data = traitData;

    useEffect(()=>{
        data.forEach((trait, i)=>{
            let traitsData = [data[i].effects, data[i].desc];
            setTraitsData(prev=>new Map([...prev,  [trait.name, traitsData]]));
            props.setTraitsMap(prev=>new Map([...prev,  [trait.name, 0]]));
        });
    }, [props.hexes])
    
    useEffect(()=>{
        let list = [];

        props.hexes.forEach(champion=>{
            if(champion !== null){
                if(champion.traits.includes("Dragon")){
                    list.push(champion.traits[0]);
                    list.push(champion.traits[0]);
                }
                champion.traits.forEach(trait=>{
                    list.push(trait);
                })
            }
        });

        list.forEach(trait=>{
            let occurencies = 0;
            list.forEach(nextTrait=>{
                if(trait === nextTrait){
                    occurencies += 1;
                }
            })
            props.setTraitsMap(prev=>new Map([...prev,  [trait, occurencies]]));
        })

    }, [props.hexes])

    let getStyleLevel = (championName, occurencies) => {
        let style = 0;
        traitsData.get(championName)[0].forEach((effect, i)=>{
            if(occurencies >= effect.minUnits && occurencies <= effect.maxUnits){
                style = effect.style;
            }
        })
        return style;
    }

    let sortByStyle = (a, b) =>{
        let style1 = getStyleLevel(a[0], a[1]);
        let style2 = getStyleLevel(b[0], b[1]);

        if (style1 === style2)
            if(a[1] > b[1])
                return -1;
            else if(a[1] < b[1])
                return 1;
            else
                return 0;
        else if (style1 < style2)
            return 1;
        else if (style1 > style2)
            return -1;
    }

    return(
        <div className="traits">
        {Array.from(props.traitsMap).sort((a,b) => sortByStyle(a,b)).map((mapData, i)=>{
            let name = mapData[0];
            let occurencies = mapData[1];
            let effects = traitsData.get(name)[0];
            let desc = traitsData.get(name)[1];

            return <Trait key={name} name={name} occurencies={occurencies} effects={effects} desc={desc}></Trait>
        })}
        </div>
    )
}

export default TraitList;