import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button, Image, AsyncStorage } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
//import TimerMixin from 'react-timer-mixin';

import {MarkerIcon, Marker} from '../assets/images/robot-dev.png'
import Timestamp from 'react-timestamp';

import Storage from 'react-native-storage';

var storage = new Storage({
	// maximum capacity, default 1000 
	size: 1000,

	// Use AsyncStorage for RN, or window.localStorage for web.
	// If not set, data would be lost after reload.
	storageBackend: AsyncStorage,
	
	// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: 1000 * 3600 * 24,
	
	// cache data in the memory. default is true.
	enableCache: true,
	
	// if data was not found in storage or expired,
	// the corresponding sync method will be invoked and return 
	// the latest data.
	sync : {
		// we'll talk about the details later.
	}
})

//var DeviceInfo = require('react-native-device-info');
//import IMEI from 'react-native-imei"';
//const IMEI = require('react-native-imei');


//storage.remove({key: 'userInfo'});

export default class MapScreen extends Component {
    state = {
      mapRegion: {
        latitude: 32.7515673,
        longitude: 129.8828259,
        latitudeDelta: 0.1,
        longitudeDelta: 0.01,
      },
      location: null,
      milad:null,
      errorMessage: null,
      result:null,
      gpsStatus: "off",
      timerComment:null,
      gpsData:[],
      userData:{
        userId: 0,
        userName: "unno"
      },
      markers:[
        {
          coordinate: { latitude: 32.7615673, longitude: 129.8828259 },
          title: 'Town',
          description: 'Our office is here.',
          image: MarkerIcon,
        },
        {
          coordinate: { latitude: 32.7815673, longitude: 129.8828259 },
          title: 'Tokyo Station',
          description: 'Very very big station.',
          image: MarkerIcon,
        },
      ],
    };
  

    //mixins = TimerMixin;
    count = 0;

    componentDidMount(){
/*
      setInterval(() => {
        this.count++;
        this.setState({
          timerComment: "loc" + this.count
        });
        this.pushMilad();
      }, 500);
*/
     
      setInterval(() => {
        this._fetchAsync();
      }, 300000);
      

      setInterval(() => {
        //this._getAsync();
      }, 5000);
      


      setTimeout(() => {
        this._fetchAsync();
        this.count = 0;
      }, 2000);
      

    }
    
    componentWillMount() {

      this.loadUser();
      
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
          //this.state.gpsData.push(value);
          this.state.gpsData.push(loc);
          this.setState({
            milad:loc,
            gpsStatus:"on"
          })
          //this._fetchAsync(loc);
        }
        else {
          //console.log("nooooooooooooooooo loc");
        }
      });
      }
    }
  

    loadUser(){

      storage.load({
        key: 'userInfo',
      }).then(ret => {
        // found data go to then()
        this.setState({
          userData: {
            userId: ret.userId,
            userName: ret.userName
          }
        });
      }).catch(err => {
        this.inputUser();
      })

    }
  
    inputUser(){

      // Dateオブジェクトを作成
      var date = new Date() ;
      // UNIXタイムスタンプを取得する (ミリ秒単位)
      var a = date.getTime() ;
      // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
      var userId = Math.floor( a / 1000 ) ;

      this.setState({
        userData: {
          userId: userId,
          userName: "suga"
        }
      });

      storage.save({
        key: 'userInfo',   // Note: Do not use underscore("_") in key!
        data: { 
          userId: this.state.userData.userId,
          userName: this.state.userData.userName
        },
        // if not specified, the defaultExpires will be applied instead.
        // if set to null, then it will never expire.
        expires: 1000 * 3600
      });


    }


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
  
      //let location = await Location.getCurrentPositionAsync({});
      //this.setState({ location });

    };
  


    pushMilad() {
      this.state.gpsData.push(this.state.milad);
    }


  
    _getAsync = async (loc) => {

      //let url = "http://localhost:5000/api/RunnerLog";
      let url = "http://sakura2018.azurewebsites.net/api/RunnerLog";

      return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {

        this.responseJson = responseJson;


      })
      
      /*

[{
  "type":"Feature",
  "geometry":{
    "type":"Point",
    "coordinates":[129.86489876465038,32.761400825620314]
  },
  "properties":{
    "Id":13643,
    "KeisokuDate":"2018-04-01T02:17:53.21",
    "Imei":null,
    "CreatedDate":"2018-04-01T02:19:20.46",
    "Vol":null,"Note":null
  }
},



      */
    };

  
    _fetchAsync  = async (loc) => {

      let sendData = {
        userData: this.state.userData,
        location: this.state.gpsData
      };

      //let url = "http://localhost:5000/api/RunnerSave/";
      let url = "http://sakura2018.azurewebsites.net/api/RunnerSave/";

      await fetch(url, {
          method: "POST", 
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sendData)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          result: "success2",
          gpsData: []
        });
        this.count = 0;
      });

    };




    showExplain(i) {
      // showCallout()は、<MapView.Callout />を呼び出す
     this.state.markers[i].showCallout();
   }

    render() {
      let text = 'Sakura Run 2018..';
      let milad = "milad location...";
      if (this.state.errorMessage) {
        text = this.state.errorMessage;
      } else if (this.state.location) {
        text = JSON.stringify(this.state.location);
      }
      //milad = JSON.stringify(this.state.milad);
      let result = JSON.stringify(this.state.result);
      let timerComment = JSON.stringify(this.state.timerComment);
      //let markers = this.state.markers;



      return (
        <View style={styles.container}>
           <MapView
            style={styles.map}
            initialRegion={this.state.mapRegion}
            onRegionChange={this._handleMapRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
            >
            {this.state.markers.map((marker, i) => (
              <MapView.Marker
                coordinate={marker.coordinate}
                description={marker.description}
                key={`marker-${String(i + 1)}`}
              >
            </MapView.Marker>

            ))}
          </MapView>
          
          <Text style={styles.gpsStatus}> GPS: {this.state.gpsStatus} </Text>

          <Text style={styles.gpsStatus}> timerComment: {timerComment} </Text>

          <Button onPress={this._fetchAsync.bind(this)} title="Send Data" color="#841584"  />

          <Button onPress={this._getAsync.bind(this)} title="_getAsync" color="#841584"  />
          

          <Text style={styles.gpsStatus}> userName: {this.state.userData.userName} </Text>
          <Text style={styles.gpsStatus}> userId: {this.state.userData.userId} </Text>
          
          
          <Text style={styles.item} >{this.responseJson }</Text>

        </View>
      );
    }
  }
  /*


            {this.markers.map((marker, i) => (
              <MapView.Marker
                coordinate={marker.coordinate}

                //keyの指定
                key={`marker-${String(i + 1)}`}
                //refの指定を行う
                ref={(ref) => {
                  this.markers[i] = ref;
                }}
                description={marker.description}
                onPress={() => this.showExplain(i)}
              >
               // 独自アイコン
              <Image source={marker.image} style={ styles.MarkerIconImage } />

    　　　　　　// 独自の情報ウィンドウの内容指定
                <MapView.Callout>
                  <View>
                    <Text>This is a sample view</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            ))}
  */
  //
  //<Button onPress={this.pushMilad.bind(this)} title="push GPS" color="#841584"  />
  //<Button onPress={this._fetchAsync.bind(this)} title="Send Data" color="#841584"  />
  //<Text style={styles.item} >{result}</Text>

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
    },
    gpsStatus: {
      fontSize: 10,
      textAlign: 'right',
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
  
  
    MarkerIconImage:{
      width:15,
      height:30,
    },
  

  });
  