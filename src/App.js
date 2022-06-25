import React from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import ReactConfetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());

  const [score, setScore] = React.useState({
    rolls: 0,
    start: Date.now(),
    timeToWin: '',
    highScore: localStorage.getItem('score') || null,
  });

  const [tenzies, setTenzies] = React.useState(false);

  React.useEffect(() => {
    let allHeld = dice.every((die) => die.isHeld);
    let allSame = dice.every((die) => die.value === dice[0].value);
    if (allSame && allHeld) {
      setTenzies(true);
      setScore((prev) => {
        let newTopScore;
        if (prev.highScore > prev.rolls || prev.highScore == null) {
          newTopScore = prev.rolls;
          localStorage.setItem('score', `${newTopScore}`);
        }
        return {
          ...prev,
          timeToWin: formatTime(Date.now() - prev.start),
          highScore: newTopScore || prev.highScore,
        };
      });
    }
  }, [dice]);

  function allNewDice() {
    return [...new Array(10)].map((el, i) => {
      return generateNewDie();
    });
  }

  function generateNewDie() {
    return { id: nanoid(), value: ~~(Math.random() * 6) + 1, isHeld: false };
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false);
      setDice(allNewDice());
      setScore((prev) => {
        return {
          ...prev,
          start: Date.now(),
          rolls: 0,
          timeToWin: '',
        };
      });
    } else {
      setDice((prev) => {
        return prev.map((dice) => (!dice.isHeld ? generateNewDie() : dice));
      });
      setScore((prev) => {
        return {
          ...prev,
          rolls: prev.rolls + 1,
        };
      });
    }
  }

  function holdDice(id) {
    setDice((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isHeld: !el.isHeld } : el))
    );
  }

  function formatTime(ms) {
    let sec = Math.round(ms / 1000);
    let min;
    if (sec > 60) {
      min = ~~(sec % 60);
      return `${min} min ${sec} seconds`;
    }
    return `${sec} seconds`;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));
  return (
    <main>
      <h1>Tenzies</h1>
      <h4 className='info'>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </h4>
      <h4>Highscore: {score.highScore && `${score.highScore} rolls`}</h4>
      <h2 className='rolls'>Rolls: {score.rolls}</h2>
      {tenzies && <h3>It took {score.timeToWin}</h3>}
      <div className='dice-container'>{diceElements}</div>
      <button className='roll-dice' onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      {tenzies && <ReactConfetti />}
    </main>
  );
}
