import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Todos from "./components/todos/Index";
import View from './components/todos/View';


function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes >
          <Route exact path='/' element={<Todos />} />
          <Route path='/:id/:name' element={<View />} />
        </Routes >
      </Router>
    </>
  )
}

export default App;
