import React from "react";
import ReactModal from 'react-modal';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Modal.scss";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        height: '80vh',
        backgroundColor: 'white',
    },
    overlay: {
        background: "rgba(0, 0, 0, 0.3)"
    }
};

function Modal(props) {
    return (
        <ReactModal
            isOpen={props.isOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={props.onClose}
            style={customStyles}
            contentLabel='Modal'
            ariaHideApp={false}
        >
            <div className='ModalContent'>
                <div className='modalTitle'>{props.title}</div>
                <div
                    className='closeButton'
                    onClick={props.onClose}
                >
                    <FontAwesomeIcon icon={faWindowClose} />
                </div>
                {props.children}
            </div>
        </ReactModal>

    )
}

export default Modal;
