import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRequests } from '@/context/RequestContext'
import RequestCard from '@/components/ui/RequestCard'
import { FontAwesome } from '@expo/vector-icons'

const PendingRequest = () => {
  const { allRequests, loading } = useRequests()
  return (
    <SafeAreaView className='flex-1 bg-brand-dark'>
      
      {/* Header */}
      <View className='p-3'>
        <Text className='font-bold text-3xl text-brand-text mb-2'>
          Pending Requests
        </Text>
        <Text className="text-brand-text-secondary text-lg">
          View requested services 
        </Text>
      </View>

      {/* all requests */}
      {loading ? (
         <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#60A5FA" />
            <Text className="text-brand-text-secondary mt-4">Loading requests...</Text>
         </View>
      ) : (
          <FlatList
            data={allRequests}
            renderItem={({ item }) => (
              <RequestCard item={item} />
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
    </SafeAreaView>
  )
}

export default PendingRequest