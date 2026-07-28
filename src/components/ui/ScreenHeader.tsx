import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ScreenHeader.styles";

type Props = {
  title: string;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
};

export function ScreenHeader({ title, rightIcon, onRightPress }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {rightIcon && (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <MaterialIcons name={rightIcon} size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
