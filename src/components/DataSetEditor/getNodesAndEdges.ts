import { Internal } from "./formatMutation";

export function getNodesAndEdges(node, parentNode) {
  const nodes = [];
  const edges = [];

  nodes.push(node);
  console.log({ node });

  if (parentNode) {
    edges.push({
      id: `${node.id}-${parentNode.id}`,
      from: parentNode.id,
      to: node.id,
    });
  }

  if (node.children?.length) {
    node.children.forEach((child) => {
      const { nodes: nextNodes, edges: nextEdges } = getNodesAndEdges(
        child,
        node
      );
      nodes.push(...nextNodes);
      edges.push(...nextEdges);
    });
  }

  return { nodes, edges };
}

const formatToNode = (obj, parent) => {
  const node = {
    id: obj.loc.start.toString(),
    text: obj.name.value,
    data: obj,
  };

  if (parent) {
    const edge = {
      id: Math.random().toString(),
      from: parent.loc.start.toString(),
      to: node.id,
    };

    return { node, edge };
  }

  return { node };
};
