# Copilot Instructions

## Project Context Guidance

Files referenced below have paths relative to the project root (not this file).

- Always use the steering documents located in `.kiro/steering` for technical direction, architecture, and workflow best practices.
- Reference `model_spec.md` in the repository root for game design, mechanics, and feature requirements. This file contains the authoritative specification for SoberLife's gameplay, systems, and user experience.
- When making decisions, implementations, or answering questions, ensure alignment with both the steering docs and the model spec.
- If there is any conflict between general coding practices and the steering docs/model spec, defer to the steering docs and model spec.
- For new features, bug fixes, or refactoring, always check these sources for context before proceeding.

## Usage
- Treat `.kiro/steering` as the source of truth for technical and process decisions.
- Treat `model_spec.md` as the source of truth for game design, mechanics, and user experience.
- Document any deviations from these sources in code comments or PR descriptions.

## Documentation

When your turn ends, summarize what you did in a concise manner. Print this summary in a code block wrapped in triple backticks so that it is formatted correctly and can be used as a commit message.