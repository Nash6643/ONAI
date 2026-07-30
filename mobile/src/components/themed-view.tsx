import React from 'react';
import { View, ViewProps } from 'react-native';
import { Colors } from '../constants/theme';
import { useTheme } from '../hooks/use-theme'; 

interface ThemedViewProps extends ViewProps {
  type?: 'background' | 'card' | 'primary';
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ style, type = 'background', ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  // Safely fallback to our theme constant if theme hook returns undefined
  const backgroundColor = theme?.[type] ?? Colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}