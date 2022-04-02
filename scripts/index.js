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

    function validarSessao(campo_1, campo_2) {
        if (campo_1.value.length > 0 && campo_2.value.length > 0) {
            if (campo_1.value != bancoDados.Email || campo_2.value != bancoDados.Senha) {
                selectId("erroForm").innerHTML += `<li> <b>Email</b> e <b>senha</b> não conferem ou usuário não cadastrado! </li>`;
            }
        }

    }

    // chamando as funções para testar se os campos estão vazios
    campoVazio(email);
    campoVazio(senha);
    // chamando as funções para validadr que o que estar armazenado na session corresponde 
    // ao informado no login
    validarSessao(email, senha);

    //impedindo de enviar os dados se campos não foram preenchidos
    // if (document.querySelectorAll("li").length > 0) {
    //     event.preventDefault();
    // }


})