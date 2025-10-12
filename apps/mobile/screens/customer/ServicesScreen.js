import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  Searchbar,
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';

const ServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories = [
    { value: 'all', label: 'All Services', icon: 'spa' },
    { value: 'nails', label: 'Nails', icon: 'palette' },
    { value: 'hair', label: 'Hair', icon: 'content-cut' },
    { value: 'massage', label: 'Massage', icon: 'healing' },
    { value: 'facial', label: 'Facial', icon: 'face' },
    { value: 'waxing', label: 'Waxing', icon: 'spa' },
  ];

  const services = [
    {
      id: 1,
      name: 'Classic Manicure',
      category: 'nails',
      price: 35,
      duration: 45,
      description: 'Traditional manicure with cuticle care, shaping, and polish',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      popular: true,
    },
    {
      id: 2,
      name: 'Gel Manicure',
      category: 'nails',
      price: 45,
      duration: 60,
      description: 'Long-lasting gel polish manicure with UV curing',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      popular: true,
    },
    {
      id: 3,
      name: 'Haircut & Style',
      category: 'hair',
      price: 65,
      duration: 90,
      description: 'Professional haircut with wash, cut, and styling',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      popular: true,
    },
    {
      id: 4,
      name: 'Hair Color & Highlights',
      category: 'hair',
      price: 120,
      duration: 180,
      description: 'Full color service with professional grade products',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      popular: false,
    },
    {
      id: 5,
      name: 'Deep Tissue Massage',
      category: 'massage',
      price: 90,
      duration: 60,
      description: 'Therapeutic massage targeting muscle tension and knots',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      popular: true,
    },
    {
      id: 6,
      name: 'Relaxing Swedish Massage',
      category: 'massage',
      price: 80,
      duration: 60,
      description: 'Gentle, flowing massage for relaxation and stress relief',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.6,
      popular: false,
    },
    {
      id: 7,
      name: 'European Facial',
      category: 'facial',
      price: 75,
      duration: 75,
      description: 'Deep cleansing facial with extraction and moisturizing',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      popular: false,
    },
    {
      id: 8,
      name: 'Anti-Aging Facial',
      category: 'facial',
      price: 95,
      duration: 90,
      description: 'Advanced facial targeting fine lines and skin rejuvenation',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      popular: true,
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getServiceIcon = (category) => {
    const categoryMap = {
      nails: 'palette',
      hair: 'content-cut',
      massage: 'healing',
      facial: 'face',
      waxing: 'spa',
    };
    return categoryMap[category] || 'spa';
  };

  const getServiceColor = (category) => {
    const colorMap = {
      nails: theme.colors.nails,
      hair: theme.colors.hair,
      massage: theme.colors.massage,
      facial: theme.colors.primary,
      waxing: theme.colors.accent,
    };
    return colorMap[category] || theme.colors.primary;
  };

  const renderServiceCard = ({ item }) => (
    <Card style={styles.serviceCard}>
      <Card.Cover source={{ uri: item.image }} style={styles.serviceImage} />
      <Card.Content style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text variant="headlineSmall" style={styles.serviceName}>
            {item.name}
          </Text>
          {item.popular && (
            <Chip icon="star" style={styles.popularChip} textStyle={{ color: '#fff' }}>
              Popular
            </Chip>
          )}
        </View>
        
        <Text variant="bodyMedium" style={styles.serviceDescription}>
          {item.description}
        </Text>
        
        <View style={styles.serviceDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color={theme.colors.onSurface} />
            <Text variant="bodySmall" style={styles.detailText}>
              {item.duration} min
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text variant="bodySmall" style={styles.detailText}>
              {item.rating}
            </Text>
          </View>
        </View>
        
        <View style={styles.serviceFooter}>
          <Text variant="headlineSmall" style={styles.servicePrice}>
            ${item.price}
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Booking', { serviceId: item.id })}
            style={styles.bookButton}
          >
            Book Now
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    searchContainer: {
      marginBottom: theme.spacing.md,
    },
    categoryScroll: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    categoryButton: {
      marginRight: theme.spacing.sm,
      minWidth: 100,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginVertical: theme.spacing.md,
    },
    serviceCard: {
      marginBottom: theme.spacing.md,
      elevation: theme.layout.cardElevation,
    },
    serviceImage: {
      height: 150,
    },
    serviceContent: {
      padding: theme.spacing.md,
    },
    serviceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    serviceName: {
      flex: 1,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    popularChip: {
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    serviceDescription: {
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    serviceDetails: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.lg,
    },
    detailText: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.onSurface,
    },
    serviceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    servicePrice: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    bookButton: {
      minWidth: 100,
    },
    categoryContainer: {
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.sm,
    },
    segmentedButtons: {
      marginHorizontal: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search services..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchContainer}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {serviceCategories.map((category) => (
            <Button
              key={category.value}
              mode={selectedCategory === category.value ? 'contained' : 'outlined'}
              onPress={() => setSelectedCategory(category.value)}
              style={styles.categoryButton}
              icon={category.icon}
              compact
            >
              {category.label}
            </Button>
          ))}
        </ScrollView>
      </View>

      {/* Services List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ServicesScreen;