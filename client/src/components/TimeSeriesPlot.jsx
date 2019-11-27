import React from 'react';
import { format } from "d3-format";
// Imports from the charts library

import {ChartContainer, ChartRow, Charts, YAxis, LineChart, Legend, Resizable, styler} from "react-timeseries-charts";
import MultiBrush from './MultiBrush'
const upDownStyle = styler([
    { key: "in", color: "#C8D5B8" }, 
    { key: "out", color: "#9BB8D7" }
]);
class TimeSeriesPlot extends React.Component {

    render(){
        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };
  
        const markerStyle = {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: "#AAA",
          marginLeft: "5px"
        }
  
        const axistype = "linear";
        const tracker = this.props.tracker ? `${this.props.tracker}` : "";
        const formatter = format(".4s");
  
        return (
            <div>
                {/*
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={upDownStyle}
                            categories={[
                                { key: "in", label: "Into Site" },
                                { key: "out", label: "Out of site" }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{tracker}</span>
                        </div>
                </div>
                */}
                <hr />
  
                <div className="row">
                    <div className="col-md-12">
                        { this.props.tracker ?
                            <div style={{position: 'relative'}}>
                                <div style={{position: 'absolute', left: this.props.trackerX}}>
                                    <div style={markerStyle}>Data In: {formatter(this.props.trackerEventIn.get('in'))}</div>
                                </div>
                            </div>
                        : null }
                        <Resizable>
                            <ChartContainer
                                timeRange={this.props.timerange}
                                trackerPosition={this.props.tracker}
                                onTrackerChanged={this.props.handleTrackerChanged}
                                enablePanZoom={false}
                                maxTime={this.props.timerange.end()}
                                minTime={this.props.timerange.begin()}
                                minDuration={1000 * 60 * 60}
                                onBackgroundClick={this.props.onBackgroundClick}
                                onTimeRangeChanged={this.props.handleTimeRangeChange}
                            >
                                <ChartRow height="250" debug={false}>
                                    <Charts>
                                        <LineChart
                                            axis="traffic"
                                            series={this.props.data}
                                            columns={["in"]}
                                            style={upDownStyle}
                                        />
                                        <MultiBrush
                                            timeRanges={this.props.selections}
                                            style={i => {
                                                if (i === this.props.selected) {
                                                    return { fill: "#46abff" };
                                                } else {
                                                    return { fill: "#cccccc" };
                                                }
                                            }}
                                            text={i => {
                                                return this.props.getText?this.props.getText(i):''
                                            }}
                                            allowSelectionClear
                                            onTimeRangeChanged={this.props.handleSelectionChange}
                                            onTimeRangeClicked={this.props.onTimeRangeClicked}
                                        />
                                    </Charts>
                                    <YAxis
                                        id="traffic"
                                        label="Traffic (bps)"
                                        labelOffset={0}
                                        min={-this.props.maxSignal}
                                        max={this.props.maxSignal}
                                        absolute={true}
                                        width="60"
                                        type={axistype}
                                    />
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                    
                </div>
            </div>
        );
    }
}
export default TimeSeriesPlot;