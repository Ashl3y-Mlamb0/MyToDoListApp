import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as expoRouter from 'expo-router';

// Create a router instance that we can type-cast when needed
const router = expoRouter.router;

// Define types for the navigator
type NestedStackParamList = {
  Home: undefined;
  Details: { itemId: string };
};

// Create a typed stack navigator
const Stack = createNativeStackNavigator<NestedStackParamList>();

// Screen component types
type HomeScreenProps = {
  navigation: {
    navigate: (screen: keyof NestedStackParamList, params?: any) => void;
  };
};

type DetailsScreenProps = {
  route: {
    params: { itemId: string };
  };
  navigation: {
    goBack: () => void;
  };
};

// Screen components
function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Nested Stack Home</Text>
      <Button
        title="View Item #123"
        onPress={() => navigation.navigate('Details', { itemId: '123' })}
      />
      <Button
        title="Go back to main app"
        onPress={() => (router as any).back()}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  const { itemId } = route.params;
  
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

// Export the navigator component
export default function NestedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Nested Home',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
          title: 'Item Details',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }} 
      />
    </Stack.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 