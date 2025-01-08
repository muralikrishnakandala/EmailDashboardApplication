import React, { useState, FC, useEffect } from "react";
import { StyleSheet, View, ToastAndroid } from "react-native";
import { WebView } from "react-native-webview";
import LoginSuccessModal from "../components/LoginSuccessModal";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { AppPasswordScript, EnableTwoFAGuideScript, GetEmailAddressScript, PasswordMessage, TwoFANotVerifiedMessage, TwoFANotVerifiedScript, TwoFAVerifiedMessage } from "../data/data";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login:FC<Props> = ({navigation}) => {

  const {handleCredentials, webViewRef, login} = useAuth()
  const [hasNavigated, setHasNavigated] = useState(false);
  const [intial2FAVerification, setIntial2FAVerification] = useState(false);
  const [modal, setModal] = useState({ visible:false, title:"", message:"", type:"" });

  const resetModalState = () => {
    setModal({visible: false, type:"", title:"", message:""});
  }

  const handleProceedBtn = (type:string) => {
    resetModalState();
    if (type === '2FA_VERIFIED') {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.location.href = 'https://myaccount.google.com/apppasswords';`);
      }
    } else if (type === '2FA_NOT_VERIFIED') {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(TwoFANotVerifiedScript);
      }
    } else if (type === 'PASSWORD') {
      navigation.navigate('Dashboard');
    }
  }

  
  const handleWebViewStateChange = (newNavState: any) => {
    const { url } = newNavState;
 

    
    if (url.includes("myaccount.google.com") && !hasNavigated) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.location.href = 'https://myaccount.google.com/security/signinoptions/two-step-verification';
        `);
        
        setHasNavigated(true);
        setIntial2FAVerification(true)
      }
    } 
    
    else if (url.includes("signinoptions/twosv")) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          (function() {
           
            if (window.hasExecutedScript) return;
            window.hasExecutedScript = true;

           
            function check2FAStatus() {
              const is2FAPage = window.location.href.includes('signinoptions/twosv');
              const enabled2FAIndicator = document.body.innerText.includes("Turn off 2-Step Verification");
              const buttonContainer = document.querySelector('.xIcqYe');
              
              if (buttonContainer && ${!intial2FAVerification}) {
                      buttonContainer.style.display = 'block';
                      buttonContainer.style.border = '2px solid #f0ad4e';

                       const tooltip = document.createElement('div');

                        tooltip.textContent = "Click here to enable 2-Step Verification";
                        tooltip.style.backgroundColor = '#f8d7da';
                        tooltip.style.color = '#721c24';
                        tooltip.style.padding = '8px';
                        tooltip.style.borderRadius = '5px';
                        tooltip.style.fontSize = '14px';
                        tooltip.style.zIndex = '9999';
                        tooltip.style.width = 'fit-content';
                        tooltip.style.maxWidth = '320px';

                        buttonContainer.appendChild(tooltip);          

                      setTimeout(() => {

                      buttonContainer.style.border = 'none';
                        buttonContainer.removeChild(tooltip);

                      }, 5000); 
                    }
            
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: '2FA_CHECK',
                      is2FAPage: is2FAPage,
                      is2FAEnabled: enabled2FAIndicator,
                      isForInitialVerification:${intial2FAVerification}
                    }));
                  }

            
           
                    if (document.readyState === 'complete') {
                      check2FAStatus();
                    } else {
                      window.addEventListener('load', check2FAStatus, { once: true });
                    }     
                  })();
          

              (function(){
                const twoFaButtonEle = document.querySelector('.UywwFc-LgbsSe.UywwFc-LgbsSe-OWXEXe-dgl2Hf.wMI9H')
                
                if (twoFaButtonEle) {
                      twoFaButtonEle.addEventListener('click', function() {
                
                              if(twoFaButtonEle.textContent === "Done"){
                            
                                  window.ReactNativeWebView.postMessage(JSON.stringify({
                                      type: '2FA_CHECK',
                                      is2FAPage: true,
                                      is2FAEnabled: true,
                                  isForInitialVerification:true
                                }));  
                              };
                          })
                      }
              })()
        `);
      }

    } 
    
    else if(url.includes("/apppasswords")) {
      if(webViewRef.current){
        webViewRef.current.injectJavaScript(AppPasswordScript)
      }
    }

    else if (url.includes("/signin") && url.includes("/challenge")) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(GetEmailAddressScript);
      }
    }

    else if(url.includes("/security")) {
      if(webViewRef.current) {
        setIntial2FAVerification(false)
        webViewRef.current?.injectJavaScript(EnableTwoFAGuideScript);
      }
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);    
      switch(data.type) {
        case "2FA_CHECK":
          if(webViewRef.current && data.isForInitialVerification){
            webViewRef.current.injectJavaScript(`window.location.href = 'https://myaccount.google.com';`);
            if (data.is2FAEnabled ) {
              setModal({...modal, visible: true, type:"2FA_VERIFIED", title:TwoFAVerifiedMessage.title, message:TwoFAVerifiedMessage.message});
            } else {
              setModal({...modal, visible: true, type:"2FA_NOT_VERIFIED", title:TwoFANotVerifiedMessage.title, message:TwoFANotVerifiedMessage.message});
          }
        }
        break

        case "APP_EMAIL":
          handleCredentials(data.email, "EMAIL")
        break

        case "APP_PASSWORD":
          handleCredentials(data.password, "PASSWORD")
          setModal({...modal, visible: true,type:"PASSWORD", title:PasswordMessage.title, message:PasswordMessage.message});
        break
      }

     
    } catch (error) {
       ToastAndroid.show('Error parsing message data', ToastAndroid.SHORT);
    }
  };

      useEffect(()=>{
        const getCred = async ()=>{
          const isLoggedIn = await login();
          if(isLoggedIn) {
            navigation.navigate("Dashboard")
          }
        }
        getCred()
      },[])

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
  
});

export default Login;