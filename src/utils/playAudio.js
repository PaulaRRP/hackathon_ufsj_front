import * as React from 'react';
import { View, TouchableOpacity} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function PlayAudio(props) {

  let playAudio = async () => {
    const soundObject = new Audio.Sound();

    // Carregue o áudio a partir da string base64
    await soundObject.loadAsync({ uri: `data:audio/3gp;base64,${props.base64Audio}` });

    // Reproduza o áudio
    await soundObject.playAsync();
  }

  return (
    <TouchableOpacity onPress={playAudio} className="bg-white rounded-xl w-10 h-10 mt-1 justify-self-end self-end flex items-center justify-center">
        <View className="text-blue-600m text-center"><MaterialCommunityIcons name="play-box-outline" color="rgb(37 99 235)" size={42} /></View>
    </TouchableOpacity>
  );
}
