import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import {  } from 'nativewind';
import { useAuth } from '../../context/AuthContext';
import { useRequests, ServiceRequest } from '../../context/RequestContext';
import { Link, useRouter } from 'expo-router';

const StatusBadge = ({ status }: { status: ServiceRequest['status'] }) => {
  const bgColor = status === 'Complete' ? 'bg-brand-green' : 'bg-brand-yellow';
  const textColor = status === 'Complete' ? 'text-white' : 'text-black';
  return (
    <View className={`px-3 py-1 rounded-full ${bgColor}`}>
      <Text className={`font-semibold text-xs ${textColor}`}>{status}</Text>
    </View>
  );
};

const RequestCard = ({ item }: { item: ServiceRequest }) => (
  <View className="bg-brand-surface p-4 rounded-lg mb-3 flex-row justify-between items-center">
    <Text className="text-brand-text text-lg">{item.title}</Text>
    <StatusBadge status={item.status} />
  </View>
);

export default function HomeScreen() {
  const { user } = useAuth();
  const { requests } = useRequests();
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

        <FlatList
          data={requests}
          renderItem={({ item }) => <RequestCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text className="text-brand-text-secondary">No requests yet.</Text>
            </View>
          }
        />

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