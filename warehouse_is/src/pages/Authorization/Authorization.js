import React, { Component, Fragment } from "react";
import './Authorization.css';
import Table from "../../components/Table/Table";


var accounts = [
  {name: "Владимир", surname: "Владимирович", patronymic:"Путин", login: "Путин", password: "1", phone_num:"+8 495 606 36 02", duty:"Кладовщик"},
// {name: "Николай", password:"111"},
// {name: "Сергей", password:"3"}
];

var authorizated = false 

const host = 'http://localhost:5000';

export default function Authorization(props){

  function apiGetClients() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host+'/clients', true);
    console.log("Authorization apiGetClients was launched")
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var answer = JSON.parse(this.response)
        console.log("Authorization apiGetClients answer: ")
        console.log(answer)
        answer.map( function(item, i) {
          accounts[i] = {name: item.name, surname: item.surname, patronymic: item.patronymic, login: item.login, password: item.password, phone_num: item.phone_num, duty: item.duty}
        })
        
      }
    } 
    xhr.send(null);
  }

  if (!authorizated) {
    apiGetClients()
  }

  function submitClicked(){
    var login = document.getElementById("inputName").value
    var password = document.getElementById("inputPassword").value
    var passCheck=true
    accounts.map(item=>{
      if (item.login==login && item.password==password){
        passCheck=false
        authorizated = true
        props.func(true)
      }
    })
    if (passCheck) {
      alert("Ошибка, введенны некорректные данные");
    }
  }

    return (
      <div className="login-wrapper">
        <h1>Пожалуйста авторизируйтесь</h1>
        <form>
          <label>
            <p>Имя пользователя</p>
            <input id="inputName" type="text" />
          </label>
          <label>
            <p>Пароль</p>
            <input id="inputPassword" type="password" />
          </label>
          <div>
            <button type="submit" onClick={submitClicked}>Submit</button>
          </div>
        </form>
      </div>
    )
} 