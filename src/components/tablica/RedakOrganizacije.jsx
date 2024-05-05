import style from "./Tablica.module.css"

function RedakOrganizacije({ ime, opis, radionice, predavaci }) {

    const formatirajNiz = (niz) => {
        return niz.join(", ");
    }

    return (
        <tr>
            <td>{ime}</td>
            <td className={style.description}>{opis}</td>
            <td>{formatirajNiz(radionice)}</td>
            <td>{formatirajNiz(predavaci)}</td>
        </tr>
    );
}

export default RedakOrganizacije;
