import { useRef } from 'react';
import { Animated, Dimensions, Easing, PanResponder } from 'react-native';

const W = Dimensions.get('window').width;

// Drag from the left edge to the right to go back.
export default function SwipeBack({ onBack, edge = 60, children }) {
  const x = useRef(new Animated.Value(0)).current;
  const backRef = useRef(onBack);
  backRef.current = onBack;

  const reset = () =>
    Animated.spring(x, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();

  const pan = useRef(
    PanResponder.create({
      // Only claim the gesture if it starts near the left edge and is mostly horizontal
      onMoveShouldSetPanResponder: (e, g) =>
        e.nativeEvent.pageX - g.dx < edge && g.dx > 12 && g.dx > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => x.setValue(Math.max(0, g.dx)),
      onPanResponderRelease: (_, g) => {
        if (g.dx > W * 0.35 || g.vx > 0.6) {
          Animated.timing(x, {
            toValue: W,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => backRef.current?.());
        } else {
          reset();
        }
      },
      onPanResponderTerminate: reset,
    })
  ).current;

  return (
    <Animated.View
      {...pan.panHandlers}
      style={{ flex: 1, backgroundColor: '#080A1C', transform: [{ translateX: x }] }}
    >
      {children}
    </Animated.View>
  );
}