import base64
import os
import requests

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")  # e.g. "username/dropout-degens"
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
BASE_URL = f"https://api.github.com/repos/{GITHUB_REPO}"


def read_github_file(path: str) -> dict:
    """Read a file from the GitHub repo."""
    url = f"{BASE_URL}/contents/{path.lstrip('/')}?ref={GITHUB_BRANCH}"
    r = requests.get(url, headers=HEADERS)
    if r.status_code == 404:
        return {"error": f"File not found: {path}"}
    if not r.ok:
        return {"error": f"GitHub API error {r.status_code}: {r.text}"}
    data = r.json()
    content = base64.b64decode(data["content"]).decode("utf-8")
    return {"path": path, "content": content, "sha": data["sha"]}


def list_github_directory(path: str = "") -> dict:
    """List files/folders in a directory of the GitHub repo."""
    url = f"{BASE_URL}/contents/{path.lstrip('/')}?ref={GITHUB_BRANCH}"
    r = requests.get(url, headers=HEADERS)
    if r.status_code == 404:
        return {"error": f"Path not found: {path}"}
    if not r.ok:
        return {"error": f"GitHub API error {r.status_code}: {r.text}"}
    items = [{"name": i["name"], "type": i["type"], "path": i["path"]} for i in r.json()]
    return {"path": path or "/", "items": items}


def create_github_file(path: str, content: str, commit_message: str) -> dict:
    """Create a new file in the GitHub repo."""
    url = f"{BASE_URL}/contents/{path.lstrip('/')}"
    # Check if file already exists
    check = requests.get(f"{url}?ref={GITHUB_BRANCH}", headers=HEADERS)
    if check.ok:
        return {"error": f"File already exists at {path}. Use update_github_file instead."}
    payload = {
        "message": commit_message,
        "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
        "branch": GITHUB_BRANCH,
    }
    r = requests.put(url, headers=HEADERS, json=payload)
    if not r.ok:
        return {"error": f"GitHub API error {r.status_code}: {r.text}"}
    return {"success": True, "path": path, "commit": r.json()["commit"]["sha"][:7]}


def update_github_file(path: str, content: str, commit_message: str) -> dict:
    """Update an existing file in the GitHub repo."""
    url = f"{BASE_URL}/contents/{path.lstrip('/')}"
    # Get current SHA (required for updates)
    check = requests.get(f"{url}?ref={GITHUB_BRANCH}", headers=HEADERS)
    if check.status_code == 404:
        return {"error": f"File not found: {path}. Use create_github_file instead."}
    if not check.ok:
        return {"error": f"GitHub API error {check.status_code}: {check.text}"}
    sha = check.json()["sha"]
    payload = {
        "message": commit_message,
        "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
        "sha": sha,
        "branch": GITHUB_BRANCH,
    }
    r = requests.put(url, headers=HEADERS, json=payload)
    if not r.ok:
        return {"error": f"GitHub API error {r.status_code}: {r.text}"}
    return {"success": True, "path": path, "commit": r.json()["commit"]["sha"][:7]}


TOOL_DEFINITIONS = [
    {
        "name": "read_github_file",
        "description": "Read the contents of a file from the GitHub repository.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path relative to repo root, e.g. 'core/context/operations/data/README.md'"}
            },
            "required": ["path"],
        },
    },
    {
        "name": "list_github_directory",
        "description": "List files and folders in a directory of the GitHub repository.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Directory path relative to repo root. Leave empty for root."}
            },
            "required": [],
        },
    },
    {
        "name": "create_github_file",
        "description": "Create a new file in the GitHub repository.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path for the new file, e.g. 'core/context/summaries/nba-analysis.md'"},
                "content": {"type": "string", "description": "Full text content of the file"},
                "commit_message": {"type": "string", "description": "Git commit message describing the change"},
            },
            "required": ["path", "content", "commit_message"],
        },
    },
    {
        "name": "update_github_file",
        "description": "Update an existing file in the GitHub repository.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path to the existing file"},
                "content": {"type": "string", "description": "New full text content of the file"},
                "commit_message": {"type": "string", "description": "Git commit message describing the change"},
            },
            "required": ["path", "content", "commit_message"],
        },
    },
]


def handle_tool_call(tool_name: str, tool_input: dict) -> str:
    if tool_name == "read_github_file":
        result = read_github_file(tool_input["path"])
    elif tool_name == "list_github_directory":
        result = list_github_directory(tool_input.get("path", ""))
    elif tool_name == "create_github_file":
        result = create_github_file(tool_input["path"], tool_input["content"], tool_input["commit_message"])
    elif tool_name == "update_github_file":
        result = update_github_file(tool_input["path"], tool_input["content"], tool_input["commit_message"])
    else:
        result = {"error": f"Unknown tool: {tool_name}"}
    return str(result)
