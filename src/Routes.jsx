import React,{useEffect} from "react";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import { useAuth } from "./authContext.jsx";
import {useNavigate,useRoutes} from "react-router-dom";
import CreateRepo from "./components/repo/CreateRepo.jsx";
import RepositoryView from "./components/repo/viewRepo.jsx";
import DeleteRepo from "./components/repo/deleteRepo.jsx";
import UpdateRepo from "./components/repo/updateRepo.jsx";
import ToggleRepo from "./components/repo/toggleRepo.jsx";
import DeleteIssue from "./components/issue/DeleteIssue.jsx";
import ViewIssue from "./components/issue/viewIssue.jsx";
import AllIssues from "./components/issue/AllIssues.jsx";
import CreateIssue from "./components/issue/CreateIssue.jsx";
import UpdateIssue from "./components/issue/UpdateIssue.jsx";
import AllUsers from "./components/user/allUsers.jsx";
import DeleteUser from "./components/user/deleteUser.jsx";
import UpdateProfile from "./components/user/updateProfile.jsx";
//import FollowUser from "./components/user/followUser.jsx";
const ProjectRoutes=()=>{
    const {currentUser,setCurrentUser}=useAuth();
    const navigate=useNavigate();
    useEffect(()=>{
        const userIdFromStorage=localStorage.getItem('userId');
        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }
        if(!currentUser && !["/signup","/auth"].includes(window.location.pathname)){
            navigate("/auth");
        }
        if(currentUser && window.location.pathname=="/auth"){
            navigate("/");
        }
    },[currentUser,setCurrentUser,navigate]);
    let element=useRoutes([
        {
            path:"/",
            element:<Dashboard/>,
        },
        {
            path:"/auth",
            element:<Login/>,
        },
        {
            path:"/signup",
            element:<Signup/>,
        },
        {
            path:"/create",
            element:<CreateRepo/>
        },
        {
            path:"/repository/:id",
            element:<RepositoryView/>
        },
        {
            path:"/repository/delete/:id",
            element:<DeleteRepo/>
        },
        {
            path:"/repository/update/:id",
            element:<UpdateRepo/>
        },
        {
            path:"/repository/toggle/:id",
            element:<ToggleRepo/>
        },
        {
            path:"/issue/delete/:id",
            element:<DeleteIssue/>
        },
        {
            path:"/issue/repo/:id",
            element:<AllIssues/>
        },
        {
            path:"/issue/create/:id",
            element:<CreateIssue/>
        },
        {
            path:"/issue/update/:id",
            element:<UpdateIssue/>
        },
        {path:"/issue/:id",
            element:<ViewIssue/>
        },
        {
            path:"/user/delete/:id",
            element:<DeleteUser/>,
        },
        {
            path:"/user/all",
            element:<AllUsers/>
        },
        {
            path:"/user/profile",
            element:<Profile/>,
        },
        {
            path:"/user/update/:id",
            element:<UpdateProfile/>
        }
    ])
    return element;
}
export default ProjectRoutes;