import React from "react";

import { withStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";

import "./turnoverchart.css";

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
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {CircularProgress} from "@material-ui/core";


const styles = theme => ({
    radioGroup: {},
    formControl : {
        margin : 2
    },
    formControlLabel: {
        "margin-left": 0,
        "margin-right": 0
    },
    radio: {
        padding: 2
    }
});

class TurnoverChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rowCount : 10,
            expression: "sumSold",
            sort: -1
        };
    }

    formatNumber = value => {
        return value != null ? value.toLocaleString("ru-RU") : "0";
    };

    onClick = (e) => {
        const { group, onFilterChange } = this.props;
        switch (group) {
            case "stores" :
                onFilterChange("stores", e.stock);
                break;
            case "suppliers" :
                onFilterChange("suppliers", e.supplier);
                break;
            case "itemGroups" :
                onFilterChange("itemGroups", e.group);
                break;
        }
    };

    renderGroupTotal(data) {
        const {rowCount, expression, sort} = this.state;
        const newData = [...data].filter(a => a[expression] > 0).sort((a, b) => ((a[expression] || 0) - (b[expression] || 0)) * sort ).slice(0, rowCount);

        return (
            <ResponsiveContainer width="100%" height={70 + 50 * Math.min(data.length, rowCount)}>
                <BarChart data={newData} layout="vertical">
                    <XAxis type="number" tickFormatter={this.formatNumber} />
                    <YAxis tick={{width:165}} width={100} type="category" dataKey="name" />
                    {/*<Tooltip formatter={this.formatNumber} />*/}
                    <Bar dataKey={expression} name="Значение" fill="#8884d8" onClick={this.onClick}>
                        <LabelList dataKey={expression} formatter={this.formatNumber} />
                    </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    renderGroupDays(data) {
        const {rowCount, expression, sort} = this.state;
        const newData = [...data].filter(a => a[expression] > 0).sort((a, b) => ((a[expression] || 0) - (b[expression] || 0)) * sort ).slice(0, rowCount);

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
                    {newData.map(s => (
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
                    <Line key={expression} dataKey={expression} name="Значение" stroke="#8884d8" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    render() {
        const { classes, loading, data, group, onGroupChange, groupLevel, onGroupLevelChange, type, onTypeChange } = this.props;
        const { rowCount, expression, sort } = this.state;

        return (
            <div>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="group">Группировать</InputLabel>
                        <Select
                            value={group}
                            onChange={e => {
                                onGroupChange(e.target.value);
                            }}
                            inputProps={{
                                name: 'group',
                                id: 'group',
                            }}
                        >
                            <MenuItem value="stores">По магазинам</MenuItem>
                            <MenuItem value="suppliers">По поставщикам</MenuItem>
                            <MenuItem value="itemGroups">По группам</MenuItem>
                            <MenuItem value="days">По дням</MenuItem>
                            <MenuItem value="weeks">По неделям</MenuItem>
                        </Select>
                    </FormControl>
                    {group === "itemGroups" && <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="groupLevel">Уровень</InputLabel>
                        <Select
                            value={groupLevel}
                            onChange={e => {
                                onGroupLevelChange(e.target.value);
                            }}
                            inputProps={{
                                name: 'groupLevel',
                                id: 'groupLevel',
                            }}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                    </FormControl>}
                    {group !== "days" && group !== "weeks" && <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="type">Тип</InputLabel>
                        <Select
                            value={type}
                            onChange={e => {
                                onTypeChange(e.target.value);
                            }}
                            inputProps={{
                                name: 'type',
                                id: 'type',
                            }}
                        >
                            <MenuItem value="total">Итоги</MenuItem>
                            <MenuItem value="days">По дням</MenuItem>
                            <MenuItem value="weeks">По неделям</MenuItem>
                        </Select>
                    </FormControl>}
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="rowCount">Стр.</InputLabel>
                        <Select
                            value={rowCount}
                            onChange={e => {
                                this.setState({ rowCount: e.target.value });
                            }}
                            inputProps={{
                                name: 'rowCount',
                                id: 'rowCount',
                            }}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="expression">Значение</InputLabel>
                        <Select
                            value={expression}
                            onChange={e => {
                                this.setState({ expression: e.target.value });
                            }}
                            inputProps={{
                                name: 'expression',
                                id: 'expression',
                            }}
                        >
                            <MenuItem value="sumSold">Выручка</MenuItem>
                            <MenuItem value="markupSumSold">Надбавка</MenuItem>
                            <MenuItem value="markupPercentSold">Надбавка, %</MenuItem>
                            <MenuItem value="costSumSold">Себестоимость</MenuItem>
                            <MenuItem value="turnover">Оборачиваемость</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="sort">Сортировать</InputLabel>
                        <Select
                            value={sort}
                            onChange={e => {
                                this.setState({ sort: e.target.value });
                            }}
                            inputProps={{
                                name: 'sort',
                                id: 'sort',
                            }}
                        >
                            <MenuItem value={1}>По возрастанию</MenuItem>
                            <MenuItem value={-1}>По убыванию</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                
                {loading && <CircularProgress/>}
                {!loading && data.length > 0 && group !== "days" && group !=="weeks" && type === "total" && this.renderGroupTotal(data)}
                {!loading && data.length > 0 && group !== "days" && group !=="weeks" && (type === "days" || type === "weeks") && this.renderGroupDays(data)}
                {!loading && data.length > 0 && (group === "days" || group === "weeks") && this.renderDays(data)}
            </div>
        );
    }

}

export default withStyles(styles)(TurnoverChart);
