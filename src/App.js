import './App.css';
import TabHolder from './components/TabHolders/TabHolder/TabHolder';
import SubTabHolder from './components/TabHolders/SubTabHolder/SubTabHolder';
import StorekeeperAdvent from './pages/StorekeeperAdvent/StorekeeperAdvent';
import StorekeeperAllocation from './pages/StorekeeperAllocation/StorekeeperAllocation';
import StorekeeperExpend from './pages/StorekeeperExpend/StorekeeperExpend';
import AvatarHolder from './components/AvatarHolder/AvatarHolder';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import StorekeeperInventory from './pages/StorekeeperInventory/StorekeeperInventory';
import ManagerProducts from './pages/ManagerProducts/ManagerProducts';
import Authorization from './pages/Authorization/Authorization';
import AdministratorAccounts from './pages/AdministratorAccounts/AdministratorAccounts';
import AdministratorRackCreating from './pages/AdministratorRackCreating/AdministratorRackCreating';
import AdministratorGoodCreating from './pages/AdministratorGoodCreating/AdministratorGoodCreating';
import AdministratorZoneCreating from './pages/AdministratorZoneCreating/AdministratorZoneCreating';
import AdministratorWarehouseCreating from './pages/AdministratorWarehouseCreating/AdministratorWarehouseCreating';
import ManagerOrderCreation from './pages/ManagerOrderCreation/ManagerOrderCreation';
import ManagerSellOrders from './pages/ManagerSellOrders/ManagerSellOrders';
import ManagerShipmentOrders from './pages/ManagerShipmentOrders/ManagerShipmentOrders';
import ManagerBills from './pages/ManagerBills/ManagerBills';
import LogisticianOrders from './pages/LogisticianOrders/LogisticianOrders';
import LogisticianProducts from './pages/LogisticianProducts/LogisticianProducts';
import LogisticianBills from './pages/LogisticianBills/LogisticianBills';
import AccountantProducts from './pages/AccountantProducts/AccountantProducts';
import AccountantInvoice from './pages/AccountantInvoice/AccountantInvoice';
import PaybackOfGoods from './pages/AccountantReports/PaybackOfGoods/PaybackOfGoods';
import ProductTurnover from './pages/AccountantReports/ProductTurnover/ProductTurnover';
import PurchasedProducts from './pages/AccountantReports/PurchasedProducts/PurchasedProducts';
import SelledProducts from './pages/AccountantReports/SelledProducts/SelledProducts';
import AccountantAccounts from './pages/AccountantAccounts/AccountantAccounts';
import StorekeeperVirtualWarehouse from './pages/StorekeeperVirtualWarehouse/StorekeeperVirtualWarehouse';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import WarehouseISicon from './images/WarehouseISicon.png';
import React from 'react';
import {Routes, Route, useLocation, useNavigate} from "react-router-dom"
import {useCookies} from 'react-cookie'
import { Api } from "./api/storekeeperApi"

var api = new Api()

const mainTabsArray = [
  {title: "?????? ????????????????????",     href:"/Storekeeper",    basicHref:"/StorekeeperAdvent/Current"},
  {title: "?????? ??????????????????",      href:"/Manager",        basicHref:"/ManagerProducts"},
  {title: "?????? ??????????????",        href:"/Logistician",    basicHref:"/LogisticianOrders/Current"},
  {title: "?????? ????????????????????",     href:"/Accountant",     basicHref:"/AccountantProducts"},
  {title: "?????? ????????????????????????????", href:"/Administrator",  basicHref:"/AdministratorAccounts"},
]

