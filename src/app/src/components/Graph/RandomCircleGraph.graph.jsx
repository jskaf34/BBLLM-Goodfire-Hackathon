import { useEffect, useState } from "react";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useLoadGraph, useRegisterEvents, useSigma, useSetSettings } from "@react-sigma/core";
import Graph from "graphology";
import { useRandom } from "../../hooks/useRandom";

export const FeatureGraph = ({ graphData }) => {
  const loadGraph = useLoadGraph();
  const { assign } = useLayoutCircular();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const sigma = useSigma();

  const [hoveredNode, setHoveredNode] = useState();
  const [sentence, setSentence] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch JSON and construct sentence
  useEffect(() => {
    const fetchSentence = async () => {
      try {
        const response = await fetch("/sentence.json");
        const data = await response.json();

        const sentence = data.token_features.map(([word]) => word).join("");
        setSentence(sentence);
        setJsonData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sentence data:", error);
        setSentence("Error loading sentence.");
        setJsonData(null);
        setLoading(false);
      }
    };

    fetchSentence();
  }, []);

  // Function to handle word clicks
  const handleWordClick = (word) => {
    if (!jsonData) return;

    const wordData = jsonData.token_features.find(([token]) => token.trim() === word.trim());
    if (wordData) {
      const featureIndices = wordData[1].map((feature) => feature.feature_index_sae);
      highlightNodes(featureIndices);
    }
  };

  // Function to highlight nodes
  const highlightNodes = (featureIndices) => {
    const graph = sigma.getGraph();

    // Reset all nodes to default color
    graph.forEachNode((node) => {
      graph.updateNodeAttributes(node, (attributes) => ({
        ...attributes,
        color: "#00FF00",
        size: 1,
      }));
    });

    // Highlight nodes corresponding to feature indices
    featureIndices.forEach((featureIndex) => {
      if (graph.hasNode(featureIndex)) {
        graph.updateNodeAttributes(featureIndex, (attributes) => ({
          ...attributes,
          color: "#FF0000",
          size: 5,
        }));
      }
    });

    sigma.refresh(); // Refresh the graph to reflect changes
  };

  // Set up the graph when data is loaded
  useEffect(() => {
    if (graphData.length > 0) {
      const graph = new Graph();

      const nodeSizes = {};
      graphData.forEach(({ source, target, weight }) => {
        nodeSizes[target] = (nodeSizes[target] || 0) + weight;
        nodeSizes[source] = (nodeSizes[source] || 0) + weight;
      });

      Object.entries(nodeSizes).forEach(([node, size]) => {
        graph.addNode(node, {
          label: node,
          size: 1,
          color: "#00FF00",
          x: 0,
          y: 0,
        });
      });

      // Add edges with weights
      graphData.forEach(({ source, target, weight }) => {
        graph.addEdge(source, target, {
          weight,
          size: 1,
        });
      });

      loadGraph(graph);
      assign();

      registerEvents({
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null),
      });
    }
  }, [graphData, loadGraph, assign, registerEvents]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, highlighted: data.highlighted || false };

        if (hoveredNode) {
          if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
            newData.highlighted = true;
          } else {
            newData.color = "#E2E2E2";
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [hoveredNode, setSettings, sigma]);

  if (loading) {
    return <div>Loading sentence...</div>;
  }

  return (
    <div>
      <p style={{ fontSize: "20px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        {jsonData.token_features.map(([word], index) => (
          <span
            key={index}
            onClick={() => handleWordClick(word)}
            style={{ cursor: "pointer", color: "#007BFF", marginRight: "5px" }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};


export const RandomCircleGraph = () => {
  const { faker, randomColor } = useRandom();
  const { positions, assign } = useLayoutCircular();
  const loadGraph = useLoadGraph();

  const registerEvents = useRegisterEvents();
  const [hoveredNode, setHoveredNode] = useState();
  const setSettings = useSetSettings();
  const sigma = useSigma();

  useEffect(() => {
    const order = 100;
    const probability = 0.1;
    const graph = new Graph();
    for (let i = 0; i < order; i++) {
      graph.addNode(i, {
        label: faker.person.fullName(),
        size: faker.number.int({ min: 4, max: 20 }),
        color: randomColor(),
        x: 0,
        y: 0,
      });
    }
    for (let i = 0; i < order; i++) {
      for (let j = i + 1; j < order; j++) {
        if (Math.random() < probability) graph.addDirectedEdge(i, j, {size: 5});
        if (Math.random() < probability) graph.addDirectedEdge(j, i);
      }
    }
  
    loadGraph(graph);
    assign();

    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });
    console.log(positions());
  }, [assign, loadGraph, faker.datatype, faker, randomColor, registerEvents]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, highlighted: data.highlighted || false };

        if (hoveredNode) {
          if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
            newData.highlighted = true;
          } else {
            newData.color = "#E2E2E2";
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [hoveredNode, setSettings, sigma]);

  return null;
};