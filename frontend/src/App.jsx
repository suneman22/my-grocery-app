import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/items")
      .then(res => res.json())
      .then(setItems);
  }, []);

  const addItem = async () => {
    const res = await fetch("http://localhost:3000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity: 1 }),
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setName("");
  };

  return (
    <div>
      <h1>Grocery List</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map(i => <li key={i.id}>{i.name}</li>)}
      </ul>
    </div>
  );
}

export default App;
