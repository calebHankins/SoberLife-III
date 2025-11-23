# AGENTS.md

> [!IMPORTANT]
> This file is the **primary entry point and source of truth** for all AI agents working on SoberLife-III. Always refer to this file and the referenced documents before making changes.

## 🧘 Project Context

**SoberLife-III** is a web-based stress management game that combines blackjack mechanics with real-world scenarios.

- **Core Mechanic**: Blackjack represents managing task steps.
- **Goal**: Complete tasks (like DMV visits) without "busting" (reaching 100% stress).
- **Tech**: Vanilla HTML/CSS/JS. No frameworks. LocalStorage for persistence.

## 🧭 Steering & Specifications

You must follow the guidelines established in the `.kiro/steering` directory and the `model_spec.md`.

### 📜 Game Design (Authoritative)

- **[model_spec.md](./model_spec.md)**: The **source of truth** for game design, mechanics, features, and user experience.
  - *Rule*: If there is a conflict between general coding practices and the model spec, **defer to the model spec**.

### 🛠️ Technical Steering

The `.kiro/steering` directory contains the technical standards.

- **[tech.md](.kiro/steering/tech.md)**: Technical stack and coding standards.
  - *Key*: Vanilla JS (ES6 modules), CSS variables, no build step.
- **[structure.md](.kiro/steering/structure.md)**: File organization and architecture.
  - *Key*: Modular JS (`assets/js/`), separate CSS (`assets/css/`).
- **[git-workflow.md](.kiro/steering/git-workflow.md)**: Branching and PR workflow.
  - *Key*: Create feature branches (`feature/name`), never commit to main directly.
- **[testing.md](.kiro/steering/testing.md)**: Testing strategy.
  - *Key*: Playwright for E2E tests. Run `npm test` before committing.
- **[releases.md](.kiro/steering/releases.md)**: Release process.
- **[debugging.md](.kiro/steering/debugging.md)**: Debugging tips, especially for Zen Points.

## 🤖 Agent Instructions

1. **Read the Docs**: Before starting a task, read the relevant steering documents and `model_spec.md`.
2. **Follow the Style**: Adhere to the code style in `tech.md` (CamelCase, Semantic naming, etc.).
3. **Test Your Work**: Run tests (`npm test`) to ensure no regressions.
4. **Update Documentation**: If you change behavior, update the relevant docs (README, specs, etc.).

### 📝 Commit Message Protocol

> [!NOTE]
> **Mandatory**: End every turn with a concise "commit message" in a markdown code block that describes the currently uncommitted changes.

**Example:**

```md
feat: implement new zen activity 'Box Breathing'
```
