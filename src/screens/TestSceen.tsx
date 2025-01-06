import React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

const App = () => {
  const webViewRef = useRef(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const injectedJavaScript = `
    window.onload = function() {
      const securityTab = document.querySelector('a[data-rid="10006"][data-nav-type="1"]')

      if (securityTab) {
        securityTab.style.display = 'block';
        securityTab.style.border = '2px solid #f0ad4e'; // Adjust border as needed
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
        const parentElement = document.querySelector(".wrDwse") || document.body;
        if(parentElement) {
          parentElement.appendChild(tooltip);
          
        }

        setTimeout(() => {
         securityTab.style.border = 'none';
          parentElement.removeChild(tooltip);
        }, 5000); 
      }

      // Scroll the navbar a bit to the left
      const navbar = document.querySelector('.mWFX3e'); // Replace with actual selector if needed
      if (navbar) {
        navbar.scrollLeft = 200; // Adjust the scroll amount as needed
      }
    };
  `;

  // Hide tooltip after 5 seconds
  useEffect(() => {
    if (isTooltipVisible) {
      const timeoutId = setTimeout(() => setIsTooltipVisible(false), 5000); // 5 seconds
      return () => clearTimeout(timeoutId); // Cleanup on unmount
    }
  }, [isTooltipVisible]);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://myaccount.google.com' }}
      injectedJavaScript={injectedJavaScript}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onMessage={(event) => {
        // Handle any messages sent from the injected JavaScript if needed
        console.log('Message from WebView:', event.nativeEvent.data);
      }}
    />
  );
};

export default App;