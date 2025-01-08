export const TwoFANotVerifiedScript = `
          
              function enableTFA() {

                  const securityTab = document.querySelector('a[data-rid="10006"][data-nav-type="1"]')

                  if (securityTab) {

                  // Create a border to higlight security tab
                    securityTab.style.display = 'block';
                    securityTab.style.border = '2px solid #f0ad4e';

                    const tooltip = document.createElement('div');
                    tooltip.textContent = "Click on secuity to access 2-Factor Authentication";

                    tooltip.style.backgroundColor = '#f8d7da';
                    tooltip.style.color = '#721c24';
                    tooltip.style.padding = '8px';
                    tooltip.style.borderRadius = '5px';
                    tooltip.style.fontSize = '14px';
                    tooltip.style.zIndex = '9999';
                    tooltip.style.width = 'fit-content';
                    tooltip.style.maxWidth = '320px';

                    const parentElement = document.querySelector(".wrDwse") || document.body;
                      if(parentElement) {
                        parentElement.appendChild(tooltip);
                      }

                      setTimeout(() => {
                      securityTab.style.border = 'none';
                        parentElement.removeChild(tooltip);
                      }, 5000); 
                    }     

            //Scroll Nav bar to left
                    const navbar = document.querySelector('.mWFX3e');
                    if (navbar) {
                      navbar.scrollLeft = 200;
                    }
                }

              enableTFA()
          `
export const AppPasswordScript = `
           window.onload = function() {
              
            const appName = document.querySelector('.skQ8Ge')
            
                if (appName) {
                      appName.style.display = 'block';
                      appName.style.border = '2px solid #f0ad4e';

                      const tooltip = document.createElement('div');
                      tooltip.textContent = "Please Enter Your Device name and click on create button";

                      tooltip.style.backgroundColor = '#f8d7da';
                      tooltip.style.color = '#721c24';
                      tooltip.style.padding = '8px';
                      tooltip.style.borderRadius = '5px';
                      tooltip.style.fontSize = '14px';
                      tooltip.style.zIndex = '9999';
                      tooltip.style.width = 'fit-content';
                      tooltip.style.maxWidth = '320px';

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

                // Capture the Generated App Password and return the response to react native
              function captureAppPassword() {
                  const modalElement = document.querySelector('.XfTrZ')
                      if (modalElement && modalElement.style.display !== 'none') { 
                          const getPassword = document.querySelector(".XfTrZ");
                      if (getPassword) {
                          getPassword.style.border = '5px solid #f0ad4e'
                          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'APP_PASSWORD',password: getPassword.outerText.split(' ').join('')}))
                      }
                    }
                }

                  captureAppPassword();
                  document.addEventListener('visibilitychange', captureAppPassword);
      
    ;`

export const GetEmailAddressScript = `
          (function() { 
            function getEmailHandler() {
              const getEmail = document.querySelector(".SOeSgb");
              if (getEmail) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'APP_EMAIL', email: getEmail.textContent.trim() }));
              }
            }        
            setTimeout(getEmailHandler, 1000);
          })();
        `
export const EnableTwoFAGuideScript = `
        
  // After landing in security page it scroll up and higlight the two factor authentication option
      function handleTwoFAButton() {
      const TwoFAVerificationButton = document.querySelector('a[data-rid="403"][data-nav-type="5"]')

      if (TwoFAVerificationButton) {
        TwoFAVerificationButton.style.display = 'block';
        TwoFAVerificationButton.style.border = '2px solid #f0ad4e';

        TwoFAVerificationButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const tooltip = document.createElement('div');

        tooltip.textContent = "Click on 2-Step Verification to Enable 2FA";
        tooltip.style.backgroundColor = '#f8d7da';
        tooltip.style.color = '#721c24';
        tooltip.style.padding = '8px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = '9999';
        tooltip.style.width = 'fit-content';
        tooltip.style.maxWidth = '320px';

        TwoFAVerificationButton.appendChild(tooltip);          

        setTimeout(() => {

         TwoFAVerificationButton.style.border = 'none';
          TwoFAVerificationButton.removeChild(tooltip);

        }, 5000); 
      }

    };
 
    document.addEventListener('click',  setTimeout(()=>{
            handleTwoFAButton();
      }, 2000));
      
  `
export const TwoFAVerifiedMessage  = {
    title:"Logged In and 2FA Verified", 
    message:"Login successful! Two-factor authentication has been verified. \n Click Proceed to generate your app password."
}
export const TwoFANotVerifiedMessage  = {
    title:"Logged In and 2FA Not Verified", 
    message:"Login successful! Two-factor authentication has been not verified. \n Click Proceed to enable two factor authentication."
}
export const PasswordMessage  = {
     title:"Password generated", 
     message:"App Password generated successfully. \n Click Proceed to navigate dashboard"
}


export const carouselData = [
    {
      title: "Starry Night",      
      link: require("../assets/A.jpg")
    },
    {
      title: "Golden Desert",      
      link: require("../assets/B.jpg")
    },
    {
      title: "Ocean Waves",      
      link: require("../assets/C.jpg")
    },
    {
      title: "Mystical Forest",      
      link: require("../assets/D.jpg")
    },
    {
      title: "Snowy Peaks",      
      link: require("../assets/E.jpg")
    },
    {
      title: "City Lights",      
      link: require("../assets/F.jpg")
    },
    {
      title: "Autumn Bliss",      
      link: require("../assets/G.jpg")
    },
    {
      title: "Dreamy Meadow",      
      link: require("../assets/H.jpg")
    },
    {
      title: "Tropical Haven",      
      link: require("../assets/I.jpg")
    },
    {
      title: "Cosmic Journey",      
      link: require("../assets/J.jpg")
    },
  ];

