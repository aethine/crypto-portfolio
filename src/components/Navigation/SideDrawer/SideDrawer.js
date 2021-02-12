import React from 'react';
import Backdrop from '../../UI/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './SideDrawer.module.css';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Closed];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <div>
            <Backdrop show={props.open} clicked={props.closeSideDrawer} />
           
            <div className={attachedClasses.join(" ")}>
                <nav onClick={props.closeSideDrawer}>
                    <NavigationItems />

                </nav>
            </div>
        </div>
    )
};

export default sideDrawer;