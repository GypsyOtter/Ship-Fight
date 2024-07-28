import cross from './svg/cross.svg'
import dot from './svg/dot.svg'
import ship1hor from "./svg/size1ship.svg"
import ship2hor from "./svg/size2ship.svg"
import ship3hor from "./svg/size3ship.svg"
import ship4hor from "./svg/size4ship.svg"
import ship1ver from "./svg/size1shipVert.svg"
import ship2ver from "./svg/size2shipVert.svg"
import ship3ver from "./svg/size3shipVert.svg"
import ship4ver from "./svg/size4shipVert.svg"
import mainStyles from './main.module.css'
import rocket from './svg/rocket.svg'
import explode from './svg/explosion.svg'
import s from './Game.module.css'

const GameCell = ({ onClick, e, isOpponentField, shipToRender, index, activateRocket, activateExplosion}) => {

    let shipImg = <></>
    for (let ship of shipToRender) {
        if (isOpponentField && index === ship.firstCell) {
            switch (ship.length) {
                case 1:
                    if (ship.direction === 'hor') shipImg = <img className={s.shipImg} alt="ship1" src={ship1hor}></img>
                    if (ship.direction === 'ver') shipImg = <img className={s.shipImg} alt="ship1" src={ship1ver}></img>
                    break;
                case 2:
                    if (ship.direction === 'hor') shipImg = <img className={s.shipImg} alt="ship2" src={ship2hor}></img>
                    if (ship.direction === 'ver') shipImg = <img className={s.shipImg} alt="ship2" src={ship2ver}></img>
                    break;
                case 3:
                    if (ship.direction === 'hor') shipImg = <img className={s.shipImg} alt="ship3" src={ship3hor}></img>
                    if (ship.direction === 'ver') shipImg = <img className={s.shipImg} alt="ship3" src={ship3ver}></img>
                    break;
                case 4:
                    if (ship.direction === 'hor') shipImg = <img className={s.shipImg} alt="ship4" src={ship4hor}></img>
                    if (ship.direction === 'ver') shipImg = <img className={s.shipImg} alt="ship4" src={ship4ver}></img>
                    break;
                default:
                    break;
            }
        }
    }
    
    let CurrentCellState 
    if (!isOpponentField) {
        switch (e) {
            case 0:
                CurrentCellState = <></>
                break;
            case 1:
                CurrentCellState = <></>
                break;
            case 2:
                CurrentCellState = <img className={s.cellImg} src={cross} alt="cross" /> 
                break;
            case 3:
                CurrentCellState = <img className={s.cellImg} src={dot} alt="dot" />
                break;
            default:
                break;
        }
    } else {
        switch (e) {
            case 0:
                CurrentCellState = <></>
                break;
            case 1:
                CurrentCellState = <></>
                break;
            case 2:
                CurrentCellState = <img className={s.cellImg} src={cross} alt="cross" /> 
                break;
            case 3:
                CurrentCellState = <img className={s.cellImg} src={dot} alt="dot" />
                break;
            default:
                break;
        }
    }

    return (
        <button onClick={onClick} className={mainStyles.cell}>
            <img className={activateRocket[1] && activateRocket[0] === index ? `${s.rocket} ${s.fallingRocket}` : s.rocket} src = {rocket}></img>
            <img className={activateExplosion[1] && activateExplosion[0] === index ? `${s.explode} ${s.activeExplode}` : s.explode} src={explode}></img>
            {CurrentCellState}
            {shipImg}
        </button>
    )
}

export default GameCell