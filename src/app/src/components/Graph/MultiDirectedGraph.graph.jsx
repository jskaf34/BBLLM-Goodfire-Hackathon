import React, { useMemo } from "react";
import { SigmaContainer, ControlsContainer, ZoomControl, FullScreenControl, SearchControl } from "@react-sigma/core";
import { EdgeArrowProgram } from "sigma/rendering";
import EdgeCurveProgram from "@sigma/edge-curve";
import RandomCircleGraph from "./RandomCircleGraph.graph";
import Fa2 from "./Fa2.graph";

export const MultiDirectedGraph = ({ style }) => {
  // Sigma settings
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      renderEdgeLabels: true,
      defaultEdgeType: "straight",
      edgeProgramClasses: {
        straight: EdgeArrowProgram,
        curved: EdgeCurveProgram,
      },
    }),
    [],
  );

  return (
    <SigmaContainer style={style} settings={{ allowInvalidContainer: true }}>
      <RandomCircleGraph />
      <Fa2 /> 
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default MultiDirectedGraph;
