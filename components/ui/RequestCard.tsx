import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ServiceRequest } from '@/context/RequestContext';
import { FontAwesome } from '@expo/vector-icons';

interface RequestCardProps {
  item: ServiceRequest;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'accepted':
      return 'bg-blue-500';
    case 'in-progress':
      return 'bg-purple-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};

export default function RequestCard({ item }: RequestCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className="bg-brand-surface rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-brand-text font-bold text-lg flex-1">
          {item.title}
        </Text>
        <View className={`${getStatusColor(item.status)} px-3 py-1 rounded-full`}>
          <Text className="text-white text-xs font-semibold">
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text className="text-brand-text-secondary mb-3" numberOfLines={2}>
        {item.description}
      </Text>

      {item.workerName && (
        <View className="flex-row items-center mb-2">
          <FontAwesome name="user" size={14} color="#8E8E93" />
          <Text className="text-brand-text-secondary ml-2 text-sm">
            Worker: {item.workerName}
          </Text>
        </View>
      )}

      <View className="flex-row items-center">
        <FontAwesome name="calendar" size={14} color="#8E8E93" />
        <Text className="text-brand-text-secondary ml-2 text-sm">
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );
}