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
const API_KEY='AIzaSyDhOCyIoQjMiCNcKdinj8cRHX32jMEDBOA';
const REQUEST_URL='https://maps.googleapis.com/maps/api/geocode/json?address=ADDRESS&key='+API_KEY;
class DesForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '',data:'',address:''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        if(this.state.value!=''){
            this.fetchData();
            console.log(this.state.data);
        }
    }

    fetchData() {
     fetch(REQUEST_URL.replace("ADDRESS",this.state.value))
          .then((response) => response.json())
     .then((responseData) => {
       this.setState({
         data: responseData,
       })
       if(responseData.status=="OK"){
           this.setState({
               address:responseData.results[0].formatted_address
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
