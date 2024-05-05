import style from "./Kartica.module.css"

function KarticaInfo({ info, sadrzaj }) {
    return (
        <div className={style.cardInfoRow}>
            <strong>{info}:</strong>
            <p>{sadrzaj}</p>
        </div>
    );
}

export default KarticaInfo;