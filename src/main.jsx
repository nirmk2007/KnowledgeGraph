import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const prompts = [
  "Who acted in The Matrix?",
  "Recommend a sci-fi movie",
  "Who has Tom Hanks worked with?",
  "What did Christopher Nolan direct?"
];

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitQuery(event) {
    event?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The assistant could not answer.");
      setResult(payload);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <a className="wordmark" href="/" aria-label="Knowledge Graph Movie Intelligence">
          <span className="wordmark-mark">K</span>
          <span>nowledge Graph Movie Intelligence</span>
        </a>
        <div className="status-pill"><span className="status-dot" /> Hybrid engine online</div>
      </nav>

      <section className="hero-grid">
        <div className="intro-copy">
          <p className="eyebrow">MOVIE INTELLIGENCE / 01</p>
          <h1>Find the story<br /><em>behind</em> the screen.</h1>
          <p className="lede">Ask about casts, directors, connections, or the feeling you want to watch tonight. This project provides relationship-aware graph search with semantic discovery.</p>
        </div>
        <div className="signal-card" aria-label="System capabilities">
          <div className="signal-orbit"><span className="orbit-core">RM</span></div>
          <div>
            <p className="card-kicker">LIVE SYSTEM MAP</p>
            <p className="signal-title">Two ways into<br />the same story.</p>
            <div className="legend-row"><span className="legend-line graph-line" /> Graph / relationships</div>
            <div className="legend-row"><span className="legend-line vector-line" /> Vector / meaning</div>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">ASK THE ARCHIVE</p>
            <h2>What are you curious about?</h2>
          </div>
          <span className="query-count">{result ? "01 result" : "Ready when you are"}</span>
        </div>

        <form className="query-form" onSubmit={submitQuery}>
          <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “Who acted in The Matrix?”" rows="3" aria-label="Movie question" />
          <div className="form-footer">
            <span className="input-hint">Natural language works best</span>
            <button type="submit" disabled={loading || !query.trim()}>{loading ? "Thinking..." : "Explore answer"}<span className="button-arrow">↗</span></button>
          </div>
        </form>

        <div className="prompt-row">
          {prompts.map((prompt) => <button className="prompt-chip" key={prompt} onClick={() => setQuery(prompt)}>{prompt}</button>)}
        </div>

        {error && <div className="error-panel"><strong>Connection interrupted.</strong><span>{error}</span></div>}

        {result && !error && (
          <article className="result-panel">
            <div className="result-header">
              <div><p className="eyebrow">RESPONSE / 01</p><h2>{result.query}</h2></div>
              <div className={`route-badge ${result.retriever}`}><span /> {result.retriever === "graph" ? "Graph retrieval" : "Vector retrieval"}</div>
            </div>
            <div className="answer-copy">{result.answer}</div>
            <details className="context-details">
              <summary>View retrieved context <span>+</span></summary>
              <pre>{result.context}</pre>
            </details>
          </article>
        )}
      </section>

      <footer className="footer"><span>Knowledge Graph Movie Intelligence</span><span>Knowledge, with a point of view.</span></footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
