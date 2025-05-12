import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { StateCreator } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection, Edge as ReactFlowEdge, Node as ReactFlowNode } from "reactflow";
import {
  createEdges,
  createNodes,
  updateEdges,
  updateNodes,
  Node,
  Edge,
  ContentType,
  Options
} from "../utils/dataUtils";

interface DiagramState {
  nodes: ReactFlowNode<any>[];
  edges: ReactFlowEdge<any>[];
  data: ContentType[];
  showModal: boolean;
  options: Options & {
    snapToGrid: boolean;
    showTypes: boolean;
    showIcons: boolean;
    showRelationsOnly: boolean;
    showAdminTypes: boolean;
    showDefaultFields: boolean;
    showPluginTypes: boolean;
    scrollMode: boolean;
    backgroundPattern: string;
    layoutDirection: string;
  };
  setData: (contentTypesData: ContentType[]) => void;
  setShowModal: (bool: boolean) => void;
  toggleOption: (optionName: string, optionValue?: any) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  drawDiagram: () => void;
  redrawNodes: () => void;
  redrawEdges: () => void;
  applyLayout: () => void;
}

type DiagramPersist = (
  config: StateCreator<DiagramState, [], []>,
  options: PersistOptions<DiagramState, DiagramState>
) => StateCreator<DiagramState, [], []>;

export const useDigramStore = create<DiagramState>()(
  (persist as DiagramPersist)(
    (set, get) => ({
      nodes: [],
      edges: [],
      data: [],
      showModal: false,
      options: {
        snapToGrid: false,
        showTypes: true,
        showIcons: true,
        showRelationsOnly: false,
        showAdminTypes: false,
        showDefaultFields: false,
        showPluginTypes: false,
        showEdges: true,
        scrollMode: true,
        edgeType: "step",
        backgroundPattern: "dots",
        layoutDirection: "TB", // Default to vertical layout
      },
      setData: (contentTypesData) => {
        set({
          data: contentTypesData,
        });
      },
      setShowModal: (bool) => {
        set({
          showModal: bool,
        });
      },
      toggleOption: (optionName, optionValue = null) => {
        const newOptions = { ...get().options };
        if (optionValue !== null) {
          newOptions[optionName] = optionValue;
        } else {
          newOptions[optionName] = !newOptions[optionName];
        }
        set({ options: newOptions });
      },
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      drawDiagram: () => {
        const options = get().options;
        let typesToDraw = get().data;
        if (!options.showAdminTypes) {
          typesToDraw = typesToDraw.filter(
            (x) => !x.name.startsWith("admin::")
          );
        }
        if (!options.showPluginTypes) {
          typesToDraw = typesToDraw.filter(
            (x) => !x.name.startsWith("plugin::")
          );
        }
        let newNodes = createNodes(typesToDraw, options);
        let newEdges = createEdges(typesToDraw, options);
        set({
          nodes: newNodes as ReactFlowNode<any>[],
          edges: newEdges as ReactFlowEdge<any>[],
        });
        // Apply layout after drawing the diagram
        setTimeout(() => get().applyLayout(), 10);
      },
      redrawNodes: () => {
        let newNodes = updateNodes(get().nodes as unknown as Node[], get().options);
        set({
          nodes: newNodes as ReactFlowNode<any>[],
        });
      },
      redrawEdges: () => {
        let newEdges = updateEdges(get().edges as unknown as Edge[], get().options);
        set({
          edges: newEdges as ReactFlowEdge<any>[],
        });
      },
      applyLayout: () => {
        // External function to handle layout will call this
        // Implementation will be in the component that uses it
        // This is just a placeholder to expose the functionality
      },
    }),
    {
      name: "strapi-schema-visualizer",
    }
  )
);
