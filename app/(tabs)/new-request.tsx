import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import {  } from 'nativewind';
import { useRequests } from '../../context/RequestContext';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function NewRequestScreen() {
  const { addRequest } = useRequests();
  const router = useRouter();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!serviceType.trim()) {
      Alert.alert('Validation Error', 'Service Type is required.');
      return;
    }

    addRequest({ title: serviceType, description });
    router.back(); // Go back to the home screen
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <ScrollView className="p-6">
        <Text className="text-brand-text text-lg font-semibold mb-2">Service Type:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., House Painting, Plumbing Fix"
          placeholderTextColor="#8E8E93"
          value={serviceType}
          onChangeText={setServiceType}
        />

        <Text className="text-brand-text text-lg font-semibold mb-2">Description:</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6 h-32"
          placeholder="Provide more details about your request..."
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <View className="flex-row justify-start items-center mb-6">
          <View className="w-20 h-20 bg-brand-surface rounded-lg mr-3 justify-center items-center">
            <FontAwesome name="image" size={24} color="#8E8E93" />
          </View>
          <View className="w-20 h-20 bg-brand-surface rounded-lg justify-center items-center">
            <FontAwesome name="image" size={24} color="#8E8E93" />
          </View>
        </View>

        <TouchableOpacity className="bg-brand-surface p-3 rounded-lg items-center flex-row justify-center mb-8">
            <FontAwesome name="upload" size={16} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Upload Photo(s)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-brand-blue p-4 rounded-lg items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-lg">Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}