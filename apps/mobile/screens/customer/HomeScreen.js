import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';
import { useAuth } from '../../services/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const popularServices = [
    { id: 1, name: 'Manicure & Pedicure', icon: 'spa', color: theme.colors.nails, price: '$45' },
    { id: 2, name: 'Hair Cut & Style', icon: 'content-cut', color: theme.colors.hair, price: '$65' },
    { id: 3, name: 'Deep Tissue Massage', icon: 'healing', color: theme.colors.massage, price: '$90' },
    { id: 4, name: 'Eyebrow Shaping', icon: 'face-retouching-natural', color: theme.colors.primary, price: '$25' },
  ];

  const featuredTechnicians = [
    { id: 1, name: 'Sarah Johnson', specialty: 'Hair Stylist', rating: 4.9, image: null },
    { id: 2, name: 'Maria Rodriguez', specialty: 'Nail Technician', rating: 4.8, image: null },
    { id: 3, name: 'Lisa Chen', specialty: 'Massage Therapist', rating: 4.9, image: null },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: 'Hair Cut',
      technician: 'Sarah Johnson',
      date: '2025-10-15',
      time: '2:00 PM',
      status: 'confirmed'
    }
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      height: 200,
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
    appointmentCard: {
      marginBottom: theme.spacing.sm,
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
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: theme.spacing.lg,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
        style={styles.header}
      >
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.firstName || 'Guest'}!
          </Text>
          <Text style={styles.subText}>
            Ready to look and feel amazing?
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search services, stylists..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Booking')}
            icon="event"
          >
            Book Now
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Services')}
            icon="spa"
          >
            View Services
          </Button>
        </View>

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
                      style={[styles.statusChip, { backgroundColor: theme.colors.confirmed }]}
                      textStyle={{ color: '#fff' }}
                    >
                      {appointment.status}
                    </Chip>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text>with {appointment.technician}</Text>
                    <Text>{appointment.date} at {appointment.time}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {/* Popular Services */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularServices.map((service) => (
            <Card key={service.id} style={styles.serviceCard}>
              <Card.Content style={{ alignItems: 'center' }}>
                <Avatar.Icon
                  size={50}
                  icon={service.icon}
                  style={[styles.serviceIcon, { backgroundColor: service.color }]}
                />
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: theme.spacing.xs }}>
                  {service.name}
                </Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Featured Technicians */}
        <Text style={styles.sectionTitle}>Featured Technicians</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredTechnicians.map((tech) => (
            <Card
              key={tech.id}
              style={styles.technicianCard}
              onPress={() => navigation.navigate('TechnicianProfile', { technicianId: tech.id })}
            >
              <Card.Content>
                <Avatar.Text
                  size={60}
                  label={tech.name.split(' ').map(n => n[0]).join('')}
                  style={styles.technicianAvatar}
                />
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
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;