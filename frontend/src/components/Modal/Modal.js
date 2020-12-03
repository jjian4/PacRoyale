import React from "react";
import ReactModal from 'react-modal';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Modal.scss";

const customStyles = {
    content: {
        paddingTop: '0',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        maxWidth: '750px',
        minHeight: '80vh',
        maxHeight: '95vh',
        backgroundColor: 'white',
    },
    overlay: {
        background: "rgba(0, 0, 0, 0.4)"
    }
};

function Modal(props) {
    return (
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={props.onClose}
            style={customStyles}
            contentLabel='Modal'
            ariaHideApp={false}
        >
            <div className='ModalContent'>
                <div className='modalTop'>
                    <div className='modalTitle'>{props.title}</div>
                    <div
                        className='closeButton'
                        onClick={props.onClose}
                    >
                        <FontAwesomeIcon icon={faWindowClose} />
                    </div>
                </div>
                {props.children}
            </div>
        </ReactModal>

    )
}

export default Modal;
