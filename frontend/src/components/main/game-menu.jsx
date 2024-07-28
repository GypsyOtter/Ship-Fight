import mainStyles from "./main.module.css";
import { Ship } from "./Ship";
import { Link } from 'react-router-dom'
import { useState } from "react";
import { SetupField } from "./SetupField";
import size1ship from "./svg/size1ship.svg"
import size2ship from "./svg/size2ship.svg"
import size3ship from "./svg/size3ship.svg"
import size4ship from "./svg/size4ship.svg"
import size1shipVert from "./svg/size1shipVert.svg"
import size2shipVert from "./svg/size2shipVert.svg"
import size3shipVert from "./svg/size3shipVert.svg"
import size4shipVert from "./svg/size4shipVert.svg"


export function GameMenu({ cells, setCells, insertIntoQueue, setShipsLayout, shipsLayout }) {
    

    const refreshOccupiedCells = (newShipsLayout) => {
        const newCells = new Array(100).fill(0);
        for (let ship of newShipsLayout.filter(ship => ship.isOnField)) {
            if (ship.rotation === 'ver') {
                for (let i = 0; i < ship.size; i++) {
                    newCells[10 * (ship.startY + i) + ship.startX] = 1;
                }
            }
            else {
                for (let i = 0; i < ship.size; i++) {
                    newCells[10 * ship.startY + ship.startX + i] = 1;
                }
            }
        }
        return refreshBufferCells(newCells);
    }

    const refreshBufferCells = (newCells) => {
        newCells = newCells.map((e) => e === 4 ? 0 : e);
        for (let i in newCells) {
            if (newCells[i] === 1) {
                if (newCells?.[i - 10] === 0) newCells[i - 10] = 4;
                if (newCells?.[parseInt(i) + 10] === 0) newCells[parseInt(i) + 10] = 4;
                if (i % 10 !== 9 && newCells?.[parseInt(i) + 1] === 0) newCells[parseInt(i) + 1] = 4;
                if (i % 10 !== 0 && newCells?.[i - 1] === 0) newCells[i - 1] = 4;
            }
        }
        setCells(newCells);
        return newCells;
    }

    const preloadImages = new Array(8).fill();
    preloadImages[0] = size1ship;
    preloadImages[1] = size2ship;
    preloadImages[2] = size3ship;
    preloadImages[3] = size4ship;
    preloadImages[4] = size1shipVert;
    preloadImages[5] = size2shipVert;
    preloadImages[6] = size3shipVert;
    preloadImages[7] = size4shipVert;

    return (
        <div className={mainStyles.gameMenu}>
            <SetupField cells={cells} refreshOccupiedCells={refreshOccupiedCells} shipsLayout={shipsLayout} setShipsLayout={setShipsLayout}></SetupField>
            <GameSetupPanel refreshOccupiedCells={refreshOccupiedCells} insertIntoQueue={insertIntoQueue} shipsLayout={shipsLayout} setShipsLayout={setShipsLayout} />
            {preloadImages.map((el, index) => (
                <img key={index} src={el} alt="ship" style={{ width: 0, height: 0, position: "absolute", top: 0, left: 0 }} />
            ))}
        </div>
    );
}

const GameSetupPanel = ({ refreshOccupiedCells, insertIntoQueue, shipsLayout, setShipsLayout, setShipDragged }) => {
    const dragOverHandler = (ev) => {
        ev.preventDefault();
    }

    const dropHandler = (ev) => {
        ev.preventDefault();
        const shipNumber = ev.dataTransfer.getData('text/plain').split(',')[2];
        const shipRemoved = shipsLayout.filter(e => e.shipNumber === parseInt(shipNumber))[0];
        if (shipRemoved.isOnField) {
            let newShipsLayout = shipsLayout.filter(e => e.shipNumber !== parseInt(shipNumber));
            const newShip = {
                shipNumber: parseInt(shipNumber),
                isOnField: false,
                id: mainStyles['ship' + (shipNumber)]
            }
            newShipsLayout = [...newShipsLayout, newShip];
            refreshOccupiedCells(newShipsLayout);
            setShipsLayout(newShipsLayout);
        }
    }


    return (
        <div
            className={mainStyles.gameSetupPanel}
            onDragOver={(ev) => dragOverHandler(ev)}
            onDrop={(ev) => dropHandler(ev)}
        >
            <div className={mainStyles.setupPanelHeading}>Расставьте свои судна</div>
            <div className={mainStyles.shipsContainer}>
                {shipsLayout.filter(e => e.isOnField === false).map((e) => (
                    <Ship
                        key={e.shipNumber}
                        shipNumber={e.shipNumber}
                        isOnField={e.isOnField}
                        rotation={e.rotation}
                        id={mainStyles['ship' + (e.shipNumber)]}
                        shipsLayout={shipsLayout}
                        setShipDragged={setShipDragged}
                    />
                ))}
            </div>
            <Link to='/game'>
                <button
                    disabled={shipsLayout.filter(e => e.isOnField === true).length !== 10}
                    title={shipsLayout.filter(e => e.isOnField === true).length !== 10 ? 'Перед началом завершите расстановку судов' : ''}
                    className={mainStyles.btn}
                    onClick={insertIntoQueue}>
                    Найти игру
                </button>
            </Link>
        </div>
    );

}