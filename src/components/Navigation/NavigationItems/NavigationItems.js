import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' active exact>
            Search
        </NavigationItem>
        <NavigationItem link='/trade'>Trade</NavigationItem>
        <NavigationItem link='/wallet'>Wallet</NavigationItem>
    </ul>
);

export default navigationItems;
