import React from "react";

import { withStyles } from "@material-ui/core/styles";
import {Button} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import AppBar from "@material-ui/core/AppBar";
import BarcodeScanner from "./BarcodeScanner";
import ListItem from "../../App";

const styles = {
    button : {
        padding : "2px",
        "min-width" : "24px"
    }
};

class BarcodeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {classes, onDetected, scanBarcode, onScanBarcodeChange} = this.props;

        return <div className={this.props.className}>
            <Button
                variant="outlined"
                onClick={(e) => onScanBarcodeChange(true)}
                className={classes.button}
            >
                <i className="material-icons">camera</i>
            </Button>
            <Dialog
                fullScreen
                open={scanBarcode}
                onClose={() => onScanBarcodeChange(false) }
                aria-labelledby="read-barcode"
            >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={() => onScanBarcodeChange(false) } aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Сканирование штрих-кода
                        </Typography>
                    </Toolbar>
                </AppBar>
                <BarcodeScanner
                    onDetected={onDetected}
                />
            </Dialog>
        </div>
    }
}

export default withStyles(styles)(BarcodeButton);
