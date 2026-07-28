import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/BoldBlueTheme';
import { styles } from '@/styles/pass.styles';
import { MOCK_EVENTS } from '@/data/mockEvents';

export default function DigitalPassScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const event = MOCK_EVENTS.find((e) => e.id === id);
  
  // Scanner animation
  const [scanAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [scanAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 192], // height of QR container
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.successIconContainer}>
          <MaterialIcons name="check-circle" size={32} color={Colors.primary} />
        </View>
        
        <Text style={styles.headerTitle}>Rec Pass Hub</Text>
        <Text style={styles.headerSubtitle}>Your registration is confirmed</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Pass Card */}
        <View style={styles.passCard}>
          {/* Top Section */}
          <View style={styles.passTopSection}>
            <View style={styles.cutoutLeft} />
            <View style={styles.cutoutRight} />
            
            <Text style={styles.passEventTitle}>{event?.title || 'Unknown Event'}</Text>
            <Text style={styles.passVipLabel}>VIP Entry</Text>
            
            <View style={styles.dateTimeRow}>
              <View style={styles.dtColumn}>
                <Text style={styles.dtLabel}>Date</Text>
                <Text style={styles.dtValue}>{event?.date || 'TBD'}</Text>
              </View>
              <View style={[styles.dtColumn, styles.dtColumnRight]}>
                <Text style={styles.dtLabel}>Time</Text>
                <Text style={styles.dtValue}>{event?.time || 'TBD'}</Text>
              </View>
            </View>
          </View>
          
          {/* Bottom Section (QR) */}
          <View style={styles.passBottomSection}>
            <View style={styles.qrCodeBox}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuN1LYw58O7qneRJnLblweKA3J9tGdMCy6iSFbGzn3VmKrNGk27d-VU9ZrpbFxjv_4KxUoefjLjKGSQwUVapY-2RSyQ9_HYp40Y_jz_MDIwz33kp0ZrtzquPs3icvthECEYEr4UwSPYb-xCkLf8kvECtC7nKEP2iqXWnpes08bZaw34uQCNPd26n88gb2fkoROcY2oGfHvcCa1yFdObDz5gzrIf_jozpjpPgq6QYTa7QgrXrU0xBQqDg' }} 
                style={styles.qrCodeImage} 
              />
              <Animated.View style={[styles.qrScannerLine, { transform: [{ translateY }] }]} />
            </View>
            <Text style={styles.passIdText}>ID: PSR-992-XYZ</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <MaterialIcons name="add-to-home-screen" size={24} color={Colors.onPrimary} />
            <Text style={styles.primaryBtnText}>Add to Apple Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <MaterialIcons name="download" size={24} color={Colors.primary} />
            <Text style={styles.secondaryBtnText}>Download GPX Route</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Sponsored By</Text>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMfiazWwVc6Tg5t768KJl7r_Ws-7acAlgzWvpI_ofyVCh2AN-aIZe3P2RIW8WD57YrPqqdp-r1PdylUn0OBRcjB0ZwIsZRf-mcKfu2_XvIxUhqtLdVFu4ugOl_AkDpmDUuaB-XQm6RE5EjhvYPlnzBWH-i6v-MAxWT3ZBojKquZgeDrxPuQCUP7AXvqfG5LWDJ5v07egfNMCa5j4Oj1KW2PfyZv7bI66Oka_So-Jztgc7mSImmjVmAQA' }}
            style={styles.sponsorImage}
          />
        </View>
      </ScrollView>
    </View>
  );
}
