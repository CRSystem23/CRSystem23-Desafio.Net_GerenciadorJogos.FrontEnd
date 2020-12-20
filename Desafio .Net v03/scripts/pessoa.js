  function BuscarPessoasSelectOption(){
     document.querySelector("#pessoa").innerHTML = 'Selecione';
     var pessoas_select = document.querySelector("#pessoa");

     var xhr = new XMLHttpRequest();

     xhr.open(`GET`, `http://localhost:9010/api/pessoa`, true);
     xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));
 
     xhr.onerror = function () {
         console.log('ERRO', xhr.readyState);
     }
 
     xhr.onreadystatechange = function () {
         if (this.readyState == 4) {
             if (this.status == 200) {
                 var pessoas = JSON.parse(this.responseText);
                 for (var indice in pessoas) {
                     var p_options = document.createElement('option');
                     p_options.setAttribute('value', pessoas[indice].Nome)
                     p_options.innerHTML = pessoas[indice].Nome;
                     pessoas_select.appendChild(p_options);
                  }
                 }
             } else if (this.status == 500) {
                 var erro = JSON.parse(this.responseText);
                 console.log(erro);
             }else if (this.status == 401) {
                 logout()
             }
         }
 
     xhr.send();
  }







  
var tbody = document.querySelector('table tbody');
var pessoa = {};

function Cadastrar() {
    pessoa.Nome = document.querySelector('#nome').value;

    if (pessoa.Id === undefined || pessoa.Id === 0) {
        this.SalvarPessoas('POST', 0, pessoa);
    } else {
        this.SalvarPessoas('PUT', pessoa.Id, pessoa);
    }

    pessoa = {};

    this.CarregarPessoas();

    $('#myModal').modal('hide')
}

function NovoJogo() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Pessoa';

    BuscarPessoasSelectOption()

    $('#myModal').modal('show')
}

function Cancelar() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#nome').value = '';

    pessoa = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Jogo';

    $('#myModal').modal('hide')
}

function CarregarPessoas() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://localhost:9010/api/pessoa`, true);
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
                logout()
            }
        }
    }

    xhr.send();
}

function SalvarPessoas(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://localhost:9010/api/pessoa/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(corpo));
}


function ExcluirJogo(id) {
    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', `http://localhost:9010/api/pessoa/${id}`, false);
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
                ExcluirJogo(pessoa.Id);
                CarregarPessoas();
            }
        }
    });
}


this.CarregarPessoas();

function EditarJogo(pessoaA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#pessoaid').value = pessoaA.Id;
    document.querySelector('#nome').value = pessoaA.Nome;


    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Editar Jogo ${pessoa.Nome}`;

    pessoa = pessoaA;
}

function AdicionarLinhaTable(pessoaA) {
    var trow = `<tr>
                    <td style="display: none;">${pessoaA.Id}</td>
                    <td>${pessoaA.Nome}</td>
                    <td>
                        <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='EditarJogo(${JSON.stringify(pessoaA)})'>Editar</button>
                        <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(pessoaA)})'>Excluir</button>
                    </td>
                </tr>
                `
    tbody.innerHTML += trow;
}

function AdicionaOption(pessoaA) {
    var trow = `<tr>
                    <td style="display: none;">${pessoaA.Id}</td>
                    <td>${pessoaA.Nome}</td>
                    <td>
                        <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='EditarJogo(${JSON.stringify(pessoaA)})'>Editar</button>
                        <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(pessoaA)})'>Excluir</button>
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

  
  
  
  
  
  
  
  
  
  