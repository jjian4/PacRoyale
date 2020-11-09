import React from 'react';
import Login from './components/Login/Login';
import './App.css';

const PAGES = {
  LOGIN: 'login',
  MENU: 'menu',
  STORE: 'store',
  HOST_GAME_SETUP: 'host_game_setup',
  JOIN_GAME: 'join_game',
  LOBBY: 'lobby',
  ARENA: 'arena',
}

class App extends React.Component {
  state = {
    currentPage: PAGES.LOGIN
  }
  
  render() {
    const page = this.state.currentPage;

    return (
      <div className="App">
        {page === PAGES.LOGIN && (
          <Login/>
        )}
      </div>
    );
  }
}



export default App;
