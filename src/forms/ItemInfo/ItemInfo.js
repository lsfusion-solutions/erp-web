import React from "react";

import { withStyles } from "@material-ui/core/styles";

import DateSelector from "../../components/dates/DateSelector";
import StoreSelector from "../../components/stores/StoreSelector";
import moment from "moment";
import ItemSelector from "../../components/items/ItemSelector";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

import {selectAction, getUrlExec} from "../../lsfusion";

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const styles = {
    tabbedPane : {

    },
    tabs : {
        "min-height" : "32px"
    },
    tab : {
        "min-height" : "32px"
    },
    tablePaper : {
        width : "100%"
    },
    table : {
        width : "100%"
    },
    tableRow : {
        "height" : "24px"
    },
    detailCell : {
        padding: 2,
        "&:last-child": {
            paddingRight: 2
        }
    }
};

class ItemInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stores : [],

            startDate : moment().subtract(7, "days"),
            endDate : moment().subtract(1, "days"),

            barcode : "",
            name : "",

            item : null,

            mainTab : 0,
            dataTab : 0,

            balance : [ ],
            ledger : [ ],
            prices : [ ],
            markups : [ ],
            history : [ ]
        }
    }

    fetchItemInfo () {
        if (this.state.item != null) {
            if (this.state.dataTab === 0)
                selectAction("Item.getSkuSalesBalance",
                    {
                        stores: this.state.stores.map(store => ({id: store})),
                        startDate: this.state.startDate.format("YYYY-MM-DD"),
                        endDate: this.state.endDate.format("YYYY-MM-DD"),
                        item: this.state.item.id
                    }).then(balance => this.setState({ balance }));
            if (this.state.dataTab === 1)
                selectAction("Item.getSkuLedger",
                {
                    stores: this.state.stores.map(store => ({id: store})),
                    startDate: this.state.startDate.format("YYYY-MM-DD"),
                    endDate: this.state.endDate.format("YYYY-MM-DD"),
                    item: this.state.item.id
                }).then(ledger => this.setState({ ledger }));
            if (this.state.dataTab === 2)
                selectAction("Item.getPriceListDetail",
                    {
                        stores: this.state.stores.map(store => ({id: store})),
                        startDate: this.state.startDate.format("YYYY-MM-DD"),
                        endDate: this.state.endDate.format("YYYY-MM-DD"),
                        item: this.state.item.id
                    }).then(prices => this.setState({ prices }));
            if (this.state.dataTab === 3)
                selectAction("Item.getSkuMarkups",
                    {
                        item: this.state.item.id
                    }).then(markups => this.setState({ markups }));
            if (this.state.dataTab === 4)
                selectAction("Item.getSkuDateSalesBalance",
                    {
                        stores: this.state.stores.map(store => ({id: store})),
                        startDate: this.state.startDate.format("YYYY-MM-DD"),
                        endDate: this.state.endDate.format("YYYY-MM-DD"),
                        item: this.state.item.id
                    }).then(history => this.setState({ history }));
        }
    }

    onItemChange = (item) => {
        this.setState( {item}, () => this.fetchItemInfo())
    };

    onStoreChange = (stores) => {
        this.setState ( { stores }, () => this.fetchItemInfo());
    };

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate, endDate }, () => this.fetchItemInfo());
    };

    onChangeTab = (dataTab) => {
        this.setState({ dataTab }, () => this.fetchItemInfo())
    };

    render() {
        const {classes} = this.props;
        const {barcode, name, item, mainTab, dataTab} = this.state;

        return (<div>
            <AppBar position="static" color = "default">
                <Tabs value={mainTab}
                      onChange={(event, mainTab) => this.setState({ mainTab })}
                      indicatorColor="primary"
                      textColor="primary"
                      className={classes.tabs}
                >
                    <Tab label="Параметры" className={classes.tab}/>
                    <Tab label="Данные" className={classes.tab}/>
                </Tabs>
            </AppBar>
            {mainTab === 0 &&
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
            </div>
            }
            {mainTab === 1 &&
            <div>
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
                <div className={classes.tabbedPane}>
                    <AppBar position="static">
                        <Tabs value={dataTab}
                              onChange={(event, dataTab) => this.onChangeTab(dataTab)}
                              variant="scrollable"
                              scrollButtons="auto"
                              className={classes.tabs}>
                            <Tab label="Остатки" className={classes.tab}/>
                            <Tab label="Движение" className={classes.tab}/>
                            <Tab label="Цены" className={classes.tab}/>
                            <Tab label="Надбавки" className={classes.tab}/>
                            <Tab label="Динамика" className={classes.tab}/>
                            <Tab label="Изображение" className={classes.tab}/>
                        </Tabs>
                    </AppBar>
                    {dataTab === 0 &&
                    <div className={classes.tablePaper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow className={classes.tableRow}>
                                    <TableCell className={classes.detailCell}>Магазин</TableCell>
                                    <TableCell className={classes.detailCell} align="right">Остаток</TableCell>
                                    <TableCell className={classes.detailCell} align="right">Продано</TableCell>
                                    <TableCell className={classes.detailCell} align="right">Заказано</TableCell>
                                    <TableCell className={classes.detailCell} align="right">Цена</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.balance.map(row => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell className={classes.detailCell} component="th" scope="row">{row.name}</TableCell>
                                        <TableCell className={classes.detailCell} align="right">{row.quantity}</TableCell>
                                        <TableCell className={classes.detailCell} align="right">{row.sold}</TableCell>
                                        <TableCell className={classes.detailCell} align="right">{row.ordered}</TableCell>
                                        <TableCell className={classes.detailCell} align="right">{row.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    }
                    {dataTab === 1 &&
                    <div className={classes.tablePaper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow className={classes.tableRow}>
                                    <TableCell className={classes.detailCell}>Магазин</TableCell>
                                    <TableCell className={classes.detailCell}>Дата</TableCell>
                                    <TableCell className={classes.detailCell} align="right">Кол-во</TableCell>
                                    <TableCell className={classes.detailCell}>Описание</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.ledger.map(row => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell className={classes.detailCell} component="th" scope="row">{row.nameStock}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.date}</TableCell>
                                        <TableCell className={classes.detailCell} align="right">{row.quantity}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    }
                    {dataTab === 2 &&
                    <div className={classes.tablePaper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow className={classes.tableRow}>
                                    <TableCell className={classes.detailCell}>С</TableCell>
                                    <TableCell className={classes.detailCell}>По</TableCell>
                                    <TableCell className={classes.detailCell}>Организация</TableCell>
                                    <TableCell className={classes.detailCell}>Склады</TableCell>
                                    <TableCell className={classes.detailCell}>Цены</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.prices.map(row => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell className={classes.detailCell}>{row.fromDate}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.toDate}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.nameCompany}</TableCell>
                                        <TableCell className={classes.detailCell}>{(row.stockGroups !== undefined ? row.stockGroups : "") + (row.stockGroups !== undefined && row.stocks !== undefined ? "," : "") + (row.stocks !== undefined ? row.stocks : "")}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.prices}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    }
                    {dataTab === 3 &&
                    <div className={classes.tablePaper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow className={classes.tableRow}>
                                    <TableCell className={classes.detailCell}>Наименование</TableCell>
                                    <TableCell className={classes.detailCell}>Надбавка, %</TableCell>
                                    <TableCell className={classes.detailCell}>Тип</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.markups.map(row => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell className={classes.detailCell}>{row.name}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.markup}</TableCell>
                                        <TableCell className={classes.detailCell}>{row.level}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    }
                    {dataTab === 4 &&
                    <div>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={this.state.history} syncId="history">
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="date"/>
                                <YAxis width={25}/>
                                <Tooltip/>
                                <Legend/>
                                <Line key="sold" dataKey="sold" name="Продажа" stroke="#8884d8" dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={this.state.history} syncId="history">
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="date"/>
                            <YAxis width={25}/>
                            <Tooltip/>
                            <Legend/>
                            <Line key="balance" dataKey="balance" name="Остаток" stroke="#82ca9d" dot={false}/>
                            </LineChart>
                            </ResponsiveContainer>
                        }
                    </div>}
                    {dataTab === 5 && item != null &&
                    <img width="100%" height="100%" src={getUrlExec() + "?action=Stock.getSkuImage&p=" + item.id} alt=""/>
                    }
                </div>
            </div>
            }
        </div>);
    }
}

export default withStyles(styles)(ItemInfo);