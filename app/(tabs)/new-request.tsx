import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRequests } from "../../context/RequestContext";

// Service types
interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  description: string;
}

const SERVICE_TYPES: ServiceType[] = [
  {
    id: "painting-interior",
    name: "Interior Painting",
    basePrice: 150,
    unit: "per room",
    description: "Professional interior painting services",
  },
  {
    id: "painting-exterior",
    name: "Exterior Painting",
    basePrice: 250,
    unit: "per wall",
    description: "Exterior wall painting and finishing",
  },
  {
    id: "renovation-kitchen",
    name: "Kitchen Renovation",
    basePrice: 15000,
    unit: "per project",
    description: "Complete kitchen renovation and remodeling",
  },
  {
    id: "renovation-bathroom",
    name: "Bathroom Renovation",
    basePrice: 12000,
    unit: "per project",
    description: "Full bathroom renovation services",
  },
  {
    id: "renovation-general",
    name: "General Renovation",
    basePrice: 8000,
    unit: "per project",
    description: "General home renovation and repairs",
  },
  {
    id: "cleaning-residential",
    name: "Residential Cleaning",
    basePrice: 350,
    unit: "per session",
    description: "Deep cleaning for homes",
  },
  {
    id: "cleaning-commercial",
    name: "Commercial Cleaning",
    basePrice: 800,
    unit: "per session",
    description: "Professional office and commercial cleaning",
  },
  {
    id: "pest-control-general",
    name: "General Pest Control",
    basePrice: 600,
    unit: "per treatment",
    description: "Pest inspection and treatment",
  },
  {
    id: "pest-control-fumigation",
    name: "Fumigation Services",
    basePrice: 1200,
    unit: "per property",
    description: "Complete property fumigation",
  },
];

