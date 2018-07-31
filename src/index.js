import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// 1.Square组件(使用了函数组件定义的方式)
function Square(props){
      return (
        <button className="square" onClick={()=>props.onClick()}>
        {props.value}
      </button>
      );
  }
  
//   2.Board 组件
  class Board extends React.Component {
      

    

    renderSquare(i) {
        // 能把值传到子组件Square中
      return <Square value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)} />;
    }
    
    render() {
      return (
          <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  

//   3. game组件
  class Game extends React.Component {
      // 在组件的constructor方法中设置this.state添加自身状态数据
    constructor(){
        super();
        this.state = {
            history:[{
                squares:Array(9).fill(null)
            }],
            xIsNext : true,
            stepNumber:0
        };
    }
    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 判断如果某个格子已有数或者已经有人胜利了就不能再下棋
        if(calculateWinner(squares) || squares[i] ){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X':'O';
        // 放回
        this.setState({
            history:history.concat([{
                squares:squares
            }]),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext,
        })
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)? false:true,
        })
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
      const moves = history.map((step , move)=>{
          const desc = move ? 'Move #'+ move:'Game start';
          return (
              <li key={move}>
                  <a  onClick={()=>this.jumpTo(move)}>{desc}</a>
              </li>
          );
      });

    //   渲染列表
      let status;
      if(winner){
        status = "Winner is "+ winner;
      }
      else{
        status = "Next player" + (this.state.xIsNext?"X":"O");
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  

  function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  