import React from 'react'
import s from './Game.module.css'

const ModalWindow = ({modalText}) => {

  return (
    <div className={modalText !== ''  ? `${s.modalWindow} ${s.active}` : s.modalWindow}>
      <div className={s.modalContent}>
        {modalText}
      </div>
    </div>
  )
}

export default ModalWindow