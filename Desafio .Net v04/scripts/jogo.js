
var tbody = document.querySelector('table tbody');
var jogo = {};

function Cadastrar() {
    jogo.Nome = document.querySelector('#nome').value;

    if (jogo.Id === undefined || jogo.Id === 0) {
        this.SalvarJogos('POST', 0, jogo);
    } else {
        this.SalvarJogos('PUT', jogo.Id, jogo);
    }

    jogo = {};

    this.CarregarJogos();

    $('#myModal').modal('hide')
}

function NovoJogo() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Jogo';

    $('#myModal').modal('show')
}

function Cancelar() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';

    jogo = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Jogo';

    $('#myModal').modal('hide')
}

function CarregarJogos() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://localhost:9010/api/jogo`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var jogos = JSON.parse(this.responseText);
                for (var indice in jogos) {
                    AdicionaLinha(jogos[indice]);
                }
            } else if (this.status == 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro);
            }else if (this.status == 401) {
                logout()
            }
        }
    }

    xhr.send();
}

function SalvarJogos(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://localhost:9010/api/jogo/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(corpo));
}


function ExcluirJogo(id) {
    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', `http://localhost:9010/api/jogo/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                FecharModal();
            } 
            else if (this.status == 403) {
                CallbackUsuarioSemPermissao()
            }
        }
    }

    xhr.send();
}

function Excluir(jogo) {
    bootbox.confirm({
        message: `Tem certeza que deseja excluir o jogo ${jogo.Nome}`,
        buttons: {
            confirm: {
                label: 'SIM',
                className: 'btn-success'
            },
            cancel: {
                label: 'NÃO',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                ExcluirJogo(jogo.Id);
                CarregarJogos();
            }
        }
    });
}


this.CarregarJogos();

function EditarJogo(jogoA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#jogoid').value = jogoA.Id;
    document.querySelector('#nome').value = jogoA.Nome;


    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Editar Jogo ${jogo.Nome}`;

    jogo = jogoA;
}

function AdicionaLinha(jogoA) {
    var trow = `<tr>
                    <td style="display: none;">${jogoA.Id}</td>
                    <td>${jogoA.Nome}</td>
                    <td>
                        <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='EditarJogo(${JSON.stringify(jogoA)})'>Editar</button>
                        <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(jogoA)})'>Excluir</button>
                    </td>
                </tr>
                `
    tbody.innerHTML += trow;
}

function logout() {
    sessionStorage.removeItem('token');
    window.location.href = "login.html";
  } 


  function FecharModal(){
    $('#myModal').modal('hide')
  }


  function CallbackUsuarioSemPermissao(){
    bootbox.confirm({
        message: `Usuário não possui permissão para excluir jogo`,
        buttons: {
            confirm: {
                label: 'Ok',
                className: 'btn-success'
            },
            cancel: {
                className: 'btn-danger visibility: hidden',
            }
        },
        callback: function (result) {
            if (result) {
                FecharModal();
            }
        }
    });
  }
