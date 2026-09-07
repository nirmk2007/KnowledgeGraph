"""
config.py — Loads environment variables for the Hybrid Graph RAG lab.
"""

import os
from dotenv import load_dotenv

# Load .env from the same directory as this file. Keep the existing .emv
# filename as a fallback for the current workspace.
env_dir = os.path.dirname(__file__)
load_dotenv(dotenv_path=os.path.join(env_dir, ".env"))
load_dotenv(dotenv_path=os.path.join(env_dir, ".emv"))

NEO4J_URI      = os.getenv("NEO4J_URI")
NEO4J_USER     = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Set key globally so LangChain sub-libraries pick it up automatically
if GEMINI_API_KEY:
    os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY

if not NEO4J_URI or not NEO4J_USER or not NEO4J_PASSWORD:
    raise EnvironmentError(
        "Neo4j connection variables (NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD) "
        "are not set. Add them to your .env file."
    )

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. "
        "Add it to the .env file or export it as an environment variable."
    )

if __name__ == "__main__":
    print("Configuration loaded:")
    print(f"  NEO4J_URI  : {NEO4J_URI}")
    print(f"  NEO4J_USER : {NEO4J_USER}")
    print(f"  GEMINI_KEY : {GEMINI_API_KEY[:8]}...{GEMINI_API_KEY[-4:]}")