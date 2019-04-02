import React from "react";

import { withStyles } from "@material-ui/core/styles";

import ItemStoreSelector from "../../components/items/ItemStoreSelector";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SendDocumentDialog from "./SendDocumentDialog";

const styles = {
    detailsContainer : {
        // "border-top" : "1px solid grey"
    },
    details : {
        width : "100%"
    },
    detailRow : {
        height: "auto"
    },
    detailCell : {
        padding: 2,
        "&:last-child": {
            paddingRight: 2
        }
    },
    quantityContainer : {
        display: "flex",
        "flex-direction": "row",
        "margin-top" : 2,
        "margin-bottom" : 2
    },
    quantity: {
        "align-items": "stretch",
        margin: 2
    },
    doneButton : {
        flex: 1
    },
    sendDocument : {
        width : "100%"
    }
};

class AddDocument extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,

            lastScanned: false,
            scanBarcode: false,

            barcode: "",
            name: "",

            barcodeRef: null,

            item: null,
            quantity: "",
            quantityRef: null,

            details: [],

            sending: false
        };
    }

    addDetail = () => {
        this.setState(prevState => {
            var newDetails = prevState.details.slice();
            newDetails.unshift({ item : this.state.item, quantity : parseFloat(this.state.quantity)});
            if (this.state.barcodeRef != null) this.state.barcodeRef.focus();
            var newState = { details : newDetails, item : null, barcode : "", name : "", quantity : "" };
            if (prevState.lastScanned)
                newState.scanBarcode = true;
            return newState;
        })
    };
    deleteDetail = (index) => {
        this.setState(prevState => {
            var newDetails = prevState.details.slice();
            newDetails.splice(index, 1);
            return { details : newDetails };
        })
    };

    render() {
        const {classes} = this.props;
        const {store, scanBarcode, barcode, name, item, quantity, details} = this.state;
        return (
            <div>
                <ItemStoreSelector
                    store={store}
                    onStoreChange={store => {
                        this.setState({store});
                    }}
                    barcode={barcode}
                    onBarcodeChange={(barcode, scan) => {
                        this.setState({barcode, name : "", scanBarcode: false, lastScanned: scan});
                    }}
                    scanBarcode={scanBarcode}
                    onScanBarcodeChange={scanBarcode => {
                        this.setState({scanBarcode});
                    }}
                    name={name}
                    onNameChange={name => {
                        this.setState({name, barcode : ""});
                    }}
                    item={item}
                    onItemChange={item => {
                        this.setState({item});
                        if (this.state.quantityRef != null)
                            this.state.quantityRef.focus();
                    }}
                    barcodeRef={ref => {
                        this.setState({barcodeRef: ref})
                    }}
                />
                {store != null && <div className={classes.quantityContainer}>
                    <TextField
                        id="value"
                        value={quantity}
                        onChange={(e) => this.setState({quantity: e.target.value})}
                        placeholder="Кол-во"
                        type="number"
                        inputRef={text => this.setState({quantityRef: text})}
                        className={classes.quantity}
                    />
                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                        rel="stylesheet"
                    />
                    <Button variant="contained"
                            color="secondary"
                            onClick={(e) => this.addDetail()}
                            disabled={item == null || isNaN(parseFloat(quantity))}
                            className={classes.doneButton}>
                        <i className="material-icons">done</i>
                    </Button>
                </div>}
                {store != null && <div className={classes.detailsContainer}>
                    <Table className={classes.details}>
                        <TableBody>
                            {details.map((d, index) => (
                                <TableRow key={index} className={classes.detailRow}>
                                    <TableCell className={classes.detailCell}>{d.item.barcode}</TableCell>
                                    <TableCell className={classes.detailCell}>{d.item.name}</TableCell>
                                    <TableCell className={classes.detailCell} align="right">{d.quantity}</TableCell>
                                    <TableCell className={classes.detailCell} align="center">
                                        <IconButton className={classes.button} aria-label="Delete"
                                                    onClick={(e) => this.deleteDetail(index)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}
                {store != null && <Button variant="contained"
                                          color="primary"
                                          onClick={(e) => this.setState({sending: true})}
                                          disabled={details.length === 0}
                                          className={classes.sendDocument}>
                    Отправить
                </Button>}
                <SendDocumentDialog open={this.state.sending}
                                    onSend={() => this.setState ( {details : []})}
                                    onClose={() => this.setState({sending: false})}
                                    stock={store}
                                    details={details}/>
            </div>
        );
    }
}

export default withStyles(styles)(AddDocument);
