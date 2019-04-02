import React from "react";

import { withStyles } from "@material-ui/core/styles";

import { selectAction } from "../../lsfusion";

import Select from "react-select";

const styles = theme => ({
    select: {
        margin: 2
    }
});

class StoreSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: []
        };
    }

    fetchStores() {
        selectAction(
            "Store.getDepartmentStores",
            {}
        ).then(stores => {
            this.setState({
                stores: stores.map(store => ({
                    value: store.id,
                    label: store.name
                }))
            });
        });
    }

    componentDidMount() {
        this.fetchStores();
    }

    getObjects(values, labels, isMulti) {
        if (values == null) return null;
        if (isMulti)
            return values.map(value => labels.find(item => item.value === value))
        else
            return labels.find(item => item.value === values);
    }

    render() {
        const { classes, values, onChange, isMulti, isClearable } = this.props;

        return (
            <Select
                value={this.getObjects(values, this.state.stores, isMulti)}
                onChange={e => onChange(isMulti ? e.map(v => v.value) : e.value)}
                options={this.state.stores}
                isMulti={isMulti}
                isClearable={isClearable}
                className={classes.select}
                placeholder={isMulti ? "Выберите магазины..." : "Выберите магазин..."}
            />
        );
    }
}

export default withStyles(styles)(StoreSelector);
