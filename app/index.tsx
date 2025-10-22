import 'nativewind';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    console.log('Attempting sign in with:', email);
    try {
      await signIn(email, password);
      console.log('Sign in successful!');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      let errorMessage = 'An error occurred during sign in';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your internet connection';
          break;
        default:
          errorMessage = error.message || 'Sign in failed';
      }
      
      Alert.alert('Sign In Error', errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-brand-dark p-6">
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require('../assets/meg-logo.png')}
          className="rounded-full mb-10"
          style={{ width: 300, height: 300 }}
          resizeMode="cover"
        />
        <Text className="text-3xl font-bold text-brand-text mb-8 w-full">Sign In</Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="Email"
          placeholderTextColor="#8E8E93"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6"
          placeholder="Password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="w-full bg-brand-blue p-4 rounded-lg items-center"
          onPress={handleSignIn}
        >
          <Text className="text-white font-bold text-lg">Sign in</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between w-full mt-6">
          <TouchableOpacity
            onPress={() => Alert.alert('Forgot Password', 'This feature is not yet implemented.')}
          >
            <Text className="text-brand-light-blue">Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/sign-up')}
          >
            <Text className="text-brand-light-blue">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}