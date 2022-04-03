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
    let senhaAtual = selectId("senha");
    let novaSenha = selectId("novaSenha");
    let repetirNovaSenha = selectId("repetirNovaSenha");

    //limpando a menssagem de erro dos campos que foram preenchidos
    selectId("erroForm").innerHTML = '';


    // Recuperando os dados da SessionStorage
    let bancoDados = JSON.parse(sessionStorage.getItem('dadosCadastro'));


    // validando se os campos foram preenchidos
    function campoVazio(campo) {
        if (campo.value === '') {
            selectId("erroForm").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido 😪</li>`;
        }
    }

    // se foi add um novo nome cadastre
    if (nome.value != '' && nome.value != bancoDados.Nome && senhaAtual.value === bancoDados.Senha) {
        bancoDados["Nome"] = nome.value;
    }
    // se foi add um novo sobrenom cadastre
    if (sobrenome.value != '' && sobrenome.value != bancoDados.Sobrenome && senhaAtual.value === bancoDados.Senha) {
        bancoDados["Sobrenome"] = sobrenome.value;
    }
    // se foi add um novo email cadastre
    if (email.value != '' && email.value != bancoDados.Email) {
        bancoDados["Email"] = email.value;
    }

    // se senha digitada e diferente do registrado
    if (senhaAtual.value != '' && senhaAtual.value != bancoDados.Senha) {
        selectId("erroForm").innerHTML += `<li><b>Senha Atual</b> não confere com nossos registros😅</li>`;
    }

    // se nova senha e igual a anterior
    if (senhaAtual.value === bancoDados.Senha) {
        if (novaSenha.value === bancoDados.Senha && repetirNovaSenha.value === bancoDados.Senha) {
            selectId("erroForm").innerHTML += `<li> Essa <b>Senha</b> já foi usada antes👀</li>`;
        }
    }
    // se nova senha e a confirmação são diferentes
    if (senhaAtual.value === bancoDados.Senha && novaSenha.value != "") {
        campoVazio(repetirNovaSenha);
        if (novaSenha.value != "" && repetirNovaSenha.value != "" && novaSenha.value != repetirNovaSenha.value) {
            selectId("erroForm").innerHTML += `<li> As novas <b>Senhas</b> digitadas não correspondem😏/li>`;
        }
    }
    // Definindo um tamanho mínimo para as novas senhas
    function tamnhoSenha(campo_1, campo_2) {
        if (senhaAtual.value === bancoDados.Senha && novaSenha.value === repetirNovaSenha.value) {
            if (campo_1.value.length > 0 && campo_2.value.length > 0) {
                if (campo_1.value.length <= 7) {
                    selectId("erroForm").innerHTML += `<li> Sua nova <b>Senha</b> precisa ter no mínimo 8 caracteres🥱</li>`;
                }
            }
        }

    }
    // funções para testar campo vazio
    campoVazio(nome);
    campoVazio(sobrenome);
    campoVazio(email);
    campoVazio(senhaAtual);


    // testando o tamanho da nova senha
    tamnhoSenha(novaSenha, repetirNovaSenha);

    // setando a nova senha se atendeu a todos os parametros já implementados
    if (senhaAtual.value === bancoDados.Senha) {
        if (novaSenha.value.length >= 7 && novaSenha.value === repetirNovaSenha.value) {
            bancoDados["Senha"] = novaSenha.value;
        }
    }


    console.log(bancoDados);
    sessionStorage.setItem("dadosCadastro", JSON.stringify(bancoDados));










})