import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";

function Task() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({});
  const [githubLink, setGithubLink] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setTask(res.data))
      .catch((err) => console.error("Error fetching task", err));
  }, [id, token]);

  const submitTask = async () => {
    if (!githubLink.startsWith("https://github.com/")) {
      alert("Please enter a valid GitHub repository link");
      return;
    }

    setLoading(true);
    try {
      await API.post(
        "/submissions",
        { taskId: id, githubLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Mission Accomplished! Task submitted.");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
          <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-300 underline underline-offset-4 decoration-blue-500">Task Detail</span>
        </nav>

        {/* MISSION HEADER */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                {task.title || "Loading Objective..."}
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-tighter rounded-full">
                  Priority: High
                </span>
                <span className="text-slate-500 text-xs font-mono">ID: {id?.slice(-6)}</span>
              </div>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 px-6 py-3 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reward</p>
              <p className="text-2xl font-black text-emerald-400">+{task.xpReward || 0} XP</p>
            </div>
          </div>

          {/* DESCRIPTION BOX */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-blue-500"></span> Objective
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg italic">
                "{task.description}"
              </p>
            </section>

            <section className="bg-black/30 border border-slate-800/50 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
                Technical Instructions
              </h3>
              <ul className="space-y-3 text-sm text-slate-400 font-mono">
                <li className="flex gap-3">
                  <span className="text-blue-500">01.</span> Initialize solution in your local VS Code environment.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500">02.</span> Commit changes and push to a public GitHub repository.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500">03.</span> Provide the repository URL in the field below for AI validation.
                </li>
              </ul>
            </section>

            {/* SUBMISSION FORM */}
            <section className="pt-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all pr-32"
                />
                <button 
                  onClick={submitTask}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-white text-black font-black px-6 rounded-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 text-sm tracking-tight"
                >
                  {loading ? "SENDING..." : "SUBMIT LINK"}
                </button>
              </div>
              <p className="mt-4 text-[10px] text-slate-600 text-center uppercase tracking-widest">
                Double-check your repository visibility before submitting
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;