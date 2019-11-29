import React from 'react'
import {EdfDecoder} from 'edfdecoder'
function UploadForm(props) {
  return(
    <div>
      <input type="file" onChange={setFile.bind(this)} accept='.edf'/>
      <input type="button" onClick={postFile} value="Upload" />
    </div>
  )
  function postFile(event) {   
    // HTTP POST  
  }
  function setFile(event) {
    // Get the details of the files
    let file = event.target.files[0]
    let decoder = new EdfDecoder();
    /*event.target.files[0].arrayBuffer((buff)=>{
        decoder.setInput(buff);        
        decoder.decode();
        let myEdf = decoder.getOutput();
        console.log('j')
    })*/
    let reader = new FileReader();
    reader.onloadend = function(){
      let buff = reader.result;
      decoder.setInput(buff);        
      decoder.decode();
      this.props.handleDataReady(decoder.getOutput())
    }
    reader.readAsArrayBuffer(file);
    console.log('j')
  }
}

export default UploadForm;