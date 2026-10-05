import { useRef } from 'react';
import { PanResponder, View } from 'react-native';

// Swipe left = next tab, swipe right = previous tab.
export default function SwipeTabs({ onSwipe, children }) {
  const cb = useRef(onSwipe);
  cb.current = onSwipe;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -60 || g.vx < -0.5) cb.current(1);
        else if (g.dx > 60 || g.vx > 0.5) cb.current(-1);
      },
    })
  ).current;

  return <View style={{ flex: 1 }} {...pan.panHandlers}>{children}</View>;
}