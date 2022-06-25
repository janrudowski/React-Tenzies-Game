import React from 'react';

export default function Die(props) {
  return (
    <div
      onClick={props.holdDice}
      className={`die ${props.isHeld ? 'is-held' : ''}`}
    >
      <img src={`images/${props.value}.png`} alt='dice' />
    </div>
  );
}
