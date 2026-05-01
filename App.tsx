import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FocusScreen } from './src/screens/FocusScreen';
import { CalibrationScreen } from './src/screens/CalibrationScreen';
import { TaskScreen } from './src/screens/TaskScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BrainDumpScreen } from './src/screens/BrainDumpScreen';
import { VaultScreen } from './src/screens/VaultScreen';
import { Timer, ClipboardList, Settings as SettingsIcon, Brain, FileText } from 'lucide-react-native';
import { COLORS } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FocusStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FocusMain" component={FocusScreen} />
      <Stack.Screen name="Calibration" component={CalibrationScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Inbox') {
              return <Brain size={size} color={color} />;
            } else if (route.name === 'Focus') {
              return <Timer size={size} color={color} />;
            } else if (route.name === 'Tasks') {
              return <ClipboardList size={size} color={color} />;
            } else if (route.name === 'Vault') {
              return <FileText size={size} color={color} />;
            } else if (route.name === 'Settings') {
              return <SettingsIcon size={size} color={color} />;
            }
            return null;
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.canvas,
            borderTopColor: COLORS.border,
            height: 90,
            paddingBottom: 30,
          }
        })}
      >
        <Tab.Screen name="Inbox" component={BrainDumpScreen} />
        <Tab.Screen name="Focus" component={FocusStack} />
        <Tab.Screen name="Tasks" component={TaskScreen} />
        <Tab.Screen name="Vault" component={VaultScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
