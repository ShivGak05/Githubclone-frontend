import React, { useRef } from "react";
import { useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
const DeleteIssue=()=>{
    const deletion=useRef(false);
    const {id}=useParams();
    const navigate=useNavigate();
    useEffect(()=>{
        if(deletion.current)return;
        deletion.current=true;
        const deletehandle=async()=>{
            const confirmation=window.confirm("Do you really want to delete this issue");
            if(!confirmation) return;
            try{
                const result=await fetch(`http://localhost:3000/issue/delete/${id}`,{method:"DELETE"});
                const data=await result.json();
                alert(data.message);
                navigate(`/`);
            }catch(err){
                console.log(err);
                alert("error in deleting issue");
            }
        }
        deletehandle();
    },[id,navigate]);
}
export default DeleteIssue;