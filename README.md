
# Email Dashboard Application

This is a React Native application that allows users to view their email count by connecting to their Gmail account through the IMAP protocol. The app fetches the number of emails in the inbox and displays it on the dashboard. It also guide the user to enable two factor authentication and create a app password to login email server with IMAP

## Features

- Login using Gmail credentials
- Guide user to create app password
- Fetch and display inbox email count
- Refresh button to reload the email count
- Logout functionality

## Technologies Used

- React Native
- IMAP Protocol
- React Navigation
- React Native Cookies
- React Native WebView
- React Native Carousel
- React Native Tcp Socket
- React Native Reanimated
- React Native Gesture Handler
- React Context for Authentication
- React Native MMKV for local storage

# Getting Started

## Step 1: Steup the project


1. Clone the repository.
2. Install dependencies:
```bash
npm install
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio


