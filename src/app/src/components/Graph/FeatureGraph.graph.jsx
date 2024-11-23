import { useEffect } from "react";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useLoadGraph, useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { useHoverEvents } from "../../hooks/useHoverEvents";
import { useGraphSetup } from "../../hooks/useGraphSetup";
import { addNodes, addEdges } from "../../utils/nodeManagement";


export const FeatureGraph = ({ graphData }) => {
  const loadGraph = useLoadGraph();
  const { assign } = useLayoutCircular();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const sigma = useSigma();

  const { hoveredNode, applyReducers } = useHoverEvents(registerEvents, sigma);
  const { setupGraph } = useGraphSetup(loadGraph, assign, (graph) => addNodes(graph, graphData), (graph) => addEdges(graph, graphData));

  useEffect(() => {
    if (graphData.length > 0) {
      setupGraph(graphData);
    }
  }, [graphData, setupGraph]);

  useEffect(() => {
    applyReducers(setSettings);
  }, [hoveredNode, applyReducers, setSettings]);

  return null;
};
