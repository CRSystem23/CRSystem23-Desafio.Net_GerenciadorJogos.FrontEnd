var tbody = document.querySelector('table tbody');
var controleEmprestimoJogo = {};

var IP_SERVIDOR = "localhost:9010";

$.getJSON("config/servidor.json", function (data) {
    IP_SERVIDOR = data.servidor;
});

function Cadastrar() {
    controleEmprestimoJogo.Id = document.querySelector('#controleId').value == "0" || document.querySelector('#controleId').value == "" ? 0 : parseInt(document.querySelector('#controleId').value);
    controleEmprestimoJogo.PessoaId = parseInt(document.querySelector('#cboPessoa').value);
    controleEmprestimoJogo.JogoId = parseInt(document.querySelector('#jogoId').value);
    controleEmprestimoJogo.DataEmprestimo = document.querySelector('#dataEmprestimo').value;
    controleEmprestimoJogo.DataDevolucao = document.querySelector('#dataDevolucao').value;

    if (controleEmprestimoJogo.Id === undefined || 
        controleEmprestimoJogo.Id === 0 || 
        controleEmprestimoJogo.Id === '0' ||
        controleEmprestimoJogo.Id === '') {

        this.SalvarControleJogos('POST', 0, controleEmprestimoJogo);
    } 
    else 
    {
        this.SalvarControleJogos('PUT', controleEmprestimoJogo.Id, controleEmprestimoJogo);
    }

    controleEmprestimoJogo = {};

    this.CarregarControleEmprestimos();
    this.Limpar();
    $('#myModal').modal('hide')
}

function Limpar(){
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#controleId').value = 0;
    document.querySelector('#pessoaId').value = 0;
    SelecionarOption('#cboPessoa', 0);
    document.querySelector('#jogoId').value = 0;
    document.querySelector('#jogoNome').value = '';
    document.querySelector('#dataEmprestimo').value = '';
    document.querySelector('#dataDevolucao').value = '';

    controleEmprestimoJogo = {};

    btnSalvar.textContent = 'Cadastrar';
    tituloModal.textContent = 'Emprestar/Receber Jogo';

    $('#myModal').modal('hide')
}

function Cancelar() {
    this.Limpar();
}

function CarregarControleEmprestimos() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/controleemprestimojogo`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var controleEmprestimoJogos = JSON.parse(this.responseText);
                for (var indice in controleEmprestimoJogos) {
                    AdicionaLinha(controleEmprestimoJogos[indice]);
                }
            } else if (this.status == 500) {
                var erro = JSON.parse(this.responseText);
                console.log(erro);
            }
        }
    }

    xhr.send();
}

function SalvarControleJogos(metodo, id, corpo) {
    var xhr = new XMLHttpRequest();

    if (id === undefined || id === 0)
        id = '';

    xhr.open(metodo, `http://${IP_SERVIDOR}/api/controleemprestimojogo/${id}`, false);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.setRequestHeader('content-type', 'application/json');

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                window.alert('Salvo com sucesso!');
                e.preventDefault();
            } else{
                var erro = JSON.parse(this.responseText);
                window.alert(erro);
                e.preventDefault();
            }
        }
    }

    xhr.send(JSON.stringify(corpo));
}

this.CarregarControleEmprestimos();
this.BuscarPessoasSelectOption();

