# Prototype Specification: CortexFlow 
*(A ThoughtFlow x Obsidian Hybrid)*

## 1. Executive Summary
**CortexFlow** is a conceptual prototype merging the unstructured, AI-assisted emotional processing of **ThoughtFlow** with the structured, local-first, interconnected knowledge graph of **Obsidian**. 

Designed for chronic overthinkers, journalers, and deep reflectors, CortexFlow acts as a "Second Brain for Emotional Intelligence." It allows users to brain-dump their chaotic thoughts, while an on-device AI untangles them, extracts core themes, identifies emotional patterns, and automatically maps them into a secure, markdown-based vault connected by bidirectional links.

---

## 2. Core Philosophy
* **Privacy First (Obsidian DNA):** Your thoughts are your most private data. All files are stored locally as plain text `.md` files. AI processing relies on local LLMs (e.g., Llama 3 via Ollama) to ensure zero data leakage.
* **Frictionless Capture (ThoughtFlow DNA):** The barrier to entry for logging a mood or thought should be zero. Speak, type, or scribble.
* **Emergent Structure:** You don't need to organize your thoughts; the system weaves the web for you.

---

## 3. Key Features

### 3.1. The "Brain Dump" Inbox
A minimal, distraction-free interface where users can pour out their thoughts via text or voice. 
* **Stream of Consciousness:** No formatting required. Just raw emotion and thought.
* **Anxiety / Overthinking Mode:** A specific prompt mode that asks gently guiding questions (CBT-inspired) to help the user unpack a current spiral.

### 3.2. AI "Untangler" Engine
Once a brain dump is complete, the local AI analyzes the text and performs the following actions:
* **Sentiment & Cognitive Distortion Tagging:** Automatically appends YAML frontmatter to the document with detected moods (e.g., `mood: anxious`, `distortion: catastrophizing`).
* **Entity & Theme Extraction:** Identifies recurring people, stressors, or projects and automatically wraps them in Obsidian-style brackets (e.g., `I'm so worried about [[Project Alpha]] because [[Manager Bob]]...`).
* **Summary & Action Items:** Generates a 2-sentence rational summary of the emotional dump and suggests one grounding action.

### 3.3. The Emotional Graph View
A dynamic visualization of the user's mental state, adapting Obsidian's famous Graph View for psychological insights.
* **Nodes:** Represent concepts, people, or specific days.
* **Colors (Sentiment):** Nodes glow different colors based on the emotional valence associated with them (e.g., red for stress/anger, blue for calm, purple for deep reflection).
* **Clusters:** Over time, users can physically see their anxieties clustering around specific topics (e.g., a massive red web around `[[Finances]]`), providing immediate visual feedback on mental health trends.

### 3.4. Future-Proof Markdown Vault
Every entry, AI summary, and tag is saved as a standard Markdown file.
* **Bidirectional Linking:** `[[Date]]` links to `[[Person]]` links to `[[Emotion]]`.
* **Portability:** Because the data is just a folder of text files, the user owns it forever. No vendor lock-in.

---

## 4. User Workflow Example

1. **The Dump:** It's 11:00 PM. The user opens CortexFlow and records a 3-minute rambling voice note about feeling overwhelmed by a deadline and experiencing imposter syndrome.
2. **The Processing:** The app transcribes the audio into a daily note: `2026-04-30-Dump.md`.
3. **The Untangling:** The AI processes the file in the background and modifies the markdown to include:
   * Tags: `#imposter-syndrome`, `#work-stress`
   * Backlinks: `[[RouteMaster Project]]`, `[[Career Goals]]`
   * AI Insight block appended to the bottom: *"You are catastrophizing about the deadline. Remember your past success on similar projects. Suggested action: Break the next step into a 15-minute task."*
4. **The Graph:** The user checks their Graph View. The `[[RouteMaster Project]]` node has grown slightly larger and is pulsing orange, visually prompting the user to perhaps step back and take a break.

---

## 5. Technical Architecture (High-Level)
* **Backend Storage:** Local File System (Folders of `.md` files).
* **Frontend:** Electron or Tauri framework for a lightweight, cross-platform desktop app. 
* **Text Editor:** CodeMirror (standard for Markdown editors like Obsidian).
* **AI Integration:** Integration with a local inference engine (like `llama.cpp` or `Ollama`) running a small, fine-tuned emotional processing model (e.g., 8B parameters) to ensure complete privacy.
* **Graph Rendering:** D3.js or similar WebGL library for rendering the node graph.

---

## 6. Directory Structure Example
```text
CortexFlow_Vault/
├── 01_Daily_Dumps/
│   ├── 2026-04-29.md
│   └── 2026-04-30.md
├── 02_Entities/
│   ├── Work.md
│   ├── Finances.md
│   └── Alex.md
├── 03_Emotions_&_Distortions/
│   ├── Imposter_Syndrome.md
│   └── Burnout.md
└── .cortex/ (App config, AI system prompts, and graph metadata)
```
