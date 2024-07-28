import s from './Game.module.css'
import { GameField } from "./game-field"
import ModalWindow from './ModalWindow'
import { useEffect, useState } from 'react'
import loader from './svg/loader.svg'

export function Game ({cells, setCells, socket, navigate, needToNavigate, shipsLayout, setShipsLayout}) {

  const [isInQueue, setIsInQueue] = useState(false)
  const [opponentCells, setOpponentCells] = useState("")
  const [opponentMove, setOpponentMove] = useState(-1)
  const [currentMove, setCurrentMove] = useState("")
  const [modalText, setModalText] = useState("")

  useEffect(() => {
    if (modalText !== "") {
      setTimeout(() => {
        setModalText("")
      }, 2000);
    }
  }, [modalText])

  useEffect(() => {
    if (needToNavigate) {
      navigate("/")
    }
  }, [])
  if (needToNavigate) {
    return
  }

  const sendMove = (move) => {
    if (opponentCells[move] !== 1 && opponentCells[move] !== 2) {
      setCurrentMove("second")
    }
    socket.current.send(
      JSON.stringify({
        event: "move",
        move: move,
      })
    )
  }

  const leaveGame = () => {
    setModalText("Вы вышли из игры. \n Возвращение в меню...")
    delayedNav()
  }

  const delayedNav = () => {
    setTimeout(() => {
      socket.current.close()
      navigate("/")
    }, 2000)
  }

  socket.current.onopen = () => {
    setIsInQueue(true)
    const move = Math.random() < 0.5 ? "first" : "second"
    socket.current.send(JSON.stringify({
      event: "queue",
      field: cells,
      move: move,
    }))
  }

  socket.current.onmessage = (event) => {
    if (typeof JSON.parse(event.data) === "object") {
      setCurrentMove(JSON.parse(event.data).move)
      setOpponentCells(JSON.parse(event.data).field)
      setIsInQueue(false)
    } else if (typeof JSON.parse(event.data) === "number") {
      setOpponentMove(JSON.parse(event.data))
      if (cells[JSON.parse(event.data)] !== 1 && cells[JSON.parse(event.data)] !== 2) {
        setTimeout(() => {
          setCurrentMove("first")
        }, 550);
      }
    } else if (typeof JSON.parse(event.data) === "string") {
      setModalText("Противник вышел из игры. \n Возвращение в меню...")
      delayedNav()
    }
  }

  socket.current.onclose = () => {
    setShipsLayout(Array(10).fill(null).map((e, index) => ({ shipNumber: index + 1, isOnField: false, rotation: 'hor' })))
    setCells(Array(100).fill(0))
    console.log("сокет закрыт")
  }
  socket.current.onerror = () => {
    console.log("ошибка сокета")
  }

  return (
    <div className={s.container}>
        <div className={s.myField}>
          <h2>Ваше поле</h2>
          <GameField 
            isOpponentField = {false} 
            cells = {cells}
            opponentMove = {opponentMove}
            setCells = {setCells}
            setModalText = {setModalText}
            delayedNav = {delayedNav}
            shipsLayout = {shipsLayout}
        />
        </div>
        {
          isInQueue 
          ? <div className={s.loadingBLock}>
              <h2>Ожидаем второго игрока...</h2>
              <img alt='loader' src={loader}></img>
            </div>
          : opponentCells === ''
            ? <></>
            : <>
                <div className={s.gameInfo}>
                  {currentMove === 'first' ? <h1>Ваш ход</h1> : <h1>Ход противника</h1>}
                  <button className={s.exitBtn} onClick={leaveGame}>Выход</button>
                </div>
                <div className={s.opponentField}>
                  <h2>Поле противника</h2>
                  <GameField 
                    sendMove = {sendMove}
                    isOpponentField = {true}
                    canAttack = {currentMove === 'first' ? true : false}
                    cells = {opponentCells}
                    setCells = {setOpponentCells}
                    setModalText = {setModalText}
                    delayedNav = {delayedNav}
                  /> 
                </div>
              </>
        }
        <ModalWindow modalText = {modalText} />
    </div>
  )
}