
import UserDetails from './UserDetails';
import MediaBar from './MediaBar';
import Art from './Art';
import Sidebar from './Sidebar';
import '../../styles/user-profile/user-profile.css';
import { useAuth } from "../../context/AuthContext";

import { useState } from 'react';

const Profile = () => {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    console.log(currentUser);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className='profile-wrapper'>
            <Sidebar
                isOpen={isOpen}
                toggleSidebar={toggleSidebar}
            ></Sidebar>
            <div className='profile-body'>
                <UserDetails>user deets</UserDetails>
                <MediaBar>media bar</MediaBar>
                <Art>art</Art>
            </div>
        </div>


    );
};

export default Profile;