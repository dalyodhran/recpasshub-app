import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './ListItem.styles';

type Props = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  hideDivider?: boolean;
};

export function ListItem({ 
  icon, 
  title, 
  rightElement, 
  onPress, 
  showChevron, 
  destructive,
  hideDivider 
}: Props) {
  const content = (
    <>
      <View style={[styles.listItem, !onPress && { opacity: 1 }]}>
        <View style={styles.listItemLeft}>
          {icon && (
            <View style={styles.listIconContainer}>
              <MaterialIcons name={icon} size={20} color={destructive ? '#ba1a1a' : '#54647a'} />
            </View>
          )}
          <Text style={[styles.listItemText, destructive && styles.destructiveText]}>
            {title}
          </Text>
        </View>
        <View style={styles.listItemRightContent}>
          {rightElement}
          {showChevron && <MaterialIcons name="chevron-right" size={24} color="#727785" />}
        </View>
      </View>
      {!hideDivider && <View style={styles.divider} />}
    </>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  ) : (
    <View>{content}</View>
  );
}
