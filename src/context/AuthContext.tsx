import React, { createContext, ReactNode, useContext, useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MMKVstorage, RootStackParamList } from "../../App";
import CookieManager from "@react-native-cookies/cookies";
import { ToastAndroid } from "react-native";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  login:any;
  logout: () => void;
  handleCredentials: (data: string, type: string) => void;
  email: string;
  password: string;
  webViewRef: any;
}

const AuthContext = createContext<AuthContextProps>({
  login: () => false,
  logout: () => {},
  handleCredentials: () => {},
  email: "",
  password: "",
  webViewRef: null,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const webViewRef = useRef<WebView>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleCredentials = (data: string, type: string) => {
    if (type === "EMAIL") {
      MMKVstorage.set("email", data);
      setEmail(data);
    }
    if (type === "PASSWORD") {
      MMKVstorage.set("password", data);
      setPassword(data);
    }


  };

  const login = () => {
    const getEmail = MMKVstorage.getString("email");
    const getPassword = MMKVstorage.getString("password");

    if (getEmail && getPassword) {
      setEmail(getEmail);
      setPassword(getPassword);
      return true
    }
  };

  const logout = async () => {
    try {
      await CookieManager.clearAll();
      MMKVstorage.clearAll();
      setEmail("");
      setPassword("");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      ToastAndroid.show("logout sucessful", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Error during logout", ToastAndroid.SHORT);
    }
  };

  return (
    <AuthContext.Provider value={{ handleCredentials, login, logout, email, password, webViewRef }} >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };