import { useState, useEffect, useRef } from "react";

// ── Replace with your Stripe Payment Link after setup ──
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_LINK_HERE";
const SITE_URL = "tasktheory.com";

const QUESTIONS = [
  {
    id: "avoiding",
    question: "What's something you keep meaning to do but haven't started?",
    placeholder: "Be honest. The first thing that comes to mind.",
  },
  {
    id: "feeling",
    question: "When you imagine actually doing it, what's the first feeling that shows up?",
    placeholder: "Not what you think. What you feel.",
  },
  {
    id: "story",
    question: "What do you tell yourself about why you haven't done it yet?",
    placeholder: "The reason you give yourself. Even if you know it's not the whole truth.",
  },
  {
    id: "change",
    question: "What would actually change in your life if you did it?",
    placeholder: "Be specific. What would be different?",
  },
];

async function callClaude(answers, full = false) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, full }),
  });
  if (!response.ok) throw new Error("API error");
  return response.json();
}

// ── Grain overlay ──
function Grain() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      opacity: 0.35,
    }} />
  );
}

// ── Landing ──
function Landing({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(3rem, 10vw, 7rem)",
          fontWeight: 300, letterSpacing: "-0.02em",
          color: "#f0ebe1", lineHeight: 1.05, marginBottom: "0.5rem",
        }}>
          What are you<br />
          <em style={{ fontStyle: "italic", color: "#c9a96e" }}>actually</em><br />
          avoiding?
        </div>

        <p style={{
          fontFamily: "'Lora', serif", fontSize: "1.05rem",
          color: "#8a8070", maxWidth: "380px", margin: "2rem auto",
          lineHeight: 1.75, fontStyle: "italic",
          opacity: visible ? 1 : 0, transition: "opacity 1.4s ease 0.4s",
        }}>
          Four questions. One uncomfortable answer.<br />No softening.
        </p>

        <button onClick={onStart} style={{
          marginTop: "1rem", background: "transparent",
          border: "1px solid #c9a96e", color: "#c9a96e",
          fontFamily: "'Lora', serif", fontSize: "0.9rem",
          letterSpacing: "0.15em", padding: "0.85rem 2.5rem",
          cursor: "pointer", textTransform: "uppercase",
          transition: "all 0.3s ease",
          opacity: visible ? 1 : 0, transitionDelay: "0.8s",
        }}
          onMouseEnter={e => { e.target.style.background = "#c9a96e"; e.target.style.color = "#0e0c09"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#c9a96e"; }}
        >
          Begin
        </button>

        <p style={{
          marginTop: "3rem", fontSize: "0.72rem", color: "#4a4438",
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontFamily: "'Lora', serif",
          opacity: visible ? 1 : 0, transition: "opacity 1.4s ease 1s",
        }}>
          Free · Takes 2 minutes · No account needed
        </p>
      </div>
    </div>
  );
}

// ── Question Screen ──
function QuestionScreen({ question, index, total, value, onChange, onNext, onBack }) {
  const [visible, setVisible] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => { setVisible(true); textareaRef.current?.focus(); }, 80);
  }, [index]);

  const canProceed = value.trim().length > 3;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      maxWidth: "600px", margin: "0 auto",
    }}>
      <div style={{
        width: "100%", opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Progress bar */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "3rem" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              height: "2px", flex: 1,
              background: i <= index ? "#c9a96e" : "#2a2520",
              transition: "background 0.4s ease",
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 300, color: "#f0ebe1",
          lineHeight: 1.3, marginBottom: "0.75rem", letterSpacing: "-0.01em",
        }}>
          {question.question}
        </div>

        <p style={{
          fontFamily: "'Lora', serif", fontSize: "0.85rem",
          color: "#5a5248", fontStyle: "italic", marginBottom: "2rem",
        }}>
          {question.placeholder}
        </p>

        <textarea ref={textareaRef} value={value}
          onChange={e => onChange(e.target.value)} rows={4}
          style={{
            width: "100%", background: "transparent", border: "none",
            borderBottom: "1px solid #3a3530", color: "#f0ebe1",
            fontFamily: "'Lora', serif", fontSize: "1rem",
            lineHeight: 1.8, padding: "0.5rem 0", resize: "none",
            outline: "none", caretColor: "#c9a96e",
            transition: "border-color 0.3s ease", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderBottomColor = "#c9a96e"}
          onBlur={e => e.target.style.borderBottomColor = "#3a3530"}
          onKeyDown={e => { if (e.key === "Enter" && e.metaKey && canProceed) onNext(); }}
        />

        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "2.5rem",
        }}>
          {index > 0 ? (
            <button onClick={onBack} style={{
              background: "transparent", border: "none", color: "#4a4438",
              fontFamily: "'Lora', serif", fontSize: "0.85rem",
              cursor: "pointer", padding: 0, letterSpacing: "0.05em",
            }}>← back</button>
          ) : <div />}

          <button onClick={onNext} disabled={!canProceed} style={{
            background: canProceed ? "#c9a96e" : "transparent",
            border: `1px solid ${canProceed ? "#c9a96e" : "#2a2520"}`,
            color: canProceed ? "#0e0c09" : "#3a3530",
            fontFamily: "'Lora', serif", fontSize: "0.85rem",
            letterSpacing: "0.1em", padding: "0.7rem 2rem",
            cursor: canProceed ? "pointer" : "default",
            textTransform: "uppercase", transition: "all 0.3s ease",
          }}>
            {index === total - 1 ? "See my answer" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Loading Screen ──
function Loading() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot(d => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.4rem", color: "#c9a96e", fontWeight: 300,
        letterSpacing: "0.05em", fontStyle: "italic",
      }}>
        Consulting the mirror{".".repeat(dot)}
      </div>
    </div>
  );
}

