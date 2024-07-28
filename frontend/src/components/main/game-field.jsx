import mainStyles from "./main.module.css"
import { useRef, useState, useEffect } from "react"
import { fullShipDetect, outlineDefeatedShips } from './gameFieldFunctions'
import GameCell from "./GameCell"
import size1ship from "./svg/size1ship.svg"
import size2ship from "./svg/size2ship.svg"
import size3ship from "./svg/size3ship.svg"
import size4ship from "./svg/size4ship.svg"
import size1shipVert from "./svg/size1shipVert.svg"
import size2shipVert from "./svg/size2shipVert.svg"
import size3shipVert from "./svg/size3shipVert.svg"
import size4shipVert from "./svg/size4shipVert.svg"


export function GameField({ cells, setCells, sendMove, canAttack, isOpponentField, opponentMove, setModalText, delayedNav, shipsLayout }) {

    const [animationOfAttack, setAnimationOfAttack] = useState(false)

    let fieldRef = useRef(null)
    let cellsRef = useRef(cells)

    const [activateRocket, setActivateRocket] = useState([-1, false])
    const [activateExplosion, setActivateExplosion] = useState([-1, false])

    const attack = (index) => {

        setAnimationOfAttack(true)
        setTimeout(() => {
            setAnimationOfAttack(false)
        }, 720);

        if (animationOfAttack) return
        if (!isOpponentField) return
        if (!canAttack) return
        if (cells[index] === 2 || cells[index] === 3) return

        sendMove(index)

        setActivateRocket([index, true])

        let needToExplode = false

        let newCells
        if (cells[index] === 0) {
            newCells = cells.map((num, i) => i === index ? 3 : num)
        } else {
            newCells = cells.map((num, i) => i === index ? 2 : num)
            needToExplode = true
        }


        const move = () => {
            if (newCells.filter(c => c === 2).length === 20) {
                setModalText('Вы победили! \n Возвращение в меню...')
                delayedNav()
            }

            const defeatedShips = fullShipDetect(newCells)
            outlineDefeatedShips(defeatedShips, newCells)
            setCells(newCells)
        }

        setTimeout(() => {
            setActivateRocket([index, false])
            if (needToExplode) {
                setActivateExplosion([index, true])
                setTimeout(() => {
                    setActivateExplosion([index, false])
                    move()
                }, 220);
            } else {
                move()
            }

        }, 500)
    }

    
    
    useEffect(() => {
        if (!isOpponentField) {
            if (opponentMove !== -1) {
                
                setActivateRocket([opponentMove, true])
                
                let needToExplode = false
                
                let newCells = cells.slice()
                if (cells[opponentMove] === 0) {
                    newCells = newCells.map((num, i) => i === opponentMove ? 3 : num)
                    cellsRef.current = newCells
                    console.log(cellsRef)
                } else {
                    newCells = newCells.map((num, i) => i === opponentMove ? 2 : num)
                    cellsRef.current = newCells
                    needToExplode = true
                }

                setCells(cellsRef.current)
                
                if (cellsRef.current.filter(c => c === 2).length === 20) {
                    setModalText('Вы проиграли :(  \n Возвращение в меню...')
                    delayedNav()
                }

                
                const move = () => {
                    const defeatedShips = fullShipDetect(newCells)
                    outlineDefeatedShips(defeatedShips, newCells)
                }
            
                setTimeout(() => {
                    setActivateRocket([opponentMove, false])
            
                    if (needToExplode) {
                        setActivateExplosion([opponentMove, true])
                        setTimeout(() => {
                            setActivateExplosion([opponentMove, false])
                            move()
                        }, 220);
                    } else {
                        move()
                    }
            
                }, 500);
                
            }
        }
    }, [opponentMove])

    let shipToRender = []
    const defeatedShips = fullShipDetect(cells)
    if (isOpponentField && defeatedShips.length !== 0) {
        for (let ship of defeatedShips) {
            shipToRender.push({
                firstCell: ship[0],
                length: ship.length,
                direction: ship.length === 1 ? 'hor'
                    : ship[1] - ship[0] === 1
                        ? 'hor'
                        : 'ver'
            })
        }
    }

    const renderShips = (ship) => {
        if (ship.rotation === 'ver') {
            if (ship.shipNumber === 1) return size4shipVert
            if (ship.shipNumber <= 3) return size3shipVert
            if (ship.shipNumber <= 6) return size2shipVert
            if (ship.shipNumber <= 10) return size1shipVert
        } else {
            if (ship.shipNumber === 1) return size4ship
            if (ship.shipNumber <= 3) return size3ship
            if (ship.shipNumber <= 6) return size2ship
            if (ship.shipNumber <= 10) return size1ship
        }
    }

    return (
        <div ref={fieldRef} className={mainStyles.gameField}>
            {cells.map((e, index) => (
                <GameCell
                    isOpponentField={isOpponentField}
                    key={index}
                    e={e}
                    onClick={() => attack(index)}
                    shipToRender={shipToRender}
                    index={index}
                    activateRocket={activateRocket}
                    activateExplosion={activateExplosion}
                ></GameCell>
            ))}

            {isOpponentField ? <></> : shipsLayout.map((ship, index) => (
                <img
                    style={{ position: "absolute", top: ship.startY * 45, left: ship.startX * 45 }}
                    key={index}
                    src={renderShips(ship)}
                    alt='ship'
                >
                </img>
            ))}
        </div>
    )
}