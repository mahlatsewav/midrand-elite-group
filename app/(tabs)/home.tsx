import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

// Service types 
interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  description: string;
  icon: string;
  color: string;
}

const SERVICE_TYPES: ServiceType[] = [
  {
    id: 'painting-interior',
    name: 'Interior Painting',
    basePrice: 150,
    unit: 'per room',
    description: 'Professional interior painting services',
    icon: 'paint-brush',
    color: 'bg-blue-500'
  },
  {
    id: 'painting-exterior',
    name: 'Exterior Painting',
    basePrice: 250,
    unit: 'per wall',
    description: 'Exterior wall painting and finishing',
    icon: 'home',
    color: 'bg-cyan-500'
  },
  {
    id: 'renovation-kitchen',
    name: 'Kitchen Renovation',
    basePrice: 15000,
    unit: 'per project',
    description: 'Complete kitchen renovation and remodeling',
    icon: 'cutlery',
    color: 'bg-orange-500'
  },
  {
    id: 'renovation-bathroom',
    name: 'Bathroom Renovation',
    basePrice: 12000,
    unit: 'per project',
    description: 'Full bathroom renovation services',
    icon: 'shower',
    color: 'bg-teal-500'
  },
  {
    id: 'renovation-general',
    name: 'General Renovation',
    basePrice: 8000,
    unit: 'per project',
    description: 'General home renovation and repairs',
    icon: 'wrench',
    color: 'bg-purple-500'
  },
  {
    id: 'cleaning-residential',
    name: 'Residential Cleaning',
    basePrice: 350,
    unit: 'per session',
    description: 'Deep cleaning for homes',
    icon: 'trash',
    color: 'bg-green-500'
  },
  {
    id: 'cleaning-commercial',
    name: 'Commercial Cleaning',
    basePrice: 800,
    unit: 'per session',
    description: 'Professional office and commercial cleaning',
    icon: 'building',
    color: 'bg-emerald-500'
  },
  {
    id: 'pest-control-general',
    name: 'General Pest Control',
    basePrice: 600,
    unit: 'per treatment',
    description: 'Pest inspection and treatment',
    icon: 'bug',
    color: 'bg-red-500'
  },
  {
    id: 'pest-control-fumigation',
    name: 'Fumigation Services',
    basePrice: 1200,
    unit: 'per property',
    description: 'Complete property fumigation',
    icon: 'shield',
    color: 'bg-pink-500'
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleServicePress = (service: ServiceType) => {
    // Navigate to new-request page with the selected service
    router.push({
      pathname: '/new-request',
      params: { serviceId: service.id }
    });
  };

  const renderServiceCard = ({ item }: { item: ServiceType }) => (
    <TouchableOpacity
      className="bg-brand-surface rounded-xl mb-4 overflow-hidden"
      onPress={() => handleServicePress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Icon Section */}
        <View className={`${item.color} w-24 justify-center items-center`}>
          <FontAwesome name={item.icon as any} size={32} color="#FFFFFF" />
        </View>

        {/* Content Section */}
        <View className="flex-1 p-4">
          <Text className="text-brand-text text-lg font-bold mb-1">
            {item.name}
          </Text>
          <Text className="text-brand-text-secondary text-sm mb-3" numberOfLines={2}>
            {item.description}
          </Text>
          
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-brand-light-blue text-lg font-bold">
                R{item.basePrice.toFixed(2)}
              </Text>
              <Text className="text-brand-text-secondary text-xs">
                {item.unit}
              </Text>
            </View>
            
            <View className="bg-brand-blue px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">Request</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="p-6 flex-1">
        {/* Header */}
        <View className="mb-6" style={{paddingTop: 20}}>
          <Text className="text-brand-text text-3xl font-bold mb-2">
            Welcome,{' '}
            <Text className="text-brand-light-blue">{user?.firstName}</Text>
          </Text>
          <Text className="text-brand-text-secondary text-lg">
            What service do you need today?
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            className="flex-1 bg-brand-surface p-4 rounded-lg mr-2 flex-row items-center"
            onPress={() => router.push('/my-requests')}
          >
            <FontAwesome name="list" size={20} color="#0A84FF" />
            <Text className="text-brand-text ml-3 font-semibold">My Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Services List */}
        <Text className="text-brand-text text-xl font-bold mb-4">
          Our Services
        </Text>

        <FlatList
          data={SERVICE_TYPES}
          renderItem={renderServiceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}