import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Match Maid</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p>Name</p>
      <input type="text"/>
      <p>
        Email
      </p>
      <input type="text"/>
      <p>
      <div class="slidecontainer">
      <input type="range" min="1" max="100" value="50" />
      
      </div>
      </p>
    </>
    
  )
}

export default App
