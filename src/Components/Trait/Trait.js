import { useState, useEffect } from "react";

const Trait = (props) => {
    let [ style, setStyle ] = useState(0);
    let [ nextStage, setNextStage ] = useState(1);
    let [ stages, setStages ] = useState([]);
    let [ currentStage, setCurrentStage ] = useState(0);
    let [ hovered, setHovered ] = useState(false);
    let [ description, setDescription ] = useState("");
    let [ stagesDescription, setStagesDescription ] = useState("");

    useEffect(()=>{
        formatDescription();
    }, [])
 
    useEffect(()=>{
        setStyle(0);
        setStages([]);
        setCurrentStage(0);
        setNextStage(1);
        let nextStage = 0;
        let maxStage = props.effects.length;
        let hasStyle = false;
        let stages = [];

        props.effects.forEach((effect, i)=>{
            stages.push(effect.minUnits);

            if(props.occurencies >= effect.minUnits && props.occurencies <= effect.maxUnits){
                if(!hasStyle){
                    setStyle(effect.style);
                }
                setCurrentStage(effect.minUnits);
                hasStyle = true;
                nextStage += 1 + i;
            }

            if(nextStage < maxStage ){
                setNextStage(props.effects[nextStage].minUnits);
            }else{
                setNextStage(props.effects[maxStage - 1].minUnits);
            }     
        })
       
        setStages(stages);

    }, [props.occurencies])

    let replaceCancerRiotCharacters = (text, stage) => {
        text = text.toString();
    
        return text.replace(/@(.*?)@/g, (i, match)=>{
            let adjustedMatch = match.charAt(0).toLowerCase() + match.slice(1);
            let result = "";
            if(props.effects[stage][adjustedMatch] === undefined){
                if(props.effects[stage]["variables"][match] === undefined){
                    result = " HUJ WAM W DUPE RIOT ";
                }else{
                    result = props.effects[stage]["variables"][match];
                };
            }else{
                result = props.effects[stage][adjustedMatch];
            }
            return result;
        });
    }

    let formatDescription = () => {
         
        let firstFormat = props.desc.toString().replace(/<expandRow>(.*?)<\/expandRow>/g, (m, match)=>{
            let newString = "";

            props.effects.forEach((effect, i) => {
                newString += replaceCancerRiotCharacters(match, i);
                if(i !== props.effects.length - 1){
                    newString += "\n";
                }
            });
                
            return newString;
        });

        let secondFormat = replaceCancerRiotCharacters(firstFormat, 0);

        let splitted = secondFormat.split("<br><br>");
        setStagesDescription(splitted[1].replaceAll("<br>", "\n"));
        setDescription(splitted[0].replaceAll("<br>", "\n"));

    }

    let setModal = (e) => {
        document.getElementById("desc"+ props.name ).style.top = (e.clientY - 40) + "px";
        setHovered(true)
    }

    return(
        <div style={props.showInactive ? {display:"block"} : currentStage > 0 ? {display:"block"} : {display:"none"} }>
            <div className="trait" style={props.occurencies > 0 ? {display:"block"} : {display:"none"} }>

                <div className="description" id={"desc" + props.name} style={hovered ? {display:"block"}:{display:"none"}}>
                    <b>{props.name}</b>
                    <p>{description}</p>
                    <span className="stageDescription">{stagesDescription}</span>
                </div>
            <div className={"traitImageBorder borderStyle" + style}> 
                <div className={"traitImage style" + style} onMouseEnter={(e)=>setModal(e)} onMouseLeave={(e)=>setHovered(false)}>
                    <img alt={props.name} src={ process.env.PUBLIC_URL+"/static/traits/" + props.name.toLowerCase() + ".png"}></img>
                </div> 
            </div>
            {style > 0 ?
                <div className="traitText">
                    <div className="occurencies">
                        {props.occurencies }
                    </div> 
                    <div className="traitInfo">
                        <div className="name">
                            {props.name}
                        </div> 
                        <div className="stages">
                            {stages.map((stage, i)=>{
                                if(stage === currentStage){
                                    return <span className="currentStage" key={i}>{stage}</span>
                                }else{
                                    return <span key={i}>{stage}</span>
                                }
                            }
                            )}
                        </div>
                    </div>
                </div>:
                <div className="traitText inactive">
                    <div className="traitInfo">
                        <div className="name inactive">
                            {props.name}
                        </div> 
                        <div className="stages">
                            {props.occurencies } / {nextStage}
                        </div>
                    </div>
                </div>
            }
            
            </div>
        </div>
    )
}

export default Trait;