import React from "react";

import { withStyles } from "@material-ui/core/styles";

import {selectAction} from "../../lsfusion";

import DropdownTreeSelect from "react-dropdown-tree-select"
import "./treeselect.css";

const styles = {};

function getChildren (id, groups) {
    const result = [];
    groups.forEach(group => {
        if (group.parent === id) {
            var element = { label: group.name, id: group.id, expanded : id === undefined };
            var children = getChildren(group.id, groups);
            if (children.length > 0) element = {...element, children};
            result.push(element)
        }
    });
    return result;
}

function fetchItemGroups () {
    return selectAction("Stock.getSkuGroups", {}).then(groups => getChildren(undefined, groups));
}

class ItemGroupSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shouldComponentUpdate = (nextProps) => {
        return nextProps.lastUpdated !== this.props.lastUpdated;
    };

    onChangeItemGroups = (currentNode, selectedNodes) => {
        selectedNodes.map(node => console.log("path::", node.id));
        // this.state.itemGroups.filter(g => g.checked).map(g => console.log("selected", g.id));
        this.props.onChange(selectedNodes.map(node => node.id))
    };

    render() {
        const { data } = this.props;
        
        return (
            <div>
                <DropdownTreeSelect data={data} onChange={this.onChangeItemGroups} placeholderText="Выберите группы..." className="mdl-demo"/>
            </div>
        );
    }
}

const ItemGroupSelectorWrapper = withStyles(styles)(ItemGroupSelector);

export {ItemGroupSelectorWrapper as ItemGroupSelector, fetchItemGroups};
