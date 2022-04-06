// função para otimizar o document.getElementById();

function selectId(id) {
    return document.getElementById(id);
}

let form = document.querySelector("form");


// evento que captura os dados do form
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // obtendo os valores dos campos do form
    let nome = selectId("nome");
    let sobrenome = selectId("sobrenome");
    let email = selectId("email");
    let senha = selectId("senha");
    let repetirSenha = selectId("repetirSenha");

    //limpando a menssagem de erro dos campos que foram preenchidos
    selectId("erroForm").innerHTML = '';

    // validando se os campos foram preenchidos
    function campoVazio(campo) {
        if (campo.value === '') {
            selectId("erroForm").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido </li>`;
        }
    }

    // validando se o campo repetir senha foi preenchido (melhorando a experiencia do user)
    function campoVazioSenha(campo) {
        if (campo.value === '' && campo.name === 'repetirSenha') {
            selectId("erroForm").innerHTML += `<li> O campo <b>repetir senha</b> não foi preenchido </li>`;
        }
    }

    // validando se os campos das senhas correspondem
    function confirSenha(campo_1, campo_2) {
        if (campo_1.value.length > 0 && campo_2.value.length > 0) {
            if (campo_1.value != campo_2.value) {
                selectId("erroForm").innerHTML += `<li> As <b>Senhas</b> digitadas não correspondem </li>`;
            }
        }
    }

    // Definindo um tamanho mínimo para as senhas
    function tamnhoSenha(campo_1, campo_2) {
        if (campo_1.value.length > 0 && campo_2.value.length > 0) {
            if (campo_1.value.length <= 7) {
                selectId("erroForm").innerHTML += `<li> Sua <b>Senha</b> precisa ter no mínimo 8 caracteres </li>`;
            }
        }
    }

    // chamando as funções para testar se os campos
    campoVazio(nome);
    campoVazio(sobrenome);
    campoVazio(email);
    campoVazio(senha);
    campoVazioSenha(repetirSenha);
    confirSenha(senha, repetirSenha);
    tamnhoSenha(senha, repetirSenha);

    //############# $$ Cadastrando as tarefa $$ #####################


    function cadastrarUser() {

        const dados = {
            firstName: nome.value,
            lastName: sobrenome.value,
            email: email.value,
            password: senha.value
        };
        const url = "https://ctd-todo-api.herokuapp.com/v1/users";

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
                        selectId("erroForm").innerHTML += `<li> <b class="verde">Cadastrado com sucesso! abrindo tela de login...</b> </li>`;
                        window.location = 'index.html';
                    }, 8000);
                } else if (Response["status"] >= 400 && Response["status"] < 500) {
                    selectId("erroForm").innerHTML += `<li> <b>Encontramos um cadastro para este usuário!</b> </li>`;
                } else if (Response["status"] >= 500) {
                    selectId("erroForm").innerHTML += `<li> <b>Erro no servidor!</b> </li>`;
                }
                return Response.json();
            })
            .then(function(tokenUsuario) {
                console.log(tokenUsuario);

            })
            .catch(function(err) {
                console.log(err);
            });
    }
    //impedindo de enviar os dados se campos não foram preenchidos
    if (document.querySelectorAll("li").length > 0) {
        event.preventDefault();
    } else {
        cadastrarUser(nome, sobrenome, email, senha);
    }

})