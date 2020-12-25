var tbody = document.querySelector('table tbody');
var usuario = {};
var IP_SERVIDOR = "localhost:51136";

$.getJSON("config/servidor.json", function(data) {
    IP_SERVIDOR = data.servidor;
});

function Cadastrar() {
        DadosCreate()
        $('#myModalCreate').modal('hide')
}

function CadastrarEdit() {
        DadosEdit()
        $('#myModalEdit').modal('hide')
}

function DadosCreate(){
    usuario.Id = document.querySelector('#usuarioId').value == "0" || document.querySelector('#usuarioId').value == "" ? 0 : parseInt(document.querySelector('#usuarioId').value);
    usuario.Login = document.querySelector('#usuarioLogin').value;
    usuario.Senha = document.querySelector('#usuarioSenha').value;
    usuario.PessoaId = document.querySelector('#cboPessoa').value;
    usuario.IsAdmin = Boolean(document.querySelector('#cboPerfil').value);

    if (usuario.PessoaId == 0) {
        window.alert('O nome é obrigatório');
        e.preventDefault();
    }

    if (usuario.Login == '') {
        window.alert('O login é obrigatório');
        e.preventDefault();
    }

    if (usuario.Senha == '') {
        window.alert('a senha é obrigatório');
        e.preventDefault();
    }

    if (usuario.Id === undefined || usuario.Id === 0) {
        SalvarUsuarios('POST', 0, usuario);
    }

    usuario = {};

    CarregarUsuarios();
}

function DadosEdit(){
    usuario.Login = document.querySelector('#usuarioLoginEdit').value;
    usuario.IsAdmin = document.querySelector('#cboPerfilEdit').value == "0" ? false : true;

    if(usuario.Id != undefined && usuario.Id > 0){
        SalvarUsuarios('PUT', usuario.Id, usuario);
    }

    usuario = {};

    CarregarUsuarios();
}

function NovoUsuario() {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#usuarioId').value = 0;
    document.querySelector('#usuarioLogin').value = '';
    document.querySelector('#usuarioSenha').value = '';
    document.querySelector('#cboPessoa').disabled = false;
    SelecionarOption('#cboPessoa', 0)
    SelecionarOption('#cboPerfil', 2)

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Usuário';

    $('#myModalCreate').modal('show')
}

function Cancelar() {
    LimparCriacao()
    $('#myModalCreate').modal('hide')
}

function CancelarEdit() {
    LimparEdicao()
    $('#myModalEdit').modal('hide')
}

function LimparCriacao(){
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#usuarioId').value = 0;
    document.querySelector('#usuarioLogin').value = '';
    document.querySelector('#usuarioSenha').value = '';
    SelecionarOption('#cboPessoa', 0)
    SelecionarOption('#cboPerfil', 0)

    pessoa = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Cadastrar Usuário';
}

function LimparEdicao(){
    document.querySelector('#usuarioIdEdit').value = 0;
    document.querySelector('#pessoaNomeEdit').value = '';
    document.querySelector('#usuarioLoginEdit').value = '';
    document.getElementById("cboPessoa").innerHTML = '';
    SelecionarOption('#cboPerfilEdit', 2)

    pessoa = {};
}

function CarregarUsuarios() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/usuario`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState== 4) {
            if (this.status== 200) {
                var usuarios = JSON.parse(this.responseText);
                for (var indice in usuarios) {
                    AdicionarLinhaTable(usuarios[indice]);
                }
            } else if (this.status== 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro);
            } else if (this.status== 401) {
                Logout()
            }
        }
    }

    xhr.send();
}

function SalvarUsuarios(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://${IP_SERVIDOR}/api/usuario/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(corpo));
}


function ExcluirUsuario(id) {
    var xhr = new XMLHttpRequest();

    xhr.open('DELETE', `http://${IP_SERVIDOR}/api/usuario/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onreadystatechange = function () {
        if (this.readyState== 4) {
            if (this.status== 200) {
                FecharModal();
            }
            else if (this.status== 403) {
                CallbackUsuarioSemPermissao()
            }
        }
    }

    xhr.send();
}

function Excluir(usuario) {
    bootbox.confirm({
        message: `Tem certeza que deseja excluir o usuário ${usuario.Login}`,
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
                ExcluirUsuario(usuario.Id);
                CarregarUsuarios();
            }
        }
    });
}

CarregarUsuarios();
BuscarPessoasSelectOption();

function EditarUsuario(usuarioA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#usuarioIdEdit').value = usuarioA.Id;
    document.querySelector('#pessoaNomeEdit').disabled = true;
    document.querySelector('#pessoaNomeEdit').value = usuarioA.Pessoa.Nome;
    document.querySelector('#usuarioLoginEdit').value = usuarioA.Login;
    SelecionarOption('#cboPerfilEdit', usuarioA.IsAdmin == false || usuarioA.IsAdmin == null ? 0 : 1)

    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Editar Usuario ${usuarioA.Login}`;

    usuario = usuarioA;
}

function AdicionarLinhaTable(usuarioA) {
    var perfil = usuarioA.IsAdmin ? "Administrador" : "Usuário";
    var trow = `<tr>
                   <td style="display: none;">${usuarioA.Id}</td>
                   <td>${usuarioA.Login}</td>
                   <td style="display: none;">${usuarioA.Senha}</td>
                   <td>${perfil}</td>
                   <td style="display: none;">${usuarioA.IsAdmin}</td>
                   <td>${usuarioA.Pessoa.Nome}</td>
                   <td style="display: none;">${usuarioA.PessoaId}</td>
                   <td>
                       <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModalEdit" onClick='EditarUsuario(${JSON.stringify(usuarioA)})'>Editar</button>
                       <button class="btn btn-danger botoes" onClick='Excluir(${JSON.stringify(usuarioA)})'>Excluir</button>
                   </td>
               </tr>
               `
    tbody.innerHTML += trow;
}

function Logout() {
    sessionStorage.removeItem('token');
    window.location.href = "login.html";
}

function FecharModal() {
    $('#myModal').modal('hide')
}

function CallbackUsuarioSemPermissao() {
    bootbox.confirm({
        message: `Usuário não possui permissão para excluir usuário`,
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

function BuscarPessoasSelectOption() {
    var pessoas_select = document.querySelector("#cboPessoa");

    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/pessoa/not-user`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));
    var p_options = document.createElement('option');
    p_options.setAttribute('value', 0)
    p_options.innerHTML = '';
    pessoas_select.appendChild(p_options);

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState== 4) {
            if (this.status== 200) {
                var pessoas = JSON.parse(this.responseText);
                for (var indice in pessoas) {
                    p_options = document.createElement('option');
                    p_options.setAttribute('value', pessoas[indice].Id)
                    p_options.innerHTML = pessoas[indice].Nome;
                    pessoas_select.appendChild(p_options);
                }
            }
        } else if (this.status== 500) {
            var erro = JSON.parse(this.responseText);
            console.log(erro);
        } else if (this.status== 401) {
            Logout()
        }
    }

    xhr.send();
}


function SelecionarOption(elementId, cod) {
    var elt = document.querySelector(elementId);
    var opt = elt.getElementsByTagName("option");
    for (var i = 0; i < opt.length; i++) {
        if (opt[i].value == cod) {
            elt.value = cod;
        }
    }
    return null;
}








