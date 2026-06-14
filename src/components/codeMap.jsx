import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import "reactflow/dist/style.css";

export default function CodeMapReactFlow({ data }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const { nodes, edges } = useMemo(() => {
    if (!data) {
      return {
        nodes: [],
        edges: [],
      };
    }

    const allFiles = [];

    const flatten = (items) => {
      items.forEach((item) => {
        if (
          item.type === "file" &&
          item.name.match(/\.(js|jsx|ts|tsx)$/)
        ) {
          allFiles.push(item);
        }

        if (item.children) {
          flatten(item.children);
        }
      });
    };

    flatten(data);

    const centerX = 700;
    const centerY = 400;
    const radius = 500;

    const appFile = allFiles.find(
      (f) =>
        f.name === "App.jsx" ||
        f.name === "App.js"
    );

    const otherFiles = allFiles.filter(
      (f) =>
        f.name !== "App.jsx" &&
        f.name !== "App.js"
    );

    const flowNodes = [];

    if (appFile) {
      flowNodes.push({
        id: appFile.name,

        position: {
          x: centerX,
          y: centerY,
        },

        data: {
          label: appFile.name,
        },

        style: {
          background: "#ef4444",
          color: "white",
          width: 200,
          borderRadius: 14,
          fontWeight: 700,
          textAlign: "center",
          padding: 12,
          boxShadow:
            "0 0 20px rgba(239,68,68,.7)",
        },
      });
    }

    otherFiles.forEach((file, index) => {
      const angle =
        (index / otherFiles.length) *
        Math.PI *
        2;

      flowNodes.push({
        id: file.name,

        position: {
          x:
            centerX +
            radius * Math.cos(angle),

          y:
            centerY +
            radius * Math.sin(angle),
        },

        data: {
          label: file.name,
        },

        style: {
          background: file.name.startsWith("use")
            ? "#06b6d4"
            : file.name.includes("Page")
            ? "#f59e0b"
            : "#6366f1",

          color: "white",

          width: 180,

          borderRadius: 12,

          fontWeight: 600,

          textAlign: "center",

          padding: 10,

          boxShadow:
            "0 0 12px rgba(99,102,241,.4)",
        },
      });
    });

    const flowEdges = [];

    allFiles.forEach((file) => {
      const regex =
        /import\s+.*?\s+from\s+['"](.+)['"]/g;

      let match;

      while (
        (match = regex.exec(
          file.content || ""
        )) !== null
      ) {
        const importPath = match[1];

        const importName = importPath
          .split("/")
          .pop()
          .replace(
            /\.(js|jsx|ts|tsx)$/i,
            ""
          );

        const target = allFiles.find(
          (f) =>
            f.name.replace(
              /\.(js|jsx|ts|tsx)$/i,
              ""
            ) === importName
        );

        if (target) {
          flowEdges.push({
            id:
              file.name +
              "-" +
              target.name,

            source: file.name,

            target: target.name,

            animated: true,

            style: {
              stroke: "#64748b",
              strokeWidth: 2,
            },
          });
        }
      }
    });

    return {
      nodes: flowNodes,
      edges: flowEdges,
    };
  }, [data]);

  const highlightedEdges = edges.map((edge) => {
    const active =
      selectedNode &&
      (
        edge.source === selectedNode ||
        edge.target === selectedNode
      );

    return {
      ...edge,

      animated: active,

      style: {
        stroke: active
          ? "#a855f7"
          : "#475569",

        strokeWidth: active
          ? 4
          : 2,

        opacity:
          selectedNode
            ? active
              ? 1
              : 0.2
            : 1,
      },
    };
  });

  const connectedNodes = new Set();

  highlightedEdges.forEach((edge) => {
    if (
      edge.source === selectedNode ||
      edge.target === selectedNode
    ) {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    }
  });

  const highlightedNodes = nodes.map(
    (node) => {
      const active =
        selectedNode &&
        (
          node.id === selectedNode ||
          connectedNodes.has(node.id)
        );

      return {
        ...node,

        style: {
          ...node.style,

          opacity:
            selectedNode
              ? active
                ? 1
                : 0.25
              : 1,

          boxShadow: active
            ? "0 0 35px rgba(168,85,247,.95)"
            : node.style.boxShadow,

          border: active
            ? "2px solid #c084fc"
            : "none",
        },
      };
    }
  );

  return (
    <div className="w-full h-screen bg-[#020817]">
      <ReactFlow
        nodes={highlightedNodes}
        edges={highlightedEdges}
        fitView

        onNodeClick={(_, node) =>
          setSelectedNode(node.id)
        }

        onPaneClick={() =>
          setSelectedNode(null)
        }
      >
        <MiniMap
          style={{
            background: "#0f172a",
          }}
        />

        <Controls />

        <Background
          color="#1e293b"
          gap={20}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}