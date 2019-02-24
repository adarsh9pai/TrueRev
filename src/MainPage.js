import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Dimensions, ScrollView } from 'react-native'
import { Constants, Location, Permissions } from 'expo'

class MainPage extends React.Component{
  state = {
    zipcode:null,
    state: null,
    latitude: null,
    longitude: null,
    code:  'AIzaSyCrocPk4wsWjNUBgS0zU3UqS5TDGcWYbl8'
  }

  

render(){
    const { navigation } = this.props
    const lat = navigation.getParam('lat','NaN')
    const lng = navigation.getParam('lng','NaN')
    this.setState({
      latitude : lat,
      longitude : lng
    })
    
  


    return(
        <SafeAreaView>
            <Text>{this.state.latitude}</Text>
        </SafeAreaView>
    )
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




export default MainPage