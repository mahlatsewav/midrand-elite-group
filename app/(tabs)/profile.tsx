import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { } from 'nativewind';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-brand-text text-2xl mb-2">Profile</Text>
        <Text className="text-brand-text-secondary text-lg mb-8">{user?.email}</Text>
        <TouchableOpacity
          className="w-full bg-red-600 p-4 rounded-lg items-center"
          onPress={signOut}
        >
          <Text className="text-white font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}