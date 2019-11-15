import React from 'react';
import TimeSeriesPlot from '../components/TimeSeriesPlot'

// Pond
import { TimeSeries, TimeRange } from "pondjs";
/**
 * DATA
 */
const sample = require("../data/sample.json");
const beginTime = sample['begin_time']
const endTime = sample['end_time']
const timeDelta = (endTime-beginTime)/Object.keys(sample['EEG']).length
const initialPeriod = 20000  
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
const mod = (a,n)=>((a%n)+n)%n
const breakTimeSeries = (t0, t1, period)=>{
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
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
              
        let initialSelections = breakTimeSeries(beginTime, endTime, initialPeriod)
        this.state = {
            period: initialPeriod,
            tracker: null,
            timerange: EEG.range(),
            selected: 0,
            selections:initialSelections,
            trackerEventIn_EEG: null,
            trackerEventIn_EMG: null,
            trackerEventOut_EEG: null,
            trackerEventOut_EMG: null,
            trackerX: null
        };
    }

    handleTrackerChanged = (t, scale) => {
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
        
        //https://keycode.info/
        switch(event.key){
            case 'Enter':
                this.setState((state)=>({selected:mod((state.selected+1),state.selections.length)}))
                break;
            case 'Backspace':
                this.setState((state)=>{
                    return {selected:mod(state.selected-1,state.selections.length)}
                })
                break;
            default:
                break
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this._handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }
    render(){
        return (
            <div>
                <TimeSeriesPlot 
                    data={EEG}
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
                />
                <TimeSeriesPlot 
                    data={EMG}
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
                />
            </div>
        )
    }
}
export default Dashboard;
  