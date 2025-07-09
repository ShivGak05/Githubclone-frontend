import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import server from "../../../Environment.js";
const server_url=server;
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { User, GitBranch, Users, Edit, LogOut, MapPin, Calendar, Mail } from "lucide-react";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [repos, setRepos] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const { setCurrentUser } = useAuth();
  const [loading,setLoading]=useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const [userRes, repoRes, followingRes] = await Promise.all([
          axios.get(`${server_url}/user/${userId}`),
          axios.get(`${server_url}/repo/user/${userId}`),
          axios.get(`${server_url}/user/${userId}/following`)
        ]);

        setUserDetails(userRes.data);
        setRepos(repoRes.data);
        setFollowingUsers(followingRes.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };
  console.log(repos);
  console.log(userDetails);
  if (loading) {
     return (
       <div style={styles.loadingContainer}>
         <div style={styles.spinner}></div>
       </div>
     );
   }
 
   return (
     <div style={styles.container}>
       {/* Header */}
       <div style={styles.header}>
         <div style={styles.headerContent}>
           <h1 style={styles.title}>Profile</h1>
           <button
             onClick={handleLogout}
             style={styles.logoutButton}
           >
             <LogOut size={16} />
             <span style={styles.logoutText}>Logout</span>
           </button>
         </div>
       </div>
 
       <div style={styles.mainContent}>
         <div style={styles.profileGrid}>
           {/* Left Column - Profile Info */}
           <div style={styles.leftColumn}>
             <div style={styles.profileCard}>
               {/* Profile Picture */}
               <div style={styles.profileSection}>
                 <div style={styles.profileAvatar}>
                   <User size={40} color="white" />
                 </div>
                 <h2 style={styles.username}>@{userDetails?.user?.username}</h2>
                 <div style={styles.emailContainer}>
                   <Mail size={14} />
                   <span style={styles.email}>{userDetails.email}</span>
                 </div>
               </div>
 
               {/* Stats */}
               <div style={styles.statsContainer}>
                 <div style={styles.statCard}>
                   <div style={styles.statNumber}>
                     {userDetails.followers?.length || 0}
                   </div>
                   <div style={styles.statLabel}>Followers</div>
                 </div>
                 <div style={styles.statCard}>
                   <div style={styles.statNumber}>
                     {userDetails.followedUsers?.length || 0}
                   </div>
                   <div style={styles.statLabel}>Following</div>
                 </div>
               </div>
 
               {/* Additional Info */}
               <div style={styles.infoSection}>
                 <div style={styles.infoItem}>
                   <MapPin size={16} />
                   <span style={styles.infoText}>{userDetails.location}</span>
                 </div>
                 <div style={styles.infoItem}>
                   <Calendar size={16} />
                   <span style={styles.infoText}>
                     Joined {new Date(userDetails.joinDate).toLocaleDateString()}
                   </span>
                 </div>
               </div>
 
               {/* Following List */}
               <div style={styles.followingSection}>
                 <div style={styles.followingHeader}>
                   <Users size={16} color="#007bff" />
                   <span style={styles.followingTitle}>Following</span>
                 </div>
                 <div style={styles.followingList}>
                   {followingUsers.length > 0 ? (
                     followingUsers.map((user) => (
                       <div key={user._id} style={styles.followingItem}>
                         <div style={styles.followingAvatar}>
                           <User size={12} color="white" />
                         </div>
                         <span style={styles.followingUsername}>@{user.username}</span>
                       </div>
                     ))
                   ) : (
                     <p style={styles.noFollowing}>Not following anyone yet</p>
                   )}
                 </div>
               </div>
 
               {/* Update Profile Button */}
               <button
                 onClick={() => navigate(`/user/update/${userDetails._id}`)}
                 style={styles.updateButton}
               >
                 <Edit size={16} />
                 <span style={styles.updateButtonText}>Update Profile</span>
               </button>
             </div>
           </div>
 
           {/* Right Column - Activity & Repos */}
           <div style={styles.rightColumn}>
             {/* Heat Map */}
             <div style={styles.activityCard}>
               <h3 style={styles.sectionTitle}>Activity Overview</h3>
               <HeatMapProfile />
             </div>
 
             {/* Repositories */}
             <div style={styles.repoCard}>
               <div style={styles.repoHeader}>
                 <h3 style={styles.sectionTitle}>Your Repositories</h3>
                 <div style={styles.repoCount}>
                   <GitBranch size={16} />
                   <span style={styles.repoCountText}>
                     {repos.repositories?.length || 0} repos
                   </span>
                 </div>
               </div>
               
               <div style={styles.repoList}>
                 {Array.isArray(repos.repositories) && repos.repositories.length > 0 ? (
                   repos.repositories.map((repo) => (
                     <div key={repo._id} style={styles.repoItem}>
                       <div style={styles.repoContent}>
                         <h4 style={styles.repoName}>{repo.name}</h4>
                         <p style={styles.repoDescription}>
                           {repo.description || "No description provided"}
                         </p>
                         <div style={styles.repoMeta}>
                           <span style={styles.repoLanguage}>
                             <div style={styles.languageDot}></div>
                             JavaScript
                           </span>
                           <span style={styles.repoUpdated}>Updated 2 days ago</span>
                         </div>
                       </div>
                       <button style={styles.repoButton}>
                         <GitBranch size={16} />
                       </button>
                     </div>
                   ))
                 ) : (
                   <div style={styles.noRepos}>
                     <GitBranch size={48} color="#dee2e6" />
                     <p style={styles.noReposText}>No repositories found</p>
                     <button style={styles.createRepoButton}>
                       Create your first repository
                     </button>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 const styles = {
   container: {
     minHeight: '100vh',
     backgroundColor: '#f8f9fa',
     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
   },
   loadingContainer: {
     minHeight: '100vh',
     backgroundColor: '#f8f9fa',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center'
   },
   spinner: {
     width: '48px',
     height: '48px',
     border: '3px solid #f3f3f3',
     borderTop: '3px solid #007bff',
     borderRadius: '50%',
     animation: 'spin 1s linear infinite'
   },
   header: {
     backgroundColor: 'white',
     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
     borderBottom: '1px solid #e9ecef'
   },
   headerContent: {
     maxWidth: '1200px',
     margin: '0 auto',
     padding: '0 20px',
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     height: '70px'
   },
   title: {
     fontSize: '24px',
     fontWeight: 'bold',
     color: '#212529',
     margin: 0
   },
   logoutButton: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     padding: '8px 16px',
     backgroundColor: '#dc3545',
     color: 'white',
     border: 'none',
     borderRadius: '8px',
     cursor: 'pointer',
     fontSize: '14px',
     transition: 'background-color 0.2s'
   },
   logoutText: {
     '@media (max-width: 640px)': {
       display: 'none'
     }
   },
   mainContent: {
     maxWidth: '1200px',
     margin: '0 auto',
     padding: '32px 20px'
   },
   profileGrid: {
     display: 'grid',
     gridTemplateColumns: '1fr',
     gap: '32px',
     '@media (min-width: 1024px)': {
       gridTemplateColumns: '1fr 2fr'
     }
   },
   leftColumn: {
     display: 'flex',
     flexDirection: 'column'
   },
   profileCard: {
     backgroundColor: 'white',
     borderRadius: '12px',
     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
     padding: '24px'
   },
   profileSection: {
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     marginBottom: '24px'
   },
   profileAvatar: {
     width: '96px',
     height: '96px',
     background: 'linear-gradient(135deg, #007bff 0%, #6f42c1 100%)',
     borderRadius: '50%',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: '16px'
   },
   username: {
     fontSize: '20px',
     fontWeight: 'bold',
     color: '#212529',
     margin: '0 0 4px 0'
   },
   emailContainer: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     color: '#6c757d'
   },
   email: {
     fontSize: '14px'
   },
   statsContainer: {
     display: 'grid',
     gridTemplateColumns: '1fr 1fr',
     gap: '16px',
     marginBottom: '24px'
   },
   statCard: {
     textAlign: 'center',
     padding: '12px',
     backgroundColor: '#f8f9fa',
     borderRadius: '8px'
   },
   statNumber: {
     fontSize: '24px',
     fontWeight: 'bold',
     color: '#212529'
   },
   statLabel: {
     fontSize: '14px',
     color: '#6c757d'
   },
   infoSection: {
     marginBottom: '24px'
   },
   infoItem: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     color: '#6c757d',
     marginBottom: '12px'
   },
   infoText: {
     fontSize: '14px'
   },
   followingSection: {
     marginBottom: '24px'
   },
   followingHeader: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     marginBottom: '12px'
   },
   followingTitle: {
     fontWeight: '600',
     color: '#212529'
   },
   followingList: {
     maxHeight: '160px',
     overflowY: 'auto'
   },
   followingItem: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     padding: '8px',
     backgroundColor: '#f8f9fa',
     borderRadius: '8px',
     marginBottom: '8px'
   },
   followingAvatar: {
     width: '24px',
     height: '24px',
     background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
     borderRadius: '50%',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center'
   },
   followingUsername: {
     fontSize: '14px',
     color: '#495057'
   },
   noFollowing: {
     color: '#6c757d',
     fontSize: '14px',
     margin: 0
   },
   updateButton: {
     width: '100%',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     gap: '8px',
     padding: '12px 16px',
     backgroundColor: '#007bff',
     color: 'white',
     border: 'none',
     borderRadius: '8px',
     cursor: 'pointer',
     fontSize: '14px',
     fontWeight: '500',
     transition: 'background-color 0.2s'
   },
   updateButtonText: {
     fontSize: '14px'
   },
   rightColumn: {
     display: 'flex',
     flexDirection: 'column',
     gap: '24px'
   },
   activityCard: {
     backgroundColor: 'white',
     borderRadius: '12px',
     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
     padding: '24px'
   },
   repoCard: {
     backgroundColor: 'white',
     borderRadius: '12px',
     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
     padding: '24px'
   },
   sectionTitle: {
     fontSize: '18px',
     fontWeight: '600',
     color: '#212529',
     margin: '0 0 16px 0'
   },
   repoHeader: {
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'space-between',
     marginBottom: '16px'
   },
   repoCount: {
     display: 'flex',
     alignItems: 'center',
     gap: '8px',
     color: '#6c757d'
   },
   repoCountText: {
     fontSize: '14px'
   },
   repoList: {
     display: 'flex',
     flexDirection: 'column',
     gap: '16px'
   },
   repoItem: {
     display: 'flex',
     alignItems: 'flex-start',
     justifyContent: 'space-between',
     border: '1px solid #e9ecef',
     borderRadius: '8px',
     padding: '16px',
     transition: 'background-color 0.2s',
     cursor: 'pointer'
   },
   repoContent: {
     flex: 1
   },
   repoName: {
     fontSize: '16px',
     fontWeight: '600',
     color: '#212529',
     margin: '0 0 4px 0'
   },
   repoDescription: {
     fontSize: '14px',
     color: '#6c757d',
     margin: '0 0 12px 0'
   },
   repoMeta: {
     display: 'flex',
     alignItems: 'center',
     gap: '16px',
     fontSize: '12px',
     color: '#6c757d'
   },
   repoLanguage: {
     display: 'flex',
     alignItems: 'center',
     gap: '4px'
   },
   languageDot: {
     width: '8px',
     height: '8px',
     backgroundColor: '#007bff',
     borderRadius: '50%'
   },
   repoUpdated: {
     fontSize: '12px'
   },
   repoButton: {
     marginLeft: '16px',
     padding: '8px',
     color: '#6c757d',
     backgroundColor: 'transparent',
     border: 'none',
     cursor: 'pointer',
     transition: 'color 0.2s'
   },
   noRepos: {
     textAlign: 'center',
     padding: '32px'
   },
   noReposText: {
     color: '#6c757d',
     margin: '16px 0'
   },
   createRepoButton: {
     marginTop: '16px',
     padding: '8px 16px',
     backgroundColor: '#007bff',
     color: 'white',
     border: 'none',
     borderRadius: '8px',
     cursor: 'pointer',
     fontSize: '14px',
     transition: 'background-color 0.2s'
   }
 };
 
 // Add CSS keyframes for spinner animation
 const styleSheet = document.createElement('style');
 styleSheet.textContent = `
   @keyframes spin {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
   }
   
   button:hover {
     filter: brightness(0.95);
   }
   
   .repo-item:hover {
     background-color: #f8f9fa !important;
   }
   
   @media (max-width: 1024px) {
     .profile-grid {
       grid-template-columns: 1fr !important;
     }
   }
   
   @media (max-width: 640px) {
     .logout-text {
       display: none !important;
     }
     
     .main-content {
       padding: 16px !important;
     }
     
     .profile-card, .activity-card, .repo-card {
       padding: 16px !important;
     }
   }
 `;
 document.head.appendChild(styleSheet);
 
 export default Profile;