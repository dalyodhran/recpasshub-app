import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '@/components/ui/TopAppBar';
import { Colors } from '@/constants/BoldBlueTheme';
import { styles } from '@/styles/mypass.styles';
import { getMyPasses, EventData } from '@/data/mockEvents';

export default function MyPassScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [passes, setPasses] = useState<EventData[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setPasses(getMyPasses());
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top, backgroundColor: Colors.primary }}>
        <TopAppBar title="Rec Pass Hub" />
      </View>

      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Passes</Text>
          <Text style={styles.subtitle}>Manage your event registrations.</Text>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[
              styles.segmentButton, 
              activeTab === 'Upcoming' && styles.segmentButtonActive
            ]}
            onPress={() => setActiveTab('Upcoming')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.segmentText,
              activeTab === 'Upcoming' && styles.segmentTextActive
            ]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.segmentButton, 
              activeTab === 'Past' && styles.segmentButtonActive
            ]}
            onPress={() => setActiveTab('Past')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.segmentText,
              activeTab === 'Past' && styles.segmentTextActive
            ]}>Past</Text>
          </TouchableOpacity>
        </View>

        {/* Passes List */}
        <View style={styles.cardsContainer}>
          {passes.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.onSurfaceVariant, marginTop: 24 }}>
              No passes found. Go explore and join some events!
            </Text>
          ) : (
            passes.map((pass, index) => {
              // We'll mock the first pass as "Active" (today) just for the UI showcase, 
              // and the rest as "Registered"
              const isActive = index === 0;

              return (
                <View 
                  key={pass.id} 
                  style={[styles.passCard, isActive && styles.passCardActiveBorder]}
                >
                  <View style={styles.passCardTop}>
                    <View>
                      <Text style={styles.passDate}>{pass.date} • {pass.time}</Text>
                      <Text style={styles.passTitle}>{pass.title}</Text>
                      <View style={styles.passLocationRow}>
                        <MaterialIcons name="location-on" size={16} color={Colors.primary} />
                        <Text style={styles.passLocation}>{pass.location}</Text>
                      </View>
                    </View>
                    
                    {isActive ? (
                      <View style={styles.badgeActive}>
                        <View style={styles.badgeActiveDot} />
                        <Text style={styles.badgeActiveText}>Active</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeRegistered}>
                        <Text style={styles.badgeRegisteredText}>Registered</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.passCardBottom}>
                    <View>
                      <Text style={styles.bibLabel}>Bib Number</Text>
                      {isActive ? (
                        <Text style={styles.bibNumber}>#4092</Text>
                      ) : (
                        <Text style={[styles.bibNumber, styles.bibPending]}>Pending</Text>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={isActive ? styles.btnActive : styles.btnSecondary} 
                      onPress={() => router.push(`/event/${pass.id}`)} 
                      activeOpacity={0.8}
                    >
                      <Text style={isActive ? styles.btnActiveText : styles.btnSecondaryText}>
                        View Details
                      </Text>
                      <MaterialIcons 
                        name="arrow-forward" 
                        size={18} 
                        color={isActive ? Colors.onPrimary : Colors.primary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
