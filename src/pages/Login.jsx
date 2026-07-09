import { useState } from "react"

const Login=({setLogin})=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault()

    const userData = {email, password}
    localStorage.setItem("user", JSON.stringify(userData))
    setLogin(true)
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-(--bg-dark) px-4">
      <div className="w-100 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-2xl p-8">
        
        {/* Header / Brand Icon */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-md bg-(--primary-purple) flex items-center justify-center text-(--text-white) font-bold text-sm">
            #
          </div>
          <span className="text-(--primary-purple) text-xs tracking-widest uppercase font-semibold">
            Stock Control
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-(--text-white) mb-6">
          Inventory Login
        </h1>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-(--bg-dark) border border-(--border-color) text-(--text-white) placeholder-(--text-gray) p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-purple)"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-(--bg-dark) border border-(--border-color) text-(--text-white) placeholder-(--text-gray) p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-purple)"
          />
          
          {/* Main Action Button */}
          <button className="w-full bg-(--primary-purple) hover:bg-(--hover-purple) transition-colors text-(--text-white) font-semibold py-3 rounded-lg shadow-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;