import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchTasks();
    fetchSubmissions();
  }, []);

  // ✅ get user
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log("User fetch error", err.response?.data);
    }
  };

  // ✅ get tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log("Task fetch error", err.response?.data);
    }
  };

  // ✅ get submissions
  const fetchSubmissions = async () => {
    try {
      const res = await API.get("/submissions/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch (err) {
      console.log("Submission fetch error", err.response?.data);
    }
  };

  // ✅ check submitted
  const isSubmitted = (taskId) => {
    return submissions.find((s) => s.task?._id === taskId);
  };

  // ✅ submit task (AI + XP handled in backend)
  const submitTask = async (taskId) => {
    try {
      const res = await API.post(
        "/submissions",
        {
          taskId,
          githubLink: answers[taskId],
          textAnswer: answers[taskId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`✅ Submitted! XP Earned: ${res.data.xpEarned}`);

      // 🔥 update UI instantly
      fetchSubmissions();
      fetchUser();

    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const downloadCertificate=async(req,res)=>{
    try{
      const res=await API.get("/certificate/generate",{
        headers:{Authorization:`Bearer ${token}`},
        responseType:"blob",
      });
      const url=window.URL.createObjectURL(new Blob([res.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","certificate.pdf");
      document.body.appendChild(link);
      link.click();
    }
    catch(err){
      alert(err.response?.data?.message || "Certificate failed");
    }
  };

  const allTasksCompleted=tasks.length>0 && submissions.length===tasks.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Intern <span className="text-blue-500">Dashboard</span>
          </h2>
          <p className="text-slate-400">Welcome back, {user?.name || 'Intern'}</p>
        </div>

        {user && (
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex gap-8 backdrop-blur-sm shadow-xl">
            <div className="text-center">
              <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Level</p>
              <p className="text-2xl font-mono text-blue-400">{user.level}</p>
            </div>
            <div className="text-center border-x border-slate-800 px-8">
              <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Total XP</p>
              <p className="text-2xl font-mono text-emerald-400">{user.xp}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-slate-500 font-bold tracking-widest">Domain</p>
              <p className="text-md font-semibold text-slate-300 mt-1">{user.domain}</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">Active Curriculum</h3>
          {allTasksCompleted && (
            <button 
              onClick={downloadCertificate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              🎓 Download Certificate
            </button>
          )}
        </div>

        {/* TASKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.length === 0 ? (
            <p className="text-slate-500 italic">Assigning new tasks shortly...</p>
          ) : (
            tasks.map((task) => {
              const submitted = isSubmitted(task._id);

              return (
                <div key={task._id} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${submitted ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60'}`}>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{task.title}</h4>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded font-mono">+{task.xpReward} XP</span>
                  </div>

                  <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">{task.description}</p>

                  {submitted ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Status: Completed
                      </div>
                      
                      {submitted.aiFeedback && (
                        <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                          <p className="text-xs font-bold text-blue-400 mb-2 uppercase italic">AI Analysis:</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-mono overflow-auto max-h-32">{submitted.aiFeedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                        placeholder="Paste your GitHub repository link or project summary..."
                        value={answers[task._id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [task._id]: e.target.value })}
                      />
                      <button 
                        onClick={() => submitTask(task._id)}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98]"
                      >
                        Submit Project
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;