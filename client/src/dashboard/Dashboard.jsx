import React from 'react';
import TimeSeriesPlot from '../components/TimeSeriesPlot'

// Pond
import { TimeSeries, TimeRange } from "pondjs";
const rawTrafficData = require("../data/link-traffic.json");

const trafficBNLtoNEWYSeries = new TimeSeries({
    name: `BNL to NEWY`,
    columns: ["time", "in"],
    points: rawTrafficData.traffic["BNL--NEWY"].map( p => [p[0] * 1000, p[1]])
  });
  
  const trafficNEWYtoBNLSeries = new TimeSeries({
    name: `NEWY to BNL`,
    columns: ["time", "out"],
    points: rawTrafficData.traffic["NEWY--BNL"].map( p => [p[0] * 1000, p[1]])
  });
  
  const trafficSeries = TimeSeries.timeSeriesListMerge({
    name: "traffic",
    seriesList: [trafficBNLtoNEWYSeries, trafficNEWYtoBNLSeries]
  });
  
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracker: null,
            timerange: trafficSeries.range(),
            selected: 1,
            selections: [
                new TimeRange(1441059420000, 1441062390000),
                new TimeRange(1441070850000, 1441088580000),
                new TimeRange(1441127730000, 1441137540000)
            ],
            trackerEventIn: null,
            trackerEventOut: null,
            trackerX: null
        };
    }

    handleTrackerChanged = (t, scale) => {
        this.setState({
            tracker: t,
            trackerEventIn: t && trafficBNLtoNEWYSeries.at(trafficBNLtoNEWYSeries.bisect(t)),
            trackerEventOut: t && trafficNEWYtoBNLSeries.at(trafficNEWYtoBNLSeries.bisect(t)),
            trackerX: t && scale(t)
        });
    }
    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
    }
    handleSelectionChange = (timerange, i) => {
        const selections = this.state.selections;
        selections[i] = timerange;
        this.setState({ selections });
    }
    onBackgroundClick = ()=>{
        this.setState({ selection: null })
    }
    onTimeRangeClicked = (i)=>{
        this.setState({ selected: i })
    }
    render(){
        return (
            <div>
                <TimeSeriesPlot 
                    data={trafficSeries}
                    tracker={this.state.tracker} 
                    timerange={this.state.timerange} 
                    selected={this.state.selected} 
                    selections={this.state.selections}
                    trackerEventIn={this.state.trackerEventIn}
                    trackerEventOut={this.state.trackerEventOut}
                    trackerX={this.state.trackerX}
                    handleTrackerChanged={this.handleTrackerChanged}
                    handleTimeRangeChange={this.handleTimeRangeChange}
                    handleSelectionChange={this.handleSelectionChange}
                    onBackgroundClick={this.onBackgroundClick}
                    onTimeRangeClicked={this.onTimeRangeClicked}
                />
                <p>
                    Dashboard
                </p>
            </div>
        )
    }
}
export default Dashboard;
  