const subTabsArray = [
  [
    {title: "????????????",                     roleHref:"/Storekeeper",    href:"/StorekeeperAdvent", basicHref:"/Current"},
    {title: "????????????",                     roleHref:"/Storekeeper",    href:"/StorekeeperExpend", basicHref:"/Current"},
    {title: "?????????????????????? ??????????????",        roleHref:"/Storekeeper",    href:"/StorekeeperAllocation", basicHref:""},
    {title: "????????????????????????????",             roleHref:"/Storekeeper",    href:"/StorekeeperInventory", basicHref:""},
    {title: "?????????????????????? ??????????",          roleHref:"/Storekeeper",    href:"/StorekeeperVirtualWarehouse", basicHref:""},
  ],[
    {title: "????????????",                     roleHref:"/Manager",        href:"/ManagerProducts", basicHref:""},
    {title: "???????????????? ????????????",            roleHref:"/Manager",        href:"/ManagerOrderCreation", basicHref:""},
    {title: "???????????? ???? ??????????????",          roleHref:"/Manager",        href:"/ManagerSellOrders", basicHref:"/Current"},
    {title: "???????????? ???? ????????????????",         roleHref:"/Manager",        href:"/ManagerShipmentOrders", basicHref:"/Current"},
    {title: "??????????",                      roleHref:"/Manager",        href:"/ManagerBills", basicHref:"/NewAccounts"},
  ],[
    {title: "????????????",                     roleHref:"/Logistician",    href:"/LogisticianOrders", basicHref:"/Current"},
    {title: "????????????",                     roleHref:"/Logistician",    href:"/LogisticianProducts", basicHref:""},
    {title: "??????????",                      roleHref:"/Logistician",    href:"/LogisticianBills", basicHref:"/NewAccounts"},
  ],[
    {title: "????????????",                     roleHref:"/Accountant",     href:"/AccountantProducts", basicHref:""},
    {title: "??????????????????",                  roleHref:"/Accountant",     href:"/AccountantInvoice", basicHref:"/Current"},
    {title: "????????????",                     roleHref:"/Accountant",     href:"/AccountantReports", basicHref:"/SelledProducts"},
    {title: "??????????",                      roleHref:"/Accountant",     href:"/AccountantAccounts", basicHref:"/NewAccounts"},
  ],[
    {title: "????????????????",                   roleHref:"/Administrator",  href:"/AdministratorAccounts", basicHref:""},
    {title: "???????????????? ?????????????????? ????????????",  roleHref:"/Administrator",  href:"/AdministratorCreating", basicHref:"/RackCreating"},
  ]
]

