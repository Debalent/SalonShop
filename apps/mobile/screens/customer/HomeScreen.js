import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  FlatList,
  AccessibilityInfo,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  Searchbar,
  FAB,
  Banner,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';
import { useAuth } from '../../services/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, announceForAccessibility } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(150);
  const [nextReward, setNextReward] = useState(50);
  const [showBanner, setShowBanner] = useState(true);

  // Announce screen content for accessibility
  useEffect(() => {
    announceForAccessibility('Home screen loaded. Welcome to SalonShop.');
  }, []);

  // Personalized recommendations based on user history
  const recommendedServices = [
    { id: 1, name: 'Hair Color Touch-up', icon: 'palette', color: theme.colors.hair, price: '$75', reason: 'Based on your last visit' },
    { id: 2, name: 'Gel Manicure', icon: 'spa', color: theme.colors.nails, price: '$45', reason: 'Most popular this month' },
    { id: 3, name: 'Relaxing Facial', icon: 'face', color: theme.colors.facial, price: '$85', reason: 'Recommended for you' },
  ];

  const quickActions = [
    { id: 'book', title: 'Book Now', icon: 'event', color: theme.colors.primary, action: () => navigation.navigate('Booking') },
    { id: 'services', title: 'Browse Services', icon: 'spa', color: theme.colors.secondary, action: () => navigation.navigate('Services') },
    { id: 'loyalty', title: 'My Rewards', icon: 'star', color: '#FFD700', action: () => navigation.navigate('Loyalty') },
    { id: 'profile', title: 'My Profile', icon: 'person', color: theme.colors.accent, action: () => navigation.navigate('Profile') },
  ];

  const featuredTechnicians = [
    { id: 1, name: 'Sarah Johnson', specialty: 'Hair Stylist', rating: 4.9, image: null, available: true },
    { id: 2, name: 'Maria Rodriguez', specialty: 'Nail Technician', rating: 4.8, image: null, available: false },
    { id: 3, name: 'Lisa Chen', specialty: 'Massage Therapist', rating: 4.9, image: null, available: true },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: 'Hair Cut & Style',
      technician: 'Sarah Johnson',
      date: '2025-10-15',
      time: '2:00 PM',
      status: 'confirmed',
      location: 'Main Salon'
    }
  ];

  const promotions = [
    { id: 1, title: 'First-time customer discount', description: '20% off your first service', validUntil: '2025-12-31' },
    { id: 2, title: 'Loyalty bonus', description: 'Double points this weekend', validUntil: '2025-10-27' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      height: 220,
      justifyContent: 'flex-end',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    headerContent: {
      zIndex: 1,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: theme.spacing.xs,
    },
    subText: {
      fontSize: 16,
      color: '#fff',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    searchContainer: {
      marginVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    loyaltyCard: {
      marginVertical: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 2,
    },
    loyaltyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    loyaltyProgress: {
      marginTop: theme.spacing.sm,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.md,
    },
    actionCard: {
      width: '48%',
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 2,
      alignItems: 'center',
    },
    actionIcon: {
      marginBottom: theme.spacing.xs,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.text,
    },
    recommendedCard: {
      marginRight: theme.spacing.sm,
      width: 180,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 2,
    },
    recommendedReason: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    serviceCard: {
      marginRight: theme.spacing.sm,
      width: 160,
    },
    serviceIcon: {
      alignSelf: 'center',
      marginBottom: theme.spacing.xs,
    },
    servicePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    technicianCard: {
      marginRight: theme.spacing.sm,
      width: 140,
      alignItems: 'center',
    },
    technicianAvatar: {
      marginBottom: theme.spacing.xs,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    availabilityIndicator: {
      position: 'absolute',
      top: 35,
      right: 35,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#4CAF50',
      borderWidth: 2,
      borderColor: '#fff',
    },
    appointmentCard: {
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 2,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    appointmentDetails: {
      marginTop: theme.spacing.xs,
    },
    statusChip: {
      alignSelf: 'flex-start',
    },
    promotionCard: {
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
    },
    promotionTitle: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    promotionDescription: {
      color: '#fff',
      opacity: 0.9,
      fontSize: 14,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promotions Banner */}
        {showBanner && promotions.length > 0 && (
          <Banner
            visible={showBanner}
            actions={[
              {
                label: 'View All',
                onPress: () => navigation.navigate('Promotions'),
              },
              {
                label: 'Dismiss',
                onPress: () => setShowBanner(false),
              },
            ]}
            icon={({size}) => (
              <MaterialCommunityIcons name="gift" size={size} color={theme.colors.primary} />
            )}
          >
            <Text style={{ fontWeight: 'bold' }}>{promotions[0].title}</Text>
            <Text>{promotions[0].description}</Text>
          </Banner>
        )}

        {/* Hero Header */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
          style={styles.header}
          accessible={true}
          accessibilityLabel="Welcome header with salon background image"
        >
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Text
              style={styles.welcomeText}
              accessibilityRole="header"
              accessibilityLabel={`Welcome back, ${user?.firstName || 'Guest'}!`}
            >
              Welcome back, {user?.firstName || 'Guest'}!
            </Text>
            <Text
              style={styles.subText}
              accessibilityLabel="Ready to look and feel amazing?"
            >
              Ready to look and feel amazing?
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          {/* Loyalty Points Card */}
          <Card
            style={styles.loyaltyCard}
            accessible={true}
            accessibilityLabel={`Loyalty points: ${loyaltyPoints} points. ${nextReward} points until next reward.`}
            accessibilityRole="button"
            onPress={() => {
              announceForAccessibility('Opening loyalty rewards screen');
              navigation.navigate('Loyalty');
            }}
          >
            <TouchableOpacity
              style={styles.loyaltyHeader}
              onPress={() => navigation.navigate('Loyalty')}
              accessibilityLabel="Tap to view loyalty rewards"
            >
              <View>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  Loyalty Points
                </Text>
                <Text
                  variant="headlineMedium"
                  style={{ color: theme.colors.primary, fontWeight: 'bold' }}
                  accessibilityLabel={`${loyaltyPoints} loyalty points`}
                >
                  {loyaltyPoints} pts
                </Text>
              </View>
              <MaterialCommunityIcons
                name="crown"
                size={32}
                color="#FFD700"
                accessibilityLabel="Crown icon for loyalty program"
              />
            </TouchableOpacity>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurface, marginBottom: theme.spacing.sm }}
              accessibilityLabel={`${nextReward} points until your next reward`}
            >
              {nextReward} points until your next reward!
            </Text>
            <ProgressBar
              progress={(loyaltyPoints % 200) / 200}
              color={theme.colors.primary}
              style={styles.loyaltyProgress}
              accessible={true}
              accessibilityLabel={`Progress: ${Math.round(((loyaltyPoints % 200) / 200) * 100)}% to next reward`}
            />
            <Text style={styles.progressText}>
              {200 - (loyaltyPoints % 200)} points to next reward
            </Text>
          </Card>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search services, stylists..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{ backgroundColor: theme.colors.surface }}
            />
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.action}
              >
                <MaterialIcons
                  name={action.icon}
                  size={28}
                  color={action.color}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recommended For You */}
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
              >
                <Card style={styles.recommendedCard}>
                  <Card.Content>
                    <Text style={styles.recommendedReason}>{service.reason}</Text>
                    <Avatar.Icon
                      size={40}
                      icon={service.icon}
                      style={[styles.serviceIcon, { backgroundColor: service.color }]}
                    />
                    <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: theme.spacing.xs, fontWeight: 'bold' }}>
                      {service.name}
                    </Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} style={styles.appointmentCard}>
                  <Card.Content>
                    <View style={styles.appointmentHeader}>
                      <Text variant="headlineSmall">{appointment.service}</Text>
                      <Chip
                        style={[styles.statusChip, { backgroundColor: theme.colors.primary }]}
                        textStyle={{ color: '#fff' }}
                      >
                        {appointment.status}
                      </Chip>
                    </View>
                    <View style={styles.appointmentDetails}>
                      <Text>with {appointment.technician} • {appointment.location}</Text>
                      <Text>{appointment.date} at {appointment.time}</Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </>
          )}

          {/* Featured Technicians */}
          <Text style={styles.sectionTitle}>Available Today</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTechnicians.map((tech) => (
              <TouchableOpacity
                key={tech.id}
                onPress={() => navigation.navigate('TechnicianProfile', { technicianId: tech.id })}
              >
                <Card style={styles.technicianCard}>
                  <Card.Content>
                    <View>
                      <Avatar.Text
                        size={60}
                        label={tech.name.split(' ').map(n => n[0]).join('')}
                        style={styles.technicianAvatar}
                      />
                      {tech.available && <View style={styles.availabilityIndicator} />}
                    </View>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {tech.name}
                    </Text>
                    <Text variant="bodySmall" style={{ textAlign: 'center' }}>
                      {tech.specialty}
                    </Text>
                    <View style={styles.rating}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text variant="bodySmall" style={{ marginLeft: 4 }}>
                        {tech.rating}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('QuickBook')}
        color="#fff"
      />
    </View>
  );
};

export default HomeScreen;