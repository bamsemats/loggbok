import "./App.css";
import EditorElement from "./components/editor/editor";
import Tiptap from "./components/editor/editor";

function App() {
  return (
    <div className="App">
      <h1 className="main-page-heading">
        <h1 style={{ "--sibling-index": 1 }}>T</h1>
        <h1 style={{ "--sibling-index": 2 }}>H</h1>
        <h1 style={{ "--sibling-index": 3 }}>I</h1>
        <h1
          className="end-of-word-letter"
          style={{ "--sibling-index": 4 }}
        >{`S `}</h1>
        <h1 style={{ "--sibling-index": 5 }}>I</h1>
        <h1
          className="end-of-word-letter"
          style={{ "--sibling-index": 6 }}
        >{`S `}</h1>
        <h1 style={{ "--sibling-index": 7 }}>A</h1>
        <h1
          className="end-of-word-letter"
          style={{ "--sibling-index": 8 }}
        >{`N `}</h1>
        <h1 style={{ "--sibling-index": 9 }}>A</h1>
        <h1 style={{ "--sibling-index": 10 }}>P</h1>
        <h1 style={{ "--sibling-index": 11 }}>P</h1>
      </h1>
      <Tiptap />
    </div>
  );
}

export default App;
