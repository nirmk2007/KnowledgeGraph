"""Vercel API entry point for the hybrid movie RAG assistant."""

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "hybrid-movie-rag"})


@app.route("/api/query", methods=["POST", "OPTIONS"])
def query():
    if request.method == "OPTIONS":
        return ("", 204)

    payload = request.get_json(silent=True) or {}
    question = payload.get("query", "")
    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "A non-empty query is required."}), 400

    try:
        from rag_chain import run_hybrid_rag

        result = run_hybrid_rag(question.strip(), verbose=False)
        return jsonify(
            {
                "query": result["query"],
                "retriever": result["retriever"],
                "context": result["context"],
                "answer": str(result["answer"]),
            }
        )
    except Exception as error:
        app.logger.exception("RAG query failed")
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
