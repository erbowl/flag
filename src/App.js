import React, { Component } from 'react';
import './App.css';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar  inverse collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="">FLAG</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">
                利用規約
              </NavItem>
              <NavItem eventKey={2} href="#">
                運営情報
              </NavItem>
              <NavItem eventKey={2} href="#">
                プライバシーポリシー
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div id="content">
          <DesForm />
        </div>
      </div>
    );
  }
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var URL = window.URL || window.webkitURL;

class FLAG extends React.Component{
  constructor(props){
    super(props);
    this.state={left_value:0,flag_none:true};
    this.getLeft = this.getLeft.bind(this);
    this.getLeft(props);
  }

  componentWillReceiveProps(nextProps){
    this.getLeft(nextProps);
    this.setState({flag_none:nextProps.display_none});
  }

  getLeft(props){
    const image_width=1280;
    const width=window.parent.screen.width;
    const dire_diff=(props.to_dire-props.now_dire+540)%360-180;
    this.setState({left_value:-image_width/2+width/2-image_width*dire_diff/360});
  }

  render() {
      return (
        <img className="flag" src="flag.png" alt="flag" style={{left:this.state.left_value,display:this.state.flag_none ? 'none' : ''}}/>
       );
  }

}

const API_KEY='AIzaSyCGTPUcDO_MNFVso0vvSJBqNrHCQeXF41Y';
const REQUEST_URL='https://maps.googleapis.com/maps/api/geocode/json?address=ADDRESS&key='+API_KEY;

class DesForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          value: '',
          address:'',
          lat:0,lon:0,
          direction:0,
          now_lat:0,now_lon:0,
          distance:0,
          to_dire:0,
          flag_none:true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.successFunc = this.successFunc.bind(this);
        this.errorFunc = this.errorFunc.bind(this);
        this.getDirection = this.getDirection.bind(this);
        this.geoDirection = this.geoDirection.bind(this);
        this.geoDistance = this.geoDistance.bind(this);
    }

    handleChange(event) {
       this.setState({value: event.target.value});
   }

    handleSubmit(event) {
        event.preventDefault();
        // this.setState({value:event.target.value})
        if(this.state.value!==''){
            this.setState({flag_none:false});
            this.fetchData();
            this.getLocation();
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
           this.setState({
             to_dire:this.geoDirection(this.state.lat,this.state.lon,this.state.now_lat,this.state.now_lon),
             distance:this.geoDistance(this.state.lat,this.state.lon,this.state.now_lat,this.state.now_lon)
           })
       }
     })
    }

    getLocation(){
      if( navigator.geolocation ){
        navigator.geolocation.watchPosition( this.successFunc, this.errorFunc);
        this.getDirection();
      }else{
        alert( "ブラウザ対応していないようです。最新版のChromeでお試しください。" ) ;
      }
    }
    successFunc( position ){
      this.setState({now_lat:position.coords.latitude,now_lon:position.coords.longitude});
      this.setState({
        to_dire:this.geoDirection(this.state.lat,this.state.lon,this.state.now_lat,this.state.now_lon),
        distance:this.geoDistance(this.state.lat,this.state.lon,this.state.now_lat,this.state.now_lon)
      })
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

    //向くべき方向
    geoDirection(lat1, lng1, lat2, lng2) {
      var Y = Math.cos(lng2 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
      var X = Math.cos(lng1 * Math.PI / 180) * Math.sin(lng2 * Math.PI / 180) - Math.sin(lng1 * Math.PI / 180) * Math.cos(lng2 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180 - lat1 * Math.PI / 180);
      var dirE0 = 180 * Math.atan2(Y, X) / Math.PI;
      if (dirE0 < 0) {
        dirE0 = dirE0 + 360;
      }
      var dirN0 = (dirE0 + 90) % 360;
      return dirN0;
    }
    //目的地までの距離
    geoDistance(lat1, lng1, lat2, lng2) {
      var precision =3;
      var distance = 0;
      if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
        distance = 0;
      } else {
        lat1 = lat1 * Math.PI / 180;
        lng1 = lng1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        lng2 = lng2 * Math.PI / 180;

        var A = 6378140;
        var B = 6356755;
        var F = (A - B) / A;

        var P1 = Math.atan((B / A) * Math.tan(lat1));
        var P2 = Math.atan((B / A) * Math.tan(lat2));

        var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
        var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));

        distance = A * (X + L);
        var decimal_no = Math.pow(10, precision);
        distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
      }
      return distance;
    }



    render() {
        return (
          <div >
            <form className="modal-form" onSubmit={this.handleSubmit}>
                <label>
                 目的地（Destination）:
                 <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <Button bsStyle="primary" bsSize="large" type="submit" block>
                  目的地までの方角を示す <Glyphicon glyph="flag" />
                </Button>
                <p>目的地の住所：{this.state.address}</p>
                <p>目的地までの距離：{this.state.distance}m</p>
                <p>目的地への方角：{((this.state.direction-this.state.to_dire+540)%360-180).toFixed(1)}°</p>
                <FLAG to_dire={this.state.to_dire} now_dire={this.state.direction} display_none={this.state.flag_none}/>
            </form>
          </div>
         );
    }
}

export default App;
