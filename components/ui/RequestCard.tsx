import { View, Text } from 'react-native'
import React from 'react'
import { ServiceRequest } from '@/context/RequestContext'
import StatusBadge from './StatusBadge'

const RequestCard = ({ item }: { item: ServiceRequest }) => {
  return (
   <View className="bg-brand-surface p-4 rounded-lg mb-3 flex-row justify-between items-center">
       <Text className="text-brand-text text-lg">{item.title}</Text>
       <StatusBadge status={item.status} />
   </View>
  )
}

export default RequestCard