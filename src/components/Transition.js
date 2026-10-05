import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

// Cross-fades and slides between views.
//   viewKey   : changes when the view changes (like the current screen name)
//   direction : 1 = new view comes from the right, -1 = from the left, 0 = fade only
//   distance  : how far the views slide, in pixels
// The parent must be a View with flex: 1 (this fills it).
export default function Transition({ viewKey, direction = 1, distance = 40, duration = 280, children }) {
  const progress = useRef(new Animated.Value(1)).current;
  const st = useRef({ key: viewKey, active: 0, slots: [null, null], dir: direction, node: children, leaving: null });
  const [, force] = useState(0);

  // When the key changes, keep the old view alive in the other slot so it can fade out.
  const s = st.current;
  if (s.key !== viewKey) {
    const leaving = s.active;
    s.slots = [null, null];
    s.slots[leaving] = s.node;
    s.active = 1 - leaving;
    s.key = viewKey;
    s.dir = direction;
    s.leaving = leaving;
    progress.setValue(0);
  }
  s.node = children;

  useLayoutEffect(() => {
    if (s.leaving === null) return;
    const leaving = s.leaving;
    s.leaving = null;
    Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && st.current.slots[leaving]) {
        st.current.slots[leaving] = null;
        force((n) => n + 1);
      }
    });
  });

  return (
    <>
      {[0, 1].map((i) => {
        const isActive = i === s.active;
        const frozen = s.slots[i];
        if (!isActive && !frozen) return null;

        const style = isActive
          ? {
              opacity: progress,
              transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [s.dir * distance, 0] }) }],
            }
          : {
              opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -s.dir * distance * 0.5] }) }],
            };

        return (
          <Animated.View key={i} pointerEvents={isActive ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, style]}>
            {isActive ? children : frozen}
          </Animated.View>
        );
      })}
    </>
  );
}

// Fades and slides content up when it first appears.
export function FadeIn({ children, distance = 14, duration = 260, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}