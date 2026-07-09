import { useState } from "react"; 
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";

function App() { 
  const [login, setLogin] = useState(() => {
    return localStorage.getItem("user") ? true : false;
  });

  return (
    <>
      {login ? (
        <div className="relative">
          <button 
            onClick={() => {
              localStorage.removeItem("user"); 
              setLogin(false);        
            }} 
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md z-50 text-sm hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
          {/* <Categories /> */}
          <Sidebar/>
        </div>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </>
  );
}

export default App;