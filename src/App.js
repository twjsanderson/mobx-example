import React, { useState, useContext, createContext } from 'react';
import './App.css';
import { useLocalStore, useObserver } from 'mobx-react'; 

const StoreContext = createContext();


// We create a store using the mobx useLocalStore function
// then use context api to pass that store into the provider and
// make the values inside available to the child components
// state is mutable!
const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    stuff: ['belt', 'book', 'paper'],
    addStuff: (el) => {
      store.stuff.push(el)
    },
    get stuffCount() {
      return store.stuff.length
    }
  }))

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
};


const StuffHeader = () => {
  const store = useContext(StoreContext);
  return useObserver(() => (
    <h1>{store.stuffCount} stuff!</h1>
  ))
}

// Observer returns a fucntion that wraps the JSX
const StuffList = () => {
  const store  = useContext(StoreContext)
  return useObserver(() => (
    <ul>
      {store.stuff.map((el, inx) => <li key={inx}>{el}</li>)}
    </ul>
  ));
}

const StuffForm = () => {
  const store = useContext(StoreContext);
  const [stuff, setStuff] = useState("");

  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        store.addStuff(stuff) 
        setStuff('')
      }}
    >
      <input 
        type="text" 
        value={stuff} 
        onChange={e => {setStuff(e.target.value)}} 
      />
      <button type="submit">Add</button>
    </form>
  )
}


function App() {
  return (
    <StoreProvider>
      <h1>App</h1>
      <StuffHeader />
      <StuffList />
      <StuffForm />
    </StoreProvider>
  );
}

export default App;
