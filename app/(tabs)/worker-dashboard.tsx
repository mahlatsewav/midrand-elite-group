import RequestServiceCard from '@/components/ui/RequestServiceCard';
import { useAuth } from '@/context/AuthContext';
import { useRequests, ServiceRequest } from '@/context/RequestContext';
import React, { useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, SafeAreaView, Modal, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { requests, loading, updateRequestStatus } = useRequests();
  
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestPress = (request: ServiceRequest) => {
    console.log('Worker viewing request:', request.id, 'Status:', request.status);
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Accept Request Flow
  const initiateAcceptRequest = () => {
    setShowDetailsModal(false);
    setTimeout(() => setShowAcceptModal(true), 300);
  };

  const confirmAcceptRequest = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      console.log('Accepting request:', selectedRequest.id);
      await updateRequestStatus(selectedRequest.id, 'accepted', user?.id);
      Alert.alert('Success', 'You have accepted this job!');
      setShowAcceptModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', `Failed to accept request: ${error.message || 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start Job Flow
  const initiateStartJob = () => {
    setShowDetailsModal(false);
    setTimeout(() => setShowStartModal(true), 300);
  };

  const confirmStartJob = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      console.log('Starting job:', selectedRequest.id);
      await updateRequestStatus(selectedRequest.id, 'in-progress');
      Alert.alert('Success', 'Job status updated to In Progress!');
      setShowStartModal(false);
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error starting job:', error);
      Alert.alert('Error', `Failed to start job: ${error.message || 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete Job Flow
  const initiateCompleteJob = () => {
    setShowDetailsModal(false);
    setTimeout(() => setShowCompleteModal(true), 300);
  };

  const confirmCompleteJob = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      console.log('Completing job:', selectedRequest.id);
      await updateRequestStatus(selectedRequest.id, 'completed');
      setShowCompleteModal(false);
      // Show payment verification modal after completion
      setTimeout(() => setShowPaymentModal(true), 300);
    } catch (error: any) {
      console.error('Error completing job:', error);
      Alert.alert('Error', `Failed to complete job: ${error.message || 'Please try again.'}`);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Payment Verification
  const handlePaymentConfirmed = () => {
    Alert.alert('Payment Confirmed', 'Thank you! This job has been marked as paid and completed.');
    setShowPaymentModal(false);
    setSelectedRequest(null);
  };

  const handlePaymentNotReceived = () => {
    Alert.alert(
      'Payment Not Received',
      'Please contact the client or your manager about payment for this job.',
      [{ text: 'OK', onPress: () => {
        setShowPaymentModal(false);
        setSelectedRequest(null);
      }}]
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
        <Text className="text-brand-text text-3xl font-bold mb-2">
          Welcome, {' '}
          <Text className="text-brand-light-blue">
            {user?.firstName}
          </Text>
        </Text> 
        <Text className="text-brand-text-secondary text-lg mb-6">
          Available Service Requests
        </Text>

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
                <RequestServiceCard item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="text-brand-text-secondary text-center">
                  No service requests available.{'\n'}Check back later
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
        onRequestClose={() => setShowDetailsModal(false)}
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
                    <Text className="text-brand-text-secondary text-xs mb-1">Client Name</Text>
                    <Text className="text-brand-text">{selectedRequest.clientName}</Text>
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

                {/* Action Buttons based on status */}
                {selectedRequest.status === 'pending' && (
                  <TouchableOpacity
                    className="w-full bg-brand-blue p-4 rounded-lg items-center flex-row justify-center mb-6"
                    onPress={initiateAcceptRequest}
                  >
                    <FontAwesome name="check-circle" size={20} color="#ffffff" />
                    <Text className="text-white font-bold text-lg ml-2">Accept Job</Text>
                  </TouchableOpacity>
                )}

                {selectedRequest.status === 'accepted' && selectedRequest.workerId === user?.id && (
                  <TouchableOpacity
                    className="w-full bg-purple-600 p-4 rounded-lg items-center flex-row justify-center mb-6"
                    onPress={initiateStartJob}
                  >
                    <FontAwesome name="play-circle" size={20} color="#ffffff" />
                    <Text className="text-white font-bold text-lg ml-2">Start Job</Text>
                  </TouchableOpacity>
                )}

                {selectedRequest.status === 'in-progress' && selectedRequest.workerId === user?.id && (
                  <TouchableOpacity
                    className="w-full bg-green-600 p-4 rounded-lg items-center flex-row justify-center mb-6"
                    onPress={initiateCompleteJob}
                  >
                    <FontAwesome name="check-square" size={20} color="#ffffff" />
                    <Text className="text-white font-bold text-lg ml-2">Mark as Complete</Text>
                  </TouchableOpacity>
                )}

                {selectedRequest.status === 'completed' && (
                  <View className="bg-green-500/20 border-2 border-green-500 p-4 rounded-lg mb-6">
                    <View className="flex-row items-center">
                      <FontAwesome name="check-circle" size={20} color="#22c55e" />
                      <Text className="text-brand-text ml-2 flex-1">
                        This job has been completed.
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Accept Job Confirmation Modal */}
      <Modal
        visible={showAcceptModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isProcessing && setShowAcceptModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-6">
          <View className="bg-brand-dark rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <FontAwesome name="question-circle" size={60} color="#0A84FF" />
            </View>
            <Text className="text-brand-text text-xl font-bold text-center mb-2">
              Accept This Job?
            </Text>
            <Text className="text-brand-text-secondary text-center mb-6">
              Are you sure you want to accept this service request? You will be assigned as the worker for this job.
            </Text>
            
            <View className="flex-row justify-between space-x-3">
              <TouchableOpacity
                className="flex-1 bg-brand-surface p-4 rounded-lg items-center mr-2"
                onPress={() => setShowAcceptModal(false)}
                disabled={isProcessing}
              >
                <Text className="text-brand-text font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-lg items-center ml-2 ${isProcessing ? 'bg-gray-500' : 'bg-brand-blue'}`}
                onPress={confirmAcceptRequest}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-white font-bold">Yes, Accept</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Start Job Confirmation Modal */}
      <Modal
        visible={showStartModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isProcessing && setShowStartModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-6">
          <View className="bg-brand-dark rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <FontAwesome name="play-circle" size={60} color="#9333ea" />
            </View>
            <Text className="text-brand-text text-xl font-bold text-center mb-2">
              Start This Job?
            </Text>
            <Text className="text-brand-text-secondary text-center mb-6">
              Are you ready to begin working on this service request? The status will be updated to "In Progress".
            </Text>
            
            <View className="flex-row justify-between space-x-3">
              <TouchableOpacity
                className="flex-1 bg-brand-surface p-4 rounded-lg items-center mr-2"
                onPress={() => setShowStartModal(false)}
                disabled={isProcessing}
              >
                <Text className="text-brand-text font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-lg items-center ml-2 ${isProcessing ? 'bg-gray-500' : 'bg-purple-600'}`}
                onPress={confirmStartJob}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-white font-bold">Yes, Start</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Job Confirmation Modal */}
      <Modal
        visible={showCompleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isProcessing && setShowCompleteModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-6">
          <View className="bg-brand-dark rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <FontAwesome name="check-square" size={60} color="#22c55e" />
            </View>
            <Text className="text-brand-text text-xl font-bold text-center mb-2">
              Mark as Complete?
            </Text>
            <Text className="text-brand-text-secondary text-center mb-6">
              Have you finished all work for this service request? This will mark the job as completed.
            </Text>
            
            <View className="flex-row justify-between space-x-3">
              <TouchableOpacity
                className="flex-1 bg-brand-surface p-4 rounded-lg items-center mr-2"
                onPress={() => setShowCompleteModal(false)}
                disabled={isProcessing}
              >
                <Text className="text-brand-text font-bold">Not Yet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-lg items-center ml-2 ${isProcessing ? 'bg-gray-500' : 'bg-green-600'}`}
                onPress={confirmCompleteJob}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-white font-bold">Yes, Complete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Verification Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-6">
          <View className="bg-brand-dark rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <FontAwesome name="money" size={60} color="#22c55e" />
            </View>
            <Text className="text-brand-text text-xl font-bold text-center mb-2">
              Payment Verification
            </Text>
            <Text className="text-brand-text-secondary text-center mb-6">
              Has the client paid for this completed service?
            </Text>
            
            <TouchableOpacity
              className="w-full bg-green-600 p-4 rounded-lg items-center mb-3 flex-row justify-center"
              onPress={handlePaymentConfirmed}
            >
              <FontAwesome name="check-circle" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">Yes, Payment Received</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-red-600 p-4 rounded-lg items-center flex-row justify-center"
              onPress={handlePaymentNotReceived}
            >
              <FontAwesome name="times-circle" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg ml-2">No, Not Paid Yet</Text>
            </TouchableOpacity>

            <Text className="text-brand-text-secondary text-xs text-center mt-4">
              This is for your records. Please report any payment issues to your manager.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkerDashboard;