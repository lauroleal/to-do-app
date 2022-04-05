// função para otimizar o document.getElementById();

function selectId(id) {
    return document.getElementById(id);
}
// Recuperando os dados da SessionStorage
let bancoDados = JSON.parse(sessionStorage.getItem('dadosCadastro'));


let form = document.querySelector("form");

// evento que captura os dados do form
form.addEventListener("submit", function(event) {
    event.preventDefault();

    let email = selectId("inputEmail");
    let senha = selectId("inputPassword");

    // limpando as menssagens de capos não preenchidos da tela
    selectId("erroForm").innerHTML = '';

    // validando se os campos foram preenchidos
    function campoVazio(campo) {
        if (campo.value === '') {
            selectId("erroForm").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido </li>`;
        }
    }


    // chamando as funções para testar se os campos estão vazios
    campoVazio(email);
    campoVazio(senha);

    function logarUser(email, senha) {

        const dados = {
            email: email.value,
            password: senha.value
        };
        const url = "https://ctd-todo-api.herokuapp.com/v1/users/login";

        const promessa = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        promessa
            .then(function(Response) {
                console.log(Response["status"]);
                if (Response["status"] < 300) {
                    setTimeout(function() {
                        selectId("erroForm").innerHTML += `<li> <b class="verde">Login Aprovado!</b> </li>`;
                        window.location = 'tarefas.html';
                    }, 3000);
                } else if (Response["status"] === 400) {
                    selectId("erroForm").innerHTML += `<li> <b>Senha incorreta!</b> </li>`;
                } else if (Response["status"] === 404) {
                    selectId("erroForm").innerHTML += `<li> <b>Usuário não cadastrado!</b> </li>`;
                } else if (Response["status"] >= 500) {
                    selectId("erroForm").innerHTML += `<li> <b>Erro no servidor!</b> </li>`;
                }
                return Response.json();

            })

        .then(function(tokenUsuario) {
                console.log(tokenUsuario);
                localStorage.setItem("token", tokenUsuario['jwt']);
            })
            .catch(function(err) {
                console.log(err);
            });
    }


    //impedindo de enviar os dados se campos não foram preenchidos
    if (document.querySelectorAll("li").length > 0) {
        event.preventDefault();
    } else {
        logarUser(email, senha);
    }


})