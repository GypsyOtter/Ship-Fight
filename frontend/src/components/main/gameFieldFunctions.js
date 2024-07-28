export const fullShipDetect = (field) => {

    let defeatedCellsArr = []

    const check = (shipNumber, index, prefIndex) => {
        if (prefIndex === -1) {
            defeatedCellsArr[shipNumber] = [index]
        } else {
            defeatedCellsArr[shipNumber].push(index)
        }

        if (field[index -1] === 2 && index % 10 !== 0 && index - 1 !== prefIndex) {
            check(shipNumber, index -1, index)
        }
        if (field[index +1] === 2 && index % 10 !== 9 && index + 1 !== prefIndex) {
            check(shipNumber, index +1, index)
        }
        if (field[index -10] !== undefined && field[index -10] === 2 && index -10 !== prefIndex) {
            check(shipNumber, index -10, index)
        }
        if (field[index + 10] !== undefined && field[index +10] === 2 && index + 10 !== prefIndex) {
            check(shipNumber, index +10, index)
        }
    }
    
    let shipNumber = 0
    
    for (let i in field) {
        let needToCheck = true
        if (field[+i] === 2) {
            for (let ship of defeatedCellsArr) {
                for (let c of ship) {
                    if (c === +i) {
                        needToCheck = false
                    }
                }
            }
            if (needToCheck) {
                check(shipNumber, +i, -1)
                shipNumber += 1
            }
        }
    }

    let defeatedShipsArr = defeatedCellsArr.slice()
    return defeatedShipsArr.filter((ship) => {
        for (let i in ship) {
            let cell = ship[i]
            if ((cell % 10 !== 9 && field[cell + 1] === 1) ||
                (cell % 10 !== 0 && field[cell - 1] === 1) ||
                (field[cell + 10] !== undefined && field[cell + 10] === 1) ||
                (field[cell - 10] !== undefined && field[cell - 10] === 1)) {
                return false
            }
        }
        return true
    })
}
export const outlineDefeatedShips = (defeatedShips, cells) => {
    for (let ship of defeatedShips) {
        for (let i of ship) {
            if (i % 10 !== 0) {
                if (cells[i-1] === 0) {
                    cells[i-1] = 3
                }
            }
            if (i % 10 !== 9) {
                if (cells[i+1] === 0) {
                    cells[i+1] = 3
                }
            }
            if (cells[i+10] !== undefined) {
                if (cells[i+10] === 0) {
                    cells[i+10] = 3
                }
            }
            if (cells[i-10] !== undefined) {
                if (cells[i-10] === 0) {
                    cells[i-10] = 3
                }
            }
        }
    }
}