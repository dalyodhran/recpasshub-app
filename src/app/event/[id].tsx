import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { styles } from "@/styles/event-details.styles";
import { Colors } from "@/constants/BoldBlueTheme";
import TopAppBar from "@/components/ui/TopAppBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestionBtn}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{question}</Text>
        <MaterialIcons
          name="expand-more"
          size={24}
          color={Colors.onSurfaceVariant}
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function EventDetailsScreen() {
  const { id, registered } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const isRegistered = registered === 'true';

  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.title}>Event Not Found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary, marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ paddingTop: insets.top, backgroundColor: Colors.primary }}>
        <TopAppBar 
          title="Rec Pass Hub" 
          showBackButton={true} 
          onBackPress={() => router.back()} 
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Map Snapshot */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
          <View style={styles.gradientOverlay} />
        </View>

        <View style={styles.contentContainer}>
          {/* Event Header */}
          <View style={styles.headerCard}>
            <View style={styles.badgesRow}>
              <View style={styles.sportBadge}>
                <Text style={styles.sportBadgeText}>{event.sport}</Text>
              </View>
              {isRegistered && (
                <View style={styles.joinedBadge}>
                  <MaterialIcons name="check-circle" size={14} color={Colors.onTertiaryContainer} />
                  <Text style={styles.joinedBadgeText}>Joined</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.metaRow}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={Colors.outline}
              />
              <Text style={styles.metaText}>
                {event.date} • {event.time}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={Colors.outline}
              />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View>
            <Text style={styles.sectionTitle}>Event Details</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons
                    name="straighten"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{event.distance}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons
                    name="trending-up"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.statLabel}>Elevation</Text>
                <Text style={styles.statValue}>{event.elevation}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons
                    name="timer"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.statLabel}>Target Pace</Text>
                <Text style={styles.statValue}>{event.targetPace}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialIcons
                    name="group"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.statLabel}>Capacity</Text>
                <Text style={styles.statValue}>{event.capacity}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{event.about}</Text>
          </View>

          {/* FAQs Accordion */}
          <View>
            <Text style={styles.sectionTitle}>FAQs</Text>
            <View style={styles.faqsContainer}>
              {event.faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {isRegistered && (
          <View style={styles.sponsorBanner}>
            <View style={styles.sponsorLeft}>
              <View style={styles.sponsorIcon}>
                <MaterialIcons
                  name="storefront"
                  size={24}
                  color={Colors.onPrimary}
                />
              </View>
              <View>
                <Text style={styles.sponsorLabel}>Local Sponsor</Text>
                <Text style={styles.sponsorName}>Athletics Co. Downtown</Text>
              </View>
            </View>
            <Text style={styles.sponsorLink}>View Offer</Text>
          </View>
        )}

        <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
          {isRegistered ? (
            <>
              <MaterialIcons name="chat" size={20} color={Colors.onPrimary} />
              <Text style={styles.joinButtonText}>Message Organizer</Text>
            </>
          ) : (
            <Text style={styles.joinButtonText}>Join & Sign Waiver ($15)</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
