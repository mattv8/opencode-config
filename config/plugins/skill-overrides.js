import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginPath = fs.realpathSync(fileURLToPath(import.meta.url));
const versionedSkillsDir = path.resolve(path.dirname(pluginPath), "../../skills");
const installedSkillsDir = path.join(os.homedir(), ".agents/skills");
const overrideSkillsDir = fs.existsSync(path.join(versionedSkillsDir, "test-driven-development/SKILL.md"))
  ? versionedSkillsDir
  : installedSkillsDir;
const overlaySkillsDir = path.join(os.homedir(), ".cache/opencode/skill-overrides/superpowers");

function ensureDirectorySymlink(linkPath, targetPath) {
  try {
    if (fs.realpathSync(linkPath) === fs.realpathSync(targetPath)) return;
  } catch {
    // Replace missing, stale, or invalid links below.
  }

  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(targetPath, linkPath, "dir");
}

export const SkillOverridesPlugin = async () => ({
  config: async (config) => {
    config.skills ??= {};
    config.skills.paths ??= [];

    const superpowersSkillsDir = config.skills.paths.find((skillPath) => (
      fs.existsSync(path.join(skillPath, "using-superpowers/SKILL.md"))
    ));

    if (!superpowersSkillsDir) return;

    fs.mkdirSync(overlaySkillsDir, { recursive: true });
    const skillNames = new Set();

    for (const entry of fs.readdirSync(superpowersSkillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const overridePath = path.join(overrideSkillsDir, entry.name);
      const sourcePath = fs.existsSync(path.join(overridePath, "SKILL.md"))
        ? overridePath
        : path.join(superpowersSkillsDir, entry.name);

      skillNames.add(entry.name);
      ensureDirectorySymlink(path.join(overlaySkillsDir, entry.name), sourcePath);
    }

    for (const entry of fs.readdirSync(overlaySkillsDir, { withFileTypes: true })) {
      if (!skillNames.has(entry.name)) {
        fs.rmSync(path.join(overlaySkillsDir, entry.name), { recursive: true, force: true });
      }
    }

    config.skills.paths = [
      overlaySkillsDir,
      ...config.skills.paths.filter((skillPath) => (
        skillPath !== superpowersSkillsDir && skillPath !== overrideSkillsDir
      )),
    ];
  },
});
