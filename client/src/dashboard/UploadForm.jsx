import React from 'react'
import {EdfDecoder} from 'edfdecoder'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import {Spinner} from "react-bootstrap";

class UploadForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        spinner:false
      };
  }


  render(props){
    return(
    <div align="center" className="vh-100 center-block align-middle">
        <Jumbotron>
            <h1>Hello to your favourite AutoScorer!</h1>
            <p> Just one more step to get to the dashboard &#128516; </p>
        </Jumbotron>
        <div align="center" className='mt-3 pt-3' style={{'maxWidth': 20 + 'em'}}>
          <Form.Control className="d-inline-flex p-2 align-middle" type="file" onChange={this.setFile.bind(this)} accept='.edf'/>
        </div>
        {this.state.spinner ? <Spinner animation="border" variant="secondary"  /> : null}
      </div>
    )
  }
  postFile(event) {   
    // HTTP POST  
  }
  setFile(event) {
    this.setState({spinner: true})
      // console.log("spinner on")
    // Get the details of the files
    let file = event.target.files[0]
    let filename = event.target.files[0].name;
    let decoder = new EdfDecoder();
    /*event.target.files[0].arrayBuffer((buff)=>{
        decoder.setInput(buff);        
        decoder.decode();
        let myEdf = decoder.getOutput();
    })*/
    if (file != null){
      let reader = new FileReader();
      reader.onloadend = ()=>{
        let decoder = new EdfDecoder();
        let buff = reader.result;
        decoder.setInput(buff);        
        decoder.decode();
        this.props.handleData(decoder.getOutput(), filename)
      }
      reader.readAsArrayBuffer(file);
      // this.setState({spinner: false})
      //   console.log("spinner off")
    }
    
  }
}

export default UploadForm;