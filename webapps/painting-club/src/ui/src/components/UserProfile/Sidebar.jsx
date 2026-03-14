
import '../../styles/user-profile/sidebar.css';

const Sidebar = ({
    isOpen,
    toggleSidebar
}) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className='sidebar-element'>
                <button onClick={toggleSidebar}>~</button>
            </div>
            <div className='sidebar-element'>
                Profiles
            </div>
            <div className='sidebar-element'>
                Groups
            </div>
        </div>
    )
};

export default Sidebar;