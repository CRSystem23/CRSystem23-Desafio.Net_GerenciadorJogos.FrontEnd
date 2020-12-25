var tbody = document.querySelector('table tbody');
var pessoa = {};

var IP_SERVIDOR = "localhost:9010";

$.getJSON("config/servidor.json", function(data) {
    IP_SERVIDOR = data.servidor;
});

function Cadastrar() {
    pessoa.Id = document.querySelector('#pessoaId').value == "0" || document.querySelector('#pessoaId').value == "" ? 0 : parseInt(document.querySelector('#pessoaId').value);
    pessoa.Nome = document.querySelector('#nome').value;
    pessoa.Apelido = document.querySelector('#apelido').value;
    pessoa.Endereco = document.querySelector('#endereco').value;
    pessoa.Celular = document.querySelector('#celular').value;
    pessoa.Email = document.querySelector('#email').value;

    if (pessoa.Nome == '') {
        window.alert('O nome é obrigatório');
        e.preventDefault();
    }

    if (pessoa.Endereco == '') {
        window.alert('O endereço é obrigatório');
        e.preventDefault();
    }


    if (pessoa.Id === undefined || pessoa.Id === 0) {
        this.SalvarPessoas('POST', 0, pessoa);
    } else {
        this.SalvarPessoas('PUT', pessoa.Id, pessoa);
    }

    pessoa = {};

    this.CarregarPessoas();

    $('#myModal').modal('hide')
}

function NovaPessoa() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';
    document.querySelector('#apelido').value = '';
    document.querySelector('#endereco').value = '';
    document.querySelector('#celular').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#pessoaId').value = 0;

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Pessoa';

    $('#myModal').modal('show')
}

function Cancelar() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';
    document.querySelector('#apelido').value = '';
    document.querySelector('#endereco').value = '';
    document.querySelector('#celular').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#pessoaId').value = 0;
    

    pessoa = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Pessoa';

    $('#myModal').modal('hide')
}

function CarregarPessoas() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/pessoa`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var pessoas = JSON.parse(this.responseText);
                for (var indice in pessoas) {
                    AdicionarLinhaTable(pessoas[indice]);
                }
            } else if (this.status == 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro);
            }else if (this.status == 401) {
                this.Logout()
            }
        }
    }

    xhr.send();
}

function SalvarPessoas(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://${IP_SERVIDOR}/api/pessoa/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(corpo));
}


function ExcluirPessoa(id) {
    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', `http://${IP_SERVIDOR}/api/pessoa/${id}`, false);
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

function Excluir(pessoa) {
    bootbox.confirm({
        message: `Tem certeza que deseja excluir o pessoa ${pessoa.Nome}`,
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
                this.ExcluirPessoa(pessoa.Id);
                this.CarregarPessoas();
            }
        }
    });
}


this.CarregarPessoas();

function EditarPessoa(pessoaA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = pessoaA.Nome;
    document.querySelector('#apelido').value = pessoaA.Apelido;
    document.querySelector('#endereco').value = pessoaA.Endereco;
    document.querySelector('#celular').value = pessoaA.Celular;
    document.querySelector('#email').value = pessoaA.Email;
    document.querySelector('#pessoaId').value = pessoaA.Id;


    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Editar Pessoa "${pessoaA.Nome}"`;

    pessoa = pessoaA;
}

function AdicionarLinhaTable(pessoaA) {
    var trow = `<tr>
                    <td>${pessoaA.Nome}</td>
                    <td>${pessoaA.Apelido}</td>
                    <td>${pessoaA.Endereco}</td>
                    <td>${pessoaA.Celular}</td>
                    <td>${pessoaA.Email}</td>
                    <td style="display: none;">${pessoaA.Id}</td>
                    <td>
                        <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='EditarPessoa(${JSON.stringify(pessoaA)})'>Editar</button>
                        <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(pessoaA)})'>Excluir</button>
                    </td>
                </tr>
                `
    tbody.innerHTML += trow;
}

function Logout() {
    sessionStorage.removeItem('token');
    window.location.href = "login.html";
  } 


  function FecharModal(){
    $('#myModal').modal('hide')
  }


  function CallbackUsuarioSemPermissao(){
    bootbox.confirm({
        message: `Usuário não possui permissão para excluir pessoa`,
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

  
  
  
  
  
  
  
  
  
  