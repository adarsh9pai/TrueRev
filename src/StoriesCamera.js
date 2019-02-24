import React from 'react'
import { Button, Text, Header, Body, Icon, Title, Spinner } from 'native-base'
import { Camera, Permissions, FileSystem, Video } from 'expo'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import CameraInterface from './CameraInterface'
import delay from 'delay'
import shortid from 'shortid'
import { RNS3 } from 'react-native-aws3'


class RedirectTo extends React.Component {
  componentDidMount() {
    const { scene, navigation } = this.props
    navigation.navigate(scene)
  }

  render() {
    return <View />;
  }
}

const printChronometer = seconds => {
  const minutes = Math.floor(seconds / 60)
  const remseconds = seconds % 60
  return '' + (minutes < 10 ? '0' : '') + minutes + ':' + (remseconds < 10 ? '0' : '') + remseconds
};

export default class StoriesCamera extends React.Component {
  static navigationOptions = {
    header: () => (
      <Header>
        <Body>
        </Body>
      </Header>
    )
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    recording: false,
    duration: 0,
    redirect: false
  }

  async componentWillMount() {
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' })
  }


  async registerRecord() {
    const { recording, duration } = this.state;

    if (recording) {
      await delay(1000);
      this.setState(state => ({
        ...state,
        duration: state.duration + 1
      }));
      this.registerRecord();
    }
  }

  async startRecording() {
    if (!this.camera) {
      return;
    }

    await this.setState(state => ({ ...state, recording: true }));
    this.registerRecord();
    const record = await this.camera.recordAsync();
    console.log(record);
    const videoId = shortid.generate();

    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}videos/`, {
      intermediates: true
    });

    await FileSystem.moveAsync({
      from: record.uri,
      to: `${FileSystem.documentDirectory}videos/demo_${videoId}.mov`
    });
    
    let formData = new FormData();
    formData.append("videoFile", {
        name: "name.mov",
        uri: `${FileSystem.documentDirectory}videos/demo_${videoId}.mov`,
        type: 'video/quicktime'
    });
    formData.append("id", "1234567");

    try {
        let response = await fetch('http://52.86.115.88/truerev/video/upload', {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        });
        return await response.json();
    }
    catch (error) {
        console.log('error : ' + error);
        return error;
    }
  }

  async stopRecording() {
    if (!this.camera) {
      return;
    }

    await this.camera.stopRecording();
    this.setState(state => ({ ...state, recording: false, duration: 0 }));
  }

  toggleRecording() {
    const { recording } = this.state;

    return recording ? this.stopRecording() : this.startRecording();
  }

  render() {
    const { hasCameraPermission, recording, duration, redirect } = this.state;

    if (redirect) {
      return <RedirectTo scene={redirect} navigation={this.props.navigation} />;
    }

    if (hasCameraPermission === null) {
      return (
        <CameraInterface style={styles.containerCenter}>
          <Spinner />
        </CameraInterface>
      );
    } else if (hasCameraPermission === false) {
      return (
        <CameraInterface style={styles.containerCenter}>
          <Text>No access to camera</Text>;
        </CameraInterface>
      );
    } else {
      return (
        <CameraInterface style={styles.containerCenter}>
          <Camera
            style={styles.containerCamera}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.topActions}>
              {recording && (
                <Button iconLeft transparent light small style={styles.chronometer}>
                  <Icon ios="ios-recording" android="md-recording" />
                  <Text>{printChronometer(duration)}</Text>
                </Button>
              )}
              {!recording && <View />}

              <Button
                small
                transparent
                success
                style={styles.flipCamera}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Icon ios="ios-reverse-camera" android="md-reverse-camera" />
              </Button>
            </View>
            <View style={styles.bottonActions}>
              <Button
                danger
                onPress={() => {
                  this.toggleRecording();
                }}
              >
                {recording ? (
                  <Icon ios="ios-square" android="md-square" />
                ) : (
                  <Icon ios="ios-radio-button-on" android="md-radio-button-on" />
                )}
              </Button>
            </View>
          </Camera>
        </CameraInterface>
      );
    }
  }
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flipCamera: {
    margin: 10
  },
  chronometer: {
    margin: 10
  },
  bottonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})