export default function NewRequestScreen() {
  const { addRequest } = useRequests();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Form state
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Dropdown state
  const [showServicePicker, setShowServicePicker] = useState(false);

  // Pre-select service if serviceId is passed
  useEffect(() => {
    if (params.serviceId) {
      const service = SERVICE_TYPES.find((s) => s.id === params.serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [params.serviceId]);

  // Calculate total cost
  const calculateTotal = (): number => {
    if (!selectedService) return 0;
    const qty = parseInt(quantity) || 1;
    return selectedService.basePrice * qty;
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selected]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedService) {
      Alert.alert("Validation Error", "Please select a service type.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Phone number is required.");
      return;
    }

    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid South African phone number (e.g., 0821234567 or +27821234567)"
      );
      return;
    }

    if (!address.trim()) {
      Alert.alert("Validation Error", "Street address is required.");
      return;
    }

    if (!city.trim()) {
      Alert.alert("Validation Error", "City is required.");
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty < 1) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid quantity (minimum 1)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const totalCost = calculateTotal();
      const enhancedDescription = `${description}\n\nService: ${
        selectedService.name
      }\nQuantity: ${qty} ${
        selectedService.unit
      }\nEstimated Cost: R${totalCost.toFixed(2)}`;

      await addRequest({
        title: selectedService.name,
        description: enhancedDescription,
        clientPhone: phoneNumber,
        location: {
          address: address.trim(),
          city: city.trim(),
          suburb: suburb.trim() || undefined,
        },
        photoUrls: images,
      });

      setSelectedService(null);
      setDescription("");
      setPhoneNumber("");
      setAddress("");
      setCity("");
      setSuburb("");
      setQuantity("1");
      setImages([]);

      Alert.alert("Success", "Your service request has been submitted!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/my-requests"),
        },
      ]);
    } catch (error: any) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-brand-dark">
      <ScrollView className="p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome name="arrow-left" size={24} color="#0A84FF" />
          </TouchableOpacity>
          <Text className="text-brand-text text-2xl font-bold">
            New Service Request
          </Text>
        </View>

        {/* Service Type Dropdown */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Service Type:
        </Text>
        <TouchableOpacity
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4 flex-row justify-between items-center"
          onPress={() => setShowServicePicker(true)}
          disabled={isSubmitting}
        >
          <Text
            className={
              selectedService ? "text-brand-text" : "text-brand-text-secondary"
            }
          >
            {selectedService ? selectedService.name : "Select a service..."}
          </Text>
          <FontAwesome name="chevron-down" size={16} color="#8E8E93" />
        </TouchableOpacity>

        {/* Show service details if selected */}
        {selectedService && (
          <View className="bg-brand-surface p-4 rounded-lg mb-4">
            <Text className="text-brand-text-secondary text-sm mb-1">
              {selectedService.description}
            </Text>
            <Text className="text-brand-light-blue text-sm font-semibold">
              Base Price: R{selectedService.basePrice.toFixed(2)}{" "}
              {selectedService.unit}
            </Text>
          </View>
        )}

        {/* Quantity */}
        {selectedService && (
          <>
            <Text className="text-brand-text text-lg font-semibold mb-2">
              Quantity ({selectedService.unit}):
            </Text>
            <TextInput
              className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
              placeholder="Enter quantity"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              editable={!isSubmitting}
            />
          </>
        )}

        {/* Description */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Additional Details:
        </Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4 h-32"
          placeholder="Provide more details about your request..."
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          editable={!isSubmitting}
        />

        {/* Contact Number */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Contact Number:
        </Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., 0821234567"
          placeholderTextColor="#8E8E93"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!isSubmitting}
        />

        {/* Street Address */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Street Address:
        </Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., 123 Main Street"
          placeholderTextColor="#8E8E93"
          value={address}
          onChangeText={setAddress}
          editable={!isSubmitting}
        />

        {/* Suburb */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Suburb (Optional):
        </Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-4"
          placeholder="e.g., Midrand"
          placeholderTextColor="#8E8E93"
          value={suburb}
          onChangeText={setSuburb}
          editable={!isSubmitting}
        />

        {/* City */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          City:
        </Text>
        <TextInput
          className="w-full bg-brand-surface text-brand-text p-4 rounded-lg mb-6"
          placeholder="e.g., Johannesburg"
          placeholderTextColor="#8E8E93"
          value={city}
          onChangeText={setCity}
          editable={!isSubmitting}
        />

        {/* Image Upload Section */}
        <Text className="text-brand-text text-lg font-semibold mb-2">
          Photos (Optional):
        </Text>

        {images.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {images.map((uri, index) => (
              <View key={index} className="relative mr-2 mb-2">
                <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                  onPress={() => removeImage(index)}
                >
                  <FontAwesome name="times" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className="bg-brand-surface p-3 rounded-lg items-center flex-row justify-center mb-6"
          disabled={isSubmitting}
          onPress={pickImages}
        >
          <FontAwesome name="camera" size={16} color="#0A84FF" />
          <Text className="text-brand-text font-bold ml-2">
            {images.length > 0 ? "Add More Photos" : "Add Photos"}
          </Text>
        </TouchableOpacity>

        {/* Cost Estimate */}
        {selectedService && (
          <View className="bg-brand-blue/20 border-2 border-brand-blue p-4 rounded-lg mb-6">
            <Text className="text-brand-text text-lg font-semibold mb-2">
              Cost Estimate
            </Text>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-brand-text-secondary">
                {selectedService.name} x {quantity}
              </Text>
              <Text className="text-brand-text">
                R
                {(
                  selectedService.basePrice * (parseInt(quantity) || 1)
                ).toFixed(2)}
              </Text>
            </View>
            <View className="border-t border-brand-text-secondary/30 mt-2 pt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-brand-text text-xl font-bold">
                  Total Estimate:
                </Text>
                <Text className="text-brand-light-blue text-2xl font-bold">
                  R{calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
            <Text className="text-brand-text-secondary text-xs mt-2 italic">
              * This is an estimate. Final quote will be provided after
              assessment.
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className={`w-full p-4 mb-2 rounded-lg items-center ${
            isSubmitting ? "bg-gray-500" : "bg-brand-blue"
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Service Picker Modal */}
      <Modal
        visible={showServicePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowServicePicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-brand-dark rounded-t-3xl max-h-[70%]">
            <View className="p-4 border-b border-brand-surface flex-row justify-between items-center">
              <Text className="text-brand-text text-xl font-bold">
                Select Service
              </Text>
              <TouchableOpacity onPress={() => setShowServicePicker(false)}>
                <FontAwesome name="times" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SERVICE_TYPES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-brand-surface/50"
                  onPress={() => {
                    setSelectedService(item);
                    setShowServicePicker(false);
                  }}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-brand-text text-lg font-semibold mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-brand-text-secondary text-sm mb-2">
                        {item.description}
                      </Text>
                      <Text className="text-brand-light-blue text-sm font-semibold">
                        R{item.basePrice.toFixed(2)} {item.unit}
                      </Text>
                    </View>
                    {selectedService?.id === item.id && (
                      <FontAwesome
                        name="check-circle"
                        size={24}
                        color="#0A84FF"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
