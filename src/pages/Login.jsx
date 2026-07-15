import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "sethanjali332@gmail.com" && password === "123456") {
      const userData = {
        name: "Anjali Sharma",
        email: email, 
        role: "Admin"
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userToken", "mock-token-xyz");
      
      navigate("/categories");
    } else {
      alert("Invalid input! Try again");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#0F172A] dark:to-[#1E293B] px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-2xl p-6 md:p-10 transition-all duration-300">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-md bg-(--primary-purple) flex items-center justify-center text-white font-bold text-sm">
            #
          </div>
          <span className="text-(--primary-purple) text-xs tracking-widest uppercase font-semibold">
            Stock Control
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-(--text-white) mb-6">
          Inventory Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-(--bg-dark) border border-(--border-color) text-(--text-white) placeholder-(--text-gray)/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-(--bg-dark) border border-(--border-color) text-(--text-white) placeholder-(--text-gray)/60 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] transition-all"
          />
          
          <button className="w-full bg-(--primary-purple) hover:bg-(--hover-purple) cursor-pointer transition-colors text-white font-semibold py-3 rounded-lg shadow-md mt-2">
            Login
          </button>
        </form>

      </div>
    </div>
  );
};
export default Login;