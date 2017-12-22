import React, { Component } from 'react';
//import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import moment from 'moment';
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRowColumn, TableRow } from 'material-ui';

class App extends Component {
    static defaultProps = {
        numberOfMonths: 2,
        fromMonth: new Date(),
        toMonth:new Date().getFullYear()+1
    };
    constructor(props) {
        super(props);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleFlight = this.handleFlight.bind(this);
        let time = moment().format('MMMM Do YYYY, h:mm:ss a');
        let next = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        this.state = {
            selectedDay: undefined,
            fromMon: time,
            toMon: next,
            input: "",
            detail: []
        };
    }
    handleDayChange(day) {
        ////var curent = moment().format('MMMM Do YYYY, h:mm:ss a');
        //var date = day;
        //var curent = moment().format('llll');
        //let curentday = curent.slice(9, 11);
        //let curentYear = curent.slice(13, 17);
        //let next = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        ////let selectday = date.slice(9, 11);
        ////let selectYear = date.slice(13, 17);
        //let nextday = next.slice(9, 11);
        //let nextYear = next.slice(13, 17);
        ////let duration = moment().startOf('MMMM').fromNow();
        //var d = new Date();
        //d = d.toLocaleDateString();
        ////let day = day.spl
        ////let previous = d.setDate(d.getDate() - 0);
        ////console.log(d)
        //console.log(curentday, "curentday")
        //console.log(curentYear, "curentYear")
        ////console.log(selectday, "selectday")
        ////console.log(selectYear, "selectYear")
        //console.log(nextday, "nextday")
        //console.log(nextYear, "nextYear")
        ////console.log(day)
        ////console.log(next)

        //if()

        this.setState({ selectedDay: day });
    }
    handleFlight(e) {
        var date = this.state.selectedDay;
        //console.log(date, "dateeeeeeeeeeeeeeeee")
        var flight = this.state.input;
        //console.log(flight, "flightttttttttttttttttttttttt")
        var detailFlight, captain;
        var config = {
            headers : {Accept : 'application/json', ResourceVersion : 'v3'}
        }
        axios.get("https://api.schiphol.nl/public-flights/flights?app_id=736271b6&app_key=92b67b61a7e5ed55211ef7584a05d618" + "&flightname=" +flight+ "&scheduledate" +date , config)
            .then(function(response){
                //console.log(response, "responceeeeeeeeeeee")
                //console.log(response.data.flights, "***************");
                let result = response.data.flights;
                detailFlight = result.map((elem) => {
                    //console.log(elem.aircraftType.iatamain, "elemmmmmmmmmmmmmmmmmmmmm")
                    captain = elem.aircraftType.iatamain;
                    let detail = {
                        scheduleDate : elem.scheduleDate,
                        estimatedLandingTime : elem.estimatedLandingTime,
                        flightName : elem.flightName,
                        codeShares : elem.codeShares
                    }
                    return detail;
                });
                console.log(captain, "captainnnnnnnnnnnnnnnnnnnnnnnnn")
                var config2 = {
                    headers : {Accept : 'application/json', ResourceVersion : 'v1'}
                }
                axios.get("https://api.schiphol.nl/public-flights/aircrafttypes?app_id=736271b6&app_key=92b67b61a7e5ed55211ef7584a05d618" + "&iatamain=" +captain, config2)
                    .then(function(response1){
                        console.log(response1.data.aircraftTypes, "responce 2nd walaaaaaaaaaa")
                        let aircraft = response1.data.aircraftTypes
                        aircraft = aircraft.map((elem1) => {
                            console.log(elem1, "elem123333333333333333")
                            if(elem1.iatamain == captain){
                                detailFlight.captain = elem1.iatamain
                            }
                        })
                    })
                console.log(detailFlight, "99999999999999999999")
            });
        setTimeout(() => {
        this.setState({ detail: detailFlight});
        }, 10000)
    }


    render() {
        //console.log(this.state.detail, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        const { selectedDay } = this.state;
        return (
            <div>
                {selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}
                {!selectedDay && <p>Choose a day</p>}
                <DayPickerInput
                    dayPickerProps={{
                    numberOfMonths: 2,
                    fromMonth: this.props.fromMonth,
                    toMonth: this.props.fromMonth,
                    }}

                    onDayChange={this.handleDayChange} />
                <br />
                <TextField
                    hintText="Hint Text"
                    onChange={(e)=>{this.setState({input:e.target.value})}}
                    /><br />
                <br />
                <RaisedButton label="Primary" primary={true} onClick={this.handleFlight} />
                <Table height={"100%"} fixedHeader={true} bodyStyle={{overflow:'visible'}}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Flight Name</TableHeaderColumn>
                            <TableHeaderColumn>Aircraft</TableHeaderColumn>
                            <TableHeaderColumn>Departure</TableHeaderColumn>
                            <TableHeaderColumn>Arrival</TableHeaderColumn>
                            <TableHeaderColumn>Arrival</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow selectable={false}>
                            <TableRowColumn></TableRowColumn>
                        </TableRow>
                        {this.state.detail.map((reading, index) => {
                            return <TableRow key={index}>
                                    <TableRowColumn >{reading.flightName}</TableRowColumn>
                                    <TableRowColumn >{reading.captain}</TableRowColumn>
                                    <TableRowColumn >{reading.scheduleDate}</TableRowColumn>
                                    <TableRowColumn >{reading.estimatedLandingTime}</TableRowColumn>
                                    <TableRowColumn >{reading.codeShares}</TableRowColumn>
                                 </TableRow>
                            })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default App;
