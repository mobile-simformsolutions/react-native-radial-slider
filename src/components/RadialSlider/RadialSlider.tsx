import React, { useEffect, useState } from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  NumberProp,
} from 'react-native-svg';
import { View, Platform, StyleSheet } from 'react-native';
import type { RadialSliderProps } from './types';
import { styles } from './styles';
import { Colors } from '../../theme';
import { useSliderAnimation, useRadialSlider } from './hooks';
import { defaultProps } from './SliderDefaultProps';
import ButtonContent from './ButtonContent';
import CenterContent from './CenterContent';
import TailText from './TailText';
import LineContent from './LineContent';
import MarkerValueContent from './MarkerValueContent';

const RadialSlider = (props: RadialSliderProps & typeof defaultProps) => {
  const [isStart, setIsStart] = useState<boolean>(false);
  const [iconPosition, setIconPosition] = useState<string>("");

  const {
    step,
    radius,
    sliderWidth,
    sliderTrackColor,
    linearGradient,
    thumbRadius,
    thumbBorderColor,
    thumbColor,
    thumbBorderWidth,
    style,
    markerLineSize,
    disabled,
    contentStyle,
    buttonContainerStyle,
    min,
    max,
    isHideSlider,
    isHideCenterContent,
    isHideTailText,
    isHideButtons,
    isHideLines,
    leftIconStyle,
    rightIconStyle,
    stroke,
  } = props;

  const { panResponder, value, setValue, curPoint, currentRadian, prevValue } =
    useSliderAnimation(props);

  const {
    svgSize,
    containerRef,
    startPoint,
    endPoint,
    startRadian,
    radianValue,
    isRadialCircleVariant,
    centerValue,
  } = useRadialSlider(props);

  useEffect(() => {
    //check max value length
    const maxLength = max?.toString()?.length;

    const timerId = setTimeout(handleValue, maxLength > 2 ? 10 : 100);
    return () => clearTimeout(timerId);
  });

  const handleValue = () => {
    if (iconPosition === "up" && max > value) {
      isStart && onPressButtons("up");
    } else if (iconPosition === "down" && min < value) {
      isStart && onPressButtons("down");
    }
  };

  const leftButtonStyle = StyleSheet.flatten([
    leftIconStyle,
    (disabled || min === value) && {
      opacity: 0.5,
    },
  ]);

  const rightButtonStyle = StyleSheet.flatten([
    rightIconStyle,
    (disabled || max === value) && {
      opacity: 0.5,
    },
  ]);

  const onLayout = () => {
    const ref = containerRef.current as any;
    if (ref) {
      ref.measure((_x: any, _y: any, _width: any, _height: any) => {});
    }
  };

  const onPressButtons = (type: string) => {
    if (type === "up" && max > value) {
      setValue((prevState: number) => {
        const calculatedValue = prevState + step;
        const roundedValue = parseFloat(calculatedValue.toFixed(1));

        return roundedValue;
      });
    } else if (type === "down" && min < value) {
      setValue((prevState: number) => {
        const calculatedValue = prevState - step;
        const roundedValue = parseFloat(calculatedValue.toFixed(1));
        prevValue.current = roundedValue;

        return roundedValue;
      });
    }
  };

  const circleXPosition = isRadialCircleVariant
    ? centerValue < value
      ? -7
      : 4
    : 0;

  const strokeLinecap = "round";

  const stabilizeThumbPosition = currentRadian < 3 ? 7 : -4;
  return (
    <View
      onLayout={onLayout}
      ref={containerRef as any}
      style={[styles.container, style, { width: svgSize, height: svgSize }]}
      testID="slider-view"
    >
      <Svg
        width={svgSize + markerLineSize / 2}
        height={svgSize + markerLineSize / 2}
        viewBox={`-${markerLineSize / 2} -${markerLineSize / 2} ${
          svgSize + markerLineSize
        } ${svgSize + markerLineSize}`}
        preserveAspectRatio="none"
      >
        <MarkerValueContent
          {...(props as object)}
          value={value}
          currentRadian={currentRadian}
        />
        <Defs>
          <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="gradient">
            {linearGradient.map(
              (
                item: {
                  offset: NumberProp | undefined;
                  color: string | undefined;
                },
                index: React.Key | null | undefined,
              ) => (
                <Stop key={index} offset={item.offset} stopColor={item.color} />
              ),
            )}
          </LinearGradient>
        </Defs>

        {!isHideTailText && <TailText {...props} />}
        <LineContent {...props} value={value} currentRadian={currentRadian} />
        {!isHideSlider && (
          <>
            <Path
              strokeWidth={sliderWidth}
              stroke={sliderTrackColor}
              fill="none"
              strokeLinecap={strokeLinecap}
              d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${
                startRadian - radianValue >= Math.PI ? "1" : "0"
              },1,${endPoint.x},${endPoint.y}`}
            />
            <Path
              strokeWidth={sliderWidth + 4}
              stroke="url(#gradient)"
              fill="none"
              strokeLinecap={strokeLinecap}
              d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${
                startRadian - currentRadian >= Math.PI ? "1" : "0"
              },1,${curPoint.x},${curPoint.y}`}
            />
            <Circle
              cx={curPoint.x + circleXPosition + stabilizeThumbPosition}
              cy={curPoint.y}
              r={10}
              fill={thumbColor || thumbBorderColor}
              stroke={thumbColor}
              strokeWidth={thumbBorderWidth}
              {...panResponder.panHandlers}
            />
          </>
        )}
      </Svg>
      <View style={[styles.content, contentStyle]} pointerEvents="box-none">
        {/* Center Content */}
        {!isHideCenterContent && <CenterContent {...props} value={value} />}
      </View>
    </View>
  );
};

RadialSlider.defaultProps = defaultProps;
export default RadialSlider;
