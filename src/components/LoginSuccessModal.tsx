import React from 'react';
import { Modal, StyleSheet, Text, View, Button } from 'react-native';

const LoginSuccessModal = (
  {modalData:{title, message, visible, type}, handleModalVisibility, handleProceed}:
  {modalData:{title:string, message:string, visible:boolean, type:string}, handleModalVisibility:()=>void, handleProceed:(type:string)=>void}
) => {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleModalVisibility}
      >
           
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText,{color: title.toLowerCase().includes("not") ? "#EA4335" : "#34A853"}]}>{title}</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <View style={{marginTop: 16}}>
            <Button
              title="Proceed"
              color={"#2962ff"}
              onPress={()=>handleProceed(type)}
              
            />
            </View>
          </View>
     
    </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"rgba(0,0,0,0.7)",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize:24
  },
  modalMessage: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize:16,
  }
});

export default LoginSuccessModal;