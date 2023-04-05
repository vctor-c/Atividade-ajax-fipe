const motos = document.querySelector("#motos")
const caminhoes = document.querySelector("#caminhoes")
const carros = document.querySelector("#carros")
const selectMarcasVeiculos = document.querySelector("#vehicles_brand")
const selectModelosVeiculos = document.querySelector("#vehicles_model")
const selectAnoVeiculos = document.querySelector("#vehicles_year")
const tiposContainer = document.querySelector("#vehicles_types")
const tiposVeiculos = tiposContainer.getElementsByTagName("li")
const btnBuscar = document.querySelector("#btnSearch")
const modal = document.querySelector("#modal")
const dadosContainer = document.querySelector(".vehicle_data")
const mesReferencia = dadosContainer.getElementsByClassName('reference_month')[0].getElementsByTagName("span")
const codigoFipe = dadosContainer.getElementsByClassName('fipe_code')[0].getElementsByTagName("span")
const marcaVeiculo = dadosContainer.getElementsByClassName('brand')[0].getElementsByTagName("span")
const anoVeiculo = dadosContainer.getElementsByClassName('year')[0].getElementsByTagName("span")
const precoMedio = document.getElementsByClassName('price')
var ultimoTipo = ""
var ultimaMarca = ""
var ultimoModelo = ""
const baseUrl = "https://parallelum.com.br/fipe/api/v2/"
var endpointMarcas = ""
var endpointModelo = ""
var endpointAnos = ""
var endpointDados = ""

selecionarTipo()
// A função recebe um argumento "novoTipo", que será usado para construir o endpoint para a requisição de API
function getMarcasPorTipo(novoTipo) {

    if (ultimoTipo != novoTipo) {

        resetCampos()

        selectMarcasVeiculos.innerHTML = ""

        var opcao = document.createElement("option")
        opcao.text = "Marca"
        selectMarcasVeiculos.add(opcao)

        endpointMarcas = baseUrl + novoTipo + "/brands/"

        fetch(endpointMarcas)
            .then((response) => response.json())
            .then((data) => {
                data.map((marca) => {
                    var opcao = document.createElement("option")
                    opcao.text = marca.name
                    opcao.value = marca.code
                    selectMarcasVeiculos.add(opcao)
                })
                selectMarcasVeiculos.removeAttribute("disabled")
                ultimoTipo = novoTipo
            })
    }
}


// Função para obter o modelo do veículo com base na marca selecionada
function getModeloPorMarca() {

    let novaMarca = selectMarcasVeiculos.value

    if (ultimaMarca != novaMarca) {

        selectModelosVeiculos.innerHTML = ""
        selectAnoVeiculos.innerHTML = ""

        selectAnoVeiculos.setAttribute("disabled", "disabled")
        btnBuscar.classList.add("hide")
        btnBuscar.classList.remove("search_button_show")

        var opcao = document.createElement("option")
        opcao.text = "Modelo"
        selectModelosVeiculos.add(opcao)

        endpointModelo = endpointMarcas + novaMarca + "/models/"

        fetch(endpointModelo)
            .then((response) => response.json())
            .then((data) => {
                data.map((modelos) => {
                    var opcao = document.createElement("option")
                    opcao.text = modelos.name
                    opcao.value = modelos.code
                    selectModelosVeiculos.add(opcao)
                })
                selectModelosVeiculos.removeAttribute("disabled")
                ultimaMarca = novaMarca
            })
    }
}

// Função para obter o ano do veículo com base no modelo selecionado
function getAnoPorModelo() {

    let novoModelo = selectModelosVeiculos.value

    if (ultimoModelo != novoModelo) {

        selectAnoVeiculos.innerHTML = ""
        btnBuscar.classList.add("hide")
        btnBuscar.classList.remove("search_button_show")

        var opcao = document.createElement("option")
        opcao.text = "Ano"
        selectAnoVeiculos.add(opcao)

        endpointAnos = endpointModelo + novoModelo + "/years/"

        fetch(endpointAnos)
            .then((response) => response.json())
            .then((data) => {
                data.map((anos) => {
                    var opcao = document.createElement("option")
                    opcao.text = anos.name
                    opcao.value = anos.code
                    selectAnoVeiculos.add(opcao)
                })
                selectAnoVeiculos.removeAttribute("disabled")
                ultimoModelo = novoModelo
            })
    }
}

//faz um loop por todos os tipos, ativa o selecionado e desativa os outros
function selecionarTipo(){
for (let i = 0; i < tiposVeiculos.length; i++) {
    tiposVeiculos[i].addEventListener("click", function () {
        var veiculoAtual = document.getElementsByClassName("active")

        if (veiculoAtual.length > 0) {
            veiculoAtual[0].className = veiculoAtual[0].className.replace(" active", "");
        }

        this.className += " active"
        getMarcasPorTipo(veiculoAtual[0].id)

    })
}
}

//Habilita botao de buscar
function habilitaBuscar() {
    btnBuscar.classList.remove("hide")
    btnBuscar.classList.add("search_button_show")
    btnBuscar.setAttribute("onclick", "revelaModal()")
}

//Preenche o modal com os dados do veiculo e remove o hide
function revelaModal() {
    var novoAno = selectAnoVeiculos.value

    endpointDados = endpointAnos + novoAno + "/"
    fetch(endpointDados)
        .then((response) => response.json())
        .then((data) => { // Por algum motivo essa resposta da API, quando transferido para outra varivel, e utilizado a função .map, é retornado um erro. 
            mesReferencia[0].innerHTML = data.referenceMonth
            codigoFipe[0].innerHTML = data.codeFipe
            marcaVeiculo[0].innerHTML = data.brand
            anoVeiculo[0].innerHTML = data.modelYear
            precoMedio[0].innerHTML = data.price
            modal.classList.remove("hide_modal")
        }

        )
}

function escondeModal() {
    modal.classList.add("hide_modal")
}

// reinicia os campos caso haja a troca de tipo
function resetCampos() {
    selectModelosVeiculos.innerHTML = ""
    selectModelosVeiculos.setAttribute("disabled", "disabled")
    selectAnoVeiculos.innerHTML = ""
    selectAnoVeiculos.setAttribute("disabled", "disabled")
    endpointModelo = ""
    endpointAnos = ""
    endpointDados = ""
    btnBuscar.classList.add("hide")
    btnBuscar.classList.remove("search_button_show")
}
