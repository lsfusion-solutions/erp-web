import React from "react";

import DateSelector from "../../components/dates/DateSelector";
import SalesStoreChart from "./SalesStoreChart";
import StoreSelector from "../../components/stores/StoreSelector";

import moment from "moment";

import { selectAction } from "../../lsfusion";

class SalesStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),

            type: "stores",

            stores: [],

            data: []
        };
    }

    componentDidMount() {
        this.updateSales();
    }

    static isPeriodDay(startDate, endDate) {
        return (
            startDate != null &&
            endDate != null &&
            endDate.startOf("day").diff(startDate.startOf("day")) === 0
        );
    }

    static fetchSales(startDate, endDate, type, stores) {

        var action = null;

        switch (type) {
            case "stores":
                action = "ZReport.getSalesStores";
                break;
            case "days":
                action = "ZReport.getSalesDays";
                break;
            case "daysStores":
                action = "ZReport.getSalesDaysStores";
                break;
            default:
                return null;
        }

        return selectAction(action, {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            stores: stores.map(value => ({ id: value }))
        });
    }
    updateSales() {
        if (this.state.startDate != null && this.state.endDate != null)
            return SalesStore.fetchSales(
                this.state.startDate,
                this.state.endDate,
                this.state.type,
                this.state.stores
            )
                .then(data => {
                    this.setState({ data });
                });
    }

    onDatesChange = ({ startDate, endDate }) => {
        var newState = { startDate, endDate };
        if (SalesStore.isPeriodDay(startDate, endDate)) newState.type = "stores";
        this.setState(newState, () => this.updateSales());
    };

    onTypeChange = type => {
        // this.setState({ type });
        this.setState({ type }, () => this.updateSales());
    };

    onStoreChange = stores => {
        this.setState({ stores }, () => this.updateSales());
    };

    render() {
        const { startDate, endDate } = this.state;
        return (
            <div>
                <StoreSelector
                    values={this.state.stores}
                    onChange={this.onStoreChange}
                    isMulti={true}
                    isClearable={true}
                />
                <DateSelector
                    startDate={this.state.startDate}
                    startDateId="your_unique_start_date_id"
                    endDate={this.state.endDate}
                    endDateId="your_unique_end_date_id"
                    onDatesChange={this.onDatesChange}
                />

                {startDate != null && endDate != null && (
                    <SalesStoreChart
                        data={this.state.data}
                        type={this.state.type}
                        singleType={SalesStore.isPeriodDay(startDate, endDate) ? "stores" : null}
                        onTypeChange={this.onTypeChange}
                    />
                )}
            </div>
        );
    }
}

export default SalesStore;
