import "../../styles/announcements.css";

const Announcement = ({ message }) => {
    return (
        <div className="announcement-item">
             <p>{message}</p>
        </div>
    )
}

const Announcements = () => {
    const announcements = [
        "Painting Club meets Sunday 02/15 @ 3pm @ charlie's house for indoor still life"
    ]
    
    return (
        <div className="announcements">
            <h2 className="announcements-header">
                Announcements
            </h2>
            <div className="announcements-body">
                {announcements.map((a, index) => (
                    <Announcement
                        key={index}
                        message={a}
                    />
                ))}
            </div>
        </div>
    )
}

export default Announcements;
