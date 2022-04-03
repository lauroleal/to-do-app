// função para otimizar o document.getElementById();

function selectId(id) {
    return document.getElementById(id);
}

let form = document.querySelector("form");


// evento que captura os dados do form
form.addEventListener("submit", function(event) {

    // Recuperando os dados da SessionStorage
    let bancoDados = JSON.parse(sessionStorage.getItem('dadosCadastro'));

    // obtendo os valores dos campos do form
    let nome = selectId("nome");
    let sobrenome = selectId("sobrenome");
    let email = selectId("email");
    let senhaAtual = selectId("senha");

    //limpando a menssagem de erro dos campos que foram preenchidos
    selectId("erroFormP").innerHTML = '';


    // validando se os campos foram preenchidos
    function campoVazio(campo) {
        if (campo.value === '') {
            selectId("erroFormP").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido 😪</li>`;
        }
    }

    // funções para testar campo vazio
    campoVazio(nome);
    campoVazio(sobrenome);
    campoVazio(email);
    campoVazio(senhaAtual);

    if (senhaAtual.value === bancoDados.Senha) {
        // se foi add um novo nome cadastre
        if (nome.value != '' && nome.value != bancoDados.Nome) {
            bancoDados["Nome"] = nome.value;
        }
        // se foi add um novo sobrenom cadastre
        if (sobrenome.value != '' && sobrenome.value != bancoDados.Sobrenome) {
            bancoDados["Sobrenome"] = sobrenome.value;
        }
        // se foi add um novo email cadastre
        if (email.value != '' && email.value != bancoDados.Email) {
            bancoDados["Email"] = email.value;
        }
    }
    // se senha digitada e diferente do registrado
    if (senhaAtual.value != '' && senhaAtual.value != bancoDados.Senha) {
        selectId("erroFormP").innerHTML += `<li><b>Senha Atual</b> não confere com nossos registros😅</li>`;
    }

    //impedindo de enviar os dados se campos não foram preenchidos
    if (document.querySelectorAll("li").length > 0) {
        event.preventDefault();
    }

    // atualizando os dados
    sessionStorage.setItem("dadosCadastro", JSON.stringify(bancoDados));
})


//###########################################################################

function atualiSenha() {

    //limpando a menssagem de erro dos campos que foram preenchidos
    selectId("erroFormS").innerHTML = '';

    let senhaCadastrada = selectId("senhaCadastrada");
    let novaSenha = selectId("novaSenha");
    let repetirNovaSenha = selectId("repetirNovaSenha");

    // validando se os campos foram preenchidos
    function campoVazioS(campo) {
        if (campo.value === '') {
            selectId("erroFormS").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido 😪</li>`;
        }
    }

    // funções para testar campo vazio
    campoVazioS(senhaCadastrada);
    campoVazioS(novaSenha);
    campoVazioS(repetirNovaSenha);

    // se senha digitada e diferente do registrado
    if (senhaCadastrada.value != '' && senhaCadastrada.value != bancoDados.Senha) {
        selectId("erroFormS").innerHTML += `<li><b>Senha Atual</b> não confere com nossos registros😅</li>`;
    }

    // se nova senha e igual a anterior
    if (senhaCadastrada.value === bancoDados.Senha) {
        if (novaSenha.value === bancoDados.Senha && repetirNovaSenha.value === bancoDados.Senha) {
            selectId("erroFormS").innerHTML += `<li> Essa <b>Senha</b> já foi usada antes👀</li>`;
        }
    }
    // se nova senha e a confirmação são diferentes
    if (senhaCadastrada.value === bancoDados.Senha) {
        if (novaSenha.value != "" && repetirNovaSenha.value != "" && novaSenha.value != repetirNovaSenha.value) {
            selectId("erroFormS").innerHTML += `<li> As novas <b>Senhas</b> digitadas não correspondem😏/li>`;
        }
    }
    // Definindo um tamanho mínimo para as novas senhas
    function tamnhoSenha(campo_1, campo_2) {
        if (senhaCadastrada.value === bancoDados.Senha && novaSenha.value === repetirNovaSenha.value) {
            if (campo_1.value.length > 0 && campo_2.value.length > 0) {
                if (campo_1.value.length <= 7 && campo_2.value.length <= 7) {
                    selectId("erroFormS").innerHTML += `<li> Sua nova <b>Senha</b> precisa ter no mínimo 8 caracteres🥱</li>`;
                }
            }
        }

    }

    // testando o tamanho da nova senha
    tamnhoSenha(novaSenha, repetirNovaSenha);

    // setando a nova senha se atendeu a todos os parametros já implementados e redirecionando para tarefas
    if (senhaCadastrada.value === bancoDados.Senha && novaSenha.value != "" && repetirNovaSenha.value != "") {
        if (novaSenha.value.length >= 7 && novaSenha.value === repetirNovaSenha.value) {
            bancoDados["Senha"] = novaSenha.value;
            selectId("erroFormS").innerHTML = `<li> <b>Senha</b> atualizada com sucesso! 😁</li>`;
            if (document.querySelectorAll("li").length > 0) {
                setTimeout(function() {
                    window.location = 'tarefas.html';
                }, 3000);

            }

        }
    }
    // atualizando os dados
    sessionStorage.setItem("dadosCadastro", JSON.stringify(bancoDados));
}

function atualiImg() {

    //limpando a menssagem de erro dos campos que foram preenchidos
    selectId("erroFormI").innerHTML = '';

    let senhaCadastrada2 = selectId("senhaCadastrada2");
    let img = selectId("img__cad");

    // se senha digitada e diferente do registrado
    if (senhaCadastrada2.value != '' && senhaCadastrada2.value != bancoDados.Senha) {
        selectId("erroFormI").innerHTML += `<li><b>Senha Atual</b> não confere com nossos registros😅</li>`;
    }

    // validando se os campos foram preenchidos
    function campoVazioI(campo) {
        if (campo.value === '') {
            selectId("erroFormI").innerHTML += `<li> O campo <b>${campo.name}</b> não foi preenchido 😪</li>`;
        }
    }

    // funções para testar campo vazio
    campoVazioI(senhaCadastrada2);
    campoVazioI(img);

    // setando a nova imagem se atendeu a todos os parametros já implementados e redirecionando para tarefas
    if (senhaCadastrada2.value === bancoDados.Senha && img.value != "") {
        console.log(img.value);
        bancoDados["Img"] = img.value;
        selectId("erroFormI").innerHTML += `<li> Alguma subiu!</li>`;
        if (document.querySelectorAll("li").length > 0) {
            setTimeout(function() {
                window.location = 'tarefas.html';
            }, 3000);

        }

    }
    // atualizando os dados
    sessionStorage.setItem("dadosCadastro", JSON.stringify(bancoDados));
}