const supportTabsArray = [
    {title: "??????????????",              roleHref:"/Storekeeper",    subHref:"/StorekeeperAdvent",     supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Storekeeper",    subHref:"/StorekeeperAdvent",     supportHref:"/Completed"},
    {title: "??????????????",              roleHref:"/Storekeeper",    subHref:"/StorekeeperExpend",     supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Storekeeper",    subHref:"/StorekeeperExpend",     supportHref:"/Completed"},
    {title: "??????????????",              roleHref:"/Manager",        subHref:"/ManagerSellOrders",     supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Manager",        subHref:"/ManagerSellOrders",     supportHref:"/Completed"},
    {title: "??????????????",              roleHref:"/Manager",        subHref:"/ManagerShipmentOrders", supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Manager",        subHref:"/ManagerShipmentOrders", supportHref:"/Completed"},
    {title: "?????????? ??????????",          roleHref:"/Manager",        subHref:"/ManagerBills",          supportHref:"/NewAccounts"},
    {title: "???????????????? ??????????",       roleHref:"/Manager",        subHref:"/ManagerBills",          supportHref:"/ClosedAccounts"},
    {title: "??????????????",              roleHref:"/Logistician",    subHref:"/LogisticianOrders",     supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Logistician",    subHref:"/LogisticianOrders",     supportHref:"/Completed"},
    {title: "?????????? ??????????",          roleHref:"/Logistician",    subHref:"/LogisticianBills",      supportHref:"/NewAccounts"},
    {title: "???????????????? ??????????",       roleHref:"/Logistician",    subHref:"/LogisticianBills",      supportHref:"/ClosedAccounts"},
    {title: "??????????????",              roleHref:"/Accountant",     subHref:"/AccountantInvoice",     supportHref:"/Current"},
    {title: "??????????????????????",          roleHref:"/Accountant",     subHref:"/AccountantInvoice",     supportHref:"/Completed"},
    {title: "?????????????????? ????????????",     roleHref:"/Accountant",     subHref:"/AccountantReports",     supportHref:"/SelledProducts"},
    {title: "?????????????????? ????????????",     roleHref:"/Accountant",     subHref:"/AccountantReports",     supportHref:"/PurchasedProducts"},
    {title: "???????????? ????????????",        roleHref:"/Accountant",     subHref:"/AccountantReports",     supportHref:"/ProductTurnover"},
    {title: "?????????????????????? ??????????????",  roleHref:"/Accountant",     subHref:"/AccountantReports",     supportHref:"/PaybackOfGoods"},
    {title: "?????????? ??????????",          roleHref:"/Accountant",     subHref:"/AccountantAccounts",    supportHref:"/NewAccounts"},
    {title: "???????????????? ??????????",       roleHref:"/Accountant",     subHref:"/AccountantAccounts",    supportHref:"/ClosedAccounts"},
    {title: "???????????????? ????????",        roleHref:"/Administrator",  subHref:"/AdministratorCreating", supportHref:"/ZoneCreating"},
    {title: "???????????????? ????????????????",    roleHref:"/Administrator",  subHref:"/AdministratorCreating", supportHref:"/RackCreating"},
    {title: "???????????????? ????????????",      roleHref:"/Administrator",  subHref:"/AdministratorCreating", supportHref:"/GoodCreating"},
    {title: "?????????????????? ???????????????????????? ????????????", roleHref:"/Administrator",  subHref:"/AdministratorCreating", supportHref:"/WarehouseCreating"},
]

//JSON.parse(JSON.stringify(this.state.itemList))

export default function App() {
  let warehouseTypes = undefined
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'accountData'])

  var [mainTabs, setMainTab] = React.useState([])
  var [subTabs, setSubTabs] = React.useState(subTabsArray)

  React.useEffect(() => {
    if (cookies.accountData!==undefined){
      var mainTabsBuff = []
      var subTabsBuff = []
      var admin = false
      console.log(cookies.accountData)
      JSON.parse(JSON.stringify(cookies.accountData.roles))[0].split(" ").map(role=>{
        if (role!=""){
          if (role==="??????????????????????????"){admin=true}
          if (role==="??????????????????"){
            mainTabsBuff.push(mainTabsArray[0])
            subTabsBuff.push(subTabsArray[0])
          }
          if (role==="????????????????"){
            mainTabsBuff.push(mainTabsArray[1])
            subTabsBuff.push(subTabsArray[1])
          }
          if (role==="????????????"){
            mainTabsBuff.push(mainTabsArray[2])
            subTabsBuff.push(subTabsArray[2])
          }
        }
      })
      if (admin){
        mainTabsBuff = mainTabsArray
        subTabsBuff = subTabsArray
      }
      setMainTab(mainTabsBuff)
      setSubTabs(subTabsBuff)
      checkAccess()
    }
  }, [cookies.accountData]);

  function isRolePage(){
    var check = false
    mainTabsArray.map(tab=>{
      if (tab.href.split("/")[1]===location.pathname.split("/")[1]) check = true
    })
    return check
  }

  function checkAccess(){
      var check=false
      subTabs.map(tab=>{
        if (location.pathname.split("/")[1] === tab[0].roleHref.split("/")[1]) check=true
      })
      if (!isRolePage()) check = true
      if (!check) navigate(subTabs[0][0].roleHref + subTabs[0][0].href + subTabs[0][0].basicHref)
      return check
  }

  function wrapErrorBoundary(component){
    return (
      <ErrorBoundary>
        {component}
      </ErrorBoundary>
    )
  }
  
  //setCookie('access_token', undefined, { path: '/Storekeeper/StorekeeperAdvent',  expires})

  console.log("cookies.get('Authorization'): " + cookies.access_token)
  
  if (cookies.access_token !== undefined){
    return (
      <div id="page">
        <div style={{listStyle: "none", width: "100%", height: "51px", backgroundColor: "white", fontSize: "1.25rem"}}>
          <div className="homePage" onClick={()=>{navigate("/Home")}}>
            <div className="selectedBlock" style={{width:"100%", height:"50px"}}/>
            <img src={WarehouseISicon} style={{width: "50px", height: "50px", marginLeft: "9px", marginTop:"-50px", display: "block"}}/>
          </div>
          <div style={{width: "calc(100% - 121px)", display: "inline-block"}}>
            <TabHolder tabs={mainTabs}/>
          </div>
            <AvatarHolder cookies={cookies} setCookie={setCookie}/>
        </div>
        {isRolePage() && checkAccess() &&
          <SubTabHolder tabs={subTabs} supTabs={supportTabsArray}/>
        }
        <Routes>
          <Route path="/Storekeeper/StorekeeperAdvent/Current" element={wrapErrorBoundary(<StorekeeperAdvent isCurrent={true} cookies={cookies}/>)}/>
          <Route path="/Storekeeper/StorekeeperAdvent/Completed" element={wrapErrorBoundary(<StorekeeperAdvent isCurrent={false} cookies={cookies}/>)}/>
          <Route path="/Storekeeper/StorekeeperExpend/Current" element={wrapErrorBoundary(<StorekeeperExpend isCurrent={true} cookies={cookies}/>)}/>
          <Route path="/Storekeeper/StorekeeperExpend/Completed" element={wrapErrorBoundary(<StorekeeperExpend isCurrent={false} cookies={cookies}/>)}/>
          <Route path="/Storekeeper/StorekeeperAllocation" element={wrapErrorBoundary(<StorekeeperAllocation/>)}/>
          <Route path="/Storekeeper/StorekeeperInventory" element={wrapErrorBoundary(<StorekeeperInventory/>)}/>
          <Route path="/Storekeeper/StorekeeperVirtualWarehouse" element={wrapErrorBoundary(<StorekeeperVirtualWarehouse/>)}/>

          <Route path="/Manager/ManagerProducts" element={wrapErrorBoundary(<ManagerProducts/>)}/>
          <Route path="/Manager/ManagerOrderCreation" element={wrapErrorBoundary(<ManagerOrderCreation/>)}/>
          <Route path="/Manager/ManagerSellOrders/Current" element={wrapErrorBoundary(<ManagerSellOrders isCurrent={true}/>)}/>
          <Route path="/Manager/ManagerSellOrders/Completed" element={wrapErrorBoundary(<ManagerSellOrders isCurrent={false}/>)}/>
          <Route path="/Manager/ManagerShipmentOrders/Current" element={wrapErrorBoundary(<ManagerShipmentOrders isCurrent={true}/>)}/>
          <Route path="/Manager/ManagerShipmentOrders/Completed" element={wrapErrorBoundary(<ManagerShipmentOrders isCurrent={false}/>)}/>
          <Route path="/Manager/ManagerBills/NewAccounts" element={wrapErrorBoundary(<ManagerBills isCurrent={true}/>)}/>
          <Route path="/Manager/ManagerBills/ClosedAccounts" element={wrapErrorBoundary(<ManagerBills isCurrent={false}/>)}/>

          <Route path="/Logistician/LogisticianOrders/Current" element={wrapErrorBoundary(<LogisticianOrders isCurrent={true}/>)}/>
          <Route path="/Logistician/LogisticianOrders/Completed" element={wrapErrorBoundary(<LogisticianOrders isCurrent={false}/>)}/>
          <Route path="/Logistician/LogisticianProducts" element={wrapErrorBoundary(<LogisticianProducts/>)}/>
          <Route path="/Logistician/LogisticianBills/NewAccounts" element={wrapErrorBoundary(<LogisticianBills isCurrent={true}/>)}/>
          <Route path="/Logistician/LogisticianBills/ClosedAccounts" element={wrapErrorBoundary(<LogisticianBills isCurrent={false}/>)}/>

          <Route path="/Accountant/AccountantProducts" element={wrapErrorBoundary(<AccountantProducts/>)}/>
          <Route path="/Accountant/AccountantInvoice/Current" element={wrapErrorBoundary(<AccountantInvoice isCurrent={true}/>)}/>
          <Route path="/Accountant/AccountantInvoice/Completed" element={wrapErrorBoundary(<AccountantInvoice isCurrent={false}/>)}/>
          <Route path="/Accountant/AccountantReports/SelledProducts" element={wrapErrorBoundary(<SelledProducts  cookies={cookies}/>)}/>
          <Route path="/Accountant/AccountantReports/PurchasedProducts" element={wrapErrorBoundary(<PurchasedProducts  cookies={cookies}/>)}/>
          <Route path="/Accountant/AccountantReports/ProductTurnover" element={wrapErrorBoundary(<ProductTurnover  cookies={cookies}/>)}/>
          <Route path="/Accountant/AccountantReports/PaybackOfGoods" element={wrapErrorBoundary(<PaybackOfGoods  cookies={cookies}/>)}/>
          <Route path="/Accountant/AccountantAccounts/NewAccounts" element={wrapErrorBoundary(<AccountantAccounts isCurrent={true}/>)}/>
          <Route path="/Accountant/AccountantAccounts/ClosedAccounts" element={wrapErrorBoundary(<AccountantAccounts isCurrent={false}/>)}/>

          <Route path="/Administrator/AdministratorAccounts" element={wrapErrorBoundary(<AdministratorAccounts/>)}/>
          <Route path="/Administrator/AdministratorCreating/RackCreating" element={wrapErrorBoundary(<AdministratorRackCreating/>)}/>
          <Route path="/Administrator/AdministratorCreating/GoodCreating" element={wrapErrorBoundary(<AdministratorGoodCreating/>)}/>
          <Route path="/Administrator/AdministratorCreating/ZoneCreating" element={wrapErrorBoundary(<AdministratorZoneCreating/>)}/>
          <Route path="/Administrator/AdministratorCreating/WarehouseCreating" element={wrapErrorBoundary(<AdministratorWarehouseCreating/>)}/>
          
          <Route path="/Profile" element={wrapErrorBoundary(<Profile setCookie={setCookie} cookies={cookies}/>)}/>
          <Route path="/Home" element={wrapErrorBoundary(<Home cookies={cookies}/>)}/>
        </Routes>
      </div>
    );
  } else {
    return <Authorization setCookie={setCookie} cookies={cookies}/> 
  }
}