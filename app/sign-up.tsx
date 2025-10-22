import 'nativewind';
import React, { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Validation
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    console.log('Attempting sign up with:', email, firstName);
    try {
      await signUp(email, password, firstName);
      console.log('Sign up successful!');
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Sign-up error:', error);
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your internet connection';
          break;
        default:
          errorMessage = error.message || 'Sign up failed';
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-brand-dark">
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require('../assets/meg-logo.png')}
          className="rounded-full mb-10 mt-12"
          style={{ width: 200, height: 200 }}
          resizeMode="cover"
        />
        <Text className="text-3xl font-bold text-brand-text mb-8 w-full">Create Account</Text>
        
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="First Name"
          placeholderTextColor="#8E8E93"
          autoCapitalize="words"
          value={firstName}
          onChangeText={setFirstName}
        />
        
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
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="Password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6"
          placeholder="Confirm Password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <TouchableOpacity
          className="w-full bg-brand-blue p-4 rounded-lg items-center mb-4"
          onPress={handleSignUp}
        >
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-center w-full mt-4">
          <Text className="text-brand-text-secondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-brand-light-blue font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}