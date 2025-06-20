import React, { useEffect,useRef} from "react";
import server from "../../../Environment.js";
const server_url=server;
import { useNavigate, useParams } from "react-router-dom";
const ToggleRepo=()=>{
    const {id}=useParams();
    const navigate=useNavigate();
    const hasToggled = useRef(false);
    useEffect(()=>{
         if (hasToggled.current) return;
    hasToggled.current = true;
        const toggle=async()=>{
            const confirmme=window.confirm("Are you sure to change the visibility of this repo?");
            if(!confirmme) return;
            try{
               const result=await fetch(`${server_url}/repo/toggle/${id}`,{method:"PATCH"});
               const data=await result.json();
                if(data.repository){
                    alert(`repository made ${data.repository.visibility}`);
                    navigate(`/repository/${id}`);
                }
            }catch(err){
                console.log(err);
            }
        }
        toggle();
    },[id]);
    return null
}
export default ToggleRepo;