import React, { useState, useRef, FC } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import LoginSuccessModal from "../components/LoginSuccessModal";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login:FC<Props> = ({navigation}) => {

  
  // const webViewRef = useRef<WebView>(null);
  const {handleCredentials, webViewRef} = useAuth()
  const [hasNavigated, setHasNavigated] = useState(false);
  const [modal, setModal] = useState({ visible:false, title:"", message:"", type:"" });

  const resetModalState = () => {
    setModal({visible: false, type:"", title:"", message:""});
  }

  const handleProceedBtn = (type:string) => {
    resetModalState();
    if(type === "2FA_CHECK") {
        if(webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.location.href = 'https://myaccount.google.com/apppasswords';`);
      }
    }
    else if(type === "PASSWORD"){
      navigation.navigate("Dashboard")
      }
  }

  // Handle navigation state changes
  const handleWebViewStateChange = (newNavState: any) => {
    const { url } = newNavState;
    console.log("Navigated URL:", url);

    if (url.includes("myaccount.google.com") && !hasNavigated) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.location.href = 'https://myaccount.google.com/security/signinoptions/two-step-verification';
        `);
        
        setHasNavigated(true); // Prevent repeated navigation
  
      }
    } else if (url.includes("signinoptions/twosv")) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          (function() {
            // Use a flag to ensure this script runs only once
            if (window.hasExecutedScript) return;
            window.hasExecutedScript = true;

            // Function to check 2FA status
            function check2FAStatus() {
              const is2FAPage = window.location.href.includes('signinoptions/twosv');
              const enabled2FAIndicator = document.body.innerText.includes("Turn off 2-Step Verification");

              // Send the status back to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: '2FA_CHECK',
                is2FAPage: is2FAPage,
                is2FAEnabled: enabled2FAIndicator
              }));
            }

            // Execute check2FAStatus after the page is fully loaded
            if (document.readyState === 'complete') {
              check2FAStatus();
            } else {
              window.addEventListener('load', check2FAStatus, { once: true });
            }
          })();
        `);
      }

    } else if(url.includes("/apppasswords")) {
      if(webViewRef.current){
        webViewRef.current.injectJavaScript(`
           window.onload = function() {
              
           const appName = document.querySelector('.skQ8Ge')
            
           if (appName) {
                appName.style.display = 'block';
                appName.style.border = '2px solid #f0ad4e'; // Adjust border as needed
                const tooltip = document.createElement('div');
                tooltip.textContent = "Click on secuity to access 2-Factor Authentication";
                tooltip.style.backgroundColor = '#f8d7da';
                tooltip.style.color = '#721c24';
                tooltip.style.padding = '8px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.fontSize = '14px';
                tooltip.style.zIndex = '9999';
                tooltip.style.width = 'fit-content';
                tooltip.style.maxWidth = '320px'; // Set a maximum width to prevent overflow
                const parentElement = document.querySelector(".skQ8Ge") || document.body;
        
            if(parentElement) {
              parentElement.appendChild(tooltip);
            }

            setTimeout(() => {
            appName.style.border = 'none';
              parentElement.removeChild(tooltip);
            }, 5000); 
      
        }
            
        }

       function handleModalVisibility() {
        

            const modalElement = document.querySelector('.XfTrZ')
                if (modalElement && modalElement.style.display !== 'none') { 
                  const getPassword = document.querySelector(".XfTrZ");
                    if (getPassword) {
                      getPassword.style.border = '5px solid #f0ad4e'
                        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'APP_PASSWORD',password: getPassword.outerText.split(' ').join('')}))
                    }
               }
      }

  // Check for modal initially (optional)
  handleModalVisibility();

  // Add event listener for modal visibility changes
  document.addEventListener('visibilitychange', handleModalVisibility);
      
    ;`)
      }
    } else if (url.includes("/signin") && url.includes("/challenge")) {
      if (webViewRef.current) {
        console.log("vvvvv")
        webViewRef.current.injectJavaScript(`
          (function() { // Important: Use an IIFE
        
            function getEmailHandler() {
              const getEmail = document.querySelector(".SOeSgb");
              if (getEmail) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'APP_EMAIL', email: getEmail.textContent.trim() }));
              }
            }        
            setTimeout(getEmailHandler, 1000);
        
          })(); // Close the IIFE
        `);
      }
    }
  };

  // Handle messages sent from the WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      

      switch(data.type) {
        case "2FA_CHECK":
          if(webViewRef.current){
            webViewRef.current.injectJavaScript(` window.location.href = 'https://myaccount.google.com';`);
          if (data.is2FAEnabled ) {
              console.log(data.is2FAEnabled, "On")
              setModal({...modal, visible: true, type:"2FA_CHECK", title:"Login and 2FA Verified", message:"Login successful! Two-factor authentication has been verified. \n Click Proceed to generate your app password."});
            } else {
              setModal({...modal, visible: true, type:"2FA_CHECK", title:"Login and 2FA Not Verified", message:"Login successful! Two-factor authentication has been verified. \n Click Proceed to generate your app password."});
              console.log(data.is2FAEnabled, "Off")
          }
      }
        break

        case "APP_EMAIL":
          handleCredentials(data.email, "EMAIL")
            console.log(data.email)
        break

        case "APP_PASSWORD":
        
          handleCredentials(data.password, "PASSWORD")
          setModal({...modal, visible: true,type:"PASSWORD", title:"Password generated", message:"App Password generated successfully. \n Click Proceed to navigate dashboard"});
        break



      }

      console.log("Message from WebView:", data);
     
    } catch (error) {
      console.error("Error parsing message data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: "https://accounts.google.com"}}
        onNavigationStateChange={handleWebViewStateChange}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onMessage={handleMessage}
      />
      <LoginSuccessModal
      handleModalVisibility={resetModalState}
      modalData={modal}
      handleProceed={handleProceedBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default Login;