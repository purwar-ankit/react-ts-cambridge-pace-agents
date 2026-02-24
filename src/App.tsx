import React, { useState, useEffect, useRef } from "react";

const DEADLINES = [
  { id: 1, label: "Mini Project 1", date: "2026-03-30", course: "Course 1", detail: "Applying Statistics & Core DS Techniques", color: "#00d4aa" },
  { id: 2, label: "Mini Project 2", date: "2026-04-07", course: "Course 1", detail: "Applying Statistics & Core DS Techniques", color: "#00d4aa" },
  { id: 3, label: "Mini Project 3", date: "2026-06-01", course: "Course 2", detail: "Solving Business Problems with Supervised Learning", color: "#4d9fff" },
  { id: 4, label: "Topic Project 1", date: "2026-07-20", course: "Course 3A", detail: "Applying Advanced Data Science Techniques", color: "#b06aff" },
  { id: 5, label: "Topic Project 2", date: "2026-08-24", course: "Course 3B", detail: "Applying Advanced Data Science Techniques", color: "#b06aff" },
  { id: 6, label: "Final Employer Project", date: "2026-10-12", course: "Course 4", detail: "Exploring the Future of DS & Employer Project", color: "#ff6b6b" },
  { id: 7, label: "Personal Reflection", date: "2026-10-19", course: "Course 4", detail: "Final Reflection & Consolidation", color: "#ff6b6b" },
];

const AGENTS = [
  { id: "tutor", icon: "🧠", label: "DS Tutor", desc: "Concept explanations & weekly help" },
  { id: "deadlines", icon: "📅", label: "Deadline Tracker", desc: "Progress & submission planning" },
  { id: "market", icon: "📈", label: "Market Scout", desc: "Job trends & skill demand" },
  { id: "portfolio", icon: "💼", label: "Portfolio Builder", desc: "Turn projects into case studies" },
  { id: "mentor", icon: "🎯", label: "Mentor Prep", desc: "Questions for industry sessions" },
];

const SYSTEM_PROMPTS = {
  tutor: `You are an expert Data Science tutor for a University of Cambridge PACE Career Accelerator student currently in Course 1: "Applying Statistics and Core Data Science Techniques in Business" (Feb–Mar 2026). 

Their full programme covers:
- Course 1: Statistics & Core DS (Feb–Mar)
- Course 2: Supervised Learning (Apr–May)  
- Course 3: Advanced DS & ML (Jun–Aug)
- Course 4: Future of DS + Employer Project (Sep–Oct)

Your role:
- Explain concepts clearly with intuition first, then math
- Use Python examples (pandas, numpy, scikit-learn, matplotlib)
- Connect theory to real business applications
- Suggest what to focus on for portfolio and projects
- Be encouraging but rigorous — Cambridge standard

Current focus: Statistics (descriptive stats, probability, hypothesis testing, regression, data cleaning, EDA, visualisation).`,

  market: `You are a Data Science career intelligence agent for a Cambridge PACE student studying DS with ML & AI (2026). 

Your role:
- Report on current UK & global DS/ML job market trends
- Identify the most in-demand skills right now (e.g. LLMs, MLOps, cloud ML, PyTorch)
- Give salary benchmarks for DS roles in the UK
- Highlight which industries are hiring most aggressively
- Compare job requirements to what the student is learning
- Suggest certifications or side projects that boost employability
- Be specific, data-driven, and actionable

Focus on the UK market primarily, but include global remote opportunities.`,

  portfolio: `You are a Portfolio Builder agent for a Cambridge PACE Data Science student. 

Your role:
- Help transform mini-projects and topic projects into compelling portfolio pieces
- Structure case studies: Problem → Approach → Methodology → Results → Business Impact
- Write professional project descriptions for GitHub and LinkedIn
- Suggest visualisations and metrics to include
- Advise on how to present technical work to both technical and non-technical audiences
- Help with README files, project write-ups, and presentation slides

Be concise, professional, and help the student stand out in the job market.`,

  mentor: `You are a Mentor Session Preparation agent for a Cambridge PACE Data Science student.

Their programme includes industry mentor sessions in Weeks 2, 4, and 6 of each course.

Your role:
- Help craft smart, thoughtful questions for industry mentors
- Help the student articulate their background, goals, and current learning
- Suggest topics to ask about: career paths, technical skills, industry challenges, hiring advice
- Help interpret and apply advice received from mentors
- Role-play mentor conversations to practice
- Help follow up after sessions (thank you notes, LinkedIn connections)

Be strategic — these mentor sessions are rare access to real industry professionals.`,
};

