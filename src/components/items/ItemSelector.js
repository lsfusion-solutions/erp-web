import React from "react";

import { withStyles } from "@material-ui/core/styles";

import {selectAction} from "../../lsfusion";

import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import BarcodeButton from "../barcode/BarcodeButton";

const styles = {
    barcode : {
        width : 120,
        display : "inline-block"
    },
    barcodeButton : {
        display : "inline-block",
        margin : 2
    },
    name : {
        width : 180,
        display : "inline-block"
    },
    itemsContainer : {
        "border-bottom" : "1px solid grey",
        height : 150,
        "overflow-y" : "scroll"
    },
    items : {
        width : "100%",
    },
    itemRow : {
        height: "auto"
    },
    itemCell : {
        padding: 2,
        "&:last-child": {
            paddingRight: 4
        }
    }
};

class ItemSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanBarcode: false,

            items: []
        };
    }

    fetchItems (barcode, name) {
        if ((barcode.length >= 3 || name.length > 3)) {
            selectAction("Stock.getSkus",
                { barcode : barcode.length >= 3 ? barcode : "",
                    name : name.length > 3 ? name : ""
                }).then(items => {
                    this.setState({items}, () => {
                        if (items.length === 1 && items[0].barcode === barcode) {
                            this.props.onItemChange(items[0]);
                        }
                    });
            });
        } else {
            this.setState( {items : []});
        }
    }

    componentDidMount() {
        this.fetchItems(this.props.barcode, this.props.name);
    }

    onBarcodeChange = (barcode) => {
        this.props.onBarcodeChange(barcode);
        this.fetchItems(barcode, this.props.name);
    };
    onNameChange = (name) => {
        this.props.onNameChange(name);
        this.fetchItems(this.props.barcode, name);
    };

    render() {
        const { classes, barcode, name, item, onItemChange } = this.props;
        const { scanBarcode, items } = this.state;

        return (
            <div>
                <div>
                    <TextField
                        id="barcode"
                        placeholder="Штрих-код"
                        value={barcode}
                        type="number"
                        autoComplete="off"
                        onChange={(e) => this.onBarcodeChange(e.target.value)}
                        className={classes.barcode}
                    />
                    <BarcodeButton
                        scanBarcode={scanBarcode}
                        onDetected = {(result) => { this.onBarcodeChange(result.toString()); this.setState( {scanBarcode : false} ); }}
                        onScanBarcodeChange = {(scanBarcode) => this.setState( {scanBarcode} )}
                        className={classes.barcodeButton}
                    />
                    <TextField
                        id="name"
                        placeholder="Наименование"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => this.onNameChange(e.target.value)}
                        className={classes.name}
                    />
                    <div className={classes.itemsContainer}>
                        <Table className={classes.items}>
                            <TableBody>
                                {items.map(i => (
                                    <TableRow key={i.id} onClick={e => onItemChange(i)} selected={item === i} className={classes.itemRow}>
                                        <TableCell className={classes.itemCell}>{i.barcode}</TableCell>
                                        <TableCell className={classes.itemCell}>{i.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ItemSelector);
