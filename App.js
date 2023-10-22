console.disableYellowBox = true

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import  HomeScreen from "./src/shifts/listShifts"
import  CurrentShiftScreen from "./src/shifts/currentShift"
import  SettingsScreen from "./src/settings"
import  DashScreen from "./src/dashboard"
import LoginScreen from "./src/login/loginScreen";
import makeIconRender from "./src/utils/makeIconRender";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default function App() {
  const [value, setValue] = useState('')
  const [component, setComponent] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        setValue(JSON.parse(jsonValue))
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        console.log(e)
        // error reading value
      }
    };
    getData()
    
    setComponent(value && value.email ? 
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Turnos"
          component={HomeScreen}
          options={{ tabBarIcon: makeIconRender("home") }}
        />
        <Tab.Screen
          name="Turno Atual"
          component={CurrentShiftScreen}
          options={{ tabBarIcon: makeIconRender("clock") }}
        />
        <Tab.Screen
          name="Métricas"
          component={ DashScreen }
          options={{ tabBarIcon: makeIconRender("chart-line") }}
        />
        <Tab.Screen
          name="Logout"
          component={ SettingsScreen }
          options={{ tabBarIcon: makeIconRender("logout") }}
        />
      </Tab.Navigator>
    </NavigationContainer> 
    : 
    <LoginScreen />)
  }, [ value ])

    return (component);

}
