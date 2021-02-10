import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './Toolbar.module.css';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        {/* <DrawerToggle clicked={props.openSideDrawer} />
        <div className={[classes.Logo, classes.DesktopOnly].join(' ')}>
            <Logo />
        </div> */}
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth} />
        </nav>
    </header>
);

export default toolbar;