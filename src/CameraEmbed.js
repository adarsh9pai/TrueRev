import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Camera, Permissions } from 'expo'
import shortid from 'shortid'

export default class CameraEmbed extends React.Component {
    state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back
    }
  
    async componentWillMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA)
      this.setState({ hasCameraPermission: status === 'granted' })
    }
  
    render() {
      const { hasCameraPermission } = this.state
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
      } else {
        return (
          <Camera style={{ flex: 1 }} type={this.state.type} key={shortid.generate()}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text style={{ fontSize: 15, marginBottom: 10, color: 'white' }}> Change View </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        );
      }
    }
  }