function selectId(id) {
    return document.getElementById(id);
}

//############################### $$ Preenchendo o nome do usuário $$ ###############################

// Recuperar os dados
function carregarDados() {
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
            //Sentando os dados do usuario da parte superior da pagina
            let nome = dadosUser["firstName"];
            let id = dadosUser["id"];
            let sobrenome = dadosUser["lastName"];
            selectId("nome_user").innerHTML = `Olá, ${nome}`;
            selectId("dadosUser").innerHTML = `${nome} ${sobrenome} (${id})`;
            dadosCadastro = dadosUser;
            sessionStorage.setItem("dadosCadastro", JSON.stringify(dadosCadastro));
        })
        .catch(function(err) {
            console.log(err);
        });
    // recuperando as tarefas
    recuperarTarefas();
}

// chamando a função pra recuperar os dados
carregarDados();

//############################### $$ Nova tarefa $$ ###############################

let form = document.querySelector("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    // limpar a menssagem
    selectId("legenda-tarefa").innerHTML = '';
    const tarefa = selectId("novaTarea").value;

    // validando se o campo nova tarefa foi preenchido
    function campoVazio(campo) {
        if (campo === '') {
            selectId("legenda-tarefa").innerHTML = `O campo não foi preenchido 😅`;
        } else {
            novaTarefa();
        }
    }

    campoVazio(tarefa);

    function novaTarefa() {

        const tarefas = {
            description: tarefa,
            completed: false
        }

        const url = "https://ctd-todo-api.herokuapp.com/v1/tasks";
        const token = localStorage.getItem('token');

        const promessa = fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                authorization: token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarefas)
        });

        promessa
            .then(function(Response) {
                console.log(Response["status"]);
                if (Response["status"] < 300) {
                    selectId("legenda-tarefa").innerHTML = `Tarefa cadastrada!🤩`;
                } else if (Response["status"] < 401) {
                    selectId("legenda-tarefa").innerHTML = `Preencha o campo!🙄`;
                } else if (Response["status"] === 401) {
                    selectId("legenda-tarefa").innerHTML = `Não autorizado!👀`;
                } else if (Response["status"] > 500) {
                    selectId("legenda-tarefa").innerHTML = `Erro no servidor!😅`;
                }
                return Response.json();
            })
            .then(function(respos) {
                console.log(respos);
                setTimeout(function() {
                    selectId("legenda-tarefa").innerHTML = '';
                    //recarregando a pagina para atualizar as tarefas
                    location.reload();

                }, 3000);

            })
            .catch(function(err) {
                console.log(err);
            });
    }

})


