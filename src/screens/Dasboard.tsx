import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import React, { useEffect, useState, FC } from 'react'
import TcpSocket from 'react-native-tcp-socket';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">

const Dasboard:FC<Props>  = ({navigation}) => {

  const {email, password, logout} = useAuth()
    const [emailsCount, setEmailsCount] = useState<number>(0);

    const getEmailsCount = () => {
      const client = TcpSocket.connectTLS({
              host: 'imap.gmail.com',
              port: 993,
              tls: true},
              () => {
                console.log('Connected to IMAP server',`A1 LOGIN ${email} ${password}\r\n`);
                client.write(`A1 LOGIN ${email} ${password}\r\n`)
              });
              // jdeh qcrr qsko jlrk #### new app pass
    
    
    let responseBuffer = '';

    client.on('data', data => {
      const decodedData = data.toString('utf-8');
      responseBuffer += decodedData;

      if (responseBuffer.includes('A1 OK')) {
        client.write('A2 SELECT INBOX\r\n');
        responseBuffer = '';
      } else if (responseBuffer.includes('A2 OK')) {
        client.write('A3 STATUS INBOX (MESSAGES)\r\n');
        responseBuffer = '';
      } else if (responseBuffer.includes('MESSAGES')) {
        const match = responseBuffer.match(/MESSAGES (\d+)/);
        if (match) {
          setEmailsCount(parseInt(match[1], 10));
          console.log(JSON.stringify(match))
        }
        client.write('A4 LOGOUT\r\n');
        client.destroy();
      }
    });

    client.on('error', error => {
      Alert.alert('Error', 'Failed to connect to the email server.'+ error);
      client.destroy();
    });


    client.on('close', () => {
      console.log('Connection closed');
    });
  };
  useEffect(()=>{
    getEmailsCount()
  }, [])
  return (
   <View style={styles.container}>
         <Text>Emails in Inbox: {emailsCount}</Text>
         <Button title="Refresh" onPress={getEmailsCount} />
         <Button title="Logout" onPress={()=>{
          logout()
          // navigation.navigate("Login")
          }} />
  </View>
  )
}

export default Dasboard

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})