import { loadEventById } from "@/api/event/eventService";
import { resolveDisplayLocation } from "@/api/map/mapService";
import { EventHeroMap } from "@/components/EventHeroMap";
import TopAppBar from "@/components/ui/TopAppBar";
import { Colors } from "@/constants/BoldBlueTheme";
import { myPassIds } from "@/data/mockEvents";
import type { EventData } from "@/data/mockEvents";
import { toEventData } from "@/models/eventDisplay";
import { styles } from "@/styles/event-details.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { isAxiosError } from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";

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

type FetchStatus = "loading" | "success" | "not_found" | "error";

export default function EventDetailsScreen() {
  const { id, registered } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const eventId = typeof id === "string" ? id : undefined;

  const [event, setEvent] = useState<EventData | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");

  // Real app would fetch this from a user profile or context
  // Here we use our mock global state for true dynamic updates
  const isRegisteredParam = registered === "true";
  const isRegistered =
    isAuthenticated &&
    ((typeof id === "string" && myPassIds.has(id)) || isRegisteredParam);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setFetchStatus("not_found");
      return;
    }
    setFetchStatus("loading");
    try {
      const eventModel = await loadEventById(eventId);
      const eventData = toEventData(eventModel);
      try {
        eventData.location = await resolveDisplayLocation(eventData.location);
      } catch (err) {
        // Keep the raw "lat, lon" string if reverse geocoding fails.
        console.error("Failed to resolve event location:", err);
      }
      setEvent(eventData);
      setFetchStatus("success");
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setFetchStatus("not_found");
      } else {
        console.error("Failed to load event:", err);
        setFetchStatus("error");
      }
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (fetchStatus === "loading") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (fetchStatus === "error") {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
        ]}
      >
        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={[styles.metaText, { textAlign: "center" }]}>
          We were unable to load this event. Check your connection and try
          again.
        </Text>
        <TouchableOpacity onPress={fetchEvent}>
          <Text style={{ color: Colors.primary, marginTop: 16 }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (fetchStatus === "not_found" || !event) {
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
          <EventHeroMap s3FileLocation={event.s3FileLocation} />
          <View style={styles.gradientOverlay} pointerEvents="none" />
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
                  <MaterialIcons
                    name="check-circle"
                    size={14}
                    color={Colors.onTertiaryContainer}
                  />
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
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
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

        <TouchableOpacity
          style={styles.joinButton}
          activeOpacity={0.8}
          onPress={() => {
            if (!isAuthenticated) {
              // Browsing is open to guests; joining needs an account
              router.push({
                pathname: "/login",
                params: { returnTo: `/event/${id}` },
              });
            } else if (isRegistered) {
              router.push(`/event/message/${id}`);
            } else {
              router.push(`/event/checkout/${id}`);
            }
          }}
        >
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
