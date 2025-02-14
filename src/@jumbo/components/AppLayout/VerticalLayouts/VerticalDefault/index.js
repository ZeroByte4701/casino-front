import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import CmtVerticalLayout from '../../../../../@coremat/CmtLayouts/Vertical';
import CmtHeader from '../../../../../@coremat/CmtLayouts/Vertical/Header';
import Header from '../../partials/Header';
import CmtSidebar from '../../../../../@coremat/CmtLayouts/Vertical/Sidebar';
import SidebarHeader from '../../partials/SidebarHeader';
import SideBar from '../../partials/SideBar';
import CmtContent from '../../../../../@coremat/CmtLayouts/Vertical/Content';
import Customizer from './Customizer';
import ContentLoader from '../../../ContentLoader';
import CmtFooter from '../../../../../@coremat/CmtLayouts/Vertical/Footer';
import Footer from '../../partials/Footer';
import defaultContext from '../../../contextProvider/AppContextProvider/defaultContext';
import UserAPI from '../../../../../services/api/users';

let layoutOptions = {
    headerType: defaultContext.headerType,
    footerType: 'fixed',
    sidebarType: defaultContext.sidebarType,
    isSidebarFixed: defaultContext.isSidebarFixed,
    isSidebarOpen: false,
    showTourOpt: true,
    showFooterOpt: true,
    miniSidebarWidth: 80,
    layoutStyle: defaultContext.layoutType,
    drawerBreakPoint: defaultContext.drawerBreakPoint,
    sidebarWidth: defaultContext.sidebarWidth,
};

const VerticalDefault = ({children}) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const [commonInfo, setCommonInfo] = useState();
    const [headerShow, setHeaderShow] = useState(true);
    const [sidebarShow, setSidebarShow] = useState(true);
    const [footerShow, setFooterShow] = useState(true);

    const getUserInfo = () => {
        let userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
        let memberSeq = userInfo && userInfo.seq ? userInfo.seq : '';
        UserAPI.getUserInfo({memberSeq});

        setCommonInfo(localStorage.getItem('commonInfo') ? JSON.parse(localStorage.getItem('commonInfo')) : null);
    };

    useEffect(() => {
        if (location.pathname.indexOf('/user') < 0 && location.pathname !== '/') {
            setHeaderShow(false);
            setSidebarShow(false);
            setFooterShow(false);

            layoutOptions.isSidebarFixed = false;
            layoutOptions.sidebarWidth = 0;
        }

        let userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        // if (userInfo) {
            getUserInfo(userInfo && userInfo.seq ? userInfo.seq : '');

            var intervalHandler = setInterval(() => {
                getUserInfo();
            }, 5000);
        // }

        // let intervalHandler = setInterval(() => {
        //     let token = localStorage.getItem('token');
        //     dispatch(AuthMethods[CurrentAuthMethod].getAuthUser(true, token));
        //     setCommonInfo(localStorage.getItem('commonInfo') ? JSON.parse(localStorage.getItem('commonInfo')) : null);
        // }, 3000);

        return () => {
            clearTimeout(intervalHandler);
        };
    }, [location.pathname, dispatch]);

    return (
        <CmtVerticalLayout
            className="verticalDefaultLayout"
            layoutOptions={layoutOptions}
            header={
                headerShow ?
                    <CmtHeader>
                        <Header commonInfo={commonInfo}/>
                    </CmtHeader>
                    : ''
            }
            sidebar={
                sidebarShow ?
                    <CmtSidebar>
                        <SidebarHeader/>
                        <SideBar commonInfo={commonInfo}/>
                    </CmtSidebar>
                    : ''
            }
            footer={
                footerShow ?
                    <CmtFooter>
                        <Footer/>
                    </CmtFooter>
                    : ''
            }>
            <CmtContent>
                {children}
                <Customizer/>
                <ContentLoader/>
            </CmtContent>
        </CmtVerticalLayout>
    );
};

export default VerticalDefault;
