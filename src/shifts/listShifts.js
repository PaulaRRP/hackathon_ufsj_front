import React, {Component} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from '@react-native-community/datetimepicker'
import axios from 'axios';
import { Text, View, TouchableOpacity, Alert, RefreshControl, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';



export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: 0,
      text: "",
      refreshing: false,
      date: new Date(),
      isFocus: false,
      processes: [],
      shifts: [],
      isModalVisible:false
    };
  }

  componentDidMount() {

    const getProcesses = async () => {
      const response = await axios.get(`http://172.16.172.161:5000/processes`);
      this.setState({processes: response.data})
    }

    const getShifts = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const response = await axios.get(`http://172.16.172.161:5000/shifts?level=${user.level}`);
      this.setState({shifts: response.data})
    }

    getProcesses();
    getShifts();
  }

  render() {
    let shiftsList = []

    const renderLabel = () => {
      if (this.state.value || this.state.isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Dropdown label
          </Text>
        );
      }
      return null;
    };

    
    const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate;

      this.setState({ show: false, date: currentDate });
    };

    const showDatepicker = () => {
      this.setState({show: true})
    };

    this.state.shifts.forEach(async (item, index) => {
      const toggleModal = () => {
        let parameters = ""
        item.parameters.forEach((parameter) => {
          parameters += `${parameter.title}: ${parameter.report}`;
        })
        let text = `Registro feito por ${item.userName} (${item.userContact}): ${parameters}`
          
        this.setState({isModalVisible: !this.state.isModalVisible, text: text});
      }
      shiftsList.push(
      <View key={index}>
        <TouchableOpacity onPress={toggleModal} className="bg-white rounded p-3">
          <Text className="semibold">{item.process}: {item.date_start}</Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
          <View className="p-6 rounded bg-white">
            <Text className="font-bold">
              {this.state.text}
            </Text>
            <Button title='Fechar Turno' onPress={toggleModal}/>
          </View>
        </Modal>
      </View>)
    });

    const onRefresh = () => {
      this.setState({ refreshing: true });

      const getProcesses = async () => {
        const response = await axios.get(`http://172.16.172.161:5000/processes`);
        this.setState({processes: response.data})
      }
  
      const getShifts = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const response = await axios.get(`http://172.16.172.161:5000/shifts?level=${user.level}`);
        this.setState({shifts: response.data})
      }
  
      getProcesses();
      getShifts();
      // Simulando uma solicitação assíncrona
      setTimeout(() => {
        // Após a conclusão da ação de recarregamento, defina refreshing como falso
        this.setState({ refreshing: false});
      }, 2000);
    };
    
    return (
      <ScrollView 
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={onRefresh}
        />
      }>
        <View className="px-6 pt-4">
          <TouchableOpacity className="bg-blue-600 rounded p-2" onPress={showDatepicker}><Text className="text-white text-center">Dia</Text></TouchableOpacity>
          {this.state.show && (
            <DatePicker
              testID="dateTimePicker"
              value={this.state.date}
              mode="date"
              onChange={onChangeDate}
            />
          )}
          <Text className="font-semibold">Filtrar pelo Dia: {this.state.date.toLocaleString()}</Text>
        </View>
        <View className="flex flex-row px-6 py-4 items-center">
          <Dropdown
            className="w-8/12 px-2 bg-white rounded"
            data={this.state.processes}
            labelField="name"
            valueField="_id"
            maxHeight={300}
            placeholder={!this.state.isFocus ? 'Selecionar Processo' : '...'}
            onChange={item => {
              this.state.value = item.value;
              this.state.isFocus = false
            }}
            search
            inputSearchStyle={
              { height: 40, fontSize: 16 }
            }
          />
          <TouchableOpacity className="w-3/12 bg-blue-600 rounded p-2 ml-4"><Text className="text-white semibold text-center">Listar</Text></TouchableOpacity>
        </View>
        <View className="flex intems-center justify-center bg-gray-100 p-6 gap-3">
          {shiftsList}
        </View>
      </ScrollView>
    );
  }
}