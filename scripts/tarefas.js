function selectId(id) {
    return document.getElementById(id);
}

//######################## Preenchendo o nome do usuário
function carregarInfoUser() {

    const url = "https://ctd-todo-api.herokuapp.com/v1/users/getMe";
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            authorization: token
        },

    });

    promessa
        .then(function(Response) {
            return Response.json();
        })
        .then(function(dadosUser) {
            dadosCadastro = dadosUser;
            sessionStorage.setItem("dadosCadastro", JSON.stringify(dadosCadastro));
        })
        .catch(function(err) {
            console.log(err);
        });
}


// Recuperando os dados da SessionStorage
let bancoDados = JSON.parse(sessionStorage.getItem('dadosCadastro'));

//Sentando o nome de usuario
let nome = bancoDados["firstName"];
selectId("nome_user").innerHTML = `Olá, ${nome}`;