import React from 'react';

import { ErrorModalProps } from '../../types';

import './ErrorModal.css';

const ErrorModal: React.FC<ErrorModalProps> = React.memo((props) => {
  return (
    <>
      <div className='backdrop' onClick={props.onClose} />
      <div className='error-modal'>
        <h2>An Error Occurred!</h2>
        <p>{props.children}</p>
        <div className='error-modal__actions'>
          <button type='button' onClick={props.onClose}>
            Okay
          </button>
        </div>
      </div>
    </>
  );
});

export default ErrorModal;
