import React, { useRef, useState } from "react";
import { Dimensions, Easing, Pressable } from "react-native";
import { Animated } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.Pressable`
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export default function App() {
  //Animnated.Value 는 Y = 20처럼 값을 직접 바꾸지 않는다.
  //useRef를 사용해 애니메이션 state값을 저장하면
  //다른 state가 바뀌어 render가 다시 일어나도 값이 초기화되지 않는다.
  const position = useRef(
    new Animated.ValueXY({
      x: -screenWidth / 2 + 50,
      y: -screenHeight / 2 + 50,
    })
  ).current;

  /**
   * Animated.timing(value(valueXY), config) : linear animation with ease
   * Animated.spring(value(valueXY), config) : more physical animation
   * 함께 사용할수 있는 config options: bounceness & speed / friction & tension (spring() only)
   * Animnated 함수 뒤에 start()를 붙여야 실행됨
   *
   * useNativeDriver: true(를 기본값으로 두는게 좋음)
   * bridge를 통하지 않고 native(ios, android)를 통해 애니메이션을 실행시키도록 한다(react-render 안함)
   * 특정 style property의 경우 useNativeDriver를 false로 설정해야 사용할 수 있다.
   */
  const topLeft = Animated.timing(position, {
    toValue: {
      x: -screenWidth / 2 + 50,
      y: -screenHeight / 2 + 50,
    },
    useNativeDriver: true,
  });

  const bottomLeft = Animated.timing(position, {
    toValue: {
      x: -screenWidth / 2 + 50,
      y: screenHeight / 2 - 50,
    },
    useNativeDriver: true,
  });

  const bottomRight = Animated.timing(position, {
    toValue: {
      x: screenWidth / 2 - 50,
      y: screenHeight / 2 - 50,
    },
    useNativeDriver: true,
  });

  const topRight = Animated.timing(position, {
    toValue: {
      x: screenWidth / 2 - 50,
      y: -screenHeight / 2 + 50,
    },
    useNativeDriver: true,
  });

  const moveUp = () => {
    //Animated.sequence : 여러개의 animation을 순차적 실행
    Animated.loop(
      Animated.sequence([bottomLeft, bottomRight, topRight, topLeft])
    ).start();
  };

  /**
   * value.interpolate({inputRange: [], outputRange: []})
   * value의 값이 inputRange의 배열[index]값이 되면 outputRange의 같은 index값을 return
   */
  const borderRadius = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const rotateY = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["-350deg", "360deg"], //string의 number도 자동으로 변경해줌
  });
  const backgroundColor = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 166, 255)"], // rgb string도 변경 가능
  });

  // Animated 값의 log를 보려고 할 때는 addListener 내에서 console을 실행해야한다.
  // position.addListener(() => console.log(position));
  return (
    <Container>
      {/**
       *  View종류 이외의 컴포넌트는 애니메이션이 부드럽지 않은 경향이 있으므로
       *  Animated 컴포넌트를 pressab 컴포넌트로 감싸서 사용하기도 한다.
       */}
      <AnimatedBox
        onPress={moveUp}
        style={{
          borderRadius,
          backgroundColor,
          transform: [
            ...position.getTranslateTransform(),
            // { translateY: position.y },
            // { translateX: position.x },
            // interpolate에 의한 위치를 translate item으로 바꿔줌
            { rotateY },
          ],
        }}
      />
    </Container>
  );
}
