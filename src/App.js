import { useState, useEffect } from "react"



const App = ()  => {

  const [ value, setValue] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats] = useState([])
  const [ currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }


  const getMessages = async () => {
    
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    
    
    try{
      const response = await fetch("http://localhost:8000/completions", options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    }catch (error) {
      console.error(error)
    }
  }

  useEffect(() =>{
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
          [...prevChats, 
            {
              title: currentTitle,
              role: "user",
              content: value
            }, 
          
            {
              title: currentTitle,
              role : message.role,
              content: message.content
            }
         ]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
  console.log(uniqueTitles)
  return (
    <div className="app">
      <section class="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul class="history">
          { uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={ () => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}

        </ul>
        <nav>
          <p>Made by Ishan</p>
        </nav>
      </section>
      <section class="main">
        {!currentTitle && <h1>IshanGPT</h1>}
        <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key={index}> 
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>)}

        </ul>
        <div class="bottom-section">
          <div class="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p class="info">
            Mock ChatGPT using openAI API
          </p>
        </div>
      </section>

    </div>
  );
}

export default App; 
