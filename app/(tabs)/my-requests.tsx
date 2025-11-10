import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Modal, ScrollView, Image, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRequests, ServiceRequest } from '../../context/RequestContext';
import { useRouter } from 'expo-router';
import RequestCard from '@/components/ui/RequestCard';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function MyRequestsScreen() {
  const { user } = useAuth();
  const { requests, loading, updateRequestStatus } = useRequests();
  const router = useRouter();
  
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleRequestPress = (request: ServiceRequest) => {
    console.log('Request pressed:', request.id, 'Status:', request.status);
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCancelRequest = async () => {
    if (!selectedRequest) {
      console.log('No selected request');
      return;
    }

    console.log('Cancel request initiated for:', selectedRequest.id);

    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this service request?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => console.log('Cancel dismissed')
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            console.log('User confirmed cancellation');
            setIsCancelling(true);
            try {
              console.log('Calling updateRequestStatus with:', selectedRequest.id, 'cancelled');
              await updateRequestStatus(selectedRequest.id, 'cancelled');
              console.log('Update successful, showing success alert');
              Alert.alert('Success', 'Your service request has been cancelled.');
              setShowDetailsModal(false);
              setSelectedRequest(null);
            } catch (error: any) {
              console.error('Error cancelling request:', error);
              console.error('Error details:', error.message, error.code);
              Alert.alert('Error', `Failed to cancel request: ${error.message || 'Please try again.'}`);
            } finally {
              setIsCancelling(false);
              console.log('Cancel process completed');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500';
      case 'accepted':
        return 'bg-blue-500/20 border-blue-500';
      case 'in-progress':
        return 'bg-purple-500/20 border-purple-500';
      case 'completed':
        return 'bg-green-500/20 border-green-500';
      case 'cancelled':
        return 'bg-red-500/20 border-red-500';
      default:
        return 'bg-gray-500/20 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-blue-500';
      case 'in-progress':
        return 'text-purple-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="p-6 flex-1">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
          >
            <FontAwesome name="arrow-left" size={24} color="#0A84FF" />
          </TouchableOpacity>
          <View>
            <Text className="text-brand-text text-3xl font-bold">
              My Requests
            </Text>
            <Text className="text-brand-text-secondary text-sm">
              View and manage your service requests
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text className="text-brand-text-secondary mt-4">Loading requests...</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleRequestPress(item)}>
                <RequestCard item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <FontAwesome name="inbox" size={64} color="#8E8E93" />
                <Text className="text-brand-text-secondary text-center mt-4 text-lg">
                  No requests yet
                </Text>
                <Text className="text-brand-text-secondary text-center mt-2">
                  Go back to home and request a service
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Request Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          console.log('Modal closed');
          setShowDetailsModal(false);
        }}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-brand-dark rounded-t-3xl max-h-[85%]">
            {/* Modal Header */}
            <View className="p-4 border-b border-brand-surface flex-row justify-between items-center">
              <Text className="text-brand-text text-xl font-bold">Request Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <FontAwesome name="times" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView className="p-6">
                {/* Status Badge */}
                <View className={`self-start px-4 py-2 rounded-full border-2 mb-4 ${getStatusColor(selectedRequest.status)}`}>
                  <Text className={`font-bold ${getStatusTextColor(selectedRequest.status)}`}>
                    {formatStatus(selectedRequest.status)}
                  </Text>
                </View>

                {/* Service Title */}
                <Text className="text-brand-text text-2xl font-bold mb-2">
                  {selectedRequest.title}
                </Text>

                {/* Request ID */}
                <Text className="text-brand-text-secondary text-sm mb-6">
                  Request ID: {selectedRequest.id.substring(0, 8)}...
                </Text>

                {/* Description */}
                <View className="bg-brand-surface p-4 rounded-lg mb-4">
                  <View className="flex-row items-center mb-2">
                    <FontAwesome name="file-text" size={16} color="#0A84FF" />
                    <Text className="text-brand-text font-semibold ml-2">Description</Text>
                  </View>
                  <Text className="text-brand-text-secondary">
                    {selectedRequest.description}
                  </Text>
                </View>

                {/* Contact Information */}
                <View className="bg-brand-surface p-4 rounded-lg mb-4">
                  <View className="flex-row items-center mb-3">
                    <FontAwesome name="phone" size={16} color="#0A84FF" />
                    <Text className="text-brand-text font-semibold ml-2">Contact Information</Text>
                  </View>
                  
                  <View className="mb-2">
                    <Text className="text-brand-text-secondary text-xs mb-1">Phone Number</Text>
                    <Text className="text-brand-text">{selectedRequest.clientPhone || 'Not provided'}</Text>
                  </View>

                  <View>
                    <Text className="text-brand-text-secondary text-xs mb-1">Email</Text>
                    <Text className="text-brand-text">{selectedRequest.clientEmail}</Text>
                  </View>
                </View>

                {/* Location */}
                {selectedRequest.location && (
                  <View className="bg-brand-surface p-4 rounded-lg mb-4">
                    <View className="flex-row items-center mb-3">
                      <FontAwesome name="map-marker" size={16} color="#0A84FF" />
                      <Text className="text-brand-text font-semibold ml-2">Location</Text>
                    </View>
                    
                    <View className="mb-2">
                      <Text className="text-brand-text-secondary text-xs mb-1">Street Address</Text>
                      <Text className="text-brand-text">{selectedRequest.location.address}</Text>
                    </View>

                    {selectedRequest.location.suburb && (
                      <View className="mb-2">
                        <Text className="text-brand-text-secondary text-xs mb-1">Suburb</Text>
                        <Text className="text-brand-text">{selectedRequest.location.suburb}</Text>
                      </View>
                    )}

                    <View>
                      <Text className="text-brand-text-secondary text-xs mb-1">City</Text>
                      <Text className="text-brand-text">{selectedRequest.location.city}</Text>
                    </View>
                  </View>
                )}

                {/* Worker Assignment (if assigned) */}
                {selectedRequest.workerId && selectedRequest.workerName && (
                  <View className="bg-brand-surface p-4 rounded-lg mb-4">
                    <View className="flex-row items-center mb-2">
                      <FontAwesome name="user" size={16} color="#0A84FF" />
                      <Text className="text-brand-text font-semibold ml-2">Assigned Worker</Text>
                    </View>
                    <Text className="text-brand-light-blue text-lg">
                      {selectedRequest.workerName}
                    </Text>
                  </View>
                )}

                {/* Photos */}
                {selectedRequest.photoUrls && selectedRequest.photoUrls.length > 0 && (
                  <View className="bg-brand-surface p-4 rounded-lg mb-4">
                    <View className="flex-row items-center mb-3">
                      <FontAwesome name="image" size={16} color="#0A84FF" />
                      <Text className="text-brand-text font-semibold ml-2">Photos</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {selectedRequest.photoUrls.map((url, index) => (
                        <Image
                          key={index}
                          source={{ uri: url }}
                          className="w-32 h-32 rounded-lg mr-2"
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Timestamps */}
                <View className="bg-brand-surface p-4 rounded-lg mb-4">
                  <View className="flex-row items-center mb-3">
                    <FontAwesome name="clock-o" size={16} color="#0A84FF" />
                    <Text className="text-brand-text font-semibold ml-2">Timeline</Text>
                  </View>
                  
                  <View className="mb-2">
                    <Text className="text-brand-text-secondary text-xs mb-1">Created</Text>
                    <Text className="text-brand-text">{formatDate(selectedRequest.createdAt)}</Text>
                  </View>

                  <View>
                    <Text className="text-brand-text-secondary text-xs mb-1">Last Updated</Text>
                    <Text className="text-brand-text">{formatDate(selectedRequest.updatedAt)}</Text>
                  </View>
                </View>

                {/* Cancel Button - Only show if status is pending */}
                {selectedRequest.status === 'pending' && (
                  <View className="mt-4 mb-6">
                    <TouchableOpacity
                      className={`w-full p-4 rounded-lg items-center flex-row justify-center ${isCancelling ? 'bg-gray-500' : 'bg-red-600'}`}
                      onPress={handleCancelRequest}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>
                          <ActivityIndicator color="#ffffff" size="small" />
                          <Text className="text-white font-bold text-lg ml-2">Cancelling...</Text>
                        </>
                      ) : (
                        <>
                          <FontAwesome name="times-circle" size={20} color="#ffffff" />
                          <Text className="text-white font-bold text-lg ml-2">Cancel Request</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <Text className="text-brand-text-secondary text-xs text-center mt-2">
                      You can only cancel requests that have not been accepted yet.
                    </Text>
                  </View>
                )}

                {/* Information for non-pending statuses */}
                {selectedRequest.status !== 'pending' && selectedRequest.status !== 'cancelled' && (
                  <View className="bg-blue-500/20 border-2 border-blue-500 p-4 rounded-lg mb-6">
                    <View className="flex-row items-center">
                      <FontAwesome name="info-circle" size={20} color="#0A84FF" />
                      <Text className="text-brand-text ml-2 flex-1">
                        This request has been {formatStatus(selectedRequest.status).toLowerCase()} and cannot be cancelled.
                      </Text>
                    </View>
                  </View>
                )}

                {selectedRequest.status === 'cancelled' && (
                  <View className="bg-red-500/20 border-2 border-red-500 p-4 rounded-lg mb-6">
                    <View className="flex-row items-center">
                      <FontAwesome name="ban" size={20} color="#ef4444" />
                      <Text className="text-brand-text ml-2 flex-1">
                        This request has been cancelled.
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}