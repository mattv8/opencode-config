# OpenCode Configuration

Version-controlled backup of custom opencode agent configs, permissions, prompts, and skills.

## Spotlight launcher bundle

This repo also stores the source-controlled macOS Spotlight launcher bundle at `opencode.app/`.
Keep the active app installed at `~/Applications/opencode.app`; update that installed copy or symlink separately if you want Spotlight to use this repo version.

## File Layout

| Repo path | Installs to |
|-----------|-------------|
| `config/opencode.json` | `~/.config/opencode/opencode.json` |
| `config/AGENTS.md` | `~/.config/opencode/AGENTS.md` |
| `config/tui.json` | `~/.config/opencode/tui.json` |
| `config/package.json` | `~/.config/opencode/package.json` |
| `config/skills/ragtime-architecture/SKILL.md` | `~/.config/opencode/skills/ragtime-architecture/SKILL.md` |
| `home/package.json` | `~/.opencode/package.json` |

## Prerequisites

- [opencode](https://opencode.ai) installed
- Node.js 20+ and npm
- Access to the providers in `opencode.json` (Anthropic, OpenAI, OpenRouter, local MLX server)

## Fresh Install

### 1. Clone

```bash
git clone <repo-url> ~/GitRepos/opencode-config
```

### 2. Set environment variables

Secrets in `opencode.json` use `{env:VAR}` interpolation. Create a `.env` file and source it in your shell profile:

```bash
cp ~/GitRepos/opencode-config/.env.example ~/.config/opencode/.env
```

Fill in the values, then add to `~/.zshrc` (or `~/.bashrc`):

```bash
set -a; source ~/.config/opencode/.env; set +a
```

| Variable | Used by |
|----------|---------|
| `MLX_API_KEY` | omlx provider (local MLX inference server) |
| `CF_ACCESS_CLIENT_ID` | HammRAG and ragtime_prod MCP servers |
| `CF_ACCESS_CLIENT_SECRET` | HammRAG and ragtime_prod MCP servers |
| `MCP_PASSWORD` | HammRAG and ragtime_prod MCP servers |

If you prefer literal values over env vars, replace the `{env:VAR}` references in `opencode.json` with your actual keys.

### 3. Install config files

**Option A: Symlink (recommended, keeps repo and live config in sync)**

```bash
mkdir -p ~/.config/opencode/skills/ragtime-architecture ~/.opencode

ln -sf ~/GitRepos/opencode-config/config/opencode.json       ~/.config/opencode/opencode.json
ln -sf ~/GitRepos/opencode-config/config/AGENTS.md           ~/.config/opencode/AGENTS.md
ln -sf ~/GitRepos/opencode-config/config/tui.json            ~/.config/opencode/tui.json
ln -sf ~/GitRepos/opencode-config/config/package.json        ~/.config/opencode/package.json
ln -sf ~/GitRepos/opencode-config/config/skills/ragtime-architecture/SKILL.md \
       ~/.config/opencode/skills/ragtime-architecture/SKILL.md
ln -sf ~/GitRepos/opencode-config/home/package.json          ~/.opencode/package.json
```

**Option B: Copy (one-time)**

```bash
mkdir -p ~/.config/opencode/skills/ragtime-architecture ~/.opencode

cp ~/GitRepos/opencode-config/config/opencode.json       ~/.config/opencode/
cp ~/GitRepos/opencode-config/config/AGENTS.md           ~/.config/opencode/
cp ~/GitRepos/opencode-config/config/tui.json            ~/.config/opencode/
cp ~/GitRepos/opencode-config/config/package.json        ~/.config/opencode/
cp ~/GitRepos/opencode-config/config/skills/ragtime-architecture/SKILL.md \
   ~/.config/opencode/skills/ragtime-architecture/
cp ~/GitRepos/opencode-config/home/package.json          ~/.opencode/
```

### 4. Install npm dependencies

```bash
cd ~/.config/opencode && npm install
cd ~/.opencode && npm install
```

### 5. Start opencode

```bash
opencode
```

Plugins auto-install on first run from the `plugin` array in `opencode.json`:

| Plugin | Source | Purpose |
|--------|--------|---------|
| `opencode-claude-auth` | npm | Anthropic authentication |
| `opencode-wakatime` | npm | WakaTime tracking |
| `superpowers` | git | Agent skill framework |

## Custom Agents

Six subagents defined in `opencode.json`:

| Agent | Model | Role |
|-------|-------|------|
| `coder` | `openai/gpt-5.4-fast` | Implementation worker |
| `reviewer` | `anthropic/claude-opus-4-8` | Code reviewer |
| `critic` | `openrouter/~google/gemini-pro-latest` | Skeptic for plans and architecture |
| `designer` | `anthropic/claude-sonnet-4-6` | Frontend and product design |
| `explorer` | `openai/gpt-5.4-mini-fast` | Read-only discovery |
| `debugger` | `openai/gpt-5.4` | Systematic debugging |

Built-in `general`, `explore`, and `scout` agents are disabled. All subagents have non-interactive `bash` access. Read-only agents (`reviewer`, `critic`, `explorer`, `debugger`) have `edit: deny`.

## MCP Servers

| Server | Type | Notes |
|--------|------|-------|
| HammRAG | Remote | Production Ragtime, requires CF env vars |
| ragtime_dev | Remote | Local dev (localhost:8000), OAuth |
| ragtime_staging | Remote | Staging Ragtime |
| ragtime_prod | Remote | Production Ragtime, requires CF env vars |
| playwright | Local | Requires `@playwright/mcp` (installed via `npm install`) |

## Updating

If using symlinks, edits to `~/.config/opencode/` files flow through to the repo automatically:

```bash
cd ~/GitRepos/opencode-config
git add -A
git commit -m "update config"
```

If using copies, sync changed files back to the repo before committing.

## Not Included

- **Provider API keys** (Anthropic, OpenAI, OpenRouter): set via `opencode auth login` or provider-specific env vars
- **External skills** in `~/.agents/skills/` (prisma, docker, stop-slop, senior-engineering, superpowers): installed via their respective package managers
- **`node_modules/`**: generated by `npm install`
- **Session data** in `~/.opencode/sessions/`: scratch artifacts, not config
