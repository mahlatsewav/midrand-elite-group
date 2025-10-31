import { View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { useRouter } from 'expo-router';
import RequestCard from '@/components/ui/RequestCard';
import React from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const { requests, loading } = useRequests();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="p-6 flex-1">
        <Text className="text-brand-text text-3xl font-bold mb-2">
          Welcome,{' '}
          <Text className="text-brand-light-blue">{user?.firstName}</Text>
        </Text>
        <Text className="text-brand-text-secondary text-lg mb-6">
          My Service Requests
        </Text>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text className="text-brand-text-secondary mt-4">Loading requests...</Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={({ item }) => <RequestCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="text-brand-text-secondary text-center">
                  No requests yet.{'\n'}Create your first service request!
                </Text>
              </View>
            }
          />
        )}

        <TouchableOpacity
          className="bg-brand-blue p-4 rounded-lg items-center mt-4"
          onPress={() => router.push('/new-request')}
        >
          <Text className="text-white font-bold text-lg">+ Request New Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}