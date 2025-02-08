import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import style from './Modal.module.scss';

type ModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children?: ReactNode;
};

const Modal: FC<ModalProps> = ({ visible, setVisible, children }) => {
  return visible
    ? createPortal(
        <div className={style.modalOverlay}>
          <div className={style.modalBox}>
            <div className={style.close} onClick={() => setVisible(false)} />
            <div className={style.text}>{children}</div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
