import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./FloatingActionButton.scss";

function FloatingActionButton(props) {
    return (
        <div className='FloatingActionButton' onClick={props.onClick} title={props.title}>
            <FontAwesomeIcon icon={props.icon} />
        </div>
    )
}

export default FloatingActionButton;
