import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from '@/styles/TopAppBar.styles';

interface TopAppBarProps {
  title: string;
}

export default function TopAppBar({ title }: TopAppBarProps) {
  return (
    <View style={styles.header}>
      {/* Invisible placeholder for symmetry if we had a back button */}
      <View style={styles.iconButtonPlaceholder} />

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <MaterialIcons
          name="notifications"
          size={24}
          color={Colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}
