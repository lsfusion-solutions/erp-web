import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import "./salesstorechart.css";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer
} from "recharts";

const styles = theme => ({
    radioGroup: {},
    formControlLabel: {
        "margin-left": 0,
        "margin-right": 0
    },
    radio: {
        padding: 2
    }
});

class SalesStoreChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: "sum"
        };
    }

    formatNumber = value => {
        return value != null ? value.toLocaleString("ru-RU") : "0";
    };

    renderStores(data) {
        const { expression } = this.state;
        return (
            <ResponsiveContainer width="100%" height={70 + 30 * data.length}>
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" tickFormatter={this.formatNumber} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={this.formatNumber} />
                    <Legend />
                    {expression === "sum" && (
                        <Bar dataKey="sum" name="Выручка" stackId="a" fill="#8884d8">
                            <LabelList dataKey="sum" formatter={this.formatNumber} />
                        </Bar>
                    )}
                    {expression === "sum" && (
                        <Bar
                            dataKey="discountSum"
                            name="Скидка"
                            stackId="a"
                            fill="#82ca9d"
                        />
                    )}
                    {expression === "receipt" && (
                        <Bar dataKey="receipt" name="Покупатели" fill="#8884d8">
                            <LabelList dataKey="receipt" formatter={this.formatNumber} />
                        </Bar>
                    )}
                    {expression === "averageReceipt" && (
                        <Bar
                            dataKey="averageReceipt"
                            name="Средняя сумма чека"
                            fill="#8884d8"
                        >
                            <LabelList
                                dataKey="averageReceipt"
                                formatter={this.formatNumber}
                            />
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
        );
    }
    renderDays(data) {
        const { expression } = this.state;
        return (
            <ResponsiveContainer width="100%" height={450}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={this.formatNumber} />
                    <Tooltip formatter={this.formatNumber} />
                    <Legend />
                    {expression === "sum" && (
                        <Line key="sum" dataKey="sum" name="Выручка" stroke="#8884d8" dot={false} />
                    )}
                    {expression === "sum" && (
                        <Line
                            key="discountSum"
                            dataKey="discountSum"
                            name="Скидка"
                            stroke="#82ca9d"
                            dot={false}
                        />
                    )}
                    {expression === "receipt" && (
                        <Line
                            key="receipt"
                            dataKey="receipt"
                            name="Покупатели"
                            stroke="#8884d8"
                            dot={false}
                        />
                    )}
                    {expression === "averageReceipt" && (
                        <Line
                            key="averageReceipt"
                            dataKey="averageReceipt"
                            name="Средняя сумма чека"
                            stroke="#8884d8"
                            dot={false}
                        />
                    )}
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    }
    renderDaysStores(data) {
        const { expression } = this.state;
        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        type="category"
                        allowDuplicatedCategory={false}
                    />
                    <YAxis dataKey={expression} tickFormatter={this.formatNumber} />
                    <Tooltip formatter={this.formatNumber} />
                    <Legend />
                    {data.map(s => (
                        <Line
                            key={s.name}
                            dataKey={expression}
                            data={s.d}
                            name={s.name}
                            stroke={"#" + (((1 << 24) * Math.random()) | 0).toString(16)}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    render() {
        const { classes, data, type, singleType, onTypeChange } = this.props;
        const { expression } = this.state;

        return (
            <div>
                <div>
                    <FormControl component="fieldset">
                        <RadioGroup
                            className={classes.radioGroup}
                            aria-label="Period"
                            name="period"
                            value={type}
                            onChange={e => {
                                onTypeChange(e.target.value);
                            }}
                            row
                        >
                            <FormControlLabel
                                value="stores"
                                control={<Radio className={classes.radio} />}
                                label="Итоги"
                                disabled={singleType != null && singleType !== "stores"}
                                className={classes.formControlLabel}
                            />
                            <FormControlLabel
                                value="days"
                                control={<Radio className={classes.radio} />}
                                label="График"
                                disabled={singleType != null && singleType !== "days"}
                                className={classes.formControlLabel}
                            />
                            <FormControlLabel
                                value="daysStores"
                                control={<Radio className={classes.radio} />}
                                label="Подробно"
                                disabled={singleType != null && singleType !== "daysStores"}
                                className={classes.formControlLabel}
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <FormControl component="fieldset">
                        <RadioGroup
                            className={classes.radioGroup}
                            aria-label="Expression"
                            name="expression"
                            value={expression}
                            onChange={e => {
                                this.setState({ expression: e.target.value });
                            }}
                            row
                        >
                            <FormControlLabel
                                value="sum"
                                control={<Radio className={classes.radio} />}
                                label="Суммы"
                                className={classes.formControlLabel}
                            />
                            <FormControlLabel
                                value="receipt"
                                control={<Radio className={classes.radio} />}
                                label="Чеки"
                                className={classes.formControlLabel}
                            />
                            <FormControlLabel
                                value="averageReceipt"
                                control={<Radio className={classes.radio} />}
                                label="Средний чек"
                                className={classes.formControlLabel}
                            />
                        </RadioGroup>
                    </FormControl>
                </div>

                {type === "stores" && this.renderStores(data)}
                {type === "days" && this.renderDays(data)}
                {type === "daysStores" && this.renderDaysStores(data)}
            </div>
        );
    }
}

export default withStyles(styles)(SalesStoreChart);
