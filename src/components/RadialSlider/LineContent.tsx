import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import type { LineContentProps } from './types';
import { G, Line } from 'react-native-svg';
import { useRadialSlider } from './hooks';
import { Colors } from '../../theme';

const LineContent = (props: LineContentProps) => {
  const [markerPositionValues, setMarkerPositionValues] = useState([]);
  const {
    radius = 100,
    linearGradient = [],
    thumbBorderWidth = 5,
    markerLineSize = 50,
    lineColor = Colors.grey,
    lineSpace = 3,
    min = 0,
    max = 100,
    markerValue,
    isHideMarkerLine,
    fixedMarker = false,
    value,
    markerValueInterval = 10,
  } = props;

  const {
    angle,
    lineCount,
    lines,
    lineHeight,
    isMarkerVariant,
    marks,
    isRadialCircleVariant,
    isRadialSliderVariant,
    isSpeedoMeterVariant,
  } = useRadialSlider(props);

  const markerInnerValue = Math.round((max / markerValueInterval) as number);

  useEffect(() => {
    const arr: any = [];
    for (let i = 0; i < marks.length; i = i + markerInnerValue) {
      arr.push(marks[i].value);
    }
    setMarkerPositionValues(arr);
  }, [markerInnerValue, marks, max]);

  return (
    <G>
      {lines.map((_value, index) => {
        const plusActiveIndex = index === 0 ? 0 : 1;
        const activeIndex =
          (((((value as number) - min) * 100) / (max - min)) * lineCount) /
            100 +
          plusActiveIndex;

        const getMarketIndex = () => {
          return markerPositionValues.map((val: number) => {
            return Math.floor(
              ((((val - min) * 100) / (max - min)) * lineCount) / 100
            );
          });
        };

        const markIndex = Math.floor(
          (((((!fixedMarker ? (markerValue as number) : (value as number)) -
            min) *
            100) /
            (max - min)) *
            lineCount) /
            100
        );

        const isMarkerLine = getMarketIndex()?.includes(index);

        const isSpeedoMarker = !isMarkerVariant ? 0 : isMarkerLine ? -10 : 0;

        const isSpeedoMeterMarkerLine =
          isRadialCircleVariant || isRadialSliderVariant || isSpeedoMeterVariant
            ? false
            : isMarkerLine;

        // Calculate the slider point adjustment based on the provided start point
        // The values -4 and -2 are used for fine-tuning the adjustment
        // -4 accounts for a base adjustment, and -2 is a multiplier applied to the start point
        const sliderPointAdjustment = -4 - 2 * (props?.startAngle || 0);

        // Adjust the slider start point based on variant type or use a default value (86)
        const adjustedSliderStartPoint =
          isRadialCircleVariant && props?.startAngle != null
            ? props.startAngle + sliderPointAdjustment
            : 89;

        const radialCircleLineRotation = isRadialCircleVariant
          ? adjustedSliderStartPoint
          : 90;

          return (
            <G>
              {lines.map((_value, index) => {
                const plusActiveIndex = index === 0 ? 0 : 1;
                const activeIndex =
                  (((((value as number) - min) * 100) / (max - min)) * lineCount) /
                    100 +
                  plusActiveIndex;
        
                const getMarketIndex = () => {
                  return markerPositionValues.map((val: number) => {
                    return Math.floor(
                      ((((val - min) * 100) / (max - min)) * lineCount) / 100,
                    );
                  });
                };
        
                const markIndex = Math.floor(
                  (((((!fixedMarker ? (markerValue as number) : (value as number)) -
                    min) *
                    100) /
                    (max - min)) *
                    lineCount) /
                    100,
                );
        
                const isMarkerLine = getMarketIndex()?.includes(index);
        
                const isSpeedoMarker = !isMarkerVariant ? 0 : isMarkerLine ? -10 : 0;
        
                const isSpeedoMeterMarkerLine =
                  isRadialCircleVariant || isRadialSliderVariant || isSpeedoMeterVariant
                    ? false
                    : isMarkerLine;
        
                // Calculate the slider point adjustment based on the provided start point
                // The values -4 and -2 are used for fine-tuning the adjustment
                // -4 accounts for a base adjustment, and -2 is a multiplier applied to the start point
                const sliderPointAdjustment = -4 - 2 * (props?.startAngle || 0);
        
                // Adjust the slider start point based on variant type or use a default value (86)
                const adjustedSliderStartPoint =
                  isRadialCircleVariant && props?.startAngle != null
                    ? props.startAngle + sliderPointAdjustment
                    : 89;
        
                const radialCircleLineRotation = isRadialCircleVariant
                  ? adjustedSliderStartPoint
                  : 90;
        
                return (
                  <G key={index.toString()}>
                    {(index % lineSpace === 0 ||
                      index === markIndex ||
                      isSpeedoMeterMarkerLine) && (
                      <G
                        transform={`translate(${
                          radius + (lineHeight - thumbBorderWidth)
                        }, ${radius + (lineHeight - thumbBorderWidth)})`}
                      >
                        <Line
                          x1={
                            index === markIndex && !isHideMarkerLine
                              ? radius + markerLineSize
                              : radius + lineHeight - 12
                          }
                          x2={radius - 10 + lineHeight / 2}
                          transform={`rotate(${
                            index + radialCircleLineRotation + angle
                          })`}
                          strokeWidth={2}
                          stroke={
                            activeIndex > index ||
                            (index === markIndex && !isHideMarkerLine)
                              ? Platform.OS === "web"
                                ? linearGradient[0].color
                                : "url(#gradient)"
                              : lineColor
                          }
                          fill="none"
                          strokeLinecap="round"
                        />
                      </G>
                    )}
                  </G>
                );
              })}
            </G>
          );
      })}
    </G>
  );
};

export default LineContent;
