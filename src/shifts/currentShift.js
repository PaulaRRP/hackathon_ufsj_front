import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import RecordAudio from '../utils/recordAudio';
import  PlayAudio from '../utils/playAudio';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class CurrentShiftScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStart: false,
      showEnd: false,
      mode:"date",
      isRecording: false,
      start: new Date(),
      end: new Date,
      process: "",
      processes:[],
      list: [
        {
          title: "",
          report: "",
          audio: "",
        },
      ],
    };
  }

  componentDidMount() {

    const getProcesses = async () => {
      const response = await axios.get(`http://172.16.172.161:5000/processes`);
      this.setState({processes: response.data})
    }

    getProcesses();
  }

  render() {    
    let inputsList = [];


    let onChangeTitleHandle = (text, index) => {
      const updatedList = [...this.state.list];

      updatedList[index].title = text

      this.setState({ list: updatedList });
    }
    let onChangeReportHandle = (text, index) => {
      const updatedList = [...this.state.list];

      updatedList[index].report = text
      
      this.setState({ list: updatedList });
    }

    let addNewItem = () => {
      const updatedList = [...this.state.list];

      updatedList.push({
        title: "",
        report: "",
        audio: "",
      });

      this.setState({ list: updatedList });
    }

    const self = this;
    this.state.list.forEach(async (item, index) => {
      let removeItem = () => {
        const updatedList = [...self.state.list];
  
        updatedList.splice(index, 1)
  
        self.setState({ list: updatedList });
      }

      let updateAudio = (base64Audio) => {
        const updatedList = [...self.state.list];

        updatedList[index].audio = base64Audio
        self.setState({list: updatedList});
      }

  
      inputsList.push(
        <View key={index} className="flex flex-col bg-white rounded p-2">
          <Text className="">Parâmetro</Text>
          <TextInput
            className="p-1 border rounded border-gray-300 mt-1"
            onChangeText={(text) => onChangeTitleHandle(text, index)}
            value={item.title}
          />

          <Text className="mt-1">Registro</Text>
          <TextInput
            multiline={true}
            className="p-1 border rounded border-gray-300 mt-1"
            onChangeText={(text) => onChangeReportHandle(text, index)}
            value={item.report}
          />
          <View className="flex flex-row mt-2">
            <RecordAudio base64Audio={updateAudio} />
            {
              (item.audio !== "" && <PlayAudio  base64Audio={item.audio}/>)
            }
          </View>

          <TouchableOpacity onPress={removeItem} className="bg-red-700 rounded-xl w-8 h-8 mt-2 justify-self-end self-end flex items-center justify-center">
            <View className="text-white text-center"><MaterialCommunityIcons name="trash-can-outline" color="white" size={18} /></View>
          </TouchableOpacity>
        </View>
      );
    });

    const onChangeStartDate = (event, selectedDate) => {
      const currentDate = selectedDate;

      this.setState({ showStart: false, start: currentDate });
    };
    const onChangeEndDate = (event, selectedDate) => {
      const currentDate = selectedDate;

      this.setState({ showEnd: false, end: currentDate });
    };

    const showModeStart = (currentMode) => {
      this.setState({showStart: true, mode: currentMode})
    };
    const showModeEnd = (currentMode) => {
      this.setState({showEnd: true, mode: currentMode})
    };

    const showDatepickerStart = () => {
      showModeStart('date');
    };
    const showTimepickerStart = () => {
      showModeStart('time');
    };

    const showDatepickerEnd = () => {
      showModeEnd('date');
    };
    const showTimepickerEnd = () => {
      showModeEnd('time');
    };

    const saveShift = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const shiftInfo = {
        "date_start": this.state.start,
        "date_end": this.state.end,
        "process": this.state.process,
        "parameters": this.state.list,
        "userId": user._id,
        "userName": user.name,
        "userContact": user.contact,

      }
      const response = await axios.post(`http://172.16.172.161:5000/store_shift`, shiftInfo,{
          headers: {
              'Content-Type': 'application/json'
          }
      });

      console.log(response.status)
    };


    return (
      <ScrollView>
        <View className="flex intems-center justify-center bg-gray-100 p-6 gap-3">
        <View>
          <Text className="font-semibold text-center">Selecione nos botões abaixo:</Text>
          <View className="flex flex-row py-4 items-center">
            <Dropdown
              className="w-full px-2 bg-white rounded"
              data={this.state.processes}
              labelField="name"
              valueField="name"
              maxHeight={300}
              placeholder={!this.state.isFocus ? 'Selecionar Processo' : '...'}
              onChange={item => {
                this.setState({process: item.value});
                this.state.isFocus = false
              }}
              search
              inputSearchStyle={
                { height: 40, fontSize: 16 }
              }
            />
          </View>
          <View className="flex flex-row mt-4 gap-x-0.5">
            <TouchableOpacity className="bg-blue-600 rounded-l-xl p-2 w-6/12" onPress={showDatepickerStart}><Text className="text-white text-center">Dia</Text></TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 rounded-r-xl p-2 w-6/12" onPress={showTimepickerStart}><Text className="text-white text-center">Horário Início</Text></TouchableOpacity>
          </View>
          <Text className="font-semibold">Horário de Entrada: {this.state.start.toLocaleString()}</Text>
          <View className="flex flex-row mt-4 gap-x-0.5">
            <TouchableOpacity className="bg-blue-600 rounded-l-xl p-2 w-6/12" onPress={showDatepickerEnd}><Text className="text-white text-center">Dia</Text></TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 rounded-r-xl p-2 w-6/12" onPress={showTimepickerEnd}><Text className="text-white text-center">Horário Saída</Text></TouchableOpacity>
          </View>
          <Text className="font-semibold">Horário de Saída: {this.state.end.toLocaleString()}</Text>

          {this.state.showStart && (
            <DatePicker
              testID="dateTimePicker"
              value={this.state.start}
              mode={this.state.mode}
              is24Hour={true}
              onChange={onChangeStartDate}
            />
          )}
          {this.state.showEnd && (
            <DatePicker
              testID="dateTimePicker"
              value={this.state.end}
              mode={this.state.mode}
              is24Hour={true}
              onChange={onChangeEndDate}
            />
          )}
        </View>
          {inputsList}
          <TouchableOpacity onPress={addNewItem} className="bg-blue-600 rounded-xl w-8 h-8 flex items-center justify-center">
            <Text className="text-white text-center text-lg">+</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={saveShift} className="flex w-full p-3 mt-6 rounded-lg bg-green-600"><Text className="text-center text-white">Salvar</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}