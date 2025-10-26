import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  Searchbar,
  SegmentedButtons,
  FAB,
  Menu,
  Divider,
  List,
} from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../themes/ThemeContext';

const ServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set([1, 3])); // Mock favorites
  const [viewMode, setViewMode] = useState('grid'); // grid or list

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
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'under50' && service.price < 50) ||
                        (priceRange === '50to100' && service.price >= 50 && service.price <= 100) ||
                        (priceRange === 'over100' && service.price > 100);
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.popular ? 1 : -1;
    }
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

  const toggleFavorite = (serviceId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId);
    } else {
      newFavorites.add(serviceId);
    }
    setFavorites(newFavorites);
  };

  const renderServiceCard = ({ item }) => {
    const isFavorite = favorites.has(item.id);
    const isListView = viewMode === 'list';

    return (
      <Card style={[styles.serviceCard, isListView && styles.serviceCardList]}>
        <Card.Cover
          source={{ uri: item.image }}
          style={isListView ? styles.serviceImageList : styles.serviceImage}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={20}
            color={isFavorite ? "#FF5722" : theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Card.Content style={isListView ? styles.serviceContentList : styles.serviceContent}>
          <View style={styles.serviceHeader}>
            <Text variant={isListView ? "titleMedium" : "headlineSmall"} style={isListView ? styles.serviceNameList : styles.serviceName}>
              {item.name}
            </Text>
            {item.popular && (
              <Chip icon="star" style={styles.popularChip} textStyle={{ color: '#fff' }}>
                Popular
              </Chip>
            )}
          </View>

          <Text variant={isListView ? "bodySmall" : "bodyMedium"} style={isListView ? styles.serviceDescriptionList : styles.serviceDescription}>
            {item.description}
          </Text>

          <View style={isListView ? styles.serviceDetailsList : styles.serviceDetails}>
            <View style={styles.detailItem}>
              <MaterialIcons name="schedule" size={14} color={theme.colors.onSurface} />
              <Text style={styles.detailText}>
                {item.duration} min
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.detailText}>
                {item.rating}
              </Text>
            </View>
          </View>

          <View style={isListView ? styles.serviceFooterList : styles.serviceFooter}>
            <Text variant={isListView ? "titleMedium" : "headlineSmall"} style={isListView ? styles.servicePriceList : styles.servicePrice}>
              ${item.price}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Booking', { serviceId: item.id })}
              style={isListView ? styles.bookButtonList : styles.bookButton}
              compact={isListView}
            >
              Book Now
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      elevation: 2,
    },
    searchContainer: {
      marginBottom: theme.spacing.md,
    },
    filtersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    filterButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterButton: {
      marginRight: theme.spacing.sm,
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
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    resultsText: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    viewToggle: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 2,
    },
    toggleButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: 6,
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    toggleIcon: {
      color: theme.colors.onSurface,
    },
    toggleIconActive: {
      color: '#fff',
    },
    serviceCard: {
      marginBottom: theme.spacing.md,
      elevation: theme.layout.cardElevation,
    },
    serviceCardList: {
      flexDirection: 'row',
      height: 120,
    },
    serviceImage: {
      height: 150,
    },
    serviceImageList: {
      width: 100,
      height: '100%',
    },
    serviceContent: {
      padding: theme.spacing.md,
      flex: 1,
    },
    serviceContentList: {
      padding: theme.spacing.sm,
      justifyContent: 'center',
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
    serviceNameList: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    popularChip: {
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 20,
    },
    serviceDescription: {
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    serviceDescriptionList: {
      color: theme.colors.onSurface,
      fontSize: 14,
      lineHeight: 18,
    },
    serviceDetails: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    serviceDetailsList: {
      flexDirection: 'row',
      marginTop: theme.spacing.xs,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.lg,
    },
    detailText: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.onSurface,
      fontSize: 12,
    },
    serviceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    serviceFooterList: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    servicePrice: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    servicePriceList: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    bookButton: {
      minWidth: 100,
    },
    bookButtonList: {
      minWidth: 80,
      height: 36,
    },
    categoryContainer: {
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.sm,
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
      {/* Header with Search and Filters */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search services..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchContainer}
        />

        <View style={styles.filtersRow}>
          <View style={styles.filterButtons}>
            <Menu
              visible={showFilters}
              onDismiss={() => setShowFilters(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowFilters(true)}
                  style={styles.filterButton}
                  icon="filter-variant"
                >
                  Filters
                </Button>
              }
            >
              <List.Section title="Sort By">
                <List.Item
                  title="Popular"
                  onPress={() => { setSortBy('popular'); setShowFilters(false); }}
                  right={() => sortBy === 'popular' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="Price: Low to High"
                  onPress={() => { setSortBy('price-low'); setShowFilters(false); }}
                  right={() => sortBy === 'price-low' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="Price: High to Low"
                  onPress={() => { setSortBy('price-high'); setShowFilters(false); }}
                  right={() => sortBy === 'price-high' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="Highest Rated"
                  onPress={() => { setSortBy('rating'); setShowFilters(false); }}
                  right={() => sortBy === 'rating' ? <List.Icon icon="check" /> : null}
                />
              </List.Section>
              <Divider />
              <List.Section title="Price Range">
                <List.Item
                  title="All Prices"
                  onPress={() => { setPriceRange('all'); setShowFilters(false); }}
                  right={() => priceRange === 'all' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="Under $50"
                  onPress={() => { setPriceRange('under50'); setShowFilters(false); }}
                  right={() => priceRange === 'under50' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="$50 - $100"
                  onPress={() => { setPriceRange('50to100'); setShowFilters(false); }}
                  right={() => priceRange === '50to100' ? <List.Icon icon="check" /> : null}
                />
                <List.Item
                  title="Over $100"
                  onPress={() => { setPriceRange('over100'); setShowFilters(false); }}
                  right={() => priceRange === 'over100' ? <List.Icon icon="check" /> : null}
                />
              </List.Section>
            </Menu>

            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
                onPress={() => setViewMode('grid')}
              >
                <MaterialCommunityIcons
                  name="view-grid"
                  size={20}
                  style={viewMode === 'grid' ? styles.toggleIconActive : styles.toggleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
                onPress={() => setViewMode('list')}
              >
                <MaterialCommunityIcons
                  name="view-list"
                  size={20}
                  style={viewMode === 'list' ? styles.toggleIconActive : styles.toggleIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredServices.length} services found
        </Text>
      </View>

      {/* Services List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === 'grid' ? 1 : 1}
      />

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

export default ServicesScreen;