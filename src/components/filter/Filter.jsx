import style from "./Filter.module.css"

function Filter({ naslov, children }) {
    return (
        <div className={style.filter}>
            <h2>{naslov}:</h2>
            {children}
        </div>
    );
}

export default Filter;