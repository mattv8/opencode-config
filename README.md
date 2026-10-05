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
| `skills/` | Not copied; `opencode.json` registers `~/GitRepos/opencode-config/skills`, which overrides same-named plugin skills |
| `home/package.json` | `~/.opencode/package.json` |

## Prerequisites

- [opencode](https://opencode.ai) installed
- Node.js 20+ and npm
- Git
- [Bun](https://bun.sh) (builds the PTY plugin)
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

### 5. Install local plugins

```bash
mkdir -p ~/.config/opencode/vendor
git clone https://github.com/shekohex/opencode-pty.git ~/.config/opencode/vendor/opencode-pty-source
cd ~/.config/opencode/vendor/opencode-pty-source
git checkout 9be51267ed31c81cc953b84da5b615496ab4c95a
bun install
bun run build:prod

mkdir -p ~/.config/opencode/vendor/opencode-pty-v2
cat <<'EOF' > ~/.config/opencode/vendor/opencode-pty-v2/index.js
export { default } from "../opencode-pty-source/dist/src/v2/index.js";
EOF
cat <<'EOF' > ~/.config/opencode/vendor/opencode-pty-v2/package.json
{"name":"local-opencode-pty-v2","private":true,"type":"module","main":"./index.js"}
EOF

git clone https://github.com/ayghri/i-have-adhd.git ~/.config/opencode/vendor/i-have-adhd
cd ~/.config/opencode/vendor/i-have-adhd
git checkout 58494af57962b2d7a996b4d419474380a299af5e
```

### 6. Start opencode

```bash
opencode
```

Plugins from the `plugins` array in `opencode.json`:

| Plugin | Source | Purpose |
|--------|--------|---------|
| `@ex-machina/opencode-anthropic-auth@next` | npm | Anthropic authentication |
| `@nm156/opencode-wakatime@1.4.0` | npm | WakaTime tracking |
| `superpowers` v6.4.1 | git | Agent skill framework |
| `opencode-pty-v2` | local, step 5 | PTY tools |
| `i-have-adhd` | local, step 5 | ADHD-friendly output command |

## Custom Agents

Subagents defined in `opencode.json`:

| Agent | Model | Role |
|-------|-------|------|
| `coder` | `openai/gpt-5.6-terra-fast` | Implementation worker |
| `coder-fast` | `anthropic/claude-haiku-4-5` | Simple, well-defined edits |
| `reviewer` | `anthropic/claude-opus-5-5` | High-accuracy code review |
| `reviewer-fast` | `anthropic/claude-sonnet-4-6` | Routine code review |
| `critic` | `anthropic/claude-fable-5` | Skeptic for plans and architecture |
| `ux-designer` | `anthropic/claude-sonnet-4-6` | UI/UX design and critique |
| `explorer` | `openai/gpt-6-luna-fast` | Read-only discovery |
| `debugger` | `openai/gpt-5.6-sol` | Systematic debugging |
| `reviewer-alt` (hidden) | `openai/gpt-5.6-terra` | Non-Anthropic review fallback |
| `designer-alt` (hidden) | `openai/gpt-5.6-terra` | Non-Anthropic UI fallback |

Built-in `general`, `explore`, and `scout` agents are disabled. All subagents can run shell commands without prompting. `reviewer`, `reviewer-fast`, `reviewer-alt`, `critic`, `explorer`, and `debugger` cannot edit files.

## Vendored Skills

`skills/clean-code/` contains `typescript-clean-code` and `python-clean-code` from [ertugrul-dmr/clean-code-skills](https://github.com/ertugrul-dmr/clean-code-skills) at commit `1b6b3cc1264b8fbe921c65002d05a3bf90ede178`, unmodified, under the MIT license in `skills/clean-code/LICENSE`. The other upstream skills are not installed: the Python and TypeScript tracks share skill names, and `boy-scout` asks for broader cleanups than `config/AGENTS.md` allows. To update, copy both `SKILL.md` files from a newer upstream commit and update the commit above.

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
- **External skills** in `~/.agents/skills/` (prisma, docker, stop-slop, senior-engineering): installed via their package managers
- **Superpowers skills**: come from the plugin
- **`node_modules/`**: generated by `npm install`
- **Session data** in `~/.opencode/sessions/`: scratch artifacts, not config
