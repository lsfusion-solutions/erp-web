import React from "react";

import { withStyles } from "@material-ui/core/styles";

import moment from "moment";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";

import "./dateselector.css";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
    button: {
        margin: 2
    },
    dateRange: {
        "margin-left": 2
    },
    buttonRange: {
        "padding-top" : "4px",
        "padding-bottom" : "4px",
        "border-color" : "#dbdbdb",
        "border-radius" : 2
    },
    period: {
        display: "flex"
    }
});

class DateSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedInput: null,

            anchorEl : null
        }
    }

    setPeriod = (period) => {
        this.setState ( { anchorEl : null });
        var date;
        switch (period) {
            case "today":
                date = moment();
                this.props.onDatesChange({ startDate: date, endDate: date });
                break;
            case "yesterday":
                date = moment().subtract(1, "days");
                this.props.onDatesChange({ startDate: date, endDate: date });
                break;
            case "last7days":
                this.props.onDatesChange({
                    startDate: moment().subtract(7, "days"),
                    endDate: moment().subtract(1, "days")
                });
                break;
            case "last30days":
                this.props.onDatesChange({
                    startDate: moment().subtract(30, "days"),
                    endDate: moment().subtract(1, "days")
                });
                break;
            case "month":
                this.props.onDatesChange({
                    startDate: moment().startOf("month"),
                    endDate: moment().subtract(1, "days")
                });
                break;
            case "year":
                this.props.onDatesChange({
                    startDate: moment().startOf("year"),
                    endDate: moment().subtract(1, "days")
                });
                break;
            default:
                return {};
        }
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <div>
                <div className={classes.dateRange}>
                    <DateRangePicker
                        startDate={this.props.startDate} // momentPropTypes.momentObj or null,
                        startDateId="select_start_id" // PropTypes.string.isRequired,
                        endDate={this.props.endDate} // momentPropTypes.momentObj or null,
                        endDateId="select_end_id" // PropTypes.string.isRequired,
                        onDatesChange={this.props.onDatesChange} // PropTypes.func.isRequired,
                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                        numberOfMonths={1}
                        minimumNights={0}
                        displayFormat="DD.MM.YYYY"
                        isOutsideRange={day =>
                            moment()
                                .startOf("day")
                                .diff(day.startOf("day")) < 0
                        }
                        readOnly
                        small
                    />
                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                        rel="stylesheet"
                    />
                    <Button
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        variant="outlined"
                        onClick={(event) => this.setState( { anchorEl: event.currentTarget } )}
                        className={classes.buttonRange}
                    >
                        <i className="material-icons">list</i>
                    </Button>
                    <Menu
                        id="date-interval"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => this.setState ( { anchorEl : null })}
                    >
                        <MenuItem onClick={() => this.setPeriod("today")}>Сегодня</MenuItem>
                        <MenuItem onClick={() => this.setPeriod("yesterday")}>Вчера</MenuItem>
                        <MenuItem onClick={() => this.setPeriod("last7days")}>7 дней</MenuItem>
                        <MenuItem onClick={() => this.setPeriod("last30days")}>30 дней</MenuItem>
                        <MenuItem onClick={() => this.setPeriod("month")}>Месяц</MenuItem>
                        <MenuItem onClick={() => this.setPeriod("year")}>Год</MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(DateSelector);
