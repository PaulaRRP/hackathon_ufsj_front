import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text, View } from 'react-native';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          issues: [],
          shifts: [],
        };
    }
    componentDidMount() {
        const getShifts = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const response = await axios.get(`http://172.16.172.161:5000/shifts?level=${user.level}`);

            this.setState({ shifts: response.data })
        }

        getShifts();

        let issues = this.state.shifts.filter((shift) => {
            shift.parameters.forEach(parameter => {
                return parameter.report.includes("problema") || parameter.report.includes("anomalia") || parameter.report.includes("defeito") || parameter.report.includes("quebr") || parameter.report.includes("manutenção") || parameter.report.includes("manutencao")
            });
        })

        this.setState({ issues: issues })

        // console.log(issues)

    }
    render(){
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-slate-800">Número de problemas nos últimos 10 dias:</Text>
                <Text className="font-semibold">{this.state.issues.length}</Text>
            </View>
        );
    }
}