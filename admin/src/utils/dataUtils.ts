const CARDS_PER_ROW = 6;

export interface Attribute {
  type: string;
  target?: string;
  [key: string]: any;
}

export interface ContentType {
  key: string;
  attributes: {
    [key: string]: Attribute;
  };
  [key: string]: any;
}

export interface Options {
  edgeType: string;
  showEdges: boolean;
  [key: string]: any;
}

export interface Node {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
  data: {
    options: Options;
    [key: string]: any;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  hidden: boolean;
  sourceHandle?: string;
  [key: string]: any;
}

export function createNodes(contentTypes: ContentType[], options: Options): Node[] {
  let newNodes: Node[] = [];
  contentTypes.map(
    (node, index) =>
      (newNodes = [
        ...newNodes,
        {
          id: node.key,
          position: {
            x: (index % CARDS_PER_ROW) * 320,
            y: ((index - (index % CARDS_PER_ROW)) / CARDS_PER_ROW) * 560 + (index % 2) * 48,
          },
          type: 'special',
          data: {
            ...node,
            options: options,
          },
        },
      ])
  );
  return newNodes;
}

export function updateNodes(nodes: Node[], options: Options): Node[] {
  return nodes.map((node) => ({
    ...node,
    data: { ...node.data, options: options },
  }));
}

export function createEdges(contentTypes: ContentType[], options: Options): Edge[] {
  let newEdges: Edge[] = [];

  contentTypes.map((contentType) => {
    Object.keys(contentType.attributes).map((attr) => {
      if (contentType.attributes[attr].type === 'relation') {
        // only add edge if target node is not excluded (not hidden)
        if (
          contentTypes.some((node) => node.key === contentType.attributes[attr].target) &&
          // Filter out self-connecting edges (nodes connected to themselves)
          contentType.key !== contentType.attributes[attr].target
        ) {
          newEdges = [
            ...newEdges,
            {
              id: `${contentType.attributes[attr].target}-${contentType.key}.${attr}`,
              source: contentType.key,
              target: contentType.attributes[attr].target!,
              type: options.edgeType,
              hidden: !options.showEdges,
              sourceHandle: attr,
            },
          ];
        }
      }
    });
  });
  return newEdges;
}

export function updateEdges(edges: Edge[], options: Options): Edge[] {
  // Filter out edges where source and target are the same (self-connections)
  const filteredEdges = edges.filter((edge) => edge.source !== edge.target);

  return filteredEdges.map((edge) => ({
    ...edge,
    type: options.edgeType,
    hidden: !options.showEdges,
  }));
}
