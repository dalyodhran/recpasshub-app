import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from '@/styles/FilterChip.styles';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function FilterChip({
  label,
  isActive,
  onPress,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          isActive ? styles.activeText : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
