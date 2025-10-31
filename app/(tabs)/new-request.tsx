import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRequests } from '../../context/RequestContext';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function NewRequestScreen() {
  const { addRequest } = useRequests();
  const router = useRouter();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [suburb, setSuburb] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!serviceType.trim()) {
      Alert.alert('Validation Error', 'Service Type is required.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Phone number is required.');
      return;
    }

    // Basic phone validation (South African format)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      Alert.alert('Validation Error', 'Please enter a valid South African phone number (e.g., 0821234567 or +27821234567)');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Validation Error', 'Street address is required.');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addRequest({ 
        title: serviceType, 
        description,
        clientPhone: phoneNumber,
        location: {
          address: address.trim(),
          city: city.trim(),
          suburb: suburb.trim() || undefined,
        }
      });
      
      Alert.alert(
        'Success', 
        'Your service request has been submitted!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error submitting request:', error);
      Alert.alert(
        'Error', 
        'Failed to submit your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
    router.back(); 
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <ScrollView className="p-6">
        <Text className="text-brand-text text-2xl font-bold mb-6">New Service Request</Text>

        <Text className="text-brand-text text-lg font-semibold mb-2">Service Type:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., House Painting, Plumbing Fix"
          placeholderTextColor="#8E8E93"
          value={serviceType}
          onChangeText={setServiceType}
          editable={!isSubmitting}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">Description:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4 h-32"
          placeholder="Provide more details about your request..."
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          editable={!isSubmitting}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">Contact Number:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., 0821234567"
          placeholderTextColor="#8E8E93"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!isSubmitting}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">Street Address:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="Address"
          placeholderTextColor="#8E8E93"
          value={address}
          onChangeText={setAddress}
          editable={!isSubmitting}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">Suburb:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="Suburb"
          placeholderTextColor="#8E8E93"
          value={suburb}
          onChangeText={setSuburb}
          editable={!isSubmitting}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">City:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6"
          placeholder="e.g., Johannesburg"
          placeholderTextColor="#8E8E93"
          value={city}
          onChangeText={setCity}
          editable={!isSubmitting}
        />

        <View className="flex-row justify-start items-center mb-6">
          <View className="w-20 h-20 bg-brand-surface rounded-lg mr-3 justify-center items-center">
            <FontAwesome name="image" size={24} color="#8E8E93" />
          </View>
          <View className="w-20 h-20 bg-brand-surface rounded-lg justify-center items-center">
            <FontAwesome name="image" size={24} color="#8E8E93" />
          </View>
        </View>

        <TouchableOpacity 
          className="bg-brand-surface p-3 rounded-lg items-center flex-row justify-center mb-8"
          disabled={isSubmitting}
        >
          <FontAwesome name="upload" size={16} color="#FFFFFF" />
          <Text className="text-white font-bold ml-2">Upload Photo(s)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-full p-4 rounded-lg items-center ${isSubmitting ? 'bg-gray-500' : 'bg-brand-blue'}`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}