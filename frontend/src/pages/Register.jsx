import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("Web");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const registerUser = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password, domain });
      localStorage.setItem("token", res.data.token);
      alert("Registration successful!");
      navigate("/dashboard"); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Background Glows */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="relative w-full max-w-lg bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Join the <span className="text-emerald-500">Program</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Create your professional intern profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Input */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Domain Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3.5 text-white focus:outline-none focus:border-emerald-500 appearance-none transition-all cursor-pointer"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                <option value="Web" className="bg-slate-900">Web Development</option>
                <option value="AI" className="bg-slate-900">AI / ML Engineering</option>
                <option value="Data Science" className="bg-slate-900">Data Science</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                ↓
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={registerUser}
          disabled={loading}
          className="w-full mt-10 bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          {loading ? "INITIALIZING..." : "START INTERNSHIP"}
        </button>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;