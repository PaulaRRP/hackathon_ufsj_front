import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    Text,
    Image
} from 'react-native';

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
};

const LoginScreen = props => {
    // const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);

    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordView, setPasswordView] = useState(true);

    const [formValid, setFormValid] = useState(false);

    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPassword, setTouchedPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    //Animações ao abrir teclado:
    const [Size] = useState(new Animated.Value(32));
    const [logo] = useState(new Animated.ValueXY({ x: 180, y: 160 }));

    function keyboardDidShow() {
        Animated.parallel([
            Animated.timing(logo.x, {
                toValue: 70,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(logo.y, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(Size, {
                toValue: 16,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    }

    function keyboardDidHide() {
        Animated.parallel([
            Animated.timing(logo.x, {
                toValue: 180,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(logo.y, {
                toValue: 160,
                duration: 400,
                useNativeDriver: false,
            }),
            Animated.timing(Size, {
                toValue: 32,
                duration: 400,
                useNativeDriver: false,
            }),
        ]).start();
    }

    const onEmailChange = (emailInput) => {
        // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@amg-br\.com$/
        let isValid = true;
        if (emailInput.length === 0 || !emailRegex.test(emailInput.toLowerCase())) {
            isValid = false;
        }

        setIsEmailValid(isValid);
        setEmail(emailInput);
    };

    const onPasswordChange = (passwordInput) => {
        let isValid = true;

        if (passwordInput.length === 0) {
            isValid = false;
        }
        setIsPasswordValid(isValid);
        setPassword(passwordInput);
    };

    const lostFocusEmail = () => {
        setTouchedEmail(true);
    };
    const lostFocusPassword = () => {
        setTouchedPassword(true);
    };

    const signinHandler = useCallback(async () => {
        setError(null);
        try {
            setLoading(true);
            const userInfo = {
                "email": email,
                "password": password
            }
            const response = await axios.post(`http://172.16.172.161:5000/login`, userInfo,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            await storeData(response.data)
            console.log(response.status)
        } catch (err) {
            console.log(err)
            setLoading(false);
            setError(err.message);
        }
    // }, [dispatch, email, password]);
    }, [email, password]);

    // esqueceu senha
    const goToResetPassword = () => {
        props.navigation.navigate('ResetPassword');
    };
    // esqueceu senha

    useEffect(() => {
        setFormValid(isEmailValid && isPasswordValid);
    }, [email, password]);


    if (loading) {
        return (
            <View>
                <ActivityIndicator size='large' color={'blue'} />
            </View>
        );
    }

    let passwordInput;

    const loginButtonClasses = formValid ? 'bg-blue-600 ' : 'bg-blue-300'

    return (
        <View className="flex">
            <View className="flex flex-col items-center">
                <KeyboardAvoidingView className="w-10/12 mt-6" enabled behavior={'height'}>
                    <Image
                       className="h-40 px-6 overflow-visible w-7/12 ml-16 mt-40 mb-16"
                        source={require('./logo1.png')}
                    />
                    <Text className="px-4">E-mail</Text>
                    <View className="px-4">
                        <TextInput
                            className="bg-white border rounded border-gray-300 py-1 px-2"
                            placeholder="Insira seu e-mail"
                            onSubmitEditing={() => passwordInput.focus()}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            returnKeyType='next'
                            value={email}
                            onChangeText={onEmailChange}
                            selectionColor="blue"
                            onBlur={lostFocusEmail}
                        />
                    </View>
                    {!isEmailValid && touchedEmail && (
                        <View>
                            <Text className="text-red-600">E-mail Inválido</Text>
                        </View>
                    )}

                    <Text className="px-4 mt-4">Senha</Text>
                    <View className="px-4">
                        <TextInput
                            className="bg-white border rounded border-gray-300 py-1 px-2"
                            placeholder="Insira sua Senha"
                            secureTextEntry={passwordView}
                            autoCapitalize='none'
                            returnKeyType='go'
                            ref={(input) => (passwordInput = input)}
                            value={password}
                            onChangeText={onPasswordChange}
                            onBlur={lostFocusPassword}
                        />
                        {/* {
                            passwordView ?
                                <TouchableOpacity onPress={() => setPasswordView(false)}><MaterialCommunityIcons name="eye" color="white" size={18} /></TouchableOpacity>
                            :
                                <TouchableOpacity onPress={() => setPasswordView(true)}> <MaterialCommunityIcons name="eye-off-outline" color="white" size={18} /></TouchableOpacity>
                        } */}
                    </View>

                    {!isPasswordValid && touchedPassword && (
                        <View>
                            <Text className="text-red-600">Senha válida</Text>
                        </View>
                    )}
                </KeyboardAvoidingView>

                {/* esqueceu senha */}
                <TouchableOpacity className="self-end px-12 mt-1" onPress={goToResetPassword}>
                    <Text className="text-blue-600 font-bold" >Esqueci a senha</Text>
                </TouchableOpacity>
                {/* esqueceu senha */}


                <View className="flex flex-row mt-12 gap-x-0.5 w-9/12">
                    <TouchableOpacity className={`rounded-l-xl p-2 w-6/12 ${loginButtonClasses}`} onPress={signinHandler} disabled={!formValid}><Text className="text-white text-center">Login</Text></TouchableOpacity>
                    <TouchableOpacity className="bg-blue-600 rounded-r-xl p-2 w-6/12" onPress={() => props.navigation.navigate('Cadastro')} activeOpacity={0.4}><Text className="text-white text-center">Cadastro</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default LoginScreen;