import "./App.css";
import EditorElement from "./components/editor/editor";
import Tiptap from "./components/editor/editor";

function App() {
  return (
    <div className="App">
      <h1 className="main-page-heading">
        <span style={{ "--sibling-index": 1 }}>T</span>
        <span style={{ "--sibling-index": 2 }}>h</span>
        <span style={{ "--sibling-index": 3 }}>i</span>
        <span style={{ "--sibling-index": 4 }}>{`s `}</span>
        <span style={{ "--sibling-index": 5 }}>i</span>
        <span style={{ "--sibling-index": 6 }}>{`s `}</span>
        <span style={{ "--sibling-index": 7 }}>a</span>
        <span style={{ "--sibling-index": 8 }}>{`n `}</span>
        <span style={{ "--sibling-index": 9 }}>A</span>
        <span style={{ "--sibling-index": 10 }}>p</span>
        <span style={{ "--sibling-index": 11 }}>p</span>
      </h1>
      <Tiptap />
    </div>
  );
}

export default App;
