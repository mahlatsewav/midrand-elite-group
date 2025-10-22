import { ServiceRequest } from '@/context/RequestContext'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import Button from './Button'
import StatusBadge from './StatusBadge'


const RequestServiceCard = ({item} : {item: ServiceRequest}) => {
  return (
    <View className='bg-brand-surface p-4 rounded-lg mb-4 space-y-3'>
        <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-brand-text text-lg font-semibold'>{item.title}</Text>
            <StatusBadge status="To Do" />
        </View>
        
        <View className='my-5'>
            <Text className='text-brand-text text-lg my-1-2'>Description: </Text>
            <Text className='text-brand-text'>{item.description || "No Description"}</Text> 
        </View>
        
        {
            !item.images || item.images.length === 0 ? (
              <View className="flex-row justify-start items-center mb-6">
                <View className="w-20 h-20 bg-brand-surface border-brand-text-secondary rounded-lg mr-3 justify-center items-center">
                  <MaterialIcons name="image-not-supported" size={24} color="black" />
                </View>
              </View>
          ) :
          (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-6'>
              {item.images.map((image, index) => (
                <View key={index} className="w-20 h-20 bg-brand-surface rounded-lg mr-3 justify-center items-center">
                  <Image source={{uri: image}} className="w-full h-full rounded-lg" />
                </View>
                ))
              }
            </ScrollView>
          )
        }

      <View className='flex-row justify-between items-center'>
        <Button title="Accept" varient='success' size="lg" />

        <Button title="Reject" varient='danger' size="lg"/>
        
        <Button title="Details" varient='outline' size="lg"/>
       </View>

        
    </View>
  )
}

export default RequestServiceCard