import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';

export default class MapScreen extends Component {
    state = {
      mapRegion: {
        latitude: 32.7515673,
        longitude: 129.8828259,
        latitudeDelta: 0.2,
        longitudeDelta: 0.01,
      },
      location: null,
      milad:null,
      errorMessage: null,
    };
  
  
    //https://sugasaki.com/3gim/makefile.php?file=0102.data&data=aaa
  
    componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
      //  this._getLocationAsync();
      let testlocation =  Expo.Location.watchPositionAsync({
        enableHighAccuracy: true,
        timeInterval :1,
        distanceInterval :1
      }, (loc)=>{
        if(loc.timestamp){
          this.setState({
            milad:loc
          })
          this._fetchAsync(loc);
        }
        else {
          console.log("nooooooooooooooooo loc");
        }
      });
      }
    }
  
  
  
    _fetchAsync = async (loc) => {
  
      return fetch('https://sugasaki.com/sakura2018/makefile.php?file=0401.data&data='+ loc.timestamp + ',' + loc.coords.latitude + ',' + loc.coords.longitude)
        .then((response) => response.json())
        .then((responseJson) => {
  
        })
        .catch((error) =>{
          console.error(error);
        });
  
    };
  
  
  
  
  
    componentWillUnmount() {
      this.testlocation && this.testlocation.remove();
      this.testlocation = null;
    }
  
    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
  
    //  let location = await Location.getCurrentPositionAsync({});
   //   this.setState({ location });
      
    };
  
    render() {
      let text = 'Sakura Run 2018..';
      let milad = "milad location...";
      if (this.state.errorMessage) {
        text = this.state.errorMessage;
      } else if (this.state.location) {
        text = JSON.stringify(this.state.location);
      }
      milad = JSON.stringify(this.state.milad);
  
      return (
        <View style={styles.container}>
           <MapView
            style={styles.map}
            initialRegion={this.state.mapRegion}
            onRegionChange={this._handleMapRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
          />       
          
          <Text style={styles.paragraph}>{text}</Text>
          <Text> milad: </Text>
          <Text> {milad} </Text>
        
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      textAlign: 'center',
    },
  
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  
  
    item:{
      margin:15,
      height:30,
      borderWidth:1,
      padding:6,
      borderColor:'#ddd',
      textAlign:'center'
    },
  
  
  });
  