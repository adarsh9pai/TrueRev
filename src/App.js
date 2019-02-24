import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity, SafeAreaView } from 'react-native'
import * as Expo from 'expo'
import { Google } from 'expo'
import { credentials } from './secret'
//import StoriesCamera from './StoriesCamera'
import { Camera, Permissions }from 'expo'

const createUserURL = 'http://52.86.115.88/truerev/user/create'


export default class App extends React.Component {

  postUser = (obj)=>{
    fetch(createUserURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
    });
  }

  state = {
    signedIn : false,
    email: null,
    name: null
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
          signedIn : true,
          name: result.user.name
        })
        this.postUser({
          email: result.user.email,
          name: result.user.name
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
          email: responseJson.email,
          signedIn : true,
          name: responseJson.name
        })
        this.postUser({
          email: responseJson.email,
          name: responseJson.name
        })
      }

    }
    catch({ message }){
      alert('There seems to be an issue with Facebook. Sorry for the inconvenience.')
    }
  }

  render() {
    if(this.state.signedIn){
     return( 
      <View style={styles.container}>
      <Text>Welcome, {this.state.name}</Text>
      <Text>What city do you plan to explore today?</Text>
      
      </View>
     )
    }
    else{
      return(
      <LoginPage GoogleLogin = {this.GoogleLogin} FacebookLogin = {this.FacebookLogin} />
      )
    }
  }
}

const LoginPage = props =>{
  return (
    <View style={styles.container}>
    <Text>TrueRev: Visualizations, Story-based Reviews and Pure Statistics to help you find the best home</Text>
    <Button onPress = {() => props.FacebookLogin()} title = "Continue with Facebook" />
    <Button onPress = {() => props.GoogleLogin()} title = "Continue with Google" />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
})
