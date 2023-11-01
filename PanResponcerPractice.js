import React, { useRef, useState } from "react";
import { Dimensions, PanResponder } from "react-native";
import { Animated } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;
/**
 *  Animated 기본형: Animated 를 사용할 컴포넌트는 <Animated.View />처럼 사용
 *  Animated가 지원하지 않는 컴포넌트의 경우 createAnimatedComponent(componentNam)로 사용
 *  Animated 컴포넌트를 styled로 만들고 싶을 경우 기본 컴포넌트를 styled-로 만든 후
 *  createAnimatedComponent(styledComponent)와 같이 사용한다
 */
const AnimatedBox = Animated.createAnimatedComponent(Box);

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function App() {
  //Animnated.Value 는 Y = 20처럼 값을 직접 바꾸지 않는다.
  //useRef를 사용해 애니메이션 state값을 저장하면
  //다른 state가 바뀌어 render가 다시 일어나도 값이 초기화되지 않는다.
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  /**
   * value.interpolate({inputRange: [], outputRange: []})
   * value의 값이 inputRange의 배열[index]값이 되면 outputRange의 같은 index값을 return
   */
  const borderRadius = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const backgroundColor = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 166, 255)"], // rgb string도 변경 가능
  });

  const panResponder = useRef(
    PanResponder.create({
      //이 컴포넌트에서 touch 감지 여부
      onStartShouldSetPanResponder: () => true,
      //touch가 시작될 때 실행
      onPanResponderGrant: () => {
        //position.x의 _value로 number 값을 불러와야 한다.
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
      },
      //touch한 채 손가락을 움직일 때 실행 - props (event, gestureState)
      onPanResponderMove: (_, { dx, dy }) => {
        // gestureState: {dx, dy, ...rest}
        position.setValue({
          x: dx,
          y: dy,
        });
      },
      //touch를 놓으면 실행
      onPanResponderRelease: () => {
        // onPanResponderGrant 에서 offset을 설정하면 touch 실행시마다
        // offset이 가중되기 때문에 touch 종료 시 초기화해주어야 한다.
        // flattenOffset은 현재 offset을 0으로 초기화 하고 이전값을 valueXY에 적용한다.
        position.flattenOffset();
      },
    })
  ).current;

  return (
    <Container>
      <AnimatedBox
        //touch를 감지하게 할 View에 panHandlers를 부여해야 한다
        {...panResponder.panHandlers}
        style={{
          borderRadius,
          backgroundColor,
          transform: position.getTranslateTransform(),
        }}
      />
    </Container>
  );
}
