import React from 'react'
import {EdfDecoder} from 'edfdecoder'
class UploadForm extends React.Component {
  render(props){
    return(
    <div>
      <input type="file" onChange={this.setFile.bind(this)} accept='.edf'/>
    </div>
    )
  }
  postFile(event) {   
    // HTTP POST  
  }
  setFile(event) {
    // Get the details of the files
    let file = event.target.files[0]
    let decoder = new EdfDecoder();
    /*event.target.files[0].arrayBuffer((buff)=>{
        decoder.setInput(buff);        
        decoder.decode();
        let myEdf = decoder.getOutput();
        console.log('j')
    })*/
    if (file != null){
      let reader = new FileReader();
      reader.onloadend = ()=>{
        let decoder = new EdfDecoder();
        let buff = reader.result;
        decoder.setInput(buff);        
        decoder.decode();
        this.props.handleData(decoder.getOutput())
      }
      reader.readAsArrayBuffer(file);
    }
    
  }
}

export default UploadForm;