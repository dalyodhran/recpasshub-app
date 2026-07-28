import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '@/components/ui/TopAppBar';
import { Colors } from '@/constants/BoldBlueTheme';
import { styles } from '@/styles/mypass.styles';

export default function MyPassScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

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

        {/* Passes List (Mocked) */}
        <View style={styles.cardsContainer}>
          
          {/* Active Pass Card */}
          <View style={[styles.passCard, styles.passCardActiveBorder]}>
            <View style={styles.passCardTop}>
              <View>
                <Text style={styles.passDate}>Oct 24, 2023 • 6:00 AM</Text>
                <Text style={styles.passTitle}>Golden Gate Sunrise 10K</Text>
                <View style={styles.passLocationRow}>
                  <MaterialIcons name="location-on" size={16} color={Colors.primary} />
                  <Text style={styles.passLocation}>San Francisco, CA</Text>
                </View>
              </View>
              <View style={styles.badgeActive}>
                {/* Simplified pulse dot for react native without reanimated */}
                <View style={styles.badgeActiveDot} />
                <Text style={styles.badgeActiveText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.passCardBottom}>
              <View>
                <Text style={styles.bibLabel}>Bib Number</Text>
                <Text style={styles.bibNumber}>#4092</Text>
              </View>
              <TouchableOpacity style={styles.btnActive} activeOpacity={0.8}>
                <Text style={styles.btnActiveText}>View Details</Text>
                <MaterialIcons name="arrow-forward" size={18} color={Colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Registered Pass Card */}
          <View style={styles.passCard}>
            <View style={styles.passCardTop}>
              <View>
                <Text style={styles.passDate}>Nov 12, 2023 • 8:00 AM</Text>
                <Text style={styles.passTitle}>Marin Headlands Half</Text>
                <View style={styles.passLocationRow}>
                  <MaterialIcons name="location-on" size={16} color={Colors.primary} />
                  <Text style={styles.passLocation}>Sausalito, CA</Text>
                </View>
              </View>
              <View style={styles.badgeRegistered}>
                <Text style={styles.badgeRegisteredText}>Registered</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.passCardBottom}>
              <View>
                <Text style={styles.bibLabel}>Bib Number</Text>
                <Text style={[styles.bibNumber, styles.bibPending]}>Pending</Text>
              </View>
              <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
                <Text style={styles.btnSecondaryText}>View Details</Text>
                <MaterialIcons name="arrow-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </View>
  );
}
