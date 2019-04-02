import React from "react";

import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = {
    button : {
        width: "33.33%"
    }
};

class NumPad extends React.Component {

    renderButton(classes, button) {
        return <Button onClick={(e) => { this.props.onPressButton(button); e.preventDefault(); return false; }} className={classes.button}>{button}</Button>;
    }

    render() {
        const {classes, className} = this.props;
        return <div className={className}>
            {this.renderButton(classes,"1")}
            {this.renderButton(classes,"2")}
            {this.renderButton(classes,"3")}
            {this.renderButton(classes,"4")}
            {this.renderButton(classes,"5")}
            {this.renderButton(classes,"6")}
            {this.renderButton(classes,"7")}
            {this.renderButton(classes,"8")}
            {this.renderButton(classes,"9")}
            {this.renderButton(classes,"-")}
            {this.renderButton(classes,"0")}
            {this.renderButton(classes,".")}
        </div>
    }
}

export default withStyles(styles)(NumPad);