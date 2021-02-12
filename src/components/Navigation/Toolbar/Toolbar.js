import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


import classes from './Toolbar.module.css';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <div className={classes.MainItems}>
            <DrawerToggle clicked={props.openSideDrawer} />
            <div className={classes.Logo}>
                <p style={{"margin-top": "10px"}}>Logo</p>
            </div>
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} />
        </nav>
        <FontAwesomeIcon icon={faUser} />
    </header>
);

export default toolbar;