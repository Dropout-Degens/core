# Local RAG — ChromaDB Betting Knowledge Base

## What This Is

A local semantic search layer built on ChromaDB that gives YodAI reliable, retrievable knowledge about sports betting, the DD community, and how members think. No vector DB subscription, no external API — runs in-process, persists to disk alongside the existing SQLite session store.

This solves a real gap: right now YodAI answers betting questions from training data alone. With RAG, it pulls from a curated, Dax-maintained knowledge base that reflects DD's actual approach, terminology, and community context.

---

## What Gets Stored

The RAG store is **public-facing and educational** — it's the betting brain YodAI draws on when talking to anyone (members or Dax). It is not for ops, Supabase data, or GitHub repo content — those have their own retrieval paths.

```
context/                          (new local folder in claudebot/)
  betting/
    culture.md                    <- lock culture, guru world, what DD does differently
    knowledge.md                  <- EV, units, Kelly, line movement, parlays, variance
  community/
    member-journey.md             <- beginner vs intermediate vs experienced stages
    dd-world.md                   <- what DD is, channels, tools, partners
    vibe.md                       <- how the room feels, chat examples, moment types
```

These are Dax-maintained markdown files. When content changes, re-run the ingest script.

---

## Stack

- **ChromaDB** — local persistent vector store at `db/chroma/`
- **sentence-transformers** (`all-MiniLM-L6-v2`) — free, runs fully locally, ~80MB model, no API key needed
- No external dependencies beyond pip packages

---

## New Files

| File | Purpose |
|------|---------|
| `connections/rag/__init__.py` | TOOL_DEFINITIONS + handle_tool_call |
| `connections/rag/store.py` | Chroma client setup, collection init, search function |
| `connections/rag/ingest.py` | Script to chunk + embed all context/ MD files into Chroma |
| `context/betting/culture.md` | Betting culture context doc |
| `context/betting/knowledge.md` | Core betting concepts doc |
| `context/community/member-journey.md` | Member journey stages doc |
| `context/community/dd-world.md` | DD world context doc |
| `context/community/vibe.md` | Community vibe context doc |
| `db/chroma/` | ChromaDB persistent store (auto-created on first ingest) |

---

## Tool Added to Bot

```
semantic_search(query, n_results=5)
```

Returns top-k relevant chunks with content + source file. Used when answering betting questions, member questions about DD, or anything where the curated knowledge base is more reliable than training data alone.

bot.py changes:
- Import connections.rag
- Add to ALL_TOOLS
- Add to handle_tool()

---

## Metadata Structure

Each chunk stored with source file path, category (betting / community), and type (culture / knowledge / etc). Allows optional filtering by category if needed.

---

## Ingest Workflow

Run: `python connections/rag/ingest.py`

- Reads all .md files under context/
- Chunks by section (splits on ## headings)
- Embeds with sentence-transformers
- Upserts into ChromaDB (safe to re-run — updates existing chunks)

Run manually whenever context docs change. Can be added to a scheduled job later.

---

## Status

Ready to implement.
