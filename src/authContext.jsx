// import React,{useEffect,createContext,useState,useContext} from "react";
// const AuthContext=createContext();
// export const useAuth=()=>{
//      return useContext(AuthContext);
// }
// export const AuthProvider=({children})=>{
//     const [currentUser,setCurrentUser]=null;
//     useEffect(()=>{
//         let user=localStorage.getItem("userid");
//         if(user){
//             setCurrentUser(user);
//         }
//     },[]);
//     const value={
//         currentUser,setCurrentUser
//     }
//     return <AuthContext.Provider value={value}>{childrem}</AuthContext.Provider>
// }

import React,{createContext,useContext,useEffect, useState} from "react";
const AuthContext=createContext();
export const useAuth=()=>{
    return useContext(AuthContext);
}
export const AuthProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(null);
    useEffect(()=>{
        let userId=localStorage.getItem('userId');
    if(userId){
        setCurrentUser(userId);
    }},[]);
    let value={
        currentUser,setCurrentUser,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
