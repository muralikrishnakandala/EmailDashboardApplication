import React, { createContext, ReactNode, useContext, useState, useRef } from "react";
import { WebView } from 'react-native-webview';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MMKVstorage, RootStackParamList } from "../../App";
import CookieManager from '@react-native-cookies/cookies';
interface AuthProviderProps {
  children: ReactNode;
}

interface IloginCred {
    email:string |null
    appPassword:string | null
}


interface AuthContextProps {
  
 
    login: () => boolean;
    logout: () => void;
    handleCredentials:(data:string, type:string)=> void
    email:string
    password:string
    isLoggedIn:boolean
    webViewRef:any
  }

const AuthContext = createContext<AuthContextProps>({
    
    login: () => false,
    logout: () => {},
    handleCredentials:(data:string, type:string)=>{},
    email:"",
    password:"",
    isLoggedIn:false,
    webViewRef:null
  });

  const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const webViewRef = useRef<WebView>(null);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleCredentials = (data:string, type:string) => {  
      login()
      if(type === "EMAIL") {
        MMKVstorage.set("email", JSON.stringify(data));     
        setEmail(data)
      }
      if(type === "PASSWORD") {
        MMKVstorage.set("password", JSON.stringify(data));     
        setPassword(data)
      }
    }

    const login =  () => {

        const getEmail = MMKVstorage.getString("email")
        const getPassword = MMKVstorage.getString("password")

        if(getEmail && getPassword) {
          console.log(getEmail, getPassword, "login___from")
          
          setEmail(JSON.parse(getEmail))
          setPassword(JSON.parse(getPassword))
          return true
        } else {
          return false
        }
  
    };
  
    

    

    const logout = async () => {
  
      try {
        await CookieManager.clearAll();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], 
        });
        setIsLoggedIn(false)
        MMKVstorage.clearAll();
      } catch (error) {
        console.error("Error removing user data:", error);
      }
    };
  
    const value = {handleCredentials, login, logout, email, password, isLoggedIn,webViewRef };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
  export { AuthProvider, useAuth }; 

  