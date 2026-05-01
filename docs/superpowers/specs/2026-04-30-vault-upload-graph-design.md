# Vault Upload + Obsidian-style Knowledge Graph

## Overview

Add file upload support to the Vault tab and replace the static radial graph with an interactive, Obsidian-style force-directed knowledge graph that can be exported as PNG.

## File Upload

- Upload button ("+" icon) in the Vault screen header
- Uses `expo-document-picker` to open device file picker, filtered to `.txt` and `.md`
- Selected files are read and saved to `CortexFlow_Vault/04_Uploads/`
- Content is parsed for `[[wiki-links]]` and `#hashtags` to extract entities and themes
- Parsed data (filename, content, links, hashtags) stored in Zustand alongside brain dumps

## Force-Directed Knowledge Graph

Replaces `EmotionalGraph` with a new `KnowledgeGraph` component.

### Physics Simulation
- Custom force-directed engine on the JS thread
- Nodes repel each other (Coulomb's law); linked nodes attract (spring force)
- Damping settles the layout over ~60-120 ticks
- Simulation runs on mount and re-runs when data changes

### Nodes
- Two types: entities (from brain dump AI processing) and uploaded files
- Radius scales with connection count (more links = bigger node)
- Entities colored by mood mapping (existing palette); uploads use accent color
- Labels rendered below each node

### Links
- Two nodes are linked when they share a `[[wiki-link]]`, hashtag, or entity reference
- Links render as semi-transparent lines colored by the source node

### Interaction
- Pinch-to-zoom and drag-to-pan via `react-native-gesture-handler`
- Applied as an SVG viewport transform (no re-rendering nodes)
- Double-tap resets to default zoom/position

### Empty State
- Same as current: prompt to start dumping thoughts or upload files

## PNG Export

- Download icon button in the graph section header
- Uses `react-native-view-shot` to capture the graph SVG as a PNG
- Saves to device gallery via `expo-media-library`
- Haptic feedback + toast-style confirmation on success
- Error handling for missing permissions

## New Types

```ts
interface UploadedFile {
  id: string;
  filename: string;
  content: string;
  links: string[];      // extracted [[wiki-links]]
  hashtags: string[];   // extracted #hashtags
  createdAt: number;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'entity' | 'upload';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}
```

## Store Changes

- Add `uploadedFiles: UploadedFile[]` to persisted state
- Add `uploadFile(filename: string, content: string): Promise<void>` action
- Parsing logic extracts links and hashtags, then merges into graph data

## New Dependencies

- `expo-document-picker` — file picker
- `react-native-view-shot` — capture graph as PNG
- `expo-media-library` — save PNG to device gallery

## Files Modified

- `src/screens/VaultScreen.tsx` — add upload button, integrate new graph, export button
- `src/services/VaultService.ts` — add upload directory, file save/read for uploads
- `src/store/useAppStore.ts` — add uploadedFiles state and actions
- `src/types/index.ts` — add UploadedFile, GraphNode, GraphLink types

## Files Created

- `src/components/KnowledgeGraph.tsx` — force-directed graph component
- `src/services/GraphEngine.ts` — force simulation (physics tick, layout computation)
