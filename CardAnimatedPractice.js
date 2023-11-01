import React, { useRef, useState } from "react";
import { PanResponder, View } from "react-native";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import icons from "./icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: turquoise;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
  position: absolute;
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
`;
const BtnContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;
const Btn = styled.TouchableOpacity`
  margin: 0 10px;
`;

export default function App() {
  const position = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const rotatinon = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
    extrapolate: "clamp",
    //값이 inputRange를 벗어났을 경우 처리하는 옵션(clamp: 기존값 내에서 멈춤)
  });

  //animated 함수형 정의
  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

  //animated 변수형 정의
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    //spring 특성 상 애니메이션이 멈추기까지 시간이 더 소요되므로
    //임의로 애니메이션을 종료할 시간을 더 빠르게 설정
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn(), //함수여서 실행시켜줘야 animated가 return됨
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -220) {
          goLeft.start(onDismiss);
        } else if (dx > 220) {
          goRight.start(onDismiss);
        } else {
          //parallel : 동시에 진행되는 animated배열
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
    })
  ).current;

  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    position.setValue(0);
    scale.setValue(1);
    setIndex((prev) => prev + 1);
  };

  const pressClose = () => {
    goLeft.start(onDismiss);
  };
  const pressCheck = () => {
    goRight.start(onDismiss);
  };

  return (
    <Container>
      <CardContainer>
        {/* box-shadow : android 는 view에 직접 elevation옵션으로 추가 */}
        <Card elevation={10} style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name={icons[index + 1]} color="#192a56" size={100} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          elevation={10}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotatinon },
            ],
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={100} />
        </Card>
      </CardContainer>

      <BtnContainer>
        <Btn onPress={pressClose} activeOpacity={0.8}>
          <Ionicons name="close-circle" color="white" size={50} />
        </Btn>
        <Btn onPress={pressCheck} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" color="white" size={50} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
