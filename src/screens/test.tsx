import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

const EmailDashboard = ({ email, appPassword }: { email: string; appPassword: string }) => {
  const [emailCount, setEmailCount] = useState(0);

  const fetchEmailCount = () => {
    const client = TcpSocket.connectTLS(
      {
        host: 'imap.gmail.com',
        port: 993,
        tls: true, // Enable SSL/TLSs
        
      },
      () => {
        console.log('Connected to IMAP server');
        // Send LOGIN command with email and app password
 
       
        client.write(`A1 LOGIN ${email} ${appPassword}\r\n`)

      }
    );

    
    
    let responseBuffer = '';

    client.on('data', (data) => {
      console.log(client.connecting)
      // Convert the raw buffer data to a string for easier handling
      const decodedData = data.toString('utf-8');
      console.log('Raw Buffer Data:', data);
      console.log('Decoded Data:', decodedData);

      responseBuffer += decodedData;

      // Check if we got the LOGIN response (A1 OK)
      if (responseBuffer.includes('A1 OK')) {
        console.log('LOGIN successful!');
        // Send SELECT INBOX command
        client.write('A2 SELECT INBOX\r\n');
        responseBuffer = ''; // Clear buffer for next response
      }
      // Check if the SELECT INBOX response is OK (A2 OK)
      else if (responseBuffer.includes('A2 OK')) {
        console.log('Inbox selected!');
        // Send STATUS command to fetch email count
        client.write('A3 STATUS INBOX (MESSAGES)\r\n');
        responseBuffer = ''; // Clear buffer for next response
      }
      // Parse email count from the STATUS response
      else if (responseBuffer.includes('MESSAGES')) {
        const match = responseBuffer.match(/MESSAGES (\d+)/);
        if (match) {
          setEmailCount(parseInt(match[1], 10));
          Alert.alert('Email Count', `You have ${match[1]} emails in your inbox.`);
        }
        // Send LOGOUT command after fetching email count
        client.write('A4 LOGOUT\r\n');
        client.destroy(); // Close connection after fetching email count
      }
    });

    client.on('error', (error) => {
      console.error('IMAP Error:', error);
      Alert.alert('Error', 'Failed to connect to the email server.');
      client.destroy(); // Ensure the socket is closed on error
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emailCount}>Emails in Inbox: {emailCount}</Text>
      <Button title="Fetch Email Count" onPress={fetchEmailCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emailCount: { fontSize: 20, marginBottom: 20 },
});

export default EmailDashboard;