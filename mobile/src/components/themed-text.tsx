import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';
import { useTheme } from '../hooks/use-theme'; // adjust path if needed

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'small' | 'subtitle';
  themeColor?: keyof typeof Colors;
}

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  ...otherProps
}: ThemedTextProps) {
  const theme = useTheme();

  // Safely fallback to Colors.text if theme is undefined or missing the key
  const color = theme?.[themeColor ?? 'text'] ?? Colors.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
});