import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/BoldBlueTheme";
import { styles } from '@/styles/TopAppBar.styles';

interface TopAppBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function TopAppBar({ title, showBackButton, onBackPress }: TopAppBarProps) {
  return (
    <View style={styles.header}>
      {/* Conditionally render back button or placeholder */}
      {showBackButton ? (
        <TouchableOpacity style={styles.iconButton} onPress={onBackPress} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButtonPlaceholder} />
      )}

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
