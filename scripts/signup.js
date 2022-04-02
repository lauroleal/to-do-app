// função para otimizar o document.getElementById();

function selectId(id) {
    return document.getElementById(id);
}

let form = document.querySelector("form");


// evento que captura os dados do form
form.addEventListener("submit", function(event) {

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
    function confirSenha(senha, repetirSenha) {
        if (repetirSenha.value != '') {
            if (senha.value != repetirSenha.value) {
                selectId("erroForm").innerHTML += `<li> As <b>Senhas</b> digitadas não correspondem </li>`;
            }
        }

    }

    // chamando as funçõespara testar se os campos
    campoVazio(nome);
    campoVazio(sobrenome);
    campoVazio(email);
    campoVazio(senha);
    campoVazioSenha(repetirSenha);
    confirSenha(senha, repetirSenha);

    //impedindo de enviar os dados se campos não foram preenchidos
    if (document.querySelectorAll("li").length > 0) {
        event.preventDefault();
    }


    //############# Hora de gerar um arquivo JSon #####################

    // Obj literal com os dados do form
    const dadosCadastro = { Nome: nome.value, Sobrenome: sobrenome.value, Email: email.value, Senha: senha.value };

    // Obj literal para JSON + Armazenando na Session Storage
    sessionStorage.setItem("dadosCadastro", JSON.stringify(dadosCadastro));
})