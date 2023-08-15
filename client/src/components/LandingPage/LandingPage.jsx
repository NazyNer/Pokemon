import React from 'react';
import { Link } from 'react-router-dom';
import style from './LandingPage.module.css';
export default function LandingPage() {

  return<div>
      <h1>Atrapalos a todos!!</h1>
      <div><Link className={style.navButton} to={`/home`}>Pokemon</Link></div>
    </div>;
}