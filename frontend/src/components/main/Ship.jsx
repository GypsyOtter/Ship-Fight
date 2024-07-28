import s from "./main.module.css"
import { Size1Ship } from './ships/Size1Ship'
import { Size2Ship } from './ships/Size2Ship'
import { Size3Ship } from './ships/Size3Ship'
import { Size4Ship } from './ships/Size4Ship'
import { Size1ShipVert } from './ships/Size1ShipVert'
import { Size2ShipVert } from './ships/Size2ShipVert'
import { Size3ShipVert } from './ships/Size3ShipVert'
import { Size4ShipVert } from './ships/Size4ShipVert'
import size1ship from "./svg/size1ship.svg"
import size2ship from "./svg/size2ship.svg"
import size3ship from "./svg/size3ship.svg"
import size4ship from "./svg/size4ship.svg"
import size1shipVert from "./svg/size1shipVert.svg"
import size2shipVert from "./svg/size2shipVert.svg"
import size3shipVert from "./svg/size3shipVert.svg"
import size4shipVert from "./svg/size4shipVert.svg"

import { useState } from "react"

export const Ship = ({ id, shipNumber, isOnField, size, startX, startY, rotation, shipsLayout, refreshOccupiedCells, shipMoveAttemptHandler }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [phantomShaking, setPhantomShaking] = useState(false);
    let otherRotation;
    if (rotation === 'ver') otherRotation = 'hor';
    else otherRotation = 'ver';

    if (!isOnField && shipNumber === 6) rotation = 'ver';

    const dragStartHandler = (ev) => {

        const rect = ev.target.getBoundingClientRect();
        const offsetX = ev.clientX - rect.left;
        const offsetY = ev.clientY - rect.top;

        const img = new Image();
        img.src = getShipDragImage(shipNumber, rotation);
        ev.dataTransfer.setDragImage(img, offsetX, offsetY);

        ev.dataTransfer.setData('text/plain', [offsetX, offsetY, shipNumber, rotation])
        if (isOnField) {
            let newShipsLayout = shipsLayout.filter(ship => ship.shipNumber !== shipNumber);
            refreshOccupiedCells(newShipsLayout);
        }
    }

    const dragEndHandler = () => {
        if (isOnField) refreshOccupiedCells(shipsLayout);
    }

    const getShipImage = (shipNumber, rotation, fill) => {
        if (rotation === 'hor') {
            if (shipNumber === 1) return <Size4Ship fill={fill} />;
            else if (shipNumber <= 3) return <Size3Ship fill={fill} />;
            else if (shipNumber <= 6) return <Size2Ship fill={fill} />;
            else return <Size1Ship fill={fill} />;
        }
        else if (rotation === 'ver') {
            if (shipNumber === 1) return <Size4ShipVert fill={fill} />;
            else if (shipNumber <= 3) return <Size3ShipVert fill={fill} />;
            else if (shipNumber <= 6) return <Size2ShipVert fill={fill} />;
            else return <Size1ShipVert fill={fill} />;
        }
        else {
            if (shipNumber === 1) return <Size4Ship fill={fill} />;
            else if (shipNumber <= 3) return <Size3Ship fill={fill} />;
            else if (shipNumber <= 5) return <Size2Ship fill={fill} />;
            else if (shipNumber === 6) return <Size2ShipVert fill={fill} />;
            else return <Size1Ship fill={fill} />;
        }
    }

    const getShipDragImage = (shipNumber, rotation) => {
        if (rotation === 'hor') {
            if (shipNumber === 1) return size4ship;
            else if (shipNumber <= 3) return size3ship;
            else if (shipNumber <= 6) return size2ship;
            else return size1ship;
        }
        else if (rotation === 'ver') {
            if (shipNumber === 1) return size4shipVert;
            else if (shipNumber <= 3) return size3shipVert;
            else if (shipNumber <= 6) return size2shipVert;
            else return size1shipVert;
        }
        else {
            if (shipNumber === 1) return size4ship;
            else if (shipNumber <= 3) return size3ship;
            else if (shipNumber <= 5) return size2ship;
            else if (shipNumber === 6) return size2shipVert;
            else return size1ship;
        }
    }

    const getPhantomPosition = () => {
        if (size <= 2) return [startX, startY];
        else if (rotation==='hor') return [startX+1, startY-1];
        else return [startX-1, startY+1];
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    const handleMouseDown = (event) => {
        if (event.button === 2){
            let newShipsLayout = shipsLayout.filter(ship => ship.shipNumber !== shipNumber);
            let opCells = refreshOccupiedCells(newShipsLayout);
            let wasRotated = shipMoveAttemptHandler(shipNumber, getPhantomPosition(), otherRotation, opCells);
            if (wasRotated) setIsHovered(false);
            if (!wasRotated) {
                setPhantomShaking(true);
                setTimeout(() => {
                    setPhantomShaking(false);
                }, 500);
                refreshOccupiedCells(shipsLayout);
            }
        }
    }


    if (!isOnField) {
        return (
            <div
                draggable={true}
                className={s.ship}
                id={id}
                onDragStart={(ev) => dragStartHandler(ev)}
                onDragEnd={(ev) => dragEndHandler(ev)}
                alt="ship"
            >
                {getShipImage(shipNumber, rotation, "#000000")}
            </div>
        );
    }
    else if (!isHovered) {
        return (
            <div
                draggable={true}
                className={s.ship}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: "absolute", top: startY * 45, left: startX * 45 }}
                onDragStart={(ev) => dragStartHandler(ev)}
                onDragEnd={(ev) => dragEndHandler(ev)}
            >
                {getShipImage(shipNumber, rotation, '#000000')}
            </div>
        );
    }
    else {
        return (
            <div>
                <div
                    title="Нажмите ПКМ для поворота"
                    draggable={true}
                    className={s.ship}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={(event) => handleMouseDown(event)}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ position: "absolute", top: startY * 45, left: startX * 45 }}
                    onDragStart={(ev) => dragStartHandler(ev)}
                    onDragEnd={(ev) => dragEndHandler(ev)}
                >
                    {getShipImage(shipNumber, rotation, '#000000')}
                </div>
                <div
                    className={phantomShaking ? `${s.ship} ${s.shake}` : `${s.ship}`}
                    style={{ position: "absolute", top: getPhantomPosition()[1] * 45, left: getPhantomPosition()[0] * 45, pointerEvents: "none" }}
                    onMouseLeave={handleMouseLeave}
                >
                    {getShipImage(shipNumber, otherRotation, 'rgba(255, 165, 0, 0.5)')}
                </div>
            </div>
        );
    }
}