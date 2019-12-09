import React from 'react';
import TimeSeriesPlot from '../components/TimeSeriesPlot'
import _ from 'lodash'
// Pond
import { TimeSeries, TimeRange } from "pondjs";
/**
 * DATA
 */
const visibleNumPeriods = 6
const selectedAt = 2



/**
 * UTILS
 */

const breakTimeRange = (t0, t1, numCuts)=>{
    let period = Math.floor((t1-t0)/numCuts)
    return Array.apply(null,Array(numCuts+1)).map((n,i)=>{            
        let initTime = parseInt((t0+i*period))
        let finalTime = parseInt((t0+(i+1)*period))
        if (i === numCuts){
            return new TimeRange(initTime,t1)
        }
        return new TimeRange(initTime,finalTime)
    })
}

const cutTimeSeries = (data, offsetData, length)=>{
    return data.slice(offsetData,parseInt(offsetData+length))
}

const getAmplitude = (data)=>{
    return Math.max(Math.abs(data.collection().max('in')), Math.abs(data.collection().min('in')))
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        //console.log(initEEG)
        //const max = Math.max(Math.abs(this.props.data.collection().max('in')), Math.abs(this.props.data.collection().min('in')))
        //let initEMG = EMG.slice(beginTime*1000,endTime*1000)
        this.state = {
            EEG: null,//.slice(beginTime, beginTime+(initialPeriod*1000)*3.5)
            EMG: null,
            offsetData: 0,
            tracker: null,
            timerange: null,
            selected: 0,
            selections:null,
            qualifications: {},
            trackerEventIn_EEG: null,
            trackerEventIn_EMG: null,
            trackerEventOut_EEG: null,
            trackerEventOut_EMG: null,
            trackerX: null
        };
    }
    getText = (i)=>{
        return this.state.qualifications[i+this.state.offsetData]?this.state.qualifications[i+this.state.offsetData]:null
    }
    handleTrackerChanged = (t, scale) => {
        this.setState({
            tracker: t,
            trackerEventIn_EEG: t && this.state.EEG.at(this.state.EEG.bisect(t)),
            trackerEventIn_EMG: t && this.state.EMG.at(this.state.EMG.bisect(t)),
            trackerEventOut_EEG: t && this.state.EEG.at(this.state.EEG.bisect(t)),
            trackerEventOut_EMG: t && this.state.EMG.at(this.state.EMG.bisect(t)),
            trackerX: t && scale(t)
        });
    }
    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    }
    handleSelectionChange = (timerange, i) => {
        //Blocked
        //const selections = this.state.selections;
        //selections[i] = timerange;
        //this.setState({ selections });
    }
    onBackgroundClick = ()=>{
        this.setState({ selection: null })
    }
    onTimeRangeClicked = (i)=>{
        this.setState({ selected: i%visibleNumPeriods })
        console.log(i,i%visibleNumPeriods)
    }
    edfParser = (offsetData=0)=>{
        let edf = this.props.edf
        if (!edf) return
        // http://www.pixpipe.io/edfdecoder/doc/
        let totalRecords = edf.getNumberOfRecords()
        let standardLength = edf.getRawSignal(0,0).length
        let lastLength = edf.getRawSignal(0,totalRecords-1).length
        let secondsInRecord = edf.getRecordDuration()
        let beginTime = edf.getRecordingStartDate().getTime()
        
        let valuesEEG = edf.getPhysicalSignalConcatRecords(0, offsetData, visibleNumPeriods)
        // Object.values(sample["EMG"]).map( (p,i) => [parseInt((beginTime+i*timeDelta) * 1000), p])
        let timeSeriesEEG = new TimeSeries({
            name: `EEG`,
            columns: ["time", "in"],
            points: _.map(valuesEEG, (p,i) => [parseInt((beginTime+i*secondsInRecord) * 1000), p])
        });
        let valuesEMG = edf.getPhysicalSignalConcatRecords(1, offsetData, visibleNumPeriods)
        // Object.values(sample["EMG"]).map( (p,i) => [parseInt((beginTime+i*timeDelta) * 1000), p])
        let timeSeriesEMG = new TimeSeries({
            name: `EMG`,
            columns: ["time", "in"],
            points: _.map(valuesEMG,  (p,i) => [parseInt((beginTime+i*secondsInRecord) * 1000), p])
        });
        let selections = breakTimeRange(timeSeriesEEG.timerange().toJSON()[0], timeSeriesEEG.timerange().toJSON()[1], visibleNumPeriods-1)
        return [timeSeriesEEG, timeSeriesEMG, selections]
    }
    _handleKeyDown = (event) => {     
        // let numCuts =(endTime-beginTime)/initialPeriod //TOTAL DE TALLS
        let selected = this.state.selected
        let offset = this.state.offsetData
        let eventKey = event.key
        let qualifications =  this.state.qualifications
        if (eventKey!='ArrowRight' & eventKey!='ArrowLeft'){
            qualifications={...qualifications,[offset+selected]:event.key}
            eventKey='ArrowRight'
        }
        //https://keycode.info/        
        switch(eventKey){
            case ' ':
                console.log('hey')
                // this.setState({timerange:breakTimeRange(beginTime, endTime, initialPeriod*secondsInRecord*100)})
                break;
            case 'ArrowRight':
                //if (true)  // at the end
                if (selected<selectedAt){
                    selected+=1                  
                }else{
                    offset+=1
                }
                
                break;
            case 'ArrowLeft':
                if (offset>0)offset-=1
                else{
                    if (selected>0){
                        selected-=1
                    }
                }
                break;
            default:
                break
        }
        if (offset!=this.state.offsetData) {
            let parsed = this.edfParser(offset)
            let timeSeriesEEG = parsed[0]
            let timeSeriesEMG = parsed[1]
            let selections = parsed[2]
            this.setState({
                EEG: timeSeriesEEG,
                EMG: timeSeriesEMG,
                offsetData: offset,
                selected:selected,
                timerange: timeSeriesEEG.range(),
                selections: selections,
                qualifications: qualifications
            })
        }else{
            this.setState({selected:selected,qualifications: qualifications})
        }
        /*
        this.setState((state)=>{
            return {
                selected:selected, 
                offsetData:offset,
                timerange: newEEG.range(),
                EEG:newEEG,
                EMG:newEMG,
                qualifications: qualifications
            }
        })*/
    }
    componentDidMount(){
        document.addEventListener("keydown", this._handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.edf!=null && prevProps.edf!==this.props.edf){
            let parsed = this.edfParser(0)
            let timeSeriesEEG = parsed[0]
            let timeSeriesEMG = parsed[1]
            let selections = parsed[2]
            this.setState({
                EEG: timeSeriesEEG,//.slice(beginTime, beginTime+(initialPeriod*1000)*3.5)
                EMG: timeSeriesEMG,
                timerange: timeSeriesEEG.range(),
                selections: selections
            })
        }
    }
    render(){
        
        return (
            <div>
                { this.state.EEG ? <TimeSeriesPlot 
                    data={this.state.EEG}
                    tracker={this.state.tracker} 
                    timerange={this.state.timerange} 
                    selected={this.state.selected} 
                    selections={this.state.selections}
                    trackerEventIn={this.state.trackerEventIn_EEG}
                    trackerEventOut={this.state.trackerEventIn_EEG}
                    trackerX={this.state.trackerX}
                    handleTrackerChanged={this.handleTrackerChanged}
                    handleTimeRangeChange={this.handleTimeRangeChange}
                    handleSelectionChange={this.handleSelectionChange}
                    onBackgroundClick={this.onBackgroundClick}
                    onTimeRangeClicked={this.onTimeRangeClicked}
                    maxSignal={800}
                    minSignal={-800}
                    getText={this.getText}
                />:null }
                {this.state.EMG ?<TimeSeriesPlot 
                    data={this.state.EMG}
                    tracker={this.state.tracker} 
                    timerange={this.state.timerange} 
                    selected={this.state.selected} 
                    selections={this.state.selections}
                    trackerEventIn={this.state.trackerEventIn_EMG}
                    trackerEventOut={this.state.trackerEventOut_EMG}
                    trackerX={this.state.trackerX}
                    handleTrackerChanged={this.handleTrackerChanged}
                    handleTimeRangeChange={this.handleTimeRangeChange}
                    handleSelectionChange={this.handleSelectionChange}
                    onBackgroundClick={this.onBackgroundClick}
                    onTimeRangeClicked={this.onTimeRangeClicked}
                    maxSignal={6000}
                    minSignal={-6000}
                    getText={this.getText}
                />:null}
            </div>
        )
    }
}
export default Dashboard;
  