function ReceberJogoEmprestado(controleEmprestimoJogoA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#controleId').value = controleEmprestimoJogoA.Id;
    document.querySelector('#pessoaId').value = controleEmprestimoJogoA.PessoaId;
    SelecionarOption('#cboPessoa', controleEmprestimoJogoA.PessoaId);
    document.querySelector('#jogoId').value = controleEmprestimoJogoA.JogoId;
    document.querySelector('#jogoNome').value = controleEmprestimoJogoA.JogoNome;
    document.querySelector('#jogoNome').disabled = true;

    if (controleEmprestimoJogoA.DataEmprestimo === undefined || controleEmprestimoJogoA.DataEmprestimo == null) {
        document.querySelector('#dataEmprestimo').value = ''
    } else {
        document.querySelector('#dataEmprestimo').value = controleEmprestimoJogoA.DataEmprestimo.substr(0, 10);
    }

    document.querySelector('#dataEmprestimo').disabled = true;
    document.querySelector('#dataDevolucao').disabled = false;
    document.querySelector('#cboPessoa').disabled = true;

    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Informar Recebimento do jogo ${controleEmprestimoJogoA.JogoNome}`;

    controleEmprestimoJogo = controleEmprestimoJogoA;
}

function EmprestarJogo(controleEmprestimoJogoA) {
    var btnSalvar = document.querySelector('#btnSalvar');
    var tituloModal = document.querySelector('#tituloModal');

    document.querySelector('#dataDevolucao').value = '';
    document.querySelector('#controleId').value = '';
    document.querySelector('#jogoId').value =  controleEmprestimoJogoA.JogoId
    document.querySelector('#pessoaNome').value = controleEmprestimoJogoA.PessoaNome;
    document.querySelector('#jogoNome').value = controleEmprestimoJogoA.JogoNome;
    document.querySelector('#jogoNome').disabled = true;

    if (controleEmprestimoJogoA.DataEmprestimo === undefined || controleEmprestimoJogoA.DataEmprestimo == null) {
        document.querySelector('#dataEmprestimo').value = ''
    } else {
        document.querySelector('#dataEmprestimo').value = controleEmprestimoJogoA.DataEmprestimo.substr(0, 10);
    }

    document.querySelector('#cboPessoa').disabled = false;
    document.querySelector('#dataEmprestimo').disabled = false;
    document.querySelector('#dataDevolucao').disabled = true;

    btnSalvar.textContent = 'Salvar';
    tituloModal.textContent = `Empréstimo do Jogo ${controleEmprestimoJogoA.JogoNome}`;

    controleEmprestimoJogo = controleEmprestimoJogoA;

}

function AdicionaLinha(controleEmprestimojogoA) {
    var trow = `<tr>
                    <td style="display: none;">${controleEmprestimojogoA.Id}</td>
                    <td>${controleEmprestimojogoA.JogoNome}</td>
                    <td>${controleEmprestimojogoA.PessoaNome}</td>
                    <td>${controleEmprestimojogoA.DataEmprestimo == null || controleEmprestimojogoA.DataDevolucao != null ? 'Disponivel' : 'Emprestado'}</td>
                    <td>${controleEmprestimojogoA.DataEmprestimo == null ? '' : controleEmprestimojogoA.DataEmprestimo}</td>
                    <td>${controleEmprestimojogoA.DataDevolucao == null ? '' : controleEmprestimojogoA.DataDevolucao}</td>
                    <td style="display: none;">${controleEmprestimojogoA.PessoaId}</td>
                    <td style="display: none;">${controleEmprestimojogoA.JogoId}</td>
                    
                    ${controleEmprestimojogoA.DataEmprestimo == null && controleEmprestimojogoA.DataDevolucao == null ?
            `<td>
                            <button disabled class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='ReceberJogoEmprestado(${JSON.stringify(controleEmprestimojogoA)})'>Receber</button> 
                            <button class="btn btn-danger botoes" data-toggle="modal" data-target="#myModal" onClick='EmprestarJogo(${JSON.stringify(controleEmprestimojogoA)})'>Emprestar</button> 
                        </td>` :
            `<td>
                            <button class="btn btn-info botoes" data-toggle="modal" data-target="#myModal" onClick='ReceberJogoEmprestado(${JSON.stringify(controleEmprestimojogoA)})'>Receber</button> 
                            <button disabled class="btn btn-danger botoes" data-toggle="modal" data-target="#myModal" onClick='EmprestarJogo(${JSON.stringify(controleEmprestimojogoA)})'>Emprestar</button> 
                        </td>`
        }
                </tr>
                `
    tbody.innerHTML += trow;
}

function BuscarPessoasSelectOption() {
    var pessoas_select = document.querySelector("#cboPessoa");

    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/pessoa`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));
    var p_options = document.createElement('option');
    p_options.setAttribute('value', 0)
    p_options.innerHTML = '';
    pessoas_select.appendChild(p_options);

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var pessoas = JSON.parse(this.responseText);
                for (var indice in pessoas) {
                    p_options = document.createElement('option');
                    p_options.setAttribute('value', pessoas[indice].Id)
                    p_options.innerHTML = pessoas[indice].Nome;
                    pessoas_select.appendChild(p_options);
                }
            }
        } else if (this.status == 500) {
            var erro = JSON.parse(this.responseText);
            console.log(erro);
        } else if (this.status == 401) {
            logout()
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
