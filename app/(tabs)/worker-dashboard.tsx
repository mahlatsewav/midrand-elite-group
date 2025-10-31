import RequestServiceCard from '@/components/ui/RequestServiceCard';
import { useAuth } from '@/context/AuthContext';
import { useRequests } from '@/context/RequestContext';
import React from 'react';
import { FlatList, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { requests, loading } = useRequests();

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
            renderItem={({ item }) => <RequestServiceCard item={item} />} 
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
    </SafeAreaView>
  );
};

export default WorkerDashboard;