import React from "react";

import {withStyles} from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import {selectAction, exec} from "../../lsfusion"
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

const styles = {
    formControl : {
        width: "100%"
    },
    comment : {
        width: "100%"
    },
    error : {
        "margin-top" : 20,
        color: "red"
    }
};

class SendDocumentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type : 0,
            comment : "",

            error : null,

            types : []
        };
    }

    fetchTypes () {
        selectAction("Terminal.getTerminalDocumentTypes", {}).then(types => {
            this.setState( { types } )
        }, {});
    }

    componentDidMount() {
        this.fetchTypes();
    }

    sendDocument(type, comment, stock, details) {
        exec("Terminal.addTerminalDocument", { file : { type, comment, stock, details }})
            .then(response => { this.props.onSend(); this.onClose(); })
            .catch(error => {
                console.log(error);
                this.setState({ error : "Ошибка при отправке документа"})
            });
    }

    onClose () {
        this.setState( { error: null }, this.props.onClose())
    }

    render() {
        const {classes, stock, details} = this.props;
        const {type, types, comment} = this.state;

        return <Dialog
            open={this.props.open}
            onClose={this.props.onClose}
            aria-labelledby="send-document"
        >
            <DialogTitle id="send-document">Отправка документа</DialogTitle>
            <DialogContent>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="type-helper">Тип документа</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => this.setState( {type : e.target.value })}
                        input={<Input name="type" id="type-helper"/>}
                    >
                        {types.map(type => (<MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>))}
                    </Select>
                </FormControl>
                <TextField
                    id="comment"
                    placeholder="Комментарий"
                    autoComplete="off"
                    value={comment}
                    onChange={(e) => this.setState({ comment : e.target.value } )}
                    className={classes.comment}
                />
                {this.state.error != null && <DialogContentText className = {classes.error} >
                    {this.state.error}
                </DialogContentText>}
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => this.onClose()} color="primary">
                    Отмена
                </Button>
                <Button onClick={(e) => this.sendDocument(type, comment, stock, details)} color="primary" disabled={type == null}>
                    Отправить
                </Button>
            </DialogActions>
        </Dialog>
        ;
    }
}

export default withStyles(styles)(SendDocumentDialog);