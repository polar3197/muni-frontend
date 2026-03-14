
import "../../styles/themes.css";

const themes = [
    "milton avery",
    "fairfield porter",
    "thiebaud",
    "diebenkorn",
    "franz kline",
]

const handleClick = () => {}

const Theme = ({name}) => {
    return (
        <div className="theme">
            <p>{name}</p>
        </div>
    )
}

const Themes = () => {
    return (
        <div className="themes">
            {themes.map((theme, index) => (
                <Theme 
                    key={index} 
                    name={theme}
                    onClick={() => handleClick(theme)} 
                />
            ))}
        </div>
    )
}

export default Themes;
