import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_EVENTS } from '@/data/mockEvents';
import { Colors } from '@/constants/BoldBlueTheme';
import { styles } from '@/styles/message.styles';

export default function DirectMessageScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const event = MOCK_EVENTS.find((e) => e.id === id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {event?.title || 'Loading...'}
          </Text>
          <Text style={styles.headerSubtitle}>Event Organizer</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.messageListContent} showsVerticalScrollIndicator={false}>
          {/* Date Separator */}
          <View style={styles.dateSeparatorContainer}>
            <View style={styles.dateSeparator}>
              <Text style={styles.dateSeparatorText}>Today</Text>
            </View>
          </View>

          {/* Received Message */}
          <View style={[styles.messageRow, styles.messageRowReceived]}>
            <View style={[styles.bubble, styles.bubbleReceived]}>
              <Text style={styles.bubbleTextReceived}>
                Hi there! Just checking in to see if you have any questions about the upcoming Youth Basketball League practice?
              </Text>
            </View>
            <Text style={styles.timestampReceived}>10:15 AM</Text>
          </View>

          {/* Sent Message */}
          <View style={[styles.messageRow, styles.messageRowSent]}>
            <View style={[styles.bubble, styles.bubbleSent]}>
              <Text style={styles.bubbleTextSent}>
                Hi Coach! Yes, I was wondering if we need to bring our own basketballs or if they are provided?
              </Text>
            </View>
            <Text style={styles.timestampSent}>10:20 AM</Text>
          </View>

          {/* Received Message */}
          <View style={[styles.messageRow, styles.messageRowReceived]}>
            <View style={[styles.bubble, styles.bubbleReceived]}>
              <Text style={styles.bubbleTextReceived}>
                We provide the balls for practice, but feel free to bring your own if you&apos;d like to warm up with it!
              </Text>
            </View>
            <Text style={styles.timestampReceived}>10:22 AM</Text>
          </View>

          {/* Sent Message */}
          <View style={[styles.messageRow, styles.messageRowSent]}>
            <View style={[styles.bubble, styles.bubbleSent]}>
              <Text style={styles.bubbleTextSent}>
                Great, thanks! See you there.
              </Text>
            </View>
            <Text style={styles.timestampSent}>10:25 AM</Text>
          </View>
        </ScrollView>

        {/* Bottom Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <TouchableOpacity style={styles.addIconContainer}>
            <MaterialIcons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.onSurfaceVariant}
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <MaterialIcons name="send" size={20} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
