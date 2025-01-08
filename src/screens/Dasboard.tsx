import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TcpSocket from 'react-native-tcp-socket';
import {useAuth} from '../context/AuthContext';
import CarouselComponent from '../components/Carousel';

const Dasboard = () => {
  const {email, password, logout} = useAuth();
  const [emailsCount, setEmailsCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const getEmailsCount = () => {
    setLoading(true);
    let responseBuffer = '';
    const client = TcpSocket.connectTLS(
      {
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
      },
      () => {
        console.log(email, password, "rrr")
        if(email && password) {
          client.write(`A1 LOGIN ${email} ${password}\r\n`)
        } else {
          ToastAndroid.show('Please try again', ToastAndroid.SHORT);
          client.destroy()
        }
      },
    );

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
        }
        setLoading(false);
        client.write('A4 LOGOUT\r\n');
        client.destroy();
      }
    });

    client.on('error', error => {
      setLoading(false);
      Alert.alert('Error', 'Failed to connect to the email server.' + error);
      client.destroy();
    });

    client.on('close', () => {
      setLoading(false);
      ToastAndroid.show('Connection closed', ToastAndroid.SHORT);
    });
  };

  useEffect(() => {
    getEmailsCount();
  }, []);
  return (
    <View style={styles.container}>
      <CarouselComponent />
      <View style={styles.emailContainer}>
      <View style={{flex:1, width:"100%"}}>
        <Text style={styles.emailCountTitle}>EMAIL COUNT</Text>
        {loading ? (
          <ActivityIndicator size={120} style={{margin: 20}} />
        ) : (
          <Text style={styles.emailCount}>{emailsCount}</Text>
        )}
   
          <TouchableOpacity
            disabled={loading}
            onPress={getEmailsCount}
            style={styles.buttonContaier}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={[styles.buttonContaier, {backgroundColor:"#8EB69B"}]}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Dasboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAF1DE',
  },
  emailContainer: {
    flex: 1,
    margin: 16,
    justifyContent: 'center',
    alignItems:'center'
  },
  emailCountTitle: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '600',
    color: '#0B2B26',
  },
  emailCount: {
    fontSize: 120,
    color: '#051f20',
    fontWeight: '900',
    textAlign: 'center',
  },
  buttonContaier: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#235347',
    borderRadius: 16,
    flex:1,
    justifyContent:"center",
    alignItems:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign:"center",
  },
});