function getDaysLeft(dateStr) {
  const now = new Date();
  const target = new Date(dateStr + "T17:00:00");
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineCard({ dl }) {
  const days = getDaysLeft(dl.date);
  const urgent = days <= 14;
  const soon = days <= 30;
  const passed = days < 0;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${passed ? "#333" : urgent ? dl.color + "88" : "#2a2a3e"}`,
      borderLeft: `3px solid ${passed ? "#444" : dl.color}`,
      borderRadius: 8,
      padding: "12px 16px",
      marginBottom: 8,
      opacity: passed ? 0.5 : 1,
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: passed ? "#666" : "#e8e8f0", fontFamily: "'DM Mono', monospace" }}>{dl.label}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{dl.course} · {dl.detail}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace",
            color: passed ? "#555" : urgent ? "#ff6b6b" : soon ? "#ffb347" : dl.color,
          }}>
            {passed ? "SUBMITTED" : days === 0 ? "TODAY" : `${days}d left`}
          </div>
          <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>
            {new Date(dl.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · 5pm UK
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  return (
    <div style={{
      marginBottom: 16,
      display: "flex",
      flexDirection: msg.role === "user" ? "row-reverse" : "row",
      gap: 10,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: msg.role === "user" ? "#4d9fff22" : "#00d4aa22",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, border: `1px solid ${msg.role === "user" ? "#4d9fff44" : "#00d4aa44"}`,
      }}>
        {msg.role === "user" ? "U" : "AI"}
      </div>
      <div style={{
        maxWidth: "80%",
        background: msg.role === "user" ? "rgba(77,159,255,0.1)" : "rgba(0,212,170,0.07)",
        border: `1px solid ${msg.role === "user" ? "#4d9fff22" : "#00d4aa22"}`,
        borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
        padding: "10px 14px",
        fontSize: 13,
        lineHeight: 1.6,
        color: "#c8c8d8",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
        {msg.loading && <span style={{ opacity: 0.5 }}>▋</span>}
      </div>
    </div>
  );
}

export default function App() {
  const [activeAgent, setActiveAgent] = useState("tutor");
  const [conversations, setConversations] = useState({ tutor: [], market: [], portfolio: [], mentor: [] });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "deadlines" | "roadmap" | "settings"
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("cam_pace_api_key") || "";
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeAgent]);

  const currentAgent = AGENTS.find(a => a.id === activeAgent);
  const currentMessages = conversations[activeAgent] || [];

  const QUICK_PROMPTS = {
    tutor: ["Explain p-values simply", "EDA checklist for my project", "When to use which regression?", "Python: clean missing data"],
    market: ["Top DS skills in UK 2026", "Salary ranges for junior DS roles", "Which industries hire most DS?", "LLMs vs traditional ML jobs"],
    portfolio: ["Structure my mini project write-up", "GitHub README template for DS", "How to explain my project to non-tech hiring managers", "What metrics should I show?"],
    mentor: ["Questions to ask a DS industry mentor", "How to introduce myself to a mentor", "Follow-up email after mentor session", "How to network after the session"],
  };

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);

    const userMsg = { role: "user", content: msg };
    const updatedHistory = [...(conversations[activeAgent] || []), userMsg];
    setConversations(prev => ({ ...prev, [activeAgent]: updatedHistory }));

    const assistantMsg = { role: "assistant", content: "", loading: true };
    setConversations(prev => ({ ...prev, [activeAgent]: [...updatedHistory, assistantMsg] }));

    try {
      const apiMessages = updatedHistory.map(m => ({ role: m.role, content: m.content }));

      const key = apiKey || localStorage.getItem("cam_pace_api_key") || "";
      if (!key) {
        setConversations(prev => ({
          ...prev,
          [activeAgent]: [...updatedHistory, { role: "assistant", content: "⚠️ No API key set. Please click ⚙️ Settings in the sidebar and add your Gemini API key.", loading: false }],
        }));
        setLoading(false);
        return;
      }

      // Build Gemini contents array — prepend system prompt as first user/model turn
      const systemTurn = [
        { role: "user", parts: [{ text: SYSTEM_PROMPTS[activeAgent] }] },
        { role: "model", parts: [{ text: "Understood. I will follow these instructions precisely." }] },
      ];
      const geminiMessages = apiMessages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [...systemTurn, ...geminiMessages] }),
        }
      );

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || data.error?.message || "Sorry, I couldn't get a response.";

      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...updatedHistory, { role: "assistant", content: reply, loading: false }],
      }));
    } catch (e) {
      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...updatedHistory, { role: "assistant", content: "Connection error. Please try again.", loading: false }],
      }));
    }
    setLoading(false);
  }

  const nextDeadline = DEADLINES.find(d => getDaysLeft(d.date) > 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a12",
      color: "#e0e0f0",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #1a1a2e",
        background: "rgba(10,10,18,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #00d4aa, #4d9fff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700,
          }}>C</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0", letterSpacing: 0.3 }}>Cambridge PACE</div>
            <div style={{ fontSize: 10, color: "#555", fontFamily: "'DM Mono', monospace" }}>DS + ML & AI · Agent Hub</div>
          </div>
        </div>
        {nextDeadline && (
          <div style={{
            fontSize: 11, color: "#ffb347",
            background: "rgba(255,179,71,0.08)",
            border: "1px solid rgba(255,179,71,0.2)",
            borderRadius: 6, padding: "4px 10px",
            fontFamily: "'DM Mono', monospace",
          }}>
            ⚡ {nextDeadline.label} in {getDaysLeft(nextDeadline.date)}d
          </div>
        )}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 69px)" }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          borderRight: "1px solid #1a1a2e",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          background: "#080810",
        }}>
          <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace", padding: "4px 8px 8px", letterSpacing: 1 }}>AGENTS</div>
          {AGENTS.filter(a => a.id !== "deadlines").map(agent => (
            <button
              key={agent.id}
              onClick={() => { setActiveAgent(agent.id); setActiveTab("chat"); }}
              style={{
                background: activeAgent === agent.id && activeTab === "chat" ? "rgba(0,212,170,0.08)" : "transparent",
                border: `1px solid ${activeAgent === agent.id && activeTab === "chat" ? "#00d4aa33" : "transparent"}`,
                borderRadius: 8,
                padding: "10px 10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                color: activeAgent === agent.id && activeTab === "chat" ? "#00d4aa" : "#888",
              }}
            >
              <div style={{ fontSize: 14 }}>{agent.icon} <span style={{ fontSize: 12, fontWeight: 600 }}>{agent.label}</span></div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 2, paddingLeft: 20 }}>{agent.desc}</div>
            </button>
          ))}

          <div style={{ borderTop: "1px solid #1a1a2e", margin: "8px 0" }} />
          <div style={{ fontSize: 10, color: "#444", fontFamily: "'DM Mono', monospace", padding: "4px 8px 8px", letterSpacing: 1 }}>TOOLS</div>

          <button
            onClick={() => setActiveTab("deadlines")}
            style={{
              background: activeTab === "deadlines" ? "rgba(77,159,255,0.08)" : "transparent",
              border: `1px solid ${activeTab === "deadlines" ? "#4d9fff33" : "transparent"}`,
              borderRadius: 8, padding: "10px 10px",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              color: activeTab === "deadlines" ? "#4d9fff" : "#888",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600 }}>📅 Deadline Tracker</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>All submission dates</div>
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            style={{
              background: activeTab === "roadmap" ? "rgba(176,106,255,0.08)" : "transparent",
              border: `1px solid ${activeTab === "roadmap" ? "#b06aff33" : "transparent"}`,
              borderRadius: 8, padding: "10px 10px",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              color: activeTab === "roadmap" ? "#b06aff" : "#888",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600 }}>🗺️ Agent Roadmap</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Python/LangChain next steps</div>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            style={{
              background: activeTab === "settings" ? "rgba(255,179,71,0.08)" : "transparent",
              border: `1px solid ${activeTab === "settings" ? "#ffb34733" : "transparent"}`,
              borderRadius: 8, padding: "10px 10px",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              color: activeTab === "settings" ? "#ffb347" : "#888",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600 }}>⚙️ API Key Settings</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Configure Anthropic key</div>
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeTab === "settings" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              <div style={{ maxWidth: 520, margin: "0 auto" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e8f0", marginBottom: 4 }}>⚙️ API Key Settings</div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 24, fontFamily: "'DM Mono', monospace" }}>Powered by Google Gemini · Free tier</div>

                <div style={{ background: "rgba(255,179,71,0.05)", border: "1px solid rgba(255,179,71,0.2)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#ffb347", fontWeight: 600, marginBottom: 6 }}>How to get your FREE Gemini API key</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
                    1. Go to <span style={{ color: "#4d9fff", fontFamily: "monospace" }}>aistudio.google.com</span><br/>
                    2. Sign in with your Google account (free)<br/>
                    3. Click <b style={{ color: "#c0c0d0" }}>Get API Key</b> → <b style={{ color: "#c0c0d0" }}>Create API key</b><br/>
                    4. Copy and paste it below — no credit card needed ✅
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>ANTHROPIC API KEY</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={e => setApiKeyInput(e.target.value)}
                      placeholder="AIza..."
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.04)",
                        border: "1px solid #2a2a3e", borderRadius: 8,
                        padding: "10px 14px", color: "#e0e0f0",
                        fontSize: 13, outline: "none", fontFamily: "monospace",
                      }}
                    />
                    <button
                      onClick={() => {
                        if (apiKeyInput.trim()) {
                          setApiKey(apiKeyInput.trim());
                          localStorage.setItem("cam_pace_api_key", apiKeyInput.trim());
                          setApiKeySaved(true);
                          setTimeout(() => setApiKeySaved(false), 2500);
                          setApiKeyInput("");
                        }
                      }}
                      style={{
                        background: "linear-gradient(135deg, #00d4aa, #4d9fff)",
                        border: "none", borderRadius: 8,
                        padding: "10px 18px", color: "#0a0a12",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}
                    >Save</button>
                  </div>
                </div>

                {apiKeySaved && (
                  <div style={{ background: "rgba(0,212,170,0.1)", border: "1px solid #00d4aa44", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#00d4aa" }}>
                    ✅ API key saved! You can now use all agents.
                  </div>
                )}

                {apiKey && !apiKeySaved && (
                  <div style={{ background: "rgba(0,212,170,0.05)", border: "1px solid #00d4aa22", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#666" }}>
                    ✅ API key is set · <span style={{ fontFamily: "monospace" }}>{apiKey.slice(0, 12)}...</span>
                    <button onClick={() => { setApiKey(""); localStorage.removeItem("cam_pace_api_key"); }}
                      style={{ marginLeft: 12, background: "transparent", border: "1px solid #333", borderRadius: 4, padding: "2px 8px", color: "#666", fontSize: 10, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a2e", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7 }}>
                    🔒 Your key is stored only in your browser&apos;s localStorage — it never leaves your device except to call Anthropic&apos;s API directly.<br/><br/>
                    🚀 If you deployed via Vercel, you can also set <span style={{ fontFamily: "monospace", color: "#4d9fff" }}>VITE_GEMINI_API_KEY</span> in Vercel → Settings → Environment Variables to avoid entering it manually.
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "deadlines" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e8f0", marginBottom: 4 }}>📅 Submission Deadlines</div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>All times 5:00 PM UK time</div>
                {DEADLINES.map(dl => <DeadlineCard key={dl.id} dl={dl} />)}
              </div>
            </div>
          ) : activeTab === "roadmap" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e8f0", marginBottom: 4 }}>🗺️ Python/LangChain Agent Roadmap</div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 24, fontFamily: "'DM Mono', monospace" }}>What to build as you progress through the programme</div>

                {[
                  {
                    phase: "Now — Course 1 (Feb–Mar)", color: "#00d4aa",
                    agents: [
                      { name: "Study Note Summariser", tech: "LangChain + Claude", desc: "Auto-summarise your weekly class notes into flashcard-style revision sheets", code: "langchain, anthropic" },
                      { name: "Code Reviewer", tech: "Python + Claude API", desc: "Paste your DS Python code and get feedback on style, efficiency, and correctness", code: "anthropic, ast" },
                    ]
                  },
                  {
                    phase: "Course 2 (Apr–May)", color: "#4d9fff",
                    agents: [
                      { name: "ML Model Explainer", tech: "LangChain + SHAP", desc: "Explain any sklearn model's predictions in plain English using SHAP values", code: "shap, sklearn, langchain" },
                      { name: "Job Scraper Agent", tech: "LangChain + BeautifulSoup", desc: "Daily scrape of DS/ML jobs matching your skills, summarised and ranked", code: "requests, bs4, langchain" },
                    ]
                  },
                  {
                    phase: "Course 3 (Jun–Aug)", color: "#b06aff",
                    agents: [
                      { name: "Portfolio Auto-Generator", tech: "LangChain + GitHub API", desc: "Feed in your project notebook → get a full case study write-up + README", code: "langchain, github api" },
                      { name: "Research Paper Digest", tech: "LangChain + ArXiv API", desc: "Weekly digest of relevant ML papers with plain-English summaries", code: "arxiv, langchain" },
                    ]
                  },
                  {
                    phase: "Course 4 Employer Project (Sep–Oct)", color: "#ff6b6b",
                    agents: [
                      { name: "Employer Project RAG Agent", tech: "LangChain + RAG + ChromaDB", desc: "RAG over your project docs to answer stakeholder questions in real-time", code: "chromadb, langchain, anthropic" },
                      { name: "Presentation Coach", tech: "Claude API", desc: "Upload your slide deck → get coaching on narrative, clarity, and impact", code: "anthropic, pypdf" },
                    ]
                  },
                ].map(phase => (
                  <div key={phase.phase} style={{ marginBottom: 28 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: phase.color,
                      fontFamily: "'DM Mono', monospace", marginBottom: 12,
                      borderBottom: `1px solid ${phase.color}33`, paddingBottom: 6,
                    }}>{phase.phase}</div>
                    {phase.agents.map(agent => (
                      <div key={agent.name} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid #1a1a2e",
                        borderRadius: 8, padding: "12px 16px", marginBottom: 8,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e8f0" }}>{agent.name}</div>
                            <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>{agent.desc}</div>
                          </div>
                          <div style={{
                            fontSize: 10, color: phase.color,
                            background: `${phase.color}11`,
                            border: `1px solid ${phase.color}33`,
                            borderRadius: 4, padding: "2px 6px",
                            fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", marginLeft: 8,
                          }}>{agent.tech}</div>
                        </div>
                        <div style={{
                          marginTop: 8, fontSize: 10, color: "#555",
                          fontFamily: "'DM Mono', monospace",
                          background: "#0d0d1a", borderRadius: 4, padding: "4px 8px",
                        }}>pip install {agent.code}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid #1a1a2e",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <div style={{ fontSize: 20 }}>{currentAgent?.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>{currentAgent?.label}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{currentAgent?.desc}</div>
                </div>
                {currentMessages.length > 0 && (
                  <button onClick={() => setConversations(prev => ({ ...prev, [activeAgent]: [] }))}
                    style={{ marginLeft: "auto", background: "transparent", border: "1px solid #2a2a3e", borderRadius: 6, padding: "4px 10px", color: "#666", fontSize: 11, cursor: "pointer" }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {currentMessages.length === 0 ? (
                  <div style={{ textAlign: "center", paddingTop: 40 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{currentAgent?.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#c0c0d0", marginBottom: 6 }}>{currentAgent?.label}</div>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 28 }}>Ask anything or try a quick prompt below</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500, margin: "0 auto" }}>
                      {(QUICK_PROMPTS[activeAgent] || []).map(p => (
                        <button key={p} onClick={() => sendMessage(p)}
                          style={{
                            background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a3e",
                            borderRadius: 20, padding: "6px 14px", color: "#888",
                            fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                          }}
                          onMouseOver={e => { e.target.style.color = "#c0c0d0"; e.target.style.borderColor = "#444"; }}
                          onMouseOut={e => { e.target.style.color = "#888"; e.target.style.borderColor = "#2a2a3e"; }}
                        >{p}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  currentMessages.map((msg, i) => <ChatMessage key={i} msg={msg} />)
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: "14px 20px",
                borderTop: "1px solid #1a1a2e",
                background: "#080810",
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder={`Ask the ${currentAgent?.label}...`}
                    disabled={loading}
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.04)",
                      border: "1px solid #2a2a3e", borderRadius: 8,
                      padding: "10px 14px", color: "#e0e0f0",
                      fontSize: 13, outline: "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    style={{
                      background: loading ? "#1a1a2e" : "linear-gradient(135deg, #00d4aa, #4d9fff)",
                      border: "none", borderRadius: 8,
                      padding: "10px 18px", color: loading ? "#555" : "#0a0a12",
                      fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {loading ? "..." : "Send →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
