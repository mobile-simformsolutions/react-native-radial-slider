import React from 'react';
import { Text as SVGText, G, TSpan } from 'react-native-svg';
import { useRadialSlider } from './hooks';
import type { RadialSliderProps, TextTailProps } from './types';
import { Colors } from '../../theme';

const TailText = (props: TextTailProps) => {
  const { unit, min, max } = props;
  const { startPoint, endPoint } = useRadialSlider(props as RadialSliderProps);

  return (
    <>
      <G transform={`translate(${-20}, ${40})`}>
        <SVGText fill={Colors.darkCharcoal} fontSize={16} fontWeight={"600"}>
          <TSpan x={startPoint.x + 5} y={startPoint.y + 10}>
            {`Not`}
          </TSpan>
          <TSpan x={startPoint.x} y={startPoint.y + 30}>
            {`Likely`}
          </TSpan>
        </SVGText>
      </G>
      <G transform={`translate(${-10}, ${40})`}>
        <SVGText fill={Colors.darkCharcoal} fontSize={16} fontWeight={"600"}>
          <TSpan x={endPoint.x - 30} y={endPoint.y + 10}>
            {`Extremely`}
          </TSpan>
          <TSpan x={endPoint.x - 10} y={endPoint.y + 30}>
            {`Likely`}
          </TSpan>
        </SVGText>
      </G>
    </>
  );
};

export default TailText;
