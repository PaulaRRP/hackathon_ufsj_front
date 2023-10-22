import * as React from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";

export default function RecordAudio(props) {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.LOW_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();

    const fileData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Agora 'fileData' contém a representação base64 do áudio

    props.base64Audio(fileData);
  }

  return (
    <View className="w-5/12 mt-2">
      <TouchableOpacity
        className="bg-blue-600 p-2 rounded-lg"
        onPress={recording ? stopRecording : startRecording}
      >
        <Text className="text-white text-center">{recording ? 'Parar' : 'Gravar Áudio'}</Text>
        </ TouchableOpacity>
    </View>
  );
}
