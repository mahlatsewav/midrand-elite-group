import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import 'nativewind';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const { signIn } = useAuth();

  const handleSignIn = () => {
    signIn();
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require('../assets/meg-logo.png')}
          className="w-40 h-20 rounded-full mb-10"
        />
        <Text className="text-3xl font-bold text-brand-text mb-8 w-full"> Sign In </Text>
        
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="Email"
          placeholderTextColor="#8E8E93"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6"
          placeholder="Password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
        />
        
        <TouchableOpacity
          className="w-full bg-brand-blue p-4 rounded-lg items-center"
          onPress={handleSignIn}
        >
          <Text className="text-white font-bold text-lg">Sign in</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-between w-full mt-6">
          <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'This feature is not yet implemented.')}>
            <Text className="text-brand-light-blue">Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Sign Up', 'This feature is not yet implemented.')}>
            <Text className="text-brand-light-blue">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}