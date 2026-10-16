import React from "react";
import {Composition} from "remotion";
import {OceanMystery} from "./Video";

export const Root: React.FC = () => (
  <Composition
    id="OceanMystery"
    component={OceanMystery}
    durationInFrames={2100}
    fps={30}
    width={1080}
    height={1920}
  />
);
