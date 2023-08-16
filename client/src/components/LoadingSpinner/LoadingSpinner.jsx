import React from 'react';
import style from './LoadingSpinner.module.css'; 

function LoadingSpinner() {
  return (
    <div className={style.spinnerContainer}>
      <div className={style.spinner}></div>
    </div>
  );
}

export default LoadingSpinner;