import React, { Component } from 'react';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
            <p>FLAG</p>
            <DesForm/>
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
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        if(this.state.value!=''){
            this.fetchData();
            console.log(this.state);
        }
    }

    fetchData() {
     fetch(REQUEST_URL.replace("ADDRESS",this.state.value))
          .then((response) => response.json())
     .then((responseData) => {
       if(responseData.status=="OK"){
           this.setState({
               address:responseData.results[0].formatted_address,
               lat:responseData.results[0].geometry.location.lat,
               lon:responseData.results[0].geometry.location.lon,
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
         </form>
         );
    }
}

class distance extends React.Component{
    constructor(props){
        super(props);
        this.state={value:''};
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(event){
        this.setState({value:event.target.value});
    }
    render(){
        return(
            <p>{this.state.value}</p>
        );
    }
}

export default App;
