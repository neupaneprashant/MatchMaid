import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App()  {
    return(
        <div className="App">
            <header className="MatchMaid-header">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                <img src={reactLogo} className="logo react" alt="React logo" />
                <h1>Vite + React</h1>
            </header>
            <div className="card">
                <button onClick={() => alert('Welcome to MatchMaid!')}>Click on me</button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );

}

export default App
