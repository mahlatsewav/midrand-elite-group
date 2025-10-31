import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { ServiceRequest, useRequests } from '@/context/RequestContext';
import { FontAwesome } from '@expo/vector-icons';

interface RequestServiceCardProps {
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

export default function RequestServiceCard({ item }: RequestServiceCardProps) {
  const { acceptRequest, updateRequestStatus } = useRequests();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptRequest(item.id);
      Alert.alert('Success', 'You have accepted this service request!');
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept the request. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'in-progress' | 'completed') => {
    setIsUpdating(true);
    try {
      await updateRequestStatus(item.id, newStatus);
      Alert.alert('Success', `Request marked as ${newStatus.replace('-', ' ')}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCallClient = () => {
    const phoneNumber = item.clientPhone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const formatLocation = () => {
    if (!item.location) {
      return 'Location not provided';
    }
    const { address, suburb, city } = item.location;
    if (suburb) {
      return `${address}, ${suburb}, ${city}`;
    }
    return `${address}, ${city}`;
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

      <Text className="text-brand-text-secondary mb-3">
        {item.description}
      </Text>

      <View className="flex-row items-center mb-2">
        <FontAwesome name="map-marker" size={14} color="#8E8E93" />
        <Text className="text-brand-text-secondary ml-2 text-sm flex-1" numberOfLines={2}>
          {formatLocation()}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <FontAwesome name="user" size={14} color="#8E8E93" />
        <Text className="text-brand-text-secondary ml-2 text-sm">
          Client: {item.clientName}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <FontAwesome name="calendar" size={14} color="#8E8E93" />
          <Text className="text-brand-text-secondary ml-2 text-sm">
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        {/* Call Client Button - Only show if worker has accepted */}
        {item.status !== 'pending' && (
          <TouchableOpacity
            className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleCallClient}
          >
            <FontAwesome name="phone" size={16} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Call Client</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action buttons based on status */}
      {item.status === 'pending' && (
        <TouchableOpacity
          className={`p-3 rounded-lg items-center ${isAccepting ? 'bg-gray-500' : 'bg-green-600'}`}
          onPress={handleAccept}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-bold">Accept Request</Text>
          )}
        </TouchableOpacity>
      )}

      {item.status === 'accepted' && (
        <TouchableOpacity
          className={`p-3 rounded-lg items-center ${isUpdating ? 'bg-gray-500' : 'bg-purple-600'}`}
          onPress={() => handleStatusUpdate('in-progress')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-bold">Start Working</Text>
          )}
        </TouchableOpacity>
      )}

      {item.status === 'in-progress' && (
        <TouchableOpacity
          className={`p-3 rounded-lg items-center ${isUpdating ? 'bg-gray-500' : 'bg-green-600'}`}
          onPress={() => handleStatusUpdate('completed')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-bold">Mark as Completed</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}