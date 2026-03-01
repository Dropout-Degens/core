import os
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")  # e.g. https://sctugnxbqxrrnkxydcss.supabase.co
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")


def query_supabase(sql: str) -> dict:
    """Run a read-only SQL query against Supabase."""
    # Block destructive statements
    sql_upper = sql.strip().upper()
    for blocked in ("INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER", "CREATE"):
        if sql_upper.startswith(blocked):
            return {"error": f"Blocked: only SELECT queries are allowed. Got: {blocked}"}

    url = f"{SUPABASE_URL}/rest/v1/rpc/execute_sql"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
    }

    # Use Supabase's SQL endpoint directly
    sql_url = f"{SUPABASE_URL}/rest/v1/"
    # Fall back to pg REST via the sql endpoint
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        headers=headers,
        json={"query": sql},
    )

    # If RPC doesn't exist, use the direct query approach
    if r.status_code in (404, 400):
        # Use supabase-py style via direct REST
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/query",
            headers=headers,
            json={"sql": sql},
        )

    if not r.ok:
        return {"error": f"Supabase error {r.status_code}: {r.text[:500]}"}

    data = r.json()
    if isinstance(data, list):
        return {"rows": data, "count": len(data)}
    return {"result": data}


TOOL_DEFINITIONS = [
    {
        "name": "query_supabase",
        "description": (
            "Run a read-only SQL SELECT query against the Supabase database. "
            "Key tables: private.\"EVAlertEvent\" (EV bet alerts, 7,732 hockey rows), "
            "manual.\"EVActualStat\" (actual results, 120,845 rows — columns: id, actualStat). "
            "Only SELECT statements are allowed."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sql": {
                    "type": "string",
                    "description": "A valid PostgreSQL SELECT query. Use double quotes for schema-qualified table names, e.g. SELECT * FROM private.\"EVAlertEvent\" LIMIT 10",
                }
            },
            "required": ["sql"],
        },
    }
]


def handle_tool_call(tool_name: str, tool_input: dict) -> str:
    if tool_name == "query_supabase":
        result = query_supabase(tool_input["sql"])
        return str(result)
    return str({"error": f"Unknown tool: {tool_name}"})
