import React from "react";

import { withStyles } from "@material-ui/core/styles";

import { selectAction } from "../../lsfusion";

import Select from "react-select";

const styles = theme => ({
    select: {
        margin: 2
    }
});

const actions = [ { id : "supplier", labels : "поставщиков", label : "поставщика", action : "LegalEntity.getLegalEntitiesSupplier"}];

class LegalEntitySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            legalEntities: []
        };
    }

    fetchLegalEntities() {
        selectAction(
            actions.find(action => action.id === this.props.type).action,
            {}
        ).then(legalEntities => {
            this.setState({
                legalEntities: legalEntities.map(legalEntity => ({
                    value: legalEntity.id,
                    label: legalEntity.name
                }))
            });
        });
    }

    componentDidMount() {
        this.fetchLegalEntities();
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
                value={this.getObjects(values, this.state.legalEntities, isMulti)}
                onChange={e => onChange(isMulti ? e.map(v => v.value) : e.value)}
                options={this.state.legalEntities}
                isMulti={isMulti}
                isClearable={isClearable}
                className={classes.select}
                placeholder={"Выберите " + (isMulti ? actions.find(action => action.id === this.props.type).labels : actions.find(action => action.id === this.props.type).label) + "..."}
            />
        );
    }
}

export default withStyles(styles)(LegalEntitySelector);
