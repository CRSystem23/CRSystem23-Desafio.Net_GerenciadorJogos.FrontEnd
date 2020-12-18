
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

    this.CarregarControleEmprestimos();

    $('#myModal').modal('show')
}

function NovoAluno() {
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

    aluno = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Jogo';

    $('#myModal').modal('hide')
}

function CarregarControleEmprestimos() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://localhost:9010/api/controleemprestimojogo`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var controleemprestimojogos = JSON.parse(this.responseText);
                for (var indice in controleemprestimojogos) {
                    AdicionaLinha(controleemprestimojogos[indice]);
                }
            } else if (this.status == 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro);
            }
        }
    }

    xhr.send();
}

function SalvarJogos(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://localhost:9010/api/controleemprestimojogo/`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(corpo));
}


function ExcluirControleEmprestimo(id) {
    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', `http://localhost:9010/api/controleemprestimojogo/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.send();
}

function Excluir(controleemprestimojogo) {
    bootbox.confirm({
        message: `Tem certeza que deseja excluir o estudante ${controleemprestimojogo.Nome}`,
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
                ExcluirControleEmprestimo(controleemprestimojogo.Id);
                CarregarControleEmprestimos();
            }
        }
    });
}


this.CarregarControleEmprestimos();

function EditarControleEmprestimo(controleemprestimojogo) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = controleemprestimojogo.Nome;


    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Editar Jogo ${controleemprestimojogo.Nome}`;

    controleemprestimojogo = controleemprestimojogo;
}

function AdicionaLinha(controleemprestimojogo) {
    var trow = `<tr>
                    <td>${controleemprestimojogo.JogoNome}</td>
                    <td>${controleemprestimojogo.PessoaNome}</td>
                    <td>${controleemprestimojogo.DataEmprestimo == null || controleemprestimojogo.DataDevolucao != null ? 'Disponivel' : 'Emprestado'}</td>
                    <td>${controleemprestimojogo.DataEmprestimo}</td>
                    <td>${controleemprestimojogo.DataDevolucao == null ? '' : controleemprestimojogo.DataDevolucao}</td>
                    <td>
                        <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='EditarControleEmprestimo(${JSON.stringify(controleemprestimojogo)})'>Editar</button>
                        <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(controleemprestimojogo)})'>Excluir</button>
                    </td>
                </tr>
                `
    tbody.innerHTML += trow;
}