// ── Free Result ──
function FreeResult({ result, onUnlock }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      maxWidth: "580px", margin: "0 auto",
    }}>
      <div style={{
        width: "100%", opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: "0.75rem", color: "#5a5248",
          letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem",
        }}>You are avoiding</p>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 7vw, 3.5rem)",
          fontWeight: 300, color: "#c9a96e",
          lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "2rem",
        }}>
          {result.label}
        </div>

        <div style={{ width: "40px", height: "1px", background: "#3a3530", marginBottom: "2rem" }} />

        <p style={{
          fontFamily: "'Lora', serif", fontSize: "1rem",
          color: "#b0a898", lineHeight: 1.9, marginBottom: "3rem",
        }}>
          {result.preview}
        </p>

        <div style={{ borderTop: "1px solid #2a2520", paddingTop: "2rem" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem",
            color: "#f0ebe1", fontWeight: 300, marginBottom: "0.5rem",
          }}>
            There's more beneath this.
          </p>
          <p style={{
            fontFamily: "'Lora', serif", fontSize: "0.85rem",
            color: "#5a5248", fontStyle: "italic", marginBottom: "1.5rem",
          }}>
            The full read includes what it's costing you, why it makes complete sense, and one concrete thing to do today.
          </p>

          <button onClick={onUnlock} style={{
            width: "100%", background: "#c9a96e", border: "none",
            color: "#0e0c09", fontFamily: "'Lora', serif", fontSize: "0.9rem",
            letterSpacing: "0.1em", padding: "1rem", cursor: "pointer",
            textTransform: "uppercase", transition: "opacity 0.2s ease",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            Unlock the full read — $2
          </button>

          <p style={{
            fontFamily: "'Lora', serif", fontSize: "0.72rem", color: "#3a3530",
            textAlign: "center", marginTop: "1rem", letterSpacing: "0.05em",
          }}>
            One-time · No account · Instant access
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Full Result ──
function FullResult({ result }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleShare = () => {
    const text = `I just found out what I'm actually avoiding: "${result.label}". Find yours → ${SITE_URL}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const sections = [
    { title: "What it is", content: result.what_it_is },
    { title: "Why it makes sense", content: result.why_it_makes_sense },
    { title: "What it's costing you", content: result.what_its_costing },
    { title: "One thing", content: result.one_thing },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "4rem 2rem", maxWidth: "580px", margin: "0 auto" }}>
      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: "0.75rem", color: "#5a5248",
          letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem",
        }}>You are avoiding</p>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 7vw, 3.5rem)",
          fontWeight: 300, color: "#c9a96e",
          lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.5rem",
        }}>
          {result.label}
        </div>

        <div style={{ width: "40px", height: "1px", background: "#3a3530", marginBottom: "2.5rem" }} />

        <p style={{
          fontFamily: "'Lora', serif", fontSize: "1rem",
          color: "#b0a898", lineHeight: 1.9, marginBottom: "3rem", fontStyle: "italic",
        }}>
          {result.preview}
        </p>

        {sections.map((s, i) => (
          <div key={i} style={{
            marginBottom: "2.5rem", opacity: visible ? 1 : 0,
            transition: `opacity 0.8s ease ${0.3 + i * 0.15}s`,
          }}>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: "0.7rem", color: "#c9a96e",
              letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem",
            }}>{s.title}</p>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: "0.98rem",
              color: "#d0c8be", lineHeight: 1.85,
            }}>{s.content}</p>
          </div>
        ))}

        {/* Share button */}
        <div style={{ borderTop: "1px solid #2a2520", paddingTop: "2rem", marginTop: "1rem" }}>
          <button onClick={handleShare} style={{
            width: "100%", background: "transparent",
            border: "1px solid #c9a96e", color: copied ? "#0e0c09" : "#c9a96e",
            backgroundColor: copied ? "#c9a96e" : "transparent",
            fontFamily: "'Lora', serif", fontSize: "0.85rem",
            letterSpacing: "0.1em", padding: "0.85rem",
            cursor: "pointer", textTransform: "uppercase",
            transition: "all 0.3s ease", marginBottom: "1.5rem",
          }}>
            {copied ? "Copied. Now share it." : "Share your result"}
          </button>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => window.location.reload()} style={{
              background: "transparent", border: "none", color: "#4a4438",
              fontFamily: "'Lora', serif", fontSize: "0.8rem",
              cursor: "pointer", letterSpacing: "0.05em", textDecoration: "underline",
            }}>
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({ avoiding: "", feeling: "", story: "", change: "" });
  const [freeResult, setFreeResult] = useState(null);
  const [fullResult, setFullResult] = useState(null);

  // Check if returning from Stripe payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      const saved = sessionStorage.getItem("avoidance_answers");
      const savedFree = sessionStorage.getItem("avoidance_free");
      if (saved && savedFree) {
        const parsedAnswers = JSON.parse(saved);
        setAnswers(parsedAnswers);
        setFreeResult(JSON.parse(savedFree));
        setScreen("loading");
        callClaude(parsedAnswers, true).then(result => {
          setFullResult(result);
          setScreen("full");
        }).catch(() => setScreen("free"));
      }
    }
  }, []);

  const handleStart = () => { setCurrentQ(0); setScreen("questions"); };

  const handleAnswer = (val) => {
    const key = QUESTIONS[currentQ].id;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleNext = async () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setScreen("loading");
      try {
        const result = await callClaude(answers, false);
        setFreeResult(result);
        setScreen("free");
      } catch (e) {
        console.error(e);
        setScreen("questions");
      }
    }
  };

  const handleBack = () => { if (currentQ > 0) setCurrentQ(q => q - 1); };

  const handleUnlock = () => {
    // Save state so we can restore after Stripe redirect
    sessionStorage.setItem("avoidance_answers", JSON.stringify(answers));
    sessionStorage.setItem("avoidance_free", JSON.stringify(freeResult));
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        body { background: #0e0c09; min-height: 100vh; }
        textarea::placeholder { color: #3a3530; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0e0c09; }
        ::-webkit-scrollbar-thumb { background: #2a2520; }
      `}</style>

      <Grain />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "landing" && <Landing onStart={handleStart} />}
        {screen === "questions" && (
          <QuestionScreen
            question={QUESTIONS[currentQ]} index={currentQ} total={QUESTIONS.length}
            value={answers[QUESTIONS[currentQ].id]}
            onChange={handleAnswer} onNext={handleNext} onBack={handleBack}
          />
        )}
        {screen === "loading" && <Loading />}
        {screen === "free" && freeResult && <FreeResult result={freeResult} onUnlock={handleUnlock} />}
        {screen === "full" && fullResult && <FullResult result={fullResult} />}
      </div>
    </>
  );
}
