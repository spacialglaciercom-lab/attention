import { GraphNode, GraphLink } from '../types';

const REPULSION_STRENGTH = 5000;
const ATTRACTION_STRENGTH = 0.01;
const DAMPING = 0.9;
const MAX_VELOCITY = 5;
const MIN_DISTANCE = 20;
const MAX_ITERATIONS = 120;
const CONVERGENCE_THRESHOLD = 0.1;

export function runForceSimulation(
  nodes: GraphNode[],
  links: GraphLink[],
  width: number,
  height: number
): GraphNode[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const simNodes = nodes.map(n => ({
    ...n,
    x: n.x || centerX + (Math.random() - 0.5) * 100,
    y: n.y || centerY + (Math.random() - 0.5) * 100,
    vx: 0,
    vy: 0,
  }));

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let maxMovement = 0;

    // Repulsion: all nodes repel each other (Coulomb's law)
    for (let i = 0; i < simNodes.length; i++) {
      for (let j = i + 1; j < simNodes.length; j++) {
        const a = simNodes[i];
        const b = simNodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < MIN_DISTANCE) dist = MIN_DISTANCE;

        const force = REPULSION_STRENGTH / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    // Attraction: linked nodes attract (spring force)
    for (const link of links) {
      const source = simNodes.find(n => n.id === link.source);
      const target = simNodes.find(n => n.id === link.target);
      if (!source || !target) continue;

      let dx = target.x - source.x;
      let dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const force = dist * ATTRACTION_STRENGTH;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    // Centering: slight gravity toward center
    for (const node of simNodes) {
      node.vx += (centerX - node.x) * 0.001;
      node.vy += (centerY - node.y) * 0.001;
    }

    // Apply velocity with damping and clamping
    for (const node of simNodes) {
      node.vx *= DAMPING;
      node.vy *= DAMPING;

      if (Math.abs(node.vx) > MAX_VELOCITY) {
        node.vx = Math.sign(node.vx) * MAX_VELOCITY;
      }
      if (Math.abs(node.vy) > MAX_VELOCITY) {
        node.vy = Math.sign(node.vy) * MAX_VELOCITY;
      }

      node.x += node.vx;
      node.y += node.vy;

      // Clamp to bounds
      node.x = Math.max(node.size, Math.min(width - node.size, node.x));
      node.y = Math.max(node.size, Math.min(height - node.size, node.y));

      const movement = Math.abs(node.vx) + Math.abs(node.vy);
      if (movement > maxMovement) maxMovement = movement;
    }

    if (maxMovement < CONVERGENCE_THRESHOLD) break;
  }

  return simNodes;
}

export function buildGraphData(
  entities: { name: string; moods: string[] }[],
  uploads: { id: string; filename: string; links: string[]; hashtags: string[] }[],
  moodColorFn: (moods: string[]) => string,
  accentColor: string
): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const entityNameSet = new Set<string>();

  // Entity nodes from brain dumps
  entities.forEach((entity) => {
    entityNameSet.add(entity.name);
    const linkCount = uploads.filter(
      u => u.links.includes(entity.name) || u.hashtags.some(h => entity.name.toLowerCase().includes(h.toLowerCase()))
    ).length;
    nodes.push({
      id: `entity-${entity.name}`,
      label: entity.name,
      type: 'entity',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 16 + Math.min(linkCount * 4, 24),
      color: moodColorFn(entity.moods),
    });
  });

  // Entity nodes from upload [[links]] (not in brain dumps)
  const uploadLinkEntities = new Set<string>();
  uploads.forEach(u => u.links.forEach(l => uploadLinkEntities.add(l)));
  uploadLinkEntities.forEach((name) => {
    if (!entityNameSet.has(name)) {
      entityNameSet.add(name);
      const linkCount = uploads.filter(
        u => u.links.includes(name) || u.hashtags.some(h => name.toLowerCase().includes(h.toLowerCase()))
      ).length;
      nodes.push({
        id: `entity-${name}`,
        label: name,
        type: 'entity',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 16 + Math.min(linkCount * 4, 24),
        color: accentColor,
      });
    }
  });

  // Upload nodes
  uploads.forEach((upload) => {
    nodes.push({
      id: `upload-${upload.id}`,
      label: upload.filename.replace(/\.(md|txt)$/, ''),
      type: 'upload',
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 12 + Math.min((upload.links.length + upload.hashtags.length) * 3, 16),
      color: accentColor,
    });

    // Link uploads to their referenced entities
    upload.links.forEach((link) => {
      if (entityNameSet.has(link)) {
        links.push({
          source: `upload-${upload.id}`,
          target: `entity-${link}`,
        });
      }
    });

    // Link uploads that share hashtags
    for (let i = 0; i < uploads.length; i++) {
      for (let j = i + 1; j < uploads.length; j++) {
        const a = uploads[i];
        const b = uploads[j];
        const sharedHashtags = a.hashtags.filter(h => b.hashtags.includes(h));
        if (sharedHashtags.length > 0) {
          const alreadyLinked = links.some(
            l => (l.source === `upload-${a.id}` && l.target === `upload-${b.id}`) ||
                 (l.source === `upload-${b.id}` && l.target === `upload-${a.id}`)
          );
          if (!alreadyLinked) {
            links.push({
              source: `upload-${a.id}`,
              target: `upload-${b.id}`,
            });
          }
        }
      }
    }
  });

  // Core node: 'You'
  nodes.push({
    id: 'core-you',
    label: 'You',
    type: 'core',
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    size: 24,
    color: '#4F46E5',
  });

  // Link core to all entities
  entities.forEach((entity) => {
    links.push({
      source: 'core-you',
      target: `entity-${entity.name}`,
    });
  });

  return { nodes, links };
}
