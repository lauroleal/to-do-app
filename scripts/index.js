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

    //impedindo de enviar os dados se campos não foram preenchidos
    // if (document.querySelectorAll("li").length > 0) {
    //     event.preventDefault();
    // }



    console.log(bancoDados.Nome);
})