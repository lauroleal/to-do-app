// Recuperando os dados da SessionStorage
let bancoDados = JSON.parse(sessionStorage.getItem('dadosCadastro'));

function selectId(id) {
    return document.getElementById(id);
}

//Sentando o nome de usuario
let nome = bancoDados.Nome;
selectId("nome_user").innerHTML = `Olá, ${nome}`;

// sentando nova im no perfil se ela foi cadastrada no editar cadastro
if (bancoDados.Img != "img") {
    let img = bancoDados.Img;
    selectId("img__perfil").setAttribute('src', img);
}





// funções para alterar a imagem
selectId("menssagem__alterar").onmousemove = function() { legendaImg() };
selectId("menssagem__alterar").onmouseout = function() { tiraLegenda() };

// mostrar texto de alterar imagem
function legendaImg() {
    let texto = "Alterar Imagem";
    selectId("id_menssagem").innerHTML = texto;
    selectId("id_menssagem").style.fontSize = "12px";
    selectId("id_menssagem").style.textAlign = "center";
    selectId("id_menssagem").style.paddingTop = "14px";
}

// Limpar texto de alterar imagem
function tiraLegenda() {
    let texto = "";
    selectId("id_menssagem").innerHTML = texto;
}