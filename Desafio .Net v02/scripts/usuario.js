// ESTE SERIA O CONTEÚDO DO .js
var json_cidades = {
    "estados": [
      {
        "sigla": "AC",
        "nome": "Acre",
        "cidades": [
          "Acrelândia",
          "Assis Brasil",
          "Brasiléia",
          "Bujari",
          "Capixaba",
          "Cruzeiro do Sul",
          "Epitaciolândia",
          "Feijó",
          "Jordão",
          "Mâncio Lima",
          "Manoel Urbano",
          "Marechal Thaumaturgo",
          "Plácido de Castro",
          "Porto Acre",
          "Porto Walter",
          "Rio Branco",
          "Rodrigues Alves",
          "Santa Rosa do Purus",
          "Sena Madureira",
          "Senador Guiomard",
          "Tarauacá",
          "Xapuri"
        ]
      },
      {
        "sigla": "AL",
        "nome": "Alagoas",
        "cidades": [
          "Água Branca",
          "Anadia",
          "Arapiraca",
          "Atalaia",
          "Barra de Santo Antônio",
          "Barra de São Miguel",
          "Batalha",
          "Belém",
          "Belo Monte",
          "Boca da Mata",
          "Branquinha",
          "Cacimbinhas",
          "Cajueiro",
          "Campestre",
          "Campo Alegre",
          "Campo Grande",
          "Canapi",
          "Capela",
          "Carneiros",
          "Chã Preta",
          "Coité do Nóia",
          "Colônia Leopoldina",
          "Coqueiro Seco",
          "Coruripe",
          "Craíbas",
          "Delmiro Gouveia",
          "Dois Riachos",
          "Estrela de Alagoas",
          "Feira Grande",
          "Feliz Deserto",
          "Flexeiras",
          "Girau do Ponciano",
          "Ibateguara",
          "Igaci",
          "Igreja Nova",
          "Inhapi",
          "Jacaré dos Homens",
          "Jacuípe",
          "Japaratinga",
          "Jaramataia",
          "Jequiá da Praia",
          "Joaquim Gomes",
          "Jundiá",
          "Junqueiro",
          "Lagoa da Canoa",
          "Limoeiro de Anadia",
          "Maceió",
          "Major Isidoro",
          "Mar Vermelho",
          "Maragogi",
          "Maravilha",
          "Marechal Deodoro",
          "Maribondo",
          "Mata Grande",
          "Matriz de Camaragibe",
          "Messias",
          "Minador do Negrão",
          "Monteirópolis",
          "Murici",
          "Novo Lino",
          "Olho d'Água das Flores",
          "Olho d'Água do Casado",
          "Olho d'Água Grande",
          "Olivença",
          "Ouro Branco",
          "Palestina",
          "Palmeira dos Índios",
          "Pão de Açúcar",
          "Pariconha",
          "Paripueira",
          "Passo de Camaragibe",
          "Paulo Jacinto",
          "Penedo",
          "Piaçabuçu",
          "Pilar",
          "Pindoba",
          "Piranhas",
          "Poço das Trincheiras",
          "Porto Calvo",
          "Porto de Pedras",
          "Porto Real do Colégio",
          "Quebrangulo",
          "Rio Largo",
          "Roteiro",
          "Santa Luzia do Norte",
          "Santana do Ipanema",
          "Santana do Mundaú",
          "São Brás",
          "São José da Laje",
          "São José da Tapera",
          "São Luís do Quitunde",
          "São Miguel dos Campos",
          "São Miguel dos Milagres",
          "São Sebastião",
          "Satuba",
          "Senador Rui Palmeira",
          "Tanque d'Arca",
          "Taquarana",
          "Teotônio Vilela",
          "Traipu",
          "União dos Palmares",
          "Viçosa"
        ]
      }
    ]
  };
  // FIM DO .js
  
  function buscaCidades(e){
     document.querySelector("#cidade").innerHTML = '';
     var cidade_select = document.querySelector("#cidade");
  
     var num_estados = json_cidades.estados.length;
     var j_index = -1;
  
     // aqui eu pego o index do Estado dentro do JSON
     for(var x=0;x<num_estados;x++){
        if(json_cidades.estados[x].sigla == e){
           j_index = x;
        }
     }
  
     if(j_index != -1){
    
        // aqui eu percorro todas as cidades e crio os OPTIONS
        json_cidades.estados[j_index].cidades.forEach(function(cidade){
           var cid_opts = document.createElement('option');
           cid_opts.setAttribute('value',cidade)
           cid_opts.innerHTML = cidade;
           cidade_select.appendChild(cid_opts);
        });
     }else{
        document.querySelector("#cidade").innerHTML = '';
     }
  }







  
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

  
  
  
  
  
  
  
  
  
  