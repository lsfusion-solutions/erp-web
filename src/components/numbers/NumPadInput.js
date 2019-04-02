import React from "react";

import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import NumPad from "./NumPad";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import List from "../../App";

const styles = {
    container: {
        "display": "flex",
        "flex-direction": "row"
    },
    numPad: {
        "flex" : 2
    },
    value: {
    },
    actionColumn: {
        "flex": "1",
        "display": "flex",
        "flex-direction": "column"
    },
    button: {
    },
    doneButton: {
        "flex": 1
    }
};

class NumPadInput extends React.Component {

    onPressButton = (value, button) => {
        var newValue;
        switch (button) {
            case "backspace" :
                newValue = value.slice(0, -1)
                break;
            case "." :
                newValue = value.replace('.', '') + '.';
                break;
            case "-" :
                newValue = '-' + value.replace('-', '');
                break;
            default:
                newValue = value + button;
        }
        this.props.onChange(newValue)
    }

    render() {
        const { classes, value, disabled } = this.props;
        return <div className={classes.container}>
            <NumPad className={classes.numPad} onPressButton={(button) => this.onPressButton(value, button)}/>
            <div className={classes.actionColumn}>
                <Button onClick={(e) => this.onPressButton(value, "backspace")} className={classes.button}><i className="material-icons">backspace</i></Button>
                <TextField
                    id="value"
                    value={value}
                    label="Кол-во"
                    InputProps={{
                        readOnly: true
                    }}
                    className={classes.value}
                />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <Button variant="contained"
                        color="primary"
                        onClick={(e) => this.props.onDone()}
                        disabled={disabled || isNaN(parseFloat(value))}
                        className={classes.doneButton}>
                    <i className="material-icons">done</i>
                </Button>
            </div>
        </div>
    }
}

export default withStyles(styles)(NumPadInput);

