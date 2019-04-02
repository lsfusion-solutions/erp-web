import React from "react";

import { withStyles } from "@material-ui/core/styles";
import ItemSelector from "../../components/items/ItemSelector";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {selectAction, exec} from "../../lsfusion";
import Message from "../../components/Message";

import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";

import "./itemsize.css";

const styles = {
    textField : {
        width : 110
    },
    button : {
        width : "100%"
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    dialog : {
    },
    sliderLabel : {
        margin : 4
    },
    slider : {
        margin : 4,
        "padding-bottom" : 8
    }
};

class ItemSize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barcode : "",
            name : "",

            item : null,

            sizesChanged : false,
            sizes : {},

            messageVariant : "success",
            message : null,

            camera : false,
            sizeFactor : 1,

            imageUrl : null
        }
    }

    fetchItemSize() {
        selectAction("Item.getSkuSize",
            {
                item: this.state.item.id
            }).then(sizes =>
                this.setState({ sizes : sizes[0], sizesChanged : false }));
        exec("Stock.getSkuImage",
            {
                item: this.state.item.id
            }).then(response => response.blob()).then(
            blob => this.setState({ imageUrl : window.URL.createObjectURL(blob) })
        );
    }

    onItemChange = (item) => {
        this.setState( {item}, () => this.fetchItemSize() )
    };

    onChangeSize (id, value) {
        this.setState(prevState =>
            ({sizes : {...prevState.sizes,
                    ...{[id]: parseFloat(value)}
                }, sizesChanged : true})
        );
    }

    saveItemSize () {
        exec("Item.addSkuSize",
            {
                sizes: [ this.state.sizes ],
                id: this.state.item.id
            }).then(response => this.setState( { message : "Данные сохранены", messageVariant : "success", sizesChanged : false }))
              .catch(error => this.setState( { message : "Ошибка при сохранении данных", messageVariant : "error" }));
    }

    onTakePhoto = (dataUri) => {
        fetch(dataUri)
            .then(res => res.blob()).then(image =>
            {
                exec("Stock.setSkuImage",
                    {
                        image: image,
                        id: this.state.item.id
                    }).then(response => {
                        this.setState( { message : "Изображение загружено", messageVariant : "success", camera : false });
                        this.fetchItemSize();
                    }).catch(error => this.setState( { message : "Ошибка при загрузке изображения", messageVariant : "error" }));
            }
        )
    };

    render() {
        const {classes} = this.props;
        const {barcode, name, item, sizes, sizesChanged, message, messageVariant, camera, sizeFactor, imageUrl} = this.state;

        return <div>
            <ItemSelector
                barcode={barcode}
                onBarcodeChange={barcode => {
                    this.setState({barcode, name : ""});
                }}
                name={name}
                onNameChange={name => {
                    this.setState({name, barcode : ""});
                }}
                item={item}
                onItemChange={this.onItemChange}
            />
            <TextField
                id="length"
                label="Длина, мм"
                value={sizes.length === undefined ? "" : sizes.length}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("length", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="width"
                label="Ширина, мм"
                value={sizes.width === undefined ? "" : sizes.width}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("width", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="height"
                label="Высота, мм"
                value={sizes.height === undefined ? "" : sizes.height}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("height", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="volume"
                label="Объем, л"
                value={sizes.volume === undefined ? "" : sizes.volume}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("volume", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="netWeight"
                label="Вес нетто, кг"
                value={sizes.netWeight === undefined ? "" : sizes.netWeight}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("netWeight", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                id="grossWeight"
                label="Вес брутто, кг"
                value={sizes.grossWeight === undefined ? "" : sizes.grossWeight}
                type="number"
                autoComplete="off"
                disabled={item == null}
                onChange={(e) => this.onChangeSize("grossWeight", e.target.value)}
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={(e) => this.saveItemSize()}
                disabled={item == null || !sizesChanged}
                className={classes.button}>
                Сохранить
            </Button>
            <Message
                variant={messageVariant}
                open={message != null}
                message={message}
                handleClose={(e) => this.setState ({message : null} )}
            />
            { item != null &&
                <div>
                    {/*<img width="100%" height="100%" src={getUrlExec() + "?action=Stock.getSkuImage&p=" + item.id} alt=""/>*/}
                    <img width="100%" height="100%" src={imageUrl} alt=""/>
                </div>}
            <Button
                variant="contained"
                color="secondary"
                onClick={(e) => this.setState ( {camera : true}) }
                disabled={item == null}
                className={classes.button}>
                Сфотографировать
            </Button>
            <Dialog
                fullScreen
                open={camera}
                onClose={() => this.setState ({ camera: false}) }
                aria-labelledby="send-image"
                className={classes.dialog}
            >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={() => this.setState ({ camera: false}) } aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Изображение
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Typography className={classes.sliderLabel}>Качество</Typography>
                <Slider
                    className={classes.slider}
                    value={sizeFactor}
                    max={1}
                    onChange={(event, value) => this.setState({sizeFactor : value}) }
                />
                <Camera
                    idealFacingMode = {FACING_MODES.ENVIRONMENT}
                    isImageMirror = {false}
                    sizeFactor={sizeFactor}
                    onTakePhoto = { this.onTakePhoto }
                />
            </Dialog>
        </div>
    }
}

export default withStyles(styles)(ItemSize);