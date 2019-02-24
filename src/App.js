import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity, SafeAreaView } from 'react-native'
import * as Expo from 'expo'
import { Google } from 'expo'
import { credentials } from './secret'
//import StoriesCamera from './StoriesCamera'
import { Camera, Permissions }from 'expo'
import Icon from 'react-native-vector-icons/FontAwesome';


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
    <SafeAreaView style = {{backgroundColor:'#71226e'}}>
    {/*<View style = {styles.LoginPage}>
    <Text style ={styles.Title}>trueREV</Text>
    <Text style ={styles.tagline}>Data analytics and Complex Algorithms to find the Perfect home for you</Text>
    <Button icon={
        <Icon
          name="google"
          size={25}
          color="white"

          />
          } onPress={this.GoogleLogin} title='   Continue with Google' buttonStyle={styles.LoginButtonGoogle} />
      <Button icon={
          <Icon
          name="facebook-f"
          size={25}
          color="white"

          />
          }onPress={this.FacebookLogin} title='   Continue with Facebook' buttonStyle={styles.LoginButtonFacebook} />
        </View>*/}

        <View style={styles.FirstPage}>
        <TextInput 
          style={styles.CityInput}
          placeholder="enter city to search for"
          onChangeText={(text) => this.setState({text})}
        />
        <Button buttonStyle={styles.GetLocation} icon={
        <Icon
          name="location-arrow"
          size={25}
          color="white"
          />
          }
          title="  or Get Current Location"/>  
        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  //Page to Login
  LoginPage: {
    height:'100%',
    alignContent:'center',
    backgroundColor: '#71255e',
    opacity: 0.95,
  },
  //Page to take city input
  FirstPage: {
    height:'100%',
    alignContent:'center',
    backgroundColor: '#71255e',
    opacity: 0.95,
  },
  //App title on Login page
  Title: {
    top: '20%',
    fontSize : 75,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 0,
  },
  //Textbox to enter city name
  CityInput:{
    color:'#FFFFFF',
    fontSize: 40,
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: '300',
    top: '40%',
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  //Button to get user location
  GetLocation:{
    marginTop: 20,
    borderRadius: 70,
    width: "80%",
    height: 60,
    backgroundColor: '#EC7357',
    alignSelf:'center',
    top: '100%',
    alignItems: 'center',
  },
  //Subtitle in Login page
  tagline:{
    color:'#FFFFFF',
    fontSize: 20,
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: '300',
    top: '20%',
    marginHorizontal: 20,
  },
  //Login button for google
  LoginButtonGoogle: {
    marginTop: 20,
    borderRadius: 70,
    width: "80%",
    height: 60,
    backgroundColor: '#d34836',
    alignSelf:'center',    
    top: '120%',
    alignItems: 'center',
  },
  //Login button for facebook  
  LoginButtonFacebook:  {
    marginTop: 20,
    borderRadius: 70,
    width: "80%",
    height: 60,
    backgroundColor: '#3B5998',
    alignSelf:'center',
    top: '80%',
    alignItems: 'center',
  },
})
