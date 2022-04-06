function selectId(id) {
    return document.getElementById(id);
}

//############################### $$ Preenchendo o nome do usuário $$ ###############################

// Carregar os dados
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
            // //Sentando os dados do usuario da parte superior da pagina
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
    console.log(tarefa);

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
                    selectId("legenda-tarefa").innerHTML = `Tarefa cadastrado com sucesso!🤩`;
                } else if (Response["status"] < 401) {
                    selectId("legenda-tarefa").innerHTML = `Primeiro preencha o campo a baixo!🙄`;
                } else if (Response["status"] === 401) {
                    selectId("legenda-tarefa").innerHTML = `Não autorizado!👀`;
                } else if (Response["status"] > 500) {
                    selectId("legenda-tarefa").innerHTML = `Tarefa não cadastrada!😅`;
                }
                return Response.json();
            })
            .then(function(respos) {
                console.log(respos);
                setTimeout(function() {
                    selectId("legenda-tarefa").innerHTML = '';
                }, 5000);

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
                selectId("legenda-tarefa").innerHTML = `Carregando as tarefas..`;
            } else if (Response["status"] === 401) {
                selectId("legenda-tarefa").innerHTML = `Erro de autorização!🙄`;
            } else if (Response["status"] > 500) {
                selectId("legenda-tarefa").innerHTML = `Erro ao recuperar as tarefas!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);
            const arrayTarefas = retorno;

            arrayTarefas.forEach(function(element) {

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
                // criando outra tag div
                let divDesc = document.createElement("div");
                // atribuido a class descricao na tag div
                divDesc.classList.add("descricao");
                // criando a tag p
                let pNome = document.createElement("p");
                // atribuido a class nome na tag p
                pNome.classList.add("nome");
                // add a descrição da tarefa na tag p
                let texDesc = document.createTextNode(descricao);
                pNome.appendChild(texDesc);
                // criando a tag p
                let pTempo = document.createElement("p");
                // atribuido a class timestamp na tag p
                pTempo.classList.add("timestamp");
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
                divDone.appendChild(divDesc);
                butaoDel.appendChild(imgDel);
                butaoEdit.appendChild(imgEdit);
                li.appendChild(divDone);
                li.appendChild(divDesc);
                li.appendChild(butaoDel);
                li.appendChild(butaoEdit);
                div.appendChild(li);


            })

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
                // removendo o efeito de tarefas carregando
                selectId("skeleton").classList.remove("skeleton");

            }, 5000);

        })
        .catch(function(err) {
            console.log(err);
        });

}

//############################### $$ Deletar as tarefas $$ ###############################
function deletarTarefa(id) {


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
                selectId("legenda-tarefa").innerHTML = `Erro no srvidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
            }, 5000);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}

function EditarTarefa(id) {


    const url = `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`;
    const token = localStorage.getItem('token');

    const promessa = fetch(url, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            authorization: token,
            "Content-Type": "application/json"
        }
    });

    promessa
        .then(function(Response) {
            console.log(Response["status"]);
            if (Response["status"] < 300) {
                selectId("legenda-tarefa").innerHTML = `Tarefa atualizada 😚`;
            } else if (Response["status"] > 500) {
                selectId("legenda-tarefa").innerHTML = `Erro no srvidor!😅`;
            }
            return Response.json();
        })
        .then(function(retorno) {
            console.log(retorno);

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
            }, 5000);

            //atualizando as tarefas
            location.reload();

        })
        .catch(function(err) {
            console.log(err);
        });
}