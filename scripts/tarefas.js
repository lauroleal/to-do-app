function selectId(id) {
    return document.getElementById(id);
}

//######################## Preenchendo o nome do usuário

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
}

// chamando a função pra recuperar os dados
carregarDados();

// Nova tarefas
let form = document.querySelector("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const novaTarefa = selectId("novaTarea").value;
    console.log(novaTarefa);
    const tarefa = {
        description: novaTarefa,
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
        body: JSON.stringify(tarefa)
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
})

// Recuperar as tarefas
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

                let status = element.completed;
                let dataCriacao = element.createdAt;
                let descricao = element.description;
                let idTarefa = element.id;
                console.log(status, dataCriacao, descricao, idTarefa);
                let ul = document.querySelector('tarefas-pendentes');

            })

            setTimeout(function() {
                selectId("legenda-tarefa").innerHTML = '';
            }, 5000);

        })
        .catch(function(err) {
            console.log(err);
        });

}