import "reactflow/dist/style.css";
import "./styles.css";
import React, { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useFetchClient } from '@strapi/strapi/admin';
import { Layouts } from "@strapi/admin/strapi-admin";
import { Button, Modal } from "@strapi/design-system";
import { Search, Drag, Download, ArrowClockwise } from "@strapi/icons";
import { useTheme } from "styled-components";
import {
  SmartBezierEdge,
  SmartStepEdge,
  SmartStraightEdge,
} from "@tisoap/react-flow-smart-edge";
import {
  Background,
  ControlButton,
  Controls,
  ReactFlow,
  BackgroundVariant,
  Panel,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  Position,
  ReactFlowInstance
} from "reactflow";
import dagre from '@dagrejs/dagre';
import { getBackgroundColor } from "../utils/themeUtils";
import { useDigramStore } from "../store";
import { CustomNode } from "../components/CustomNode";
import { OptionsBar } from "../components/OptionsBar";
import { ExportModal } from "../components/ExportModal";

const nodeWidth = 220;
const nodeHeight = 36;

// Debounce function to limit how often a function can be called
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Interface to allow tracking node position changes
interface ExtendedPosition {
  x: number;
  y: number;
  isDirty?: boolean;
}

// Optimized dagre layout implementation with caching mechanism
const applyDagreLayout = (
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  direction: string,
  usePositionCache = true
): { nodes: ReactFlowNode[], edges: ReactFlowEdge[] } => {
  // Simple position cache to avoid recalculating positions when not needed
  const positionCache = new Map<string, { x: number; y: number }>();
  const nodesToLayout = [...nodes];

  // Create a new dagre graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 120,
    edgesep: 40,
    marginx: 50,
    marginy: 50,
    ranker: 'network-simplex', // Alternative: 'tight-tree' or 'longest-path'
    // Removed the optimize property as it's not valid
     // Limit maximum iterations for performance
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes with dimensions - use more efficient loop
  for (let i = 0; i < nodesToLayout.length; i++) {
    const node = nodesToLayout[i];
    // Skip nodes that are being dragged
    if (node.dragging) continue;

    g.setNode(node.id, {
      width: Math.max(300, node.width || nodeWidth),
      height: Math.max(100, node.height || nodeHeight)
    });
  }

  // Add edges - use more efficient loop
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    // Skip edges connected to dragging nodes for better performance
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (sourceNode?.dragging || targetNode?.dragging) continue;

    g.setEdge(edge.source, edge.target);
  }

  // Run the layout
  dagre.layout(g);

  // Apply the layout in a more efficient way
  const layoutedNodes = nodesToLayout.map((node) => {
    // Preserve position of dragging nodes
    if (node.dragging) {
      return node;
    }

    // Use cached position if available and the node hasn't been moved
    // Use a type-safe way to check if the position has been modified
    if (usePositionCache &&
        positionCache.has(node.id) &&
        node.position) {
      const extPosition = node.position as ExtendedPosition;
      if (!extPosition.isDirty) {
        const cachedPos = positionCache.get(node.id)!;
        return {
          ...node,
          position: {
            x: cachedPos.x,
            y: cachedPos.y,
          },
        };
      }
    }

    const nodeWithPosition = g.node(node.id);
    // Only update if we have valid position data
    if (nodeWithPosition &&
        !isNaN(nodeWithPosition.x) &&
        !isNaN(nodeWithPosition.y)) {

      const isHorizontal = direction === 'LR';
      const newX = nodeWithPosition.x - (node.width || nodeWidth) / 2;
      const newY = nodeWithPosition.y - (node.height || nodeHeight) / 2;

      // Cache the new position
      positionCache.set(node.id, { x: newX, y: newY });

      return {
        ...node,
        // Set positions based on layout direction
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        // Set position from graph with offset for centering
        position: {
          x: newX,
          y: newY,
          isDirty: false,
        } as ExtendedPosition,
      };
    }
    // Return original node if no valid position
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const useEffectSkipInitial = (func: () => void, deps: React.DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

// Memoized HomePage component to prevent unnecessary re-renders
const HomePage = React.memo(() => {
  const theme = useTheme();
  const { get } = useFetchClient();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    nodes,
    redrawEdges,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    redrawNodes,
    drawDiagram,
    toggleOption,
    options,
    setData,
  } = useDigramStore();

  // Memoized node types definition
  const nodeTypes = useMemo(() => ({ special: CustomNode }), []);

  // Memoized edge types definition
  const edgeTypes = useMemo(
    () => ({
      smartbezier: SmartBezierEdge,
      smartstep: SmartStepEdge,
      smartstraight: SmartStraightEdge,
    }),
    []
  );

  // Memoized regenerate function to prevent unnecessary recreations
  const regenrate = useCallback(async () => {
    const { data } = await get(`/schema-visualizer/get-types`);
    setData(data);
    drawDiagram();
  }, [get, setData, drawDiagram]);

  useEffectSkipInitial(() => {
    regenrate();
  }, [options.showAdminTypes, options.showPluginTypes, regenrate]);

  useEffect(() => {
    redrawEdges();
  }, [options.edgeType, options.showEdges, redrawEdges]);

  useEffect(() => {
    redrawNodes();
  }, [
    options.showTypes,
    options.showIcons,
    options.showRelationsOnly,
    options.showDefaultFields,
    redrawNodes,
  ]);

  // Memoize the toggle function for better performance
  const handleScrollToggle = useCallback(() => {
    toggleOption("scrollMode");
  }, [toggleOption]);

  const ref = useRef<HTMLDivElement>(null);

  // Handle node drag events for better performance
  const onNodeDragStart = useCallback(() => {
    setIsDragging(true);
    // Hide edges during dragging for better performance
    document.body.classList.add('dragging');

    // Mark dragged nodes as dirty to ensure proper layout after drag
    const updatedNodes = nodes.map(node => {
      if (node.dragging) {
        return {
          ...node,
          position: {
            ...node.position,
            isDirty: true
          } as ExtendedPosition
        };
      }
      return node;
    });

    useDigramStore.setState({
      nodes: updatedNodes,
    });
  }, [nodes]);

  const onNodeDragStop = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove('dragging');

    // Debounce applying layout after drag to prevent lag
    setTimeout(() => {
      // You might re-render edges here after a drag is finished
      redrawEdges();
    }, 50);
  }, [redrawEdges]);

  // Apply layout (dagre) with performance optimization
  const onLayout = useCallback(
    (direction: string) => {
      // Apply performance optimizations when calculating layout
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
        nodes,
        edges,
        direction,
        true // Use position caching
      );

      // Save the layout direction preference
      toggleOption("layoutDirection", direction);

      // Update the store with new positions
      useDigramStore.setState({
        nodes: layoutedNodes,
        edges: layoutedEdges,
      });

      // Fit view after layout
      if (rfInstance) {
        setTimeout(() => {
          rfInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
        }, 10);
      }
    },
    [nodes, edges, toggleOption, rfInstance]
  );

  // Debounced version for operations that don't need immediate response
  const debouncedLayout = useCallback(
    debounce((direction: string) => {
      onLayout(direction);
    }, 250),
    [onLayout]
  );

  // Implement the layout function to be called when diagram is loaded
  useEffect(() => {
    // Override the applyLayout implementation
    useDigramStore.setState({
      applyLayout: () => {
        if (nodes.length > 0) {
          debouncedLayout(options.layoutDirection);
        }
      }
    });
  }, [nodes.length, debouncedLayout, options.layoutDirection]);

  // Memoize background style to avoid recreating on each render
  const backgroundStyle = useMemo(() => getBackgroundColor(options.backgroundPattern, theme),
    [options.backgroundPattern, theme]);

  // Custom style to hide edges during dragging for performance
  useEffect(() => {
    // Add a style element for dynamic CSS rules
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      body.dragging .react-flow__edge {
        opacity: 0.15;
        transition: opacity 0.05s ease;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Memoize the ReactFlow props to prevent re-renders
  const flowProps = useMemo(() => ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
    edgeTypes,
    onNodeDragStart,
    onNodeDragStop,
    onInit: setRfInstance,
    fitView: true,
    minZoom: 0,
    maxZoom: 4,
    preventScrolling: !options.scrollMode,
    snapGrid: [20, 20] as [number, number],
    snapToGrid: options.snapToGrid,
    elevateEdgesOnSelect: true,
    // Better performance settings
    defaultEdgeOptions: {
      animated: false, // disable animations for better performance
    },
    // Use a higher nodesDraggable value to reduce dragging lag
    nodesDraggable: true,
    edgesFocusable: !isDragging, // Disable edge focus during drag
    edgesUpdatable: !isDragging, // Disable edge updates during drag
    fitViewOptions: {
      maxZoom: 1,
      duration: 300,
    },
    // Disable user-created connections
    connectOnClick: false,
    nodesConnectable: false,
  }), [
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
    edgeTypes,
    onNodeDragStart,
    onNodeDragStop,
    options.scrollMode,
    options.snapToGrid,
    isDragging
  ]);

  // Memoize the control button styles
  const controlsStyle = useMemo(() => ({
    "--button-background": theme.colors?.neutral150,
    "--button-foreground": theme.colors?.neutral1000,
    "--button-hover": theme.colors?.buttonPrimary500,
  } as React.CSSProperties), [theme.colors]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Layouts.Header
        title="Schema Visualizer"
        primaryAction={
          <Modal.Root>
            <Modal.Trigger>
            <Button
              startIcon={<Download />}
            >
              Export Diagram
            </Button>
            </Modal.Trigger>
            <ExportModal imageRef={ref as React.RefObject<HTMLDivElement>} />
          </Modal.Root>
        }
        secondaryAction={
          <Button
            variant="secondary"
            startIcon={<ArrowClockwise />}
            onClick={regenrate}
          >
            Regenerate
          </Button>
        }
      />
      {/* TODO remove styling when this issue is fixed: https://github.com/strapi/design-system/issues/1853 */}
			<style>
				{`
					.cte-plugin-controls button {
            background-color: var(--button-background);
            border: none;
          }

          .cte-plugin-controls button:hover {
            background-color: var(--button-hover);
          }

          .cte-plugin-controls button svg {
            fill: var(--button-foreground);
          }
				`}
			</style>
      <OptionsBar />
      <div
        ref={ref}
        style={{
          height: "100%",
          borderTop: `1px solid ${theme.colors?.neutral150}`,
        }}
      >
        <ReactFlow
          {...flowProps}
        >
          <Panel position="top-right" style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => onLayout('TB')}
              variant={options.layoutDirection === 'TB' ? "default" : "secondary"}
            >
              Vertical Layout
            </Button>
            <Button
              onClick={() => onLayout('LR')}
              variant={options.layoutDirection === 'LR' ? "default" : "secondary"}
            >
              Horizontal Layout
            </Button>
          </Panel>
          <Controls
            position="top-left"
            showInteractive={false}
            className="cte-plugin-controls"
            style={controlsStyle}
          >
            <ControlButton
              onClick={handleScrollToggle}
              title="Toggle Mouse Wheel Behavior (Zoom/Scroll)"
            >
              {
                options.scrollMode
                ? <Drag fill="#000000" />
                : <Search fill="#000000" />
              }
            </ControlButton>
          </Controls>
          <Background
            variant={options.backgroundPattern as BackgroundVariant}
            color={backgroundStyle}
          />
        </ReactFlow>
      </div>
    </div>
  );
});

// Add display name for better debugging
HomePage.displayName = 'HomePage';

export { HomePage };
