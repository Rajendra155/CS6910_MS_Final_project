import React from 'react';
import './Square.css';


// Square component represents an individual square in the Tic-tac-toe board
const Square = ({value, OnSquareClick}) =>{

    
    return(
        //Here it will return button
        <button className="square" onClick = {OnSquareClick}>{value}</button>
    )
}

export default Square;