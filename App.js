import React, { useRef, useState } from "react";
import { PanResponder, View, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import icons from "./icons";

const BLACK = "#1e272e";
const GRAY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK};
`;

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  justify-content: center;
  align-items: center;
  background-color: ${GRAY};
  border-radius: 50px;
  width: 100px;
  height: 100px;
`;

const Word = styled.Text`
  font-size: 36px;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 8px 10px;
  border-radius: 10px;
  z-index: 10;
`;

export default function App() {
  //Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -70], //작은 숫자가 앞에
    outputRange: [2, 1],
    extrapolate: "clamp", //input 범위내에서만 변화
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [70, 300],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });

  //States
  const [index, setIndex] = useState(0);

  const nextIcon = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    setIndex((prev) => prev + 1);
  };

  //Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: 0, // = {x: 0, y: 0}
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true,
    easing: Easing.linear,
    duration: 100,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 100,
    useNativeDriver: true,
    easing: Easing.linear,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, //터치를 감지할지 여부
      onPanResponderGrant: () => {
        //터치가 시작될 때
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        //터치한 채 움직일 때
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dy }) => {
        //터치가 종료될 때
        if (dy < -230 || dy > 230) {
          // Animated.sequence = start(callback)

          Animated.sequence([
            Animated.parallel([onDropOpacity, onDropScale]),
            //parallel / timing 을 animate[]안에 넣을 수 있음
            Animated.timing(position, {
              toValue: 0,
              useNativeDriver: true,
              duration: 100,
              easing: Easing.linear,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    })
  ).current;

  return (
    <Container>
      <Edge>
        <WordContainer
          style={{
            transform: [{ scale: scaleOne }],
          }}
        >
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          //panRespondere를 사용하기 위해 Animate 할 컴포넌트에 handler 넘겨주기
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GRAY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
