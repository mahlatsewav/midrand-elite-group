import { useAuth } from '@/context/AuthContext'
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface WorkStatsProps {
  id: string;
  title: string;
  total?: number;
  icon: string;
  color: string;

  subtitle?: string;
  workerName?: string;
  rating?: number;
  highlight?: boolean;
}

const WorkStats: WorkStatsProps[] = [
  {
    id: "1",
    title: "Jobs In Progress",
    total: 8,
    subtitle: "Out of 29",
    icon: "progress-clock",
    color: "bg-emerald-500",
  },
  {
    id: "2",
    title: "New Requests",
    total: 5,
    subtitle: "Awaiting assignment",
    icon: "inbox-arrow-down",
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Earnings (Month)",
    total: 12540,
    subtitle: "This month",
    icon: "cash-multiple",
    color: "bg-yellow-500",
  },
  {
    id: "4",
    title: "Worker of the Week",
    workerName: "Thabo",
    subtitle: "12 jobs completed",
    icon: "medal-outline",
    color: "bg-purple-500",
    highlight: true,
  },
  {
    id: "5",
    title: "Worker Performance Score",
    rating: 4.7,
    subtitle: "Average rating",
    icon: "account-star",
    color: "bg-red-500",
  }
]

const AdminDashboard = () => {

  const { user } = useAuth()

  const StatsCard = ({ item }: { item: WorkStatsProps }) => (
    <TouchableOpacity
      className={`bg-brand-surface rounded-xl mb-4 overflow-hidden ${item.highlight ? "border border-brand-light-blue" : ""}`}
      activeOpacity={0.7}
    >
      <View className='flex-row'>
        
        {/* Icon Section */}
        <View className={`${item.color} w-24 justify-center items-center p-8`}>
          <MaterialCommunityIcons name={item.icon as any} size={27} color="#fff" />
        </View>

        {/* Content Section */}
        <View className='flex-1 p-4'>
          
          <Text className='text-brand-text text-lg font-bold mb-1'>
            {item.title}
          </Text>

          {/* Worker of the Week */}
          {item.workerName && (
            <Text className='text-brand-light-blue text-lg font-extrabold'>
              {item.workerName}
            </Text>
          )}

          {/* Rating */}
          {item.rating && (
            <Text className="text-yellow-400 font-bold text-lg" style={{color: "#facc15"}}>
              ⭐ {item.rating.toFixed(1)}
            </Text>
          )}

          {/* Subtitle */}
          {item.subtitle && (
            <Text className="text-brand-text-secondary text-sm mb-1">
              {item.subtitle}
            </Text>
          )}

          {/* Total (number or money) */}
          {typeof item.total === "number" && (
            <Text className='text-brand-text font-extrabold text-xl'>
              {item.icon === "cash-multiple"
                ? `R ${item.total.toLocaleString()}`
                : item.total}
            </Text>
          )}

        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className='bg-brand-dark flex-1'>
      
      {/* Header */}
      <View className='p-3'>
        <Text className='font-bold text-3xl text-brand-text mb-2'>
          Welcome,{" "}
          <Text className='text-brand-light-blue'>{user?.firstName}</Text>
        </Text>
        <Text className="text-brand-text-secondary text-lg">
          Keep track of weekly tasks
        </Text>
      </View>

      {/* Top Stats */}
      <View className='flex-row justify-evenly p-5 py-7 gap-8'>
        
        <View className='bg-brand-surface rounded-xl p-5 max-w-2xl'>
          <View className='flex-row gap-3 items-center'>
            <Feather name="check-circle" size={16} color="#29f22d" />
            <Text className='font-bold text-brand-text'>JOBS DONE</Text>
          </View>
          <Text className='text-brand-text font-extrabold text-center'>12</Text>
        </View>

        <View className='bg-brand-surface rounded-xl p-5 max-w-2xl'>
          <View className='flex-row gap-3 items-center'>
            <FontAwesome6 name="people-group" size={16} color="#007AFF" />
            <Text className='font-bold text-brand-text'>WORKERS</Text>
          </View>
          <Text className='text-brand-text font-extrabold text-center'>37</Text>
        </View>

      </View>

      {/* Stats List */}
      <View className='' style={{flex: 1, paddingHorizontal: 12 }}>
        <FlatList
          data={WorkStats}
          renderItem={StatsCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 10, }}
          showsVerticalScrollIndicator={false}
        />
       </View>
    
    </SafeAreaView>
  )
}

export default AdminDashboard
