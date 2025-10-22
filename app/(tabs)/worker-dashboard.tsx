import RequestServiceCard from '@/components/ui/RequestServiceCard'
import { useAuth } from '@/context/AuthContext'
import { useRequests } from '@/context/RequestContext'
import React from 'react'
import { FlatList, Text, View } from 'react-native'

const WorkerDashboard = () => {

    const { user } = useAuth()
    const { requests } = useRequests()

  return (
        <View className='p-6 bg-brand-dark  flex-1'>
            {/* Header */}
            <Text className='text-brand-text text-3xl font-bold mb-2'>
                Welcome, {' '}
                <Text className='text-brand-light-blue'>
                    {user?.firstName}
                </Text>
            </Text> 
            <Text className='text-brand-text-secondary text-lg mb-6'>
              Services Requested From You
            </Text>

      <FlatList
        className='space-y-5'
              data={requests}
              renderItem={({ item }) => <RequestServiceCard item={item} />} 
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-brand-text-secondary">No requests yet.</Text>
                    </View>
                }
          />

        </View>
    
  )
}

export default WorkerDashboard