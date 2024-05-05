import style from "./Tablica.module.css"

function Tablica({ children, stupac1, stupac2, stupac3, stupac4, kategorija }) {
    return (
        <table>
            <thead className={style.tableThead}>
                <tr>
                    <th>{stupac1}</th>
                    <th>{stupac2}</th>
                    <th>{stupac3}</th>
                    <th>{stupac4}</th>
                    {
                        kategorija !== "organizacije" && <th>Opcije</th>
                    }
                </tr>
            </thead>

            <tbody>
                {children}
            </tbody>

        </table>
    );
}

export default Tablica;
