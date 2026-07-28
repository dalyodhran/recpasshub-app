import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';

import { Colors } from '@/constants/BoldBlueTheme';
import { styles } from '@/styles/checkout.styles';
import TopAppBar from '@/components/ui/TopAppBar';
import { addPass } from '@/data/mockEvents';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [agreed, setAgreed] = useState(false);

  const handlePay = () => {
    if (agreed && typeof id === 'string') {
      addPass(id);
      router.replace('/(tabs)/mypass');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={{ paddingTop: insets.top, backgroundColor: Colors.primary }}>
        <TopAppBar 
          title="Rec Pass Hub" 
          showBackButton 
          onBackPress={() => router.back()}
        />
      </View>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Waiver & Release</Text>
          <Text style={styles.subtitle}>Please read and sign before completing your purchase.</Text>
        </View>

        <View style={styles.waiverBoxContainer}>
          <ScrollView style={styles.waiverBox} showsVerticalScrollIndicator={true}>
            <View style={styles.waiverContent}>
              <Text style={styles.waiverTextBold}>
                RELEASE OF LIABILITY, WAIVER OF CLAIMS AND ASSUMPTION OF RISKS AGREEMENT
              </Text>
              <Text style={styles.waiverText}>
                BY SIGNING THIS DOCUMENT YOU WILL WAIVE CERTAIN LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE OR CLAIM COMPENSATION FOLLOWING AN ACCIDENT. PLEASE READ CAREFULLY!
              </Text>
              <Text style={styles.waiverText}>
                I am aware that participating in activities at Club Endurance involves many risks, dangers, and hazards including, but not limited to: physical exertion for which I may not be prepared; slips and falls; the possibility of serious physical and/or mental trauma or injury, or death associated with participating in fitness activities.
              </Text>
              <Text style={styles.waiverText}>
                In consideration of Club Endurance allowing me to participate in activities and permitting my use of their equipment and facilities, I hereby agree as follows:
              </Text>
              <Text style={styles.waiverText}>
                1. TO WAIVE ANY AND ALL CLAIMS that I have or may in the future have against Club Endurance and its directors, officers, employees, guides, agents, independent contractors, and representatives.
              </Text>
              <Text style={styles.waiverText}>
                2. TO RELEASE THE RELEASEES from any and all liability for any loss, damage, injury or expense that I may suffer, or that my next of kin may suffer, as a result of my participation in activities at Club Endurance, due to any cause whatsoever.
              </Text>
              <Text style={styles.waiverText}>
                I CONFIRM THAT I HAVE READ AND UNDERSTOOD THIS RELEASE AGREEMENT PRIOR TO SIGNING IT, AND I AM AWARE THAT BY SIGNING THIS RELEASE AGREEMENT I AM WAIVING CERTAIN LEGAL RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, ADMINISTRATORS, ASSIGNS AND REPRESENTATIVES MAY HAVE AGAINST THE RELEASEES.
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>Signature</Text>
          <View style={styles.signaturePad}>
            <Text style={styles.signaturePlaceholder}>Sign here</Text>
          </View>
          <View style={styles.signatureControls}>
            <TouchableOpacity>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={agreed}
                onValueChange={setAgreed}
                color={agreed ? Colors.primary : undefined}
              />
              <Text style={styles.checkboxText}>I agree to the terms above</Text>
            </View>
          </View>
        </View>

        <View style={styles.checkoutSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>$29.00</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.payButton, !agreed && styles.payButtonDisabled]}
            disabled={!agreed}
            onPress={handlePay}
            activeOpacity={0.8}
          >
            <MaterialIcons name="lock" size={20} color={Colors.onPrimary} />
            <Text style={styles.payButtonText}>Pay & Complete</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
