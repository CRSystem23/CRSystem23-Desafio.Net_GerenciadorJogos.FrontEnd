(() => {
    if (sessionStorage.getItem('token') != null) {
        window.location.href = "index.html";
    }
})()

var IP_SERVIDOR = "localhost:51136";

$.getJSON("config/servidor.json", function(data) {
    IP_SERVIDOR = data.servidor;
});

var login = function () {
    event.preventDefault();
    var login = document.querySelector('#email');
    var senha = document.querySelector('#password');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://${IP_SERVIDOR}/api/usuario/logar/${login.value}/${senha.value}`, true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var resultado = JSON.parse(this.responseText);
                if(resultado.mensagem == "Ok"){
                    sessionStorage.setItem('token', `${resultado.token}`);
                    sessionStorage.setItem('username', `${login.value}`);
                    verificar();
                }
            } else if (this.status == 404) {
                FalhaLogin()
            }
        }
    }
    xhr.send();
}

var verificar = function () {
    var xhr = new XMLHttpRequest();

    xhr.open(`GET`, `http://${IP_SERVIDOR}/api/ControleEmprestimoJogo`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        window.location.href = 'index.html';
    }

    xhr.send();
}

function FalhaLogin() {
    var btnOk = document.querySelector('#btnOk');
    var tituloModal = document.querySelector('#tituloModal');

    btnOk.textContent = 'Ok';
    tituloModal.textContent = 'Falha Login';

    $('#myModal').modal('show')
}


function FecharModalFalhaLogin() {
    $('#myModal').modal('hide')
}