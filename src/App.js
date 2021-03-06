import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Dimensions, ScrollView } from 'react-native'
import * as Expo from 'expo'
import { Google } from 'expo'
import { credentials } from './secret'
import { Camera, Permissions }from 'expo'
import { Button, Header } from 'react-native-elements' 
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from './StoriesCamera'
import { createStackNavigator, createAppContainer } from "react-navigation"
import { Constants, Location, Platform} from 'expo'
import StoriesCamera from './StoriesCamera'
import CameraEmbed from './CameraEmbed'
import CameraInterface from './CameraInterface'
import MainPage from './MainPage'

const createUserURL = 'http://52.86.115.88/truerev/user/create'






class App extends React.Component {

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
    name: "NaN",
    text: null,
    location: null
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    this.setState({ location });
  }

  _setLocationAsync = async(address)=>{
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.geocodeAsync(address);
    this.setState({location})
  }

  componentWillMount() {
    
    this._getLocationAsync();
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
        behavior: 'native'
        
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
      <SafeAreaView style = {{backgroundColor:'#3a4660'}}>
      <ScrollView style={styles.FirstPage}>
      <Text style ={styles.Title}>{this.state.name}</Text> 
      <Text style = {styles.tagline}> I see you're interested in some Real Estate. What place would you like to explore?</Text>
        <TextInput 
          style={styles.CityInput}
          placeholder="Enter City/Locality/Town you're looking at"
          onChangeText={(text) => this._setLocationAsync({text})}
        />
        <Button buttonStyle={styles.GetLocation} icon={
        <Icon
          name="location-arrow"
          size={25}
          color="white"
          />
          }
          title="  or Get Current Location"
          onPress = {() => this.props.navigation.navigate('MainPage',{
            lat : this.state.location.coords.latitude,
            lng: this.state.location.coords.longirude
          })}
          />  
        </ScrollView>
        </SafeAreaView>
     )
    }
    else{
      return(

          <SafeAreaView style = {{backgroundColor:'#3a4660'}}>
          <View style = {styles.LoginPage}>
          <Text style ={styles.Title}>TrueRev</Text>
          <Text style ={styles.tagline}>Data Analytics and Human feedback to guide you to find the perfect home for you.</Text>
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
              </View>
          </SafeAreaView>
        )
    }
  }
}

let {height, weight} = Dimensions.get("screen")

const styles = StyleSheet.create({
  //Page to Login
  LoginPage: {
    height:'100%',
    alignContent:'center',
    backgroundColor: '#c9af98',
    opacity: 0.95,
  },
  //Page to take city input
  FirstPage: {
    height:'100%',
    alignContent:'center',
    backgroundColor: '#c9af98',
    opacity: 0.95,
  },
  //App title on Login page
  Title: {
    top: 40,
    fontSize : 75,
    color: '#3a4660',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 0,
  },
  //Textbox to enter city name
  CityInput:{
    color:'#FFFFFF',
    fontSize: 30,
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: '300',
    top: '45%',
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  //Button to get user location
  GetLocation:{
    marginTop: 5,
    borderRadius: 70,
    width: "80%",
    height: 60,
    backgroundColor: '#3a4660',
    alignSelf:'center',
    top: height/5,
    alignItems: 'center',
  },
  //Subtitle in Login page
  tagline:{
    color:'#FFFFFF',
    fontSize: 20,
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: '500',
    top: height/6,
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
    top: height/5,
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
    top: height/5,
    alignItems: 'center',
  },
})

const AppNavigator = createStackNavigator({
  AfterLogin: App,
  MainPage: MainPage,
  StoriesCamera: StoriesCamera  

})



export default createAppContainer(AppNavigator)