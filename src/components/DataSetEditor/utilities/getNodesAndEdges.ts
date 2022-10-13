import { Map } from "typescript";
import { Internal } from "./formatMutation";

export function getNodesAndEdges(nodeLookup) {
  const initialNodes = Object.values(nodeLookup);
  const edges = [];

  initialNodes.forEach((node) => {
    const children = initialNodes.filter((child) => child.parentId === node.id);

    children.forEach((child) => {
      if (!node.active) child.active = false;

      if (node.active && child.active) {
        edges.push({
          id: `${node.id}-${child.id}`,
          from: node.id,
          to: child.id,
        });
      }
    });
  });

  const nodes = initialNodes.filter((node) => node.active === true);

  // if (node?.children?.length) {
  //   node.children.forEach((child) => {
  //     const { nodes: nextNodes, edges: nextEdges } = getNodesAndEdges(
  //       child,
  //       node
  //     );
  //     nodes.push(...nextNodes);
  //     edges.push(...nextEdges);
  //   });
  // }

  return { nodes, edges };
}
