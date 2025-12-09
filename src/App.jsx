import Header from "./components/Header/Header";
import Main from "./pages/Main/Main";
import './index.css';  

function App() {
    return (
        <>
            <Header /> 
            <div className="container">
                <Main />
            </div>
        </>
    );
}

export default App;