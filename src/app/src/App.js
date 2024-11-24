import {RandomCircleGraph, FeatureGraph} from "./components/Graph/RandomCircleGraph.graph";

import React, {useState, useEffect} from "react";
import { useMemo } from "react";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";

import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  SearchControl,
} from "@react-sigma/core";

import EdgeCurveProgram from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";

const RandomGraphBuilder = ({ style }) => {
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      edgeProgramClasses: {
        straight: EdgeArrowProgram,
        curved: EdgeCurveProgram,
      },
    }),
    []
  );

  return (
    <SigmaContainer style={style} settings={settings}>
      <RandomCircleGraph />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <LayoutForceAtlas2Control autoRunFor={2000} />
        <FullScreenControl />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

const FeatureGraphBuilder = ({ style, graphData, mapping}) => {
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      edgeProgramClasses: {
        straight: EdgeArrowProgram,
        curved: EdgeCurveProgram,
      },
    }),
    []
  );

  return (
    <SigmaContainer style={style} settings={settings}>
      <FeatureGraph graphData={graphData} mapping={mapping} />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <LayoutForceAtlas2Control autoRunFor={2000} />
        <FullScreenControl />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

const App = () => {
  const [HeightGraphData, setHeightGraphData] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [mappingLoading, setMappingLoading] = useState(true)
  const [graphHeightLoading, setGraphHeightLoading] = useState(true)

  const processData = (rawData) => {
    const lines = rawData.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line) => {
      const [column1, column2, column3] = line.trim().split(/\s+/);
      return { source: column1, target: column2, weight: parseInt(column3, 10) };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/graph.txt");
        const rawData = await response.text();
        const processedData = processData(rawData);
        setHeightGraphData(processedData);
        setGraphHeightLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setGraphHeightLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const response = await fetch("/mapping.json");
        const rawData = await response.json();

        const mappingDict = Object.entries(rawData).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

        setMapping(mappingDict);
        setMappingLoading(false);
      } catch (error) {
        console.error("Failed to load mapping data:", error);
        setMappingLoading(false);
      }
    };

    fetchMapping();
  }, []);

  if (graphHeightLoading | mappingLoading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading data...</div>;
  }

  return (
    <div style={appContainerStyle}>
      <div style={headerStyle}>BB LLM</div>

      <div style={boxStyle}>
        <FeatureGraphBuilder style={{ height: "100%", width: "100%" }} graphData={HeightGraphData} mapping={mapping} />
        <div style={descriptionStyle}>LLama 8B</div>
      </div>

      <div style={boxStyle}>
        <RandomGraphBuilder style={{ height: "100%", width: "100%" }} />
        <div style={descriptionStyle}>LLama 70B</div>
      </div>
    </div>
  );
};

// Styles
const appContainerStyle = {
  position: "relative",
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "#f9f9f9", // Light background for contrast
  padding: "20px",
  gap: "20px", // Spacing between header and graph boxes
};

const headerStyle = {
  textAlign: "center",
  padding: "10px",
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
  backgroundColor: "#ffffff",
  border: "2px solid cyan",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "800px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const boxStyle = {
  border: "2px solid cyan",
  borderRadius: "15px", // Smooth convex corners
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  overflow: "hidden",
  width: "90%",
  maxWidth: "1200px", // Constrain box width
  height: "600px", // Fixed height for uniformity
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#ffffff", // White background for content clarity
};

const descriptionStyle = {
  textAlign: "center",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#f0f8ff", // Light cyan background
  color: "#333",
  fontWeight: "bold",
  width: "100%",
};

export default App;