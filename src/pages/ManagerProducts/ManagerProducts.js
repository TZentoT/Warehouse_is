import React, { Component, Fragment } from "react";
import './ManagerProducts.css';
import FlexibleBlocksPage from "../../components/FlexibleBlocks/FlexibleBlocksPage/FlexibleBlocksPage";
import FlexibleBlock from "../../components/FlexibleBlocks/FlexibleBlock/FlexibleBlock";
import InputText from "../../components/InputText/InputText";
import InputTextArea from "../../components/InputTextArea/InputTextArea";
import { TableComponent } from "../../components/Table/TableComponent";
import { recomposeColor } from "@material-ui/core";
import { Api } from "../../api/managerApi"

var api = new Api()
const styles = {

}

export default function ManagerProducts(props){

    async function apiGetGoodsTypeCats() {
        var buffer = await api.getGoodsTypeCats()
        setTableList(buffer)
        setSelectedItemId(buffer[0])
    }

    //-------------------------------------------------------------------------Блок 1
    //-------------------------------------стол 1
    const [tableHeaders, setTableHeaders] = React.useState([
        {name: 'number',            title:'№',                  editingEnabled:false,    width:40    }, 
        {name: 'goodsCategories2',  title:'Категория',          editingEnabled:false,    width:200   }, 
        {name: 'goodsCategories3',  title:'Подкатегория',       editingEnabled:false,    width:200   }, 
        {name: 'goodsType',         title:'Наименование',       editingEnabled:false,    width:330   }, 
        {name: 'amountOnWarehouse', title:'Кол-во на складе',   editingEnabled:false,    width:135   }, 
        {name: 'cost',              title:'Цена ед товара',     editingEnabled:true,     width:125, isCurrency:true,  mask:/^[0-9]{0,10}$/i, maskExample:"быть числом больше нуля"},
        {name: 'goodsLimit',        title:'Лимит товара',       editingEnabled:true,     width:120,  mask:/^[0-9]{0,10}$/i, maskExample:"быть числом больше нуля"   },
    ]) 
    var tableSettings = {
        add:false, 
        edit:false, 
        delete:false, 
        select:true, 
        defaultSelection:true,
        filter: true
    }
    
    const [tableList, setTableList] = React.useState([])
    const [selectedItemId, setSelectedItemId] = React.useState()

    React.useEffect(() => {
        console.log("table changed")
     }, [tableList]);

    React.useEffect(() => {
       if (tableList.length > 0) setDataInTable2(selectedItemId)
    }, [selectedItemId]);

    if (tableList.toString()=="")
        apiGetGoodsTypeCats()

    //-------------------------------------стол 1 конец
    //-------------------------------------------------------------------------Блок 1 конец

    //-------------------------------------------------------------------------Блок 3
    const [good, setGood] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [subCategory, setSubCategory] = React.useState("")
    const [cost, setCost] = React.useState("")
    const [amountInStore, setAmountInStore] = React.useState("")
    const [goodLimit, setGoodLimit] = React.useState("")
    const [goodCharacteristics, setGoodCharacteristics] = React.useState("")

    function setDataInTable2(value) {
        if (value != undefined){
            setGood(value.goodsType)
            setCategory(value.goodsCategories2)
            setSubCategory(value.goodsCategories3)
            setCost(value.cost)
            setAmountInStore(value.amountOnWarehouse)
            setGoodLimit(value.goodsLimit)
            setGoodCharacteristics(value.description)
        }
    }

    //-------------------------------------------------------------------------Блок 3 конец
    let tabsHeight = 102
    return (
        <FlexibleBlocksPage marginTop={tabsHeight}>
            <FlexibleBlock>
                <div class="header_text">Товары</div>
                <div style={{width:800+'px', display:'inline-table'}}>
                    <TableComponent height={document.documentElement.clientHeight - tabsHeight - 70} columns={tableHeaders} rows={tableList} onSelect={setSelectedItemId} setNewTableList={setTableList} tableSettings={tableSettings}/>
                </div>
            </FlexibleBlock>
            <FlexibleBlock>
                <div style={{width:350+"px"}}>
                    <div class="header_text">Характеристики товара</div>
                    <div class="low_text bold">Название:&nbsp;<label class="normal">{good}</label></div>
                    <div class="low_text bold">Категория:&nbsp;<label class="normal">{category}</label></div>
                    <div class="low_text bold">Подкатегория:&nbsp;<label class="normal">{subCategory}</label></div>
                    <div class="low_text bold">Цена&nbsp;ед&nbsp;товара&nbsp;<label class="normal">{cost} ₽</label></div>
                    <div class="low_text bold">Лимит&nbsp;товара&nbsp;(кг):&nbsp;<label class="normal">{goodLimit}</label></div>
                    <div class="low_text bold">Хар-ки&nbsp;товара:&nbsp;</div><div class="low_text normal">{goodCharacteristics}</div>
                </div>
            </FlexibleBlock>
        </FlexibleBlocksPage>
    )
}