import React, { Component } from 'react';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <p>FLAG</p>
            <DesForm/>
            <Location/>
            <Distance />
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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
         <form onSubmit={this.handleSubmit}>
             <label>
              目的地（Destination）:
                 <input type="text" value={this.state.value} onChange={this.handleChange} />
             </label>
             <p>{this.state.address}</p>
             <p>{this.state.lat},{this.state.lon}</p>
         </form>
         );
    }
}

class Location extends React.Component{
  constructor(props){
    super(props);
    this.state={lat:0,lon:0};
    this.getLocation = this.getLocation.bind(this);
    this.successFunc = this.successFunc.bind(this);
    this.errorFunc = this.errorFunc.bind(this);
  }

  getLocation(){
    if( navigator.geolocation ){
      navigator.geolocation.watchPosition( this.successFunc, this.errorFunc);
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
  render() {
      return (
        <div>
          <p>現在地：{this.state.lat},{this.state.lon}</p>
          <button onClick={this.getLocation}>現在地を取得</button>
        </div>
      );
  }
}

class Distance extends React.Component{
    constructor(props){
        super(props);
        this.state={length:0,direction:0};
    }

    // geoDirection(lat1, lng1, lat2, lng2) {
    //   var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    //   var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
    //   var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
    //   if (dirE0 < 0) {
    //     dirE0 = dirE0 + 360; //0～360 にする。
    //   }
    //   var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
    //   return dirN0;
    // }
    render(){
        return(
            <span>{this.state.value}</span>
        );
    }
}

export default App;
