(() => {
    if (sessionStorage.getItem('token') != null) {
        window.location.href = "index.html";
    }
})()

var login = function () {
    event.preventDefault();
    var login = document.querySelector('#email');
    var senha = document.querySelector('#password');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:9010/api/usuario/logar/${login.value}/${senha.value}`, true);
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

    xhr.open(`GET`, `http://localhost:9010/api/ControleEmprestimoJogo`, true);
    xhr.setRequestHeader('Authorization', 'bearer ' + sessionStorage.getItem('token'));

    xhr.onerror = function () {
        console.log('ERRO', xhr.readyState);
    }

    xhr.onreadystatechange = function () {
        var result = this.responseText;
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