//############################### $$ Recuperar as tarefas $$ ###############################
function recuperarTarefas() {

    const url = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            authorization: token
        }
    });

    promessa
        .then(function(Response) {
            console.log(Response["status"]);
            if (Response["status"] < 300) {
                // colocando uma immagem de carregando na tela de tarefas
                let imgCarregando = document.createElement("img");
                imgCarregando.classList.add("img-carregando-tarefas");
                imgCarregando.setAttribute('src', './assets/carregando.gif');
                let span = selectId("img_carregando");
                span.appendChild(imgCarregando);

                selectId("legenda-tarefa").innerHTML = `Carregando as tarefas`;
            } else if (Response["status"] === 401) {
                selectId("legenda-tarefa").innerHTML = `Erro de autorização!🙄`;
                window.location = 'index.html';
            } else if (Response["status"] > 500) {
                selectId("legenda-tarefa").innerHTML = `Erro no servidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);
            const arrayTarefas = retorno;
            arrayTarefas.forEach(function(element) {
                if (element.completed === false) {
                    // capturando o status da tarefa
                    let status = element.completed;

                    // Formatando a data
                    let dataCriacao = element.createdAt;

                    dataCriacao = new Date();
                    let dia = dataCriacao.getDate().toString().padStart(2, '0'),
                        mes = (dataCriacao.getMonth() + 1).toString().padStart(2, '0'),
                        ano = dataCriacao.getFullYear().toString().substr(-2);
                    let dataFormatada = `Criada em: ${dia}/${mes}/${ano}`;


                    // capturando a descricao da tarefa
                    let descricao = element.description;
                    // capturando o id da tarefa
                    let idTarefa = element.id;

                    // selecionando a div com a id skeleton
                    let div = document.getElementById('skeleton');
                    // criando uma tag li
                    let li = document.createElement("li");
                    // atribuido a class tarefa na tag li
                    li.classList.add("tarefa");
                    // criando uma tag div
                    let divDone = document.createElement("div");
                    // atribuido a class not-done na tag div
                    divDone.classList.add("not-done");
                    // criando o input pra marcar tarefa como finalizada
                    let inputCh = document.createElement("input");
                    // indentificando o input che 
                    inputCh.setAttribute('type', `radio`);
                    inputCh.setAttribute('onclick', `marcarTarefa(${idTarefa})`);
                    inputCh.setAttribute('alt', `marcar tarefa como concluída`);
                    // criando outra tag div
                    let divDesc = document.createElement("div");
                    // atribuido a class descricao na tag div
                    divDesc.classList.add("descricao");
                    //###########3 testando
                    divDesc.setAttribute('id', `descr${idTarefa}`);
                    // criando a tag p
                    let pNome = document.createElement("p");
                    // atribuido a class nome na tag p
                    pNome.classList.add("nome");
                    // add a descrição da tarefa na tag p
                    let texDesc = document.createTextNode(descricao);
                    pNome.appendChild(texDesc);
                    pNome.setAttribute('id', `pnome${idTarefa}`);
                    // criando a tag p
                    let pTempo = document.createElement("p");

                    // atribuido a class timestamp na tag p
                    pTempo.classList.add("timestamp");
                    pTempo.setAttribute('id', `datatarefa${idTarefa}`);
                    // add a data da descricao na tag p
                    let texdata = document.createTextNode(dataFormatada);
                    pTempo.appendChild(texdata);

                    // os botoes editar e deletar + classs + atributos
                    let butaoDel = document.createElement("button");
                    butaoDel.classList.add("buttons-tarefas");
                    butaoDel.setAttribute('onclick', `deletarTarefa(${idTarefa})`);

                    let butaoEdit = document.createElement("button");
                    butaoEdit.classList.add("buttons-tarefas");
                    butaoEdit.setAttribute('onclick', `EditarTarefa(${idTarefa})`);

                    let imgDel = document.createElement("img");
                    imgDel.classList.add("img-tarefas");
                    imgDel.setAttribute('src', './assets/delete.svg');

                    let imgEdit = document.createElement("img");
                    imgEdit.classList.add("img-tarefas");
                    imgEdit.setAttribute('src', './assets/editar.svg');


                    // jogando tudo na tela
                    divDesc.appendChild(pNome);
                    divDesc.appendChild(pTempo);
                    divDone.appendChild(inputCh);
                    divDone.appendChild(divDesc);
                    butaoDel.appendChild(imgDel);
                    butaoEdit.appendChild(imgEdit);
                    li.appendChild(divDone);
                    li.appendChild(divDesc);
                    li.appendChild(butaoDel);
                    li.appendChild(butaoEdit);
                    div.appendChild(li);
                } else {
                    // capturando o status da tarefa
                    let status = element.completed;

                    // Formatando a data
                    let dataCriacao = element.createdAt;
                    dataCriacao = new Date();
                    let dia = dataCriacao.getDate().toString().padStart(2, '0'),
                        mes = (dataCriacao.getMonth() + 1).toString().padStart(2, '0'),
                        ano = dataCriacao.getFullYear().toString().substr(-2);
                    let dataFormatada = `Criada em: ${dia}/${mes}/${ano}`;

                    // capturando a descricao da tarefa
                    let descricao = element.description;
                    // capturando o id da tarefa
                    let idTarefa = element.id;

                    // selecionando a ul com a id tarefas-terminadas
                    let div = document.getElementById('tarefas-terminadas');
                    // criando uma tag li
                    let li = document.createElement("li");
                    // atribuido a class tarefa na tag li
                    li.classList.add("tarefa");
                    // criando uma tag div
                    let divDone = document.createElement("div");
                    // atribuido a class not-done na tag div
                    divDone.classList.add("not-done");
                    // criando o input pra marcar tarefa como finalizada
                    let inputCh = document.createElement("input");
                    // indentificando o input che 
                    inputCh.setAttribute('type', `radio`);
                    inputCh.setAttribute('onclick', `desMarcarTarefa(${idTarefa})`);
                    inputCh.setAttribute('alt', `Desmarcar tarefa como concluída`);
                    // criando outra tag div
                    let divDesc = document.createElement("div");
                    // atribuido a class descricao na tag div
                    divDesc.classList.add("descricao");
                    //###########3 testando
                    divDesc.setAttribute('id', `descr${idTarefa}`);
                    // criando a tag p
                    let pNome = document.createElement("p");
                    // atribuido a class nome na tag p
                    pNome.classList.add("nome");
                    // add a descrição da tarefa na tag p
                    let texDesc = document.createTextNode(descricao);
                    pNome.appendChild(texDesc);
                    pNome.setAttribute('id', `pnome${idTarefa}`);
                    // criando a tag p
                    let pTempo = document.createElement("p");

                    // atribuido a class timestamp na tag p
                    pTempo.classList.add("timestamp");
                    pTempo.setAttribute('id', `datatarefa${idTarefa}`);
                    // add a data da descricao na tag p
                    let texdata = document.createTextNode(dataFormatada);
                    pTempo.appendChild(texdata);
                    // os botoes editar e deletar + classs + atributos
                    let butaoDel = document.createElement("button");
                    butaoDel.classList.add("buttons-tarefas");
                    butaoDel.setAttribute('onclick', `deletarTarefa(${idTarefa})`);
                    let imgDel = document.createElement("img");
                    imgDel.classList.add("img-tarefas");
                    imgDel.setAttribute('src', './assets/delete.svg');

                    // jogando tudo na tela
                    divDesc.appendChild(pNome);
                    divDesc.appendChild(pTempo);
                    divDone.appendChild(inputCh);
                    divDone.appendChild(divDesc);
                    butaoDel.appendChild(imgDel);
                    li.appendChild(divDone);
                    li.appendChild(divDesc);
                    li.appendChild(butaoDel);
                    div.appendChild(li);
                }


            })

            setTimeout(function() {
                // removendo a menssagem da tela
                selectId("legenda-tarefa").innerHTML = '';
                const removerImg = document.getElementById("img_carregando");
                removerImg.removeChild(removerImg.firstElementChild);
                // removendo o efeito de tarefas carregando
                selectId("skeleton").classList.remove("skeleton");
                selectId("tarefas-terminadas").classList.remove("terminou");
            }, 4000);

        })
        .catch(function(err) {
            console.log(err);
        });

}



//############################### $$ Deletar as tarefas $$ ###############################

function confirmarDeletarTarefa(id) {

    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            authorization: token
        }
    });

    promessa
        .then(function(Response) {
            console.log(Response["status"]);
            if (Response["status"] < 300) {
                selectId("legenda-tarefa").innerHTML = `Tarefa deletada 😢`;
            } else if (Response["status"] > 500) {
                selectId("legenda-tarefa").innerHTML = `Erro no servidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
            }, 4000);

            //recarregando a pagina para atualizar as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

//############################### $$ Criar um input pra editar as tarefas $$ ###############################

function EditarTarefa(id) {

    // selecionando  a div que é criada a nova tarefa
    let div = selectId(`descr${id}`);
    // criando uma nova tag input
    let input = document.createElement("input");
    // atribuido uma id pata a nova tag input
    input.setAttribute('id', `inputeditar${id}`);
    // add estilo ao input
    input.classList.add("input-editar");
    // mostrando o input na tela
    div.appendChild(input);
    // capturando o texto da tarefa
    let valorTexto = document.getElementById(`pnome${id}`).innerText;

    // capturando os valores se cancelar
    let textoDaTarefa = selectId(`pnome${id}`).innerText;
    let data = selectId(`datatarefa${id}`).innerText;

    // pra ter de onde tirar os dados 😑
    sessionStorage.setItem("data", data);
    sessionStorage.setItem("texto", textoDaTarefa);

    // escondendo o texto da tarefa e da data
    document.getElementById(`pnome${id}`).innerHTML = '';
    document.getElementById(`datatarefa${id}`).innerHTML = '';
    // jogando o texto da tarefa para dentro do input
    input.value = valorTexto;

    // criando um botão pra enviar a atualização pro servidor
    let bt = document.createElement("button");
    bt.setAttribute('onclick', `enviarTarefaEditada(${id})`);
    bt.setAttribute('id', `btenviar${id}`);
    //add estilo ao input
    bt.classList.add("buttons-tarefas");

    // criando um botão cancelar a atualização
    let btCancel = document.createElement("button");
    btCancel.setAttribute('onclick', `cancelarEdicao(${id})`);
    btCancel.setAttribute('id', `btcancel${id}`);
    //add estilo ao input
    btCancel.classList.add("buttons-tarefas");

    //############# Botão enviar edição
    // criando uma tag img
    let imgbt = document.createElement("img");
    // add estilo ao img
    imgbt.classList.add("img-tarefas");
    imgbt.setAttribute('src', './assets/send.png');
    imgbt.setAttribute('id', `imgbt${id}`);
    imgbt.setAttribute('alt', 'Salvar edição');
    bt.appendChild(imgbt);
    // colocando o botão na tela
    div.appendChild(bt);

    //############# Botão cancelar edição
    // criando uma tag img
    let imgCancela = document.createElement("img");
    // add estilo ao img
    imgCancela.classList.add("img-tarefas-botoesx");
    imgCancela.setAttribute('src', './assets/fechar__imput.png');
    imgCancela.setAttribute('id', `imgCancela${id}`);
    imgCancela.setAttribute('alt', 'Cancelar edição');
    btCancel.appendChild(imgCancela);
    // colocando o botão na tela
    div.appendChild(btCancel);

}

//############################### $$ Botão cancelar edição da tarefa $$ ###############################

function cancelarEdicao(id) {
    let data = sessionStorage.getItem("data");
    let textoDaTarefa = sessionStorage.getItem("texto");
    // mostrando o texto da tarefa e da data novamente na tela
    document.getElementById(`pnome${id}`).innerHTML = textoDaTarefa;
    document.getElementById(`datatarefa${id}`).innerHTML = data;
    // removendo o input
    const input = document.getElementById(`inputeditar${id}`);
    input.parentNode.removeChild(input);
    // removendo imagem enviar
    const imgEn = document.getElementById(`imgbt${id}`);
    imgEn.parentNode.removeChild(imgEn);
    // removendo imagem cancelar
    const imgCan = document.getElementById(`imgCancela${id}`);
    imgCan.parentNode.removeChild(imgCan);
    // removendo botão enviar
    const bt = document.getElementById(`btenviar${id}`);
    bt.parentNode.removeChild(bt);
    // removendo botão cancelar
    const btCancel = document.getElementById(`btcancel${id}`);
    btCancel.parentNode.removeChild(btCancel);
}

//############################### $$ Enviar a tarefa editada $$ ###############################

function enviarTarefaEditada(id) {

    let campoTarefa = selectId(`inputeditar${id}`).value;

    let tarefas = {
        "description": campoTarefa,
        "completed": false
    }


    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefas)
    });

    promessa
        .then(function(Response) {
            console.log(Response["status"]);
            if (Response["status"] < 300) {
                selectId("legenda-tarefa").innerHTML = `Tarefa atualizada!😉`;
            } else if (Response["status"] > 500) {
                selectId("legenda-tarefa").innerHTML = `Erro no servidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
            }, 4000);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

//############################### $$ Recuperar as tarefas por ID $$ ###############################

// tratando campo vazio
function recuperarTarefa() {
    const inputId = selectId('idDaTarefa').value;
    if (inputId === '') {
        selectId("menssagemBusca").innerHTML = `O campo busca está vazio!`;
        setTimeout(function() {
            selectId("menssagemBusca").innerHTML = ``;
        }, 4000);
    } else {
        selectId('idDaTarefa').value = '';
        recuperarTarefaPorID(inputId);
    }


}

function recuperarTarefaPorID(id) {

    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');
    const promessa = fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json",
            authorization: token
        }
    });

    promessa
        .then(function(Response) {
            if (Response["status"] < 300) {
                selectId("menssagemBusca").innerHTML = `Tarefa localizada!😀`;
                sessionStorage.setItem("continua", "true");
            } else if (Response["status"] > 400 || Response["status"] < 500) {
                selectId("menssagemBusca").innerHTML = `Essa tarefa não existe!😯`;
                sessionStorage.setItem("continua", "false");
            } else if (Response["status"] > 500) {
                selectId("menssagemBusca").innerHTML = `Erro no servidor!😅`;
                sessionStorage.setItem("continua", "false");
            }
            return Response.json();
        })
        .then(function(retorno) {
            let continua = sessionStorage.getItem("continua");
            if (continua === "true") {

                // Formatando a data
                let dataCriacao = retorno.createdAt;
                dataCriacao = new Date();
                let dia = dataCriacao.getDate().toString().padStart(2, '0'),
                    mes = (dataCriacao.getMonth() + 1).toString().padStart(2, '0'),
                    ano = dataCriacao.getFullYear().toString().substr(-2);
                let dataFormatada = `Criada em: ${dia}/${mes}/${ano}`;

                // capturando a descricao da tarefa
                let descricao = retorno.description;
                // capturando o id da tarefa
                let idTarefa = retorno.id;

                // selecionando a div com a id skeleton
                let div = document.getElementById('resultadoBusca');
                // criando uma tag li
                let li = document.createElement("li");
                // atribuido a class tarefa na tag li
                li.classList.add("tarefa");
                // criando uma tag div
                let divDone = document.createElement("div");
                // atribuido a class not-done na tag div
                divDone.classList.add("not-done");
                // criando outra tag div
                let divDesc = document.createElement("div");
                // atribuido a class descricao na tag div
                divDesc.classList.add("descricao");
                //###########3 testando
                divDesc.setAttribute('id', `divbusca${idTarefa}`);
                // criando a tag p
                let pNome = document.createElement("p");
                // atribuido a class nome na tag p
                pNome.classList.add("nome");
                // add a descrição da tarefa na tag p
                let texDesc = document.createTextNode(descricao);
                pNome.appendChild(texDesc);
                pNome.setAttribute('id', `buscatexto${idTarefa}`);
                // criando a tag p
                let pTempo = document.createElement("p");

                // atribuido a class timestamp na tag p
                pTempo.classList.add("timestamp");
                pTempo.setAttribute('id', `databusca${idTarefa}`);
                // add a data da descricao na tag p
                let texdata = document.createTextNode(dataFormatada);
                pTempo.appendChild(texdata);

                // os botoes editar e deletar + classs + atributos
                let butaoDel = document.createElement("button");
                butaoDel.classList.add("buttons-tarefas");
                butaoDel.setAttribute('onclick', `deletarTarefaBusca(${idTarefa})`);

                let butaoEdit = document.createElement("button");
                butaoEdit.classList.add("buttons-tarefas");
                butaoEdit.setAttribute('onclick', `EditarTarefaBusca(${idTarefa})`);

                let imgDel = document.createElement("img");
                imgDel.classList.add("img-tarefas");
                imgDel.setAttribute('src', './assets/delete.svg');

                let imgEdit = document.createElement("img");
                imgEdit.classList.add("img-tarefas");
                imgEdit.setAttribute('src', './assets/editar.svg');


                // jogando tudo na tela
                divDesc.appendChild(pNome);
                divDesc.appendChild(pTempo);
                divDone.appendChild(divDesc);
                butaoDel.appendChild(imgDel);
                butaoEdit.appendChild(imgEdit);
                li.appendChild(divDone);
                li.appendChild(divDesc);
                li.appendChild(butaoDel);
                li.appendChild(butaoEdit);
                div.appendChild(li);

                setTimeout(function() {
                    // removendo a menssagem da tela
                    selectId("menssagemBusca").innerHTML = '';
                }, 4000);

            } else {
                setTimeout(function() {
                    // removendo a menssagem da tela
                    selectId("menssagemBusca").innerHTML = '';
                }, 4000);
            }

        })
        .catch(function(err) {
            console.log(err);
        });

}

function deletarTarefaBusca(id) {
    deletarTarefa(id);
}


function EditarTarefaCampoB(id) {

    // selecionando  a div que é criada a nova tarefa
    let div = selectId(`divbusca${id}`);
    // criando uma nova tag input
    let input = document.createElement("input");
    // atribuido uma id pata a nova tag input
    input.setAttribute('id', `input${id}`);
    // add estilo ao input
    input.classList.add("input-editar");
    // mostrando o input na tela
    div.appendChild(input);
    // capturando o texto da tarefa
    let valorTexto = document.getElementById(`pnome${id}`).innerText;

    // capturando os valores se cancelar
    let textoDaTarefab = selectId(`buscatexto${id}`).innerText;
    let datab = selectId(`databusca${id}`).innerText;

    // pra ter de onde tirar os dados 😑
    sessionStorage.setItem("datab", datab);
    sessionStorage.setItem("textob", textoDaTarefab);

    // escondendo o texto da tarefa e da data
    document.getElementById(`buscatexto${id}`).innerHTML = '';
    document.getElementById(`databusca${id}`).innerHTML = '';
    // jogando o texto da tarefa para dentro do input
    input.value = valorTexto;

    // criando um botão pra enviar a atualização pro servidor
    let bt = document.createElement("button");
    bt.setAttribute('onclick', `enviarTarefaEditadaBusca(${id})`);
    bt.setAttribute('id', `btenviarb${id}`);
    //add estilo ao input
    bt.classList.add("buttons-tarefas");

    // criando um botão cancelar a atualização
    let btCancel = document.createElement("button");
    btCancel.setAttribute('onclick', `cancelarEdicaoBusca(${id})`);
    btCancel.setAttribute('id', `btcancelb${id}`);
    //add estilo ao input
    btCancel.classList.add("buttons-tarefas");

    //############# Botão enviar edição
    // criando uma tag img
    let imgbt = document.createElement("img");
    // add estilo ao img
    imgbt.classList.add("img-tarefas");
    imgbt.setAttribute('src', './assets/send.png');
    imgbt.setAttribute('id', `imgbtb${id}`);
    imgbt.setAttribute('alt', 'Salvar edição');
    bt.appendChild(imgbt);
    // colocando o botão na tela
    div.appendChild(bt);

    //############# Botão cancelar edição
    // criando uma tag img
    let imgCancela = document.createElement("img");
    // add estilo ao img
    imgCancela.classList.add("img-tarefas-botoesx");
    imgCancela.setAttribute('src', './assets/fechar__imput.png');
    imgCancela.setAttribute('id', `imgCancelab${id}`);
    imgCancela.setAttribute('alt', 'Cancelar edição');
    btCancel.appendChild(imgCancela);
    // colocando o botão na tela
    div.appendChild(btCancel);

}

function EditarTarefaBusca(id) {
    EditarTarefaCampoB(id);
}

//############################### $$ Cancelar edição da tarefa Busca Id $$ ###############################

function cancelarEdicaoBusca(id) {
    let datab = sessionStorage.getItem("datab");
    let textoDaTarefab = sessionStorage.getItem("textob");
    // mostrando o texto da tarefa e da data novamente na tela
    document.getElementById(`buscatexto${id}`).innerHTML = textoDaTarefab;
    document.getElementById(`databusca${id}`).innerHTML = datab;
    // removendo o input
    const input = document.getElementById(`input${id}`);
    input.parentNode.removeChild(input);
    // removendo imagem enviar
    const imgEn = document.getElementById(`imgbtb${id}`);
    imgEn.parentNode.removeChild(imgEn);
    // removendo imagem cancelar
    const imgCan = document.getElementById(`imgCancelab${id}`);
    imgCan.parentNode.removeChild(imgCan);
    // removendo botão enviar
    const bt = document.getElementById(`btenviarb${id}`);
    bt.parentNode.removeChild(bt);
    // removendo botão cancelar
    const btCancel = document.getElementById(`btcancelb${id}`);
    btCancel.parentNode.removeChild(btCancel);
}


//############################### $$ Enviar a tarefa editada Busca Id $$ ###############################

function enviarTarefaEditadaBusca(id) {

    let campoTarefa = selectId(`input${id}`).value;
    let tarefas = {
        "description": campoTarefa,
        "completed": false
    }


    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefas)
    });

    promessa
        .then(function(Response) {
            console.log(Response["status"]);
            if (Response["status"] < 300) {
                selectId("menssagemBusca").innerHTML = `Tarefa atualizada!😉`;
            } else if (Response["status"] > 500) {
                selectId("menssagemBusca").innerHTML = `Erro no servidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            setTimeout(function() {
                selectId("menssagemBusca").innerHTML = '';
            }, 4000);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

function marcarTarefa(id) {
    let campoTarefa = selectId(`pnome${id}`).innerText;

    let tarefas = {
        "description": campoTarefa,
        "completed": true
    }


    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefas)
    });

    promessa
        .then(function(Response) {
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

function desMarcarTarefa(id) {
    let campoTarefa = selectId(`pnome${id}`).innerText;

    let tarefas = {
        "description": campoTarefa,
        "completed": false
    }


    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            authorization: token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefas)
    });

    promessa
        .then(function(Response) {
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

function deslogar() {

    // limpando por que acho digno
    sessionStorage.removeItem('dadosCadastro');
    sessionStorage.removeItem('datab');
    sessionStorage.removeItem('continua');
    sessionStorage.removeItem('tarefaExiste');
    sessionStorage.removeItem('textob');
    sessionStorage.removeItem('texto');
    sessionStorage.removeItem('data');
    // deslogando..
    localStorage.removeItem('token');
    // mandando pra tela de login
    window.location = 'index.html';
}