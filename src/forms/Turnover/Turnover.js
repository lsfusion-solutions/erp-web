import React from "react";

import { withStyles } from "@material-ui/core/styles";

import { ItemGroupSelector, fetchItemGroups } from "../../components/itemGroups/ItemGroupSelector";
import LegalEntitySelector from "../../components/legalEntities/LegalEntitySelector";
import StoreSelector from "../../components/stores/StoreSelector";
import moment from "moment";
import DateSelector from "../../components/dates/DateSelector";
import {selectAction} from "../../lsfusion";
import TurnoverChart from "./TurnoverChart";

const styles = {};

class Turnover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),

            itemGroupList: [],
            itemGroupLastUpdated: moment(),

            group: "stores",
            groupLevel: 3,

            type: "total",

            stores : [],
            suppliers : [],
            itemGroups: [],

            loading : false,
            data : []
        }
    }

    componentDidMount() {
        fetchItemGroups().then(itemGroupList => this.setState( { itemGroupList, itemGroupLastUpdated : moment() } ));
        this.updateData();
    }

    static fetchData(group, groupLevel, type, stores, suppliers, itemGroups, startDate, endDate) {

        var action = null;

        var data = {
            stores: stores.map(value => ({ id: value })),
            suppliers: suppliers.map(value => ({ id: value })),
            itemGroups: itemGroups.map(value => ({ id: value })),
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
        };

        switch (group) {
            case "stores":
                action = "Stock.getTurnoverByStock";
                break;
            case "suppliers":
                action = "Stock.getTurnoverBySupplier";
                break;
            case "itemGroups":
                action = "Stock.getTurnoverByGroup";
                data.level = groupLevel;
                break;
            case "days":
                action = "Stock.getTurnoverByDate";
                break;
            case "weeks":
                action = "Stock.getTurnoverByWeek";
                break;
            default:
                return null;
        }

        if (type === "days" && group !== "days" && group !== "weeks") action += "Date";
        if (type === "weeks" && group !== "days" && group !== "weeks") action += "Week";

        return selectAction(action, data);
    }

    static trimNumeric(value, threshold) {
        return value > threshold ? undefined : value;
    }

    updateData () {
        const {group, type} = this.state;

        this.setState ({ loading : true });
        return Turnover.fetchData(
            group,
            this.state.groupLevel,
            type,
            this.state.stores,
            this.state.suppliers,
            this.state.itemGroups,
            this.state.startDate,
            this.state.endDate
        )
            .then(data => {
                const newData = data.map((row) => {
                    var newRow = {markupPercentSold : (row.markupSumSold / row.costSumSold) * 100, turnover : Turnover.trimNumeric(row.costSumBalanceA / row.costSumSold, 999)};
                    if (type !== "total" && group !==  "days" && group !== "weeks") {
                        newRow = {...newRow, ...{ d: row.d.map((rd) =>
                                    ({...rd,...{ markupPercentSold : (rd.markupSumSold / rd.costSumSold) * 100, turnover : Turnover.trimNumeric(rd.costSumBalanceA / rd.costSumSold, 999) }}))}}
                    }
                    return {...row, ...newRow}
                });
                this.setState({ loading : false, data : newData });}
            );
    };

    onGroupChange = (group) => {
        this.setState ( { group }, () => this.updateData());
    };
    onGroupLevelChange = (groupLevel) => {
        this.setState ( { groupLevel }, () => this.updateData());
    };

    onTypeChange = (type) => {
        this.setState ( { type }, () => this.updateData());
    };

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate }, () => this.updateData());
    };
    onStoreChange = (stores) => {
        this.setState ( { stores }, () => this.updateData());
    };
    onSupplierChange = (suppliers) => {
        this.setState ( { suppliers }, () => this.updateData());
    };
    onItemGroupChange = (itemGroups) => {
        this.setState ( { itemGroups }, () => this.updateData());
    };

    checkItemGroup (nodes, groups) {
        if (nodes === undefined) return;
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].checked = groups.includes(nodes[i].id);
            this.checkItemGroup(nodes[i].children, groups);
        }
    }

    onFilterChange = (property, value) => {
        this.setState (prevState => {
            var newState = { [property] : [...prevState[property], value]};
            if (prevState.group === "itemGroups") {
                newState.itemGroupList = prevState.itemGroupList;
                this.checkItemGroup(newState.itemGroupList, newState.itemGroups);
                newState.itemGroupLastUpdated = moment();
            }
            newState.group = prevState.group === "itemGroups" ? "suppliers" : "itemGroups";
            return newState;
        }, () => this.updateData())
    };

    render() {
        const {startDate, endDate, itemGroupList, itemGroupLastUpdated, suppliers, stores, group, groupLevel, type, loading, data} = this.state;

        return (<div>
            <StoreSelector
                values={stores}
                onChange={this.onStoreChange}
                isMulti={true}
                isClearable={true}
            />
            <LegalEntitySelector
                type = "supplier"
                values = {suppliers}
                onChange={this.onSupplierChange}
                isMulti={true}
                isClearable={true}
            />
            <ItemGroupSelector
                data = {itemGroupList}
                lastUpdated = {itemGroupLastUpdated}
                onChange = {this.onItemGroupChange}
            />
            <DateSelector
                startDate={startDate}
                startDateId="turnover_start_date"
                endDate={endDate}
                endDateId="turnover_end_date"
                onDatesChange={this.onDatesChange}
            />
            <TurnoverChart
                loading={loading}
                data={data}
                group={group}
                onGroupChange={this.onGroupChange}
                groupLevel={groupLevel}
                onGroupLevelChange={this.onGroupLevelChange}
                onFilterChange={this.onFilterChange}
                type={type}
                onTypeChange={this.onTypeChange}
            />
        </div>);
    }
}

export default withStyles(styles)(Turnover);


