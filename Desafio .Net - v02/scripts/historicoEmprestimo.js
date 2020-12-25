var tbody = document.querySelector('table tbody');
var controleEmprestimoJogo = {};

var IP_SERVIDOR = "localhost:9010";

$.getJSON("config/servidor.json", function (data) {
    IP_SERVIDOR = data.servidor;
});

function CarregarControleEmprestimos() {
    tbody.innerHTML = '';
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/controleemprestimojogo/SelecionarTodos`, true);
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



this.CarregarControleEmprestimos();


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
                </tr>
                `
    tbody.innerHTML += trow;
}
