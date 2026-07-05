# obsidian-local-ai-smart-tagger
Plugin to tag &amp; summarize obsidian notes using a local AI model
# Local AI Smart Tagger (Obsidian Plugin)

A privacy-first Obsidian plugin that reads your note text, pulls your entire vault's existing tag vocabulary, and sends it to a local Ollama instance to generate a concise summary and discover context-aware tags without duplicate clutter.

## Features
- **Privacy-First:** Processes data entirely offline on your local machine using Ollama.
- **Controlled Vocabulary:** Inspects your current vault tags and prioritizes matching themes to them before inventing new labels.
- **Zero-DOM Overhead:** Runs seamlessly in the background via a hotkey, updating your note frontmatter cleanly.

## Prerequisites
1. **Ollama Installed & Running:** Ensure [Ollama](https://ollama.com/) is installed locally.
2. **Model Downloaded:** This plugin defaults to using `llama3`. You can download it by running:
   ```bash
   ollama run llama3