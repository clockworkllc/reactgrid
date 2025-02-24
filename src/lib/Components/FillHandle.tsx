import React, { useRef, useLayoutEffect, useState } from "react";
import { Location } from "../../core";
import { State } from "../Model/State";
import { FillHandleBehavior } from "../Behaviors/FillHandleBehavior";

interface FillHandleProps {
  state: State;
  location: Location;
}

export const FillHandle: React.FC<FillHandleProps> = ({ state, location }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <div
      className="rg-touch-fill-handle"
      ref={targetRef}
      style={{
        top: location.row.bottom,
        left: location.column.right,
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          // !== undefined (disabled this event for cypress tests)
          state.update((state) => ({
            ...state,
            currentBehavior: new FillHandleBehavior(),
          }));
        }
      }}
    >
      <div className="rg-fill-handle" />
    </div>
  );
};
