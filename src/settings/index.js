import React, {Component} from 'react';

import { Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default class SettingsScreen extends Component {
  componentDidMount() {
    const deleteSession = async () => {
      try {
        await AsyncStorage.setItem('user', "");
      } catch (e) {
        // saving error
      }
    };

    deleteSession();
  }
  render(){
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-800">Settingsss!</Text>
      </View>
    );
  }
}