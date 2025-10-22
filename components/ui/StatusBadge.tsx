import { ServiceRequest } from '@/context/RequestContext';
import React from 'react';
import { Text, View } from 'react-native';

const StatusBadge = ({ status }: { status: ServiceRequest['status'] }) => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'Complete':
      bgColor = 'bg-brand-green';
      textColor = 'text-white';
      break;

    case 'In Progress':
      bgColor = 'bg-brand-yellow';
      textColor = 'text-black';
      break;

    case 'To Do':
      bgColor = 'bg-red-600';
      textColor = 'text-white';
      break;

    default:
      bgColor = 'bg-gray-400';
      textColor = 'text-black';
  }

  return (
    <View className={`px-3 py-1 rounded-full ${bgColor}`}>
      <Text className={`font-semibold text-xs ${textColor}`}>{status}</Text>
    </View>
  )
}

export default StatusBadge