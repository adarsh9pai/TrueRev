import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import * as Expo from 'expo'
import { Google } from 'expo'
import { credentials } from './secret'



export default class App extends React.Component {

  state = {
    signedIn : false,
    email: null
  }

  GoogleLogin = async () => {
    try {
      console.log(credentials)
      const result = await Google.logInAsync({
        androidClientId: credentials.googleAndroid,
        iosClientId: credentials.googleiOS,
        scopes: ["profile", "email"],
        behavior: "web"
      });
      if (result.type === "success") {
        this.setState({
          email: result.user.email,
          signedIn : true
        })
      } else {
        console.log("cancelled");
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  FacebookLogin = async() => {
    try{
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Expo.Facebook.logInWithReadPermissionsAsync(credentials.facebook, {
        permissions: ['public_profile','email'],
      })
      if(type === "success"){
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`)
        const responseJson = await response.json()
        console.log(responseJson)
        this.setState({
          email: responseJson.email
        })
      }

    }
    catch({ message }){
      alert('There seems to be an issue with Facebook. Sorry for the inconvenience.')
    }
  }

  render() {
    return (
      <View style={styles.container}>
      <Text>TrueRev: Visualizations, Story-based Reviews and Pure Statistics to help you find the best home</Text>
      <Button onPress = {this.FacebookLogin} title = "Continue with Facebook" />
      <Button onPress = {this.GoogleLogin} title = "Continue with Google" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
