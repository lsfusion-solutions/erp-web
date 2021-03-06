import React from "react";

import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import SalesStore from "./forms/SalesStore/SalesStore";
import ItemInfo from "./forms/ItemInfo/ItemInfo";
import ItemSize from "./forms/ItemSize/ItemSize";
import AddDocument from "./forms/AddDocument/AddDocument";
import Turnover from "./forms/Turnover/Turnover";
import {selectAction} from "./lsfusion";

const forms = [
    { id: "zReport", caption: "Продажи", icon: "shopping_cart", component : SalesStore },
    { id: "turnover", caption: "Оборачиваемость", icon: "trending_up", component: Turnover },
    { id: "itemInfo", caption: "Информация по товару", icon: "ballot", component : ItemInfo },
    { id: "itemSize", caption: "Габариты товара", icon: "dashboard", component : ItemSize },
    { id: "terminal", caption: "Ввод документа", icon: "add", component : AddDocument }
];

const styles = {
    appBar : {
    },
    toolbar : {
        "min-height": "24px"
    },
    button : {
        padding : 8
    }
};
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories : [],
            form: null,

            opened: false
        };
    }

    readCategories () {
        selectAction("API.getCategories",{})
            .then(c => {
                var categories = c.map(category => ({...category, ...{id: category.id.replace("API_Category.", "")}}));
                this.setState(
                    {
                        categories,
                        form: forms.find(f => categories.find(c => c.id === f.id) !== undefined)
                    })
            });

    }

    componentDidMount() {
        this.readCategories();
    }

    openMenu = () => {
        this.setState({ opened: true });
    };
    closeMenu = () => {
        this.setState({ opened: false });
    };

    openForm = form => {
        this.setState({ form, opened: false });
    };

    render() {
        const { classes } = this.props;
        const { categories, form } = this.state;

        const Form = form == null ? null : form.component;

        return (
            <div>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="Menu"
                            onClick={this.openMenu}
                            className={classes.button}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            {form != null ? form.caption : ""}
                        </Typography>
                    </Toolbar>
                    <SwipeableDrawer
                        open={this.state.opened}
                        onClose={this.closeMenu}
                        onOpen={this.openMenu}
                    >
                        <List>
                            <link
                                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                                rel="stylesheet"
                            />
                            {forms.filter(form => categories.find(c => c.id === form.id) !== undefined).map(form => (
                                <ListItem
                                    button
                                    key={form.component}
                                    onClick={e => this.openForm(form)}
                                >
                                    <i className="material-icons">{form.icon}</i>
                                    <ListItemText>{form.caption}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    </SwipeableDrawer>
                </AppBar>
                {form != null && <Form/>}
            </div>
        );
    }
}

export default withStyles(styles)(App);
