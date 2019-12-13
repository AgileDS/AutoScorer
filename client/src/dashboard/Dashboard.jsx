import React from 'react';
import TimeSeriesPlot from '../components/TimeSeriesPlot'

// Pond
import { TimeSeries, TimeRange } from "pondjs";
import Button from "react-bootstrap/Button";
import {listQualifications, sendQualificationsReq} from "../api";
/**
 * DATA
 */
const sample = require("../data/sample.json");
const beginTime = sample['begin_time']
const endTime = sample['end_time']
const timeDelta = (endTime-beginTime)/Object.keys(sample['EEG']).length
const initialPeriod = 10000
const visibleNumPeriods = 6
const selectedAt = 3
const EEG = new TimeSeries({
    name: `EEG`,
    columns: ["time", "in"],
    points: Object.values(sample["EEG"]).map( (p,i) => [parseInt((beginTime+i*timeDelta) * 1000), p])
});

const EMG = new TimeSeries({
    name: `EMG`,
    columns: ["time", "in"],
    points: Object.values(sample["EMG"]).map( (p,i) => [parseInt((beginTime+i*timeDelta) * 1000), p])
});
/**
 * UTILS
 */

const breakTimeRange = (t0, t1, period)=>{
    let numCuts = Math.floor((t1-t0)/period)
    return Array.apply(null,Array(numCuts+1)).map((n,i)=>{            
        let initTime = parseInt((t0+i*period) * 1000)
        let finalTime = parseInt((t0+(i+1)*period) * 1000)
        if (i === numCuts){
            return new TimeRange(initTime,t1*1000)
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
        let initialSelections = breakTimeRange(beginTime, endTime, initialPeriod)
        let numCuts =(endTime-beginTime)/initialPeriod
        let dataPerPeriod = parseInt(EEG.size() / numCuts)
        console.log(dataPerPeriod)
        let initEEG = cutTimeSeries(EEG,0,dataPerPeriod*visibleNumPeriods)//slice(1441051972000,1441138285686)
        let initEMG = cutTimeSeries(EMG,0,dataPerPeriod*visibleNumPeriods)
        //console.log(initEEG)
        listQualifications();
        //const max = Math.max(Math.abs(this.props.data.collection().max('in')), Math.abs(this.props.data.collection().min('in')))
        //let initEMG = EMG.slice(beginTime*1000,endTime*1000)
        this.state = {
            EEG: initEEG,//.slice(beginTime, beginTime+(initialPeriod*1000)*3.5)
            EMG: initEMG,
            offsetData: 0,
            tracker: null,
            timerange: initEEG.range(),
            selected: 0,
            selections:initialSelections,
            qualifications: {},
            trackerEventIn_EEG: null,
            trackerEventIn_EMG: null,
            trackerEventOut_EEG: null,
            trackerEventOut_EMG: null,
            trackerX: null
        };
    }
    getText = (i)=>{
        return this.state.qualifications[i]?this.state.qualifications[i]:null
    }
    handleTrackerChanged = (t, scale) => {
        console.log("t: ", t)
        this.setState({
            tracker: t,
            trackerEventIn_EEG: t && EEG.at(EEG.bisect(t)),
            trackerEventIn_EMG: t && EMG.at(EMG.bisect(t)),
            trackerEventOut_EEG: t && EEG.at(EEG.bisect(t)),
            trackerEventOut_EMG: t && EMG.at(EMG.bisect(t)),
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
        this.setState({ selected: i })
    }
    _handleKeyDown = (event) => {     
        let numCuts =(endTime-beginTime)/initialPeriod
        let dataPerPeriod = parseInt(EEG.size() / numCuts)
        let selected = this.state.selected
        let offset = this.state.offsetData
        let eventKey = event.key
        let qualifications =  this.state.qualifications
        if (eventKey!='ArrowRight' & eventKey!='ArrowLeft'){
            qualifications={...qualifications,[selected]:event.key}
            console.log("ym: ", event.key, offset*dataPerPeriod)
            eventKey='ArrowRight'
        }
        //https://keycode.info/        
        switch(eventKey){
            case 'ArrowRight':
                if (selected<numCuts-1){
                    selected+=1
                    if( selected > selectedAt-1 & offset < numCuts-(visibleNumPeriods)){
                        offset+=1
                    }                   
                }
                
                break;
            case 'ArrowLeft':
                if (selected>0){
                    selected-=1
                    console.log(offset)
                    if (offset>0 & selected < numCuts-selectedAt){
                        offset-=1
                    }
                }
                break;
            default:
                break
        }
        let newEEG = cutTimeSeries(EEG,offset*dataPerPeriod,dataPerPeriod*visibleNumPeriods)
        let newEMG = cutTimeSeries(EMG,offset*dataPerPeriod,dataPerPeriod*visibleNumPeriods)
        this.setState((state)=>{
            return {
                selected:selected, 
                offsetData:offset,
                timerange: newEEG.range(),
                EEG:newEEG,
                EMG:newEMG,
                qualifications: qualifications
            }
        })
    }
    send_selections = () => {
        console.log("send", this.state.qualifications);
        console.log("timerange", this.state.EEG, this.state.EMG);
        sendQualificationsReq('test', 10, this.state.qualifications)
    }
    componentDidMount(){
        document.addEventListener("keydown", this._handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }
    render(){
        console.log(this.state.EEG)
        return (
            <div>
                <Button onClick={this.send_selections}>Save selections</Button>
                <TimeSeriesPlot 
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
                    maxSignal={getAmplitude(EEG)}
                    getText={this.getText}
                />
                <TimeSeriesPlot 
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
                    maxSignal={getAmplitude(EMG)}
                    getText={this.getText}
                />
            </div>
        )
    }
}
export default Dashboard;
  