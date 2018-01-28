import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <p>FLAG</p>
        </header>
        <DesForm/>
        <Camera/>
      </div>
    );
  }
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var URL = window.URL || window.webkitURL;

class Camera extends React.Component{
  constructor(props){
    super(props);
    this.state={src:"",cam_ids:[],now:1};
    this.getVideoSources = this.getVideoSources.bind(this);
    this.getStream = this.getStream.bind(this);
    this.getVideoSources();
  }

  getVideoSources() {
    var that=this;
    if (!navigator.mediaDevices) {
      console.log("MediaStreamTrack");
      MediaStreamTrack.getSources(function(cams) {
        cams.forEach(function(c, i, a) {
          if (c.kind !== 'video') return;
          that.setState({cam_ids:that.state.cam_ids.concat(c.id)})
        });
      });
    } else {
      navigator.mediaDevices.enumerateDevices().then(function(cams) {
        cams.forEach(function(c, i, a) {
          console.log("mediaDevices", c);
          if (c.kind !== 'videoinput') return;
          that.setState({cam_ids:that.state.cam_ids.concat(c.deviceId)});
        });
      });
    }
  }

  getStream(){
    var that=this;
    var cam_ids=this.state.cam_ids;
    var cam_id=this.state.cam_ids[(this.state.now)%this.state.cam_ids.length];
    console.log(cam_ids);
    console.log((this.state.now)%this.state.cam_ids.length);
    console.log(this.state.now);
    this.setState({now:this.state.now+1});

    navigator.getUserMedia({
        audio: false,
        video: {
          optional: [
            { sourceId: cam_id}
          ]
        }
    },function(stream) { // success
        console.log("Start Video", stream);
        that.setState({src:URL.createObjectURL(stream)})
    }, function(e) { // error
        console.error("Error on start video: " + e.code);
    });
  }

  render() {
      return (
        <div>
          <button onClick={this.getStream}>カメラを起動・切り替え</button>
          <video src={this.state.src} autoPlay/>
        </div>
       );
  }

}

const API_KEY='AIzaSyCGTPUcDO_MNFVso0vvSJBqNrHCQeXF41Y';
const REQUEST_URL='https://maps.googleapis.com/maps/api/geocode/json?address=ADDRESS&key='+API_KEY;

class DesForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '',address:'',lat:0,lon:0};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.state.value!==''){
            this.fetchData();
        }
    }

    fetchData() {
     fetch(REQUEST_URL.replace("ADDRESS",this.state.value))
          .then((response) => response.json())
     .then((responseData) => {
       if(responseData.status==="OK"){
           this.setState({
               address:responseData.results[0].formatted_address,
               lat:responseData.results[0].geometry.location.lat,
               lon:responseData.results[0].geometry.location.lng,
           })
       }
     })
    }

    render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label>
                 目的地（Destination）:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <p>{this.state.address}</p>
                <p>目的地：{this.state.lat},{this.state.lon}</p>
            </form>
              <Location
                des_lat={this.state.lat}
                des_lon={this.state.lon}
              />
          </div>
         );
    }
}

class Location extends React.Component{
  constructor(props){
    super(props);
    this.state={lat:0,lon:0,direction:0};
    this.getLocation = this.getLocation.bind(this);
    this.successFunc = this.successFunc.bind(this);
    this.errorFunc = this.errorFunc.bind(this);
    this.getDirection = this.getDirection.bind(this);
  }

  getLocation(){
    if( navigator.geolocation ){
      navigator.geolocation.watchPosition( this.successFunc, this.errorFunc);
      this.getDirection();
    }else{
      alert( "現在位置を取得できません。" ) ;
    }
  }
  successFunc( position ){
    this.setState({lat:position.coords.latitude,lon:position.coords.longitude})
  }
  errorFunc( error ){
  	var errorMessage = {
  		0: "原因不明のエラーが発生しました…。" ,
  		1: "位置情報の取得が許可されませんでした…。" ,
  		2: "電波状況などで位置情報が取得できませんでした…。" ,
  		3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
  	} ;
  	alert( errorMessage[error.code] ) ;
  }

  getDirection(){
    var that =this
    window.addEventListener('deviceorientation', function(event){
      that.setState({direction:event.alpha});
    });
  }


  render() {
      return (
        <div>
          <p>現在地：{this.state.lat},{this.state.lon}方角：{this.state.direction}</p>
          <button onClick={this.getLocation}>現在地を取得</button>
          <Distance
            des_lat={this.props.des_lat}
            des_lon={this.props.des_lon}
            loc_lat={this.state.lat}
            loc_lon={this.state.lon}
          />
        </div>
      );
  }
}

class Distance extends React.Component{
    constructor(props){
        super(props);
        this.geoDirection = this.geoDirection.bind(this);
        this.state={length:0,direction:0};
    }
    componentWillReceiveProps(nextProps){
      this.setState({length:this.geoDirection(nextProps.loc_lat,nextProps.loc_lon,nextProps.des_lat,nextProps.des_lon)});
    }

    geoDirection(lat1, lng1, lat2, lng2) {
      var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
      var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
      var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
      if (dirE0 < 0) {
        dirE0 = dirE0 + 360; //0～360 にする。
      }
      var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
      return dirN0;
    }

    // function geoDistance(lat1, lng1, lat2, lng2, precision) {
    //   // 引数　precision は小数点以下の桁数（距離の精度）
    //   var distance = 0;
    //   if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
    //     distance = 0;
    //   } else {
    //     lat1 = lat1 * Math.PI / 180;
    //     lng1 = lng1 * Math.PI / 180;
    //     lat2 = lat2 * Math.PI / 180;
    //     lng2 = lng2 * Math.PI / 180;
    //
    //     var A = 6378140;
    //     var B = 6356755;
    //     var F = (A - B) / A;
    //
    //     var P1 = Math.atan((B / A) * Math.tan(lat1));
    //     var P2 = Math.atan((B / A) * Math.tan(lat2));
    //
    //     var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
    //     var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));
    //
    //     distance = A * (X + L);
    //     var decimal_no = Math.pow(10, precision);
    //     distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
    //   }
    //   return distance;
    // }

    render(){
        return(
          <div>
            <p>{this.state.length}</p>
            <p>{this.props.loc_lat},{this.props.loc_lon},{this.props.des_lon},{this.props.des_lat}</p>
          </div>

        );
    }
}

export default App;
