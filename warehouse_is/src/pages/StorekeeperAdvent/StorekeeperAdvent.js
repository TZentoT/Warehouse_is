import React, { Component, Fragment } from "react";
import './StorekeeperAdvent.css';
import Table from "../../components/Table/Table";
import FlexibleBlocksPage from "../../components/FlexibleBlocks/FlexibleBlocksPage/FlexibleBlocksPage";
import FlexibleBlock from "../../components/FlexibleBlocks/FlexibleBlock/FlexibleBlock";
import InputDate from "../../components/InputDate/InputDate";
import InputFile from "../../components/InputFile/InputFile";
import InputText from "../../components/InputText/InputText";
import ExpandListInputRegular from "../../components/ExpandListInput/ExpandListInputRegular/ExpandListInputRegular";
import ListWithSearch from "../../components/ListWithSearch/ListWithSearch";
import { render } from "react-dom";
//const API = require('../../api/api.js');
const host = 'http://localhost:5000';

const styles = {

}


const apiGetRacksByZones = function apiGetRacksByZones() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host+'/racks_by_zone', true);
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(this.responseText);
      }
    }
    
    xhr.send("code=2");
}  

var table_list = [
    [0,'','','','','', true],
]

export default function StorekeeperAdvent(props){
     
    var id=props.Id
    function getId(){
        id++
        return id-1
    }

    const [reload, setReload] = React.useState(0)
  

    function reloadPage(){
        setReload(reload+1)
    }
    //-------------------------------------------------------------------------Блок 1
   
    var list_with_search_width = "200px"
    var list_with_search_height = "335px"
    var list_with_search_items = props.list;
     // {id: 0, text: "Заказ №1143", selected: false},
        // {id: 0, text: "Заказ №1346", selected: false},
        // {id: 0, text: "Заказ №3543", selected: false},
        // {id: 0, text: "Заказ №3156", selected: false},
        // {id: 0, text: "Заказ №6243", selected: false},
        // {id: 0, text: "Заказ №6546", selected: false},
        // {id: 0, text: "Заказ №6547", selected: false},
        // {id: 0, text: "Заказ №6548", selected: false},
        // {id: 0, text: "Заказ №6549", selected: false},
        // {id: 0, text: "Заказ №6540", selected: false},
        // {id: 0, text: "Заказ №6526", selected: false},
        // {id: 0, text: "Заказ №6536", selected: false},
        // {id: 0, text: "Заказ №6556", selected: false},
        // {id: 0, text: "Заказ №6566", selected: false},

    function set_list_with_search(value) {
        list_with_search_items = value
        props.func(value)
        console.log(list_with_search_items)
    }
    //-------------------------------------------------------------------------Блок 1 конец

    //-------------------------------------------------------------------------Блок 2
    //-------------------------------------стол 1
    var table_list_value = [
        {value: "Встраиваемая техника", selected: true},
        {value: "Стиральные машины", selected: false},
        {value: "Сушильные машины", selected: false},
        {value: "Холодильники", selected: false},
        {value: "Морозильные камеры", selected: false},
        {value: "Винные шкафы", selected: false},
        {value: "Вытяжки", selected: false},
        {value: "Плиты", selected: false},
        {value: "Посудомоечные машины", selected: false},
        {value: "Мелкая бытовая техника", selected: false},
        {value: "Микроволновые печи", selected: false},
        {value: "Электродуховки", selected: false},
        {value: "Пылесосы", selected: false},
        {value: "Водонагреватели", selected: false},
        {value: "Кулеры и пурифайеры", selected: false},
        {value: "Швейные машины, оверлоки", selected: false}
    ]

    var table_list_value_2 = [
        {value: "Варочные поверхности", selected: true},
        {value: "Духовые шкафы", selected: false},
        {value: "Вытяжки", selected: false},
        {value: "Встраиваемые посудомоечные машины", selected: false},
        {value: "Встраиваемые холодильники", selected: false},
        {value: "Встраиваемые морозильные камеры", selected: false},
        {value: "Встраиваемые микроволновые печи", selected: false},
        {value: "Кухонные мойки", selected: false},
        {value: "Измельчители отходов", selected: false},
        {value: "Кухня", selected: false},
        {value: "Бытовые приборы для дома", selected: false},
        {value: "Красота и гигиена", selected: false},
        {value: "Косметические приборы", selected: false},
        {value: "Медицина и реабилитация", selected: false},
    ]

    var goods_type_list = [
        {value: "Варочная поверхность Bosch PKE 645 B17E", selected: true},
        {value: "Варочная поверхность Bosch PKE 645 B18E", selected: false},
        {value: "Варочная поверхность Bosch PKE 645 B19E", selected: false},
        {value: "Варочная поверхность Bosch PKE 645 B20E", selected: false},
        {value: "Варочная поверхность Bosch PKE 645 B21E", selected: false},
        {value: "Варочная поверхность Bosch PKE 645 B22E", selected: false},
        {value: "Варочная поверхность Bosch PKE 645 B23E", selected: false},
    ]

    var table_headers = [
        {title:"№", mode:"text", column_width: "30px", listValue: []}, 
        {title:"Категория", mode:"inputList", column_width: "130px", listValue: table_list_value}, 
        {title:"Подкатегория", mode:"inputList", column_width: "130px", listValue: table_list_value_2}, 
        {title:"Наименование", mode:"inputList", column_width: "110px", listValue: goods_type_list}, 
        {title:"Кол-во коробок", mode:"input", column_width: "70px", listValue: []},
        {title:"", mode:"remove", column_width: "50px", listValue: []},
    ]

    var  table_field_height = "160px"
    console.log("===================-")
    console.log(props.order_list)
    console.log("====================")
    var table_list = [[0,"Встраиваемая техника","Варочные поверхности","Варочная поверхность Bosch PKE 645 B17E","0",true],];

    // props.order_list.map(function(item,i){
    //     var counter=0;
    //     var str=[]

    //     str[counter++] = i
    //     str[counter++] = item.category
    //     str[counter++] = item.sub_category
    //     str[counter++] = item.text
    //     str[counter++] = item.amount_ordered
    //     str[counter++] = item.amount
    //     str[counter++] = true
    //     temp_table_list[i]=str
    // })
  
    // console.log(temp_table_list[0][1])
    // console.log("--------------")
    // console.log(table_list[0][1])
    // if ( temp_table_list[0][1] != table_list[0][1]) {
    //     table_list = temp_table_list
    //     //render()
    //     //reloadPage()
    // }
       
    
    // var table_list = [
    //     [0, "Встраиваемая техника", "Варочные поверхности", "Встраиваемая техника №34", "10", "10", true],
    //     [1, "Холодильники", "Встраиваемые холодильники", "Холодильники №323", "15", "15", true],
    //     [2, "Плиты", "Кухонные мойки", "Плита №452", "12", "12", true],
    //     [3, "Холодильники", "", "Холодильник №654", "17", "17", true],
    //     [4, "Плиты", "", "Плита №123", "5", "5", true],
    //     [5, "Электродуховки", "Бытовые приборы для дома", "Электродуховка №323", "15", "15", true],
    //     [7, "Электродуховки", "Бытовые приборы для дома", "Электродуховка №345", "16", "11", true],
    // ]
        
    function set_table_list_1(value) {
        table_list = value
        // props.func(value)
        // console.log(table_list)
    }
    //-------------------------------------стол 1 конец

    var date; function set_date(value) {date = value}
    var documents; function set_documents(value) {documents = value}
    
    function btn_send_1() {
        console.log("date = " + date)
        if (documents != null) {
            console.log(
                documents.map(doc=>{
                    console.log("document: " + doc.name)
                })
            )
        }
        var temp_table_list=[]
        table_list.map(function(item,i){
            temp_table_list[i] = {id: item[0], category: item[1], sub_category: item[2], text: item[3], amount: item[4], code: item[5]}
        })

        var check=true
        temp_table_list.map(function(item,i){
            if (item.category == ""){
                check=false
                alert("Ошибка, категория не может быть пустой");
            }
            if (item.sub_category == ""){
                check=false
                alert("Ошибка, подкатегория не может быть пустой");
            }
            if (item.text == ""){
                check=false
                alert("Ошибка, Наименование не может быть пустой");
            }
            if (item.amount < 0){
                check=false
                alert("Ошибка, кол-во коробок не может быть отрицательным");
            }
            
        })

        if (check) props.func2(temp_table_list)
        //console.log(temp_table_list)
    }
    //-------------------------------------------------------------------------Блок 2 конец
    //[0,"Встраиваемая техника","Варочные поверхности","Варочная поверхность Bosch PKE 645 B17E","0",true],];
    

    //-------------------------------------------------------------------------Блок 3
    function onBlock3FileUploaded(files){
        files.map(doc=>{
            console.log("block 3 document: " + doc.name)
        })
    }
    var good_category; function set_good_category(value) {good_category = value}
    var one_shipment_amount; function set_one_shipment_amount(value) {one_shipment_amount = value}
    var warranty_good; function set_warranty_good(value) {warranty_good = value}
    var shipment_deadline; function set_shipment_deadline(value) {shipment_deadline = value}
    var amount_of_shipments; function set_amount_of_shipments(value) {amount_of_shipments = value}
    var good_cost; function set_good_cost(value) {good_cost = value}
    var provider_2; function set_provider_2(value) {provider_2 = value}

    //-------------------------------------стол 2
    var table_headers_2 = [
        {title:"№", mode:"text", column_width: "30px", listValue: []}, 
        {title:"Наименование", mode:"text", column_width: "110px", listValue: []}, 
        {title:"Прогресс доставки (шт)", mode:"text", column_width: "70px", listValue: []}, 
        {title:"Вес (кг)", mode:"text", column_width: "70px", listValue: []}, 
        {title:"", mode:"remove", column_width: "50px", listValue: []},
    ]

    var  table_field_height_2 = "100px"

    var table_list_2 = [
        [0, "Встраиваемая техника №5", "10/50", "50",  false],
        [1, "Встраиваемая техника №6", "15/50", "40",  false],
        [2, "Встраиваемая техника №7", "8/50", "71",  false],

    ]
    function set_table_list_2(value) {
        table_list_2 =value
    }
    //-------------------------------------стол 2 конец

    function btn_send_2() {
        console.log("good_category = " + good_category)
        console.log("one_shipment_amount = " + one_shipment_amount)
        console.log("warranty_good = " + warranty_good)
        console.log("shipment_deadline = " + shipment_deadline)
        console.log("amount_of_shipments = " + amount_of_shipments)
        console.log("good_cost = " + good_cost)
        console.log("provider_2 = " + provider_2)
        console.log(table_list_2)

    }
    list_with_search_items.map(function(item,i){ item.id = i })
    
    //-------------------------------------------------------------------------Блок 3 конец
    return (
        <FlexibleBlocksPage Id={getId()}>
            <FlexibleBlock>
                <ListWithSearch Id={getId()} item_list={list_with_search_items} func={set_list_with_search} width={list_with_search_width} height={list_with_search_height}/>
            </FlexibleBlock>
            <FlexibleBlock>
                <div class="header_text">Прием товаров</div>
                <div class="low_text row_with_item_wide"><div>Дата&nbsp;приема&nbsp;</div><InputDate Id={getId()} defValue={"2022-01-14"} func={set_date}/></div>
                {/* <div class="low_text row_with_item_wide"><div>Товар&nbsp;</div><ExpandListInputRegular Id={getId()} defValue={expand_imput_list_1[3].value} list={expand_imput_list_1} func={set_expand_list_input_1}  i={0} j={0}/></div> */}
                {/* <InputText styles = "row_with_ite   m_wide" Id={getId()} label="Поставщик" placeholder="Поставщик" set={set_provider_1}/> */}
                <div class="low_text"><InputFile Id={getId()} func={set_documents}/></div>
                <Table Id={getId()} table_headers={table_headers} table_field_height={table_field_height} table_list={table_list} func={set_table_list_1} numb={0} search="true" add="true" delete="true"/>
                <div class="place_holder"/><button class="bt_send" onClick={btn_send_1}>Отправить</button>
            </FlexibleBlock>
                {/* <FlexibleBlock>
                <div class="header_text">Заказ 1</div>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Категория" placeholder="Категория товара" set={set_good_category}/>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Кол-во товара в поставке&nbsp;" placeholder="Кол-во товара в поставке" set={set_one_shipment_amount}/>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Гарантия" placeholder="Гарантия" set={set_warranty_good}/>
                <div class="low_text row_with_item_equal"><div>Крайний срок поставки&nbsp;</div><InputDate Id="2" func={set_shipment_deadline}/></div>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Кол-во партий товара&nbsp;" placeholder="Кол-во партий товара" set={set_amount_of_shipments}/>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Цена&nbsp;" placeholder="Цена" set={set_good_cost}/>
                <InputText styles = "row_with_item_equal" Id={getId()} label="Поставщик" placeholder="Поставщик" set={set_provider_2}/>
                <div class="low_text"><InputFile Id={getId()} func={onBlock3FileUploaded}/></div>
                <Table Id={getId()} table_headers={table_headers_2} table_field_height={table_field_height_2} table_list={table_list_2} func={set_table_list_2} numb={1} search="true" add="false" delete="false"/>
            </FlexibleBlock> */}
        </FlexibleBlocksPage>
    )

    function rerender() {
        this.forceUpdate()
    }

}
