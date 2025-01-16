import Square from './Square.js';
import './Board.css';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Board() {

  const navigate = useNavigate();

   //Array is created to track square has which value eith X or O
  const[square, setSquare] = useState(Array(9).fill(null))
  
  //State is created to track whose turn it is 'X' or 'O'
  const[isXTurn, setIsXTurn] = useState(true);

  const[loading, setLoading] = useState(false);


  //Function to handle logot

  function handleLogout(){
    setLoading(true);
    setTimeout( ()=> {
      setLoading(false);
       navigate('/')

    },2000)
  }


  // Function to handle clicks on a square
  function handleClick(i) {
    
    //To prevent overwriting the value
   if(square[i])
   {
    return;
   }

  const nextSquare = square.slice();  // Creates a copy of the current square array

   if(isXTurn) // Here it will check whose turn if true, it's X's turn
   {
    nextSquare[i] = 'X'; //Update the value in duplicate array
   }
   else{
    nextSquare[i] = 'O'; //Update the value in duplicate array
   }
   
   setSquare(nextSquare) //Update the state and array was also modified
  

   setIsXTurn(!isXTurn)  //Switch between X and O
  }
  console.log(square)
  

// Function to check if it's a Tie
  function checkTie(square) {
    return !square.includes(null);
  }




  const winner = calculateWinner(square);
  let status;

  if(winner)
  {
    status =  winner+ ' wins!';
  }
  else if(checkTie(square))
  {
    status="It's a Tie"
  }
  else{
     status =   (isXTurn ? 'X' : 'O')+" 's Turn ";
  }



  function resetGame(){
     setSquare(Array(9).fill(null));
     setIsXTurn(true);
  }

  return (
    <div className="board-container">
       <div className="logout">
        <button onClick={handleLogout} className='logoutbtn'>Log out</button>
      </div>
      {loading ? ( <> <div className ="spinner-container">

<div className="dots">
<span style={{ '--i': 1 }}></span>
<span style={{ '--i': 2 }}></span>
<span style={{ '--i': 3 }}></span>
<span style={{ '--i': 4 }}></span>
<span style={{ '--i': 5 }}></span>
<span style={{ '--i': 6 }}></span>
<span style={{ '--i': 7 }}></span>
<span style={{ '--i': 8 }}></span>
<span style={{ '--i': 9 }}></span>
<span style={{ '--i': 10 }}></span>
<span style={{ '--i': 11 }}></span>
<span style={{ '--i': 12 }}></span>
<span style={{ '--i': 13 }}></span>
<span style={{ '--i': 14 }}></span>
<span style={{ '--i': 15 }}></span>

</div>

</div> </>) : ( <div className="main-container">
     
  <h2>Tic-tac-toe</h2>
  <p className={winner ?'status winner':'status'}>{status}</p>
 <div className="board">
  {/*First row of board */ }
  <div className='boardrow'>
   <Square value= {square[0]} OnSquareClick = {() => handleClick(0)} />
   <Square value= {square[1]} OnSquareClick = {() => handleClick(1)} />
   <Square value= {square[2]} OnSquareClick = {() => handleClick(2)} />
  </div>

    {/*Second row of board */ }
  <div className='boardrow'>
  <Square value= {square[3]} OnSquareClick = {() => handleClick(3)} />
   <Square value= {square[4]} OnSquareClick = {() => handleClick(4)} />
   <Square value= {square[5]} OnSquareClick = {() => handleClick(5)} />
  </div>

    {/*Third row of board */ }
  <div className='boardrow'>
  <Square value= {square[6]} OnSquareClick = {() => handleClick(6)} />
   <Square value= {square[7]} OnSquareClick = {() => handleClick(7)} />
   <Square value= {square[8]} OnSquareClick = {() => handleClick(8)} />
  </div>

  </div>

  <button className="reset" onClick={resetGame}>Reset</button>

</div>)}
   
    </div>
  );


  //Function to calculate winner
  function calculateWinner(square) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for(let i=0; i<lines.length;i++)
    {
      const[a,b,c] = lines[i];

      // Check if the values at positions a, b, and c are the same and not null
      if(square[a] && square[a] === square[b] && square[a] === square[c])
      {
        return square[a]; //Return the winning player either 'X' or 'O'
       }
    }
    return null;
  }
}

export default Board;
