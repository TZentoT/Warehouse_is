const host = 'http://127.0.0.1:8000/';
// const host = 'http://localhost:5000/';

export class Api {

    getClients () {
        var xhr = new XMLHttpRequest();
        return new Promise(function(resolve, reject){
            xhr.open("GET", host+"clients/", true);
            var accounts = []
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    console.log("GetClients answer: ")
                    console.log(this.response)
                    var answer = JSON.parse(this.response)
                    console.log("GetClients answer: ")
                    console.log(answer)
                    
                    answer.map( function(item, i) {
                        accounts.push({
                          id: i, 
                          code: item.code, 
                          number:i+1, 
                          name: item.name, 
                          surname: item.surname, 
                          patronymic: item.patronymic, 
                          login: item.login, 
                          password: item.password, 
                          phone_num: item.phone_num, 
                          duty: item.duty
                        }) 
                    })
                    resolve(accounts)
                }
            } 
            xhr.send(null);
            
        }) 
    }
}
  
  