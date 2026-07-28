import React from "react";
import { View, Text } from "react-native";
import { styles } from "./SectionCard.styles";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <View style={styles.sectionCard}>
      {title && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}
