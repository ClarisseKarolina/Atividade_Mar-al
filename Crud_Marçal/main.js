'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Remedio')) ?? [ ]
const setLocalStorage = (dbRemedio) => localStorage.setItem("db_Remedio", JSON.stringify(dbRemedio))

//Crud aqui - Create, Read, Update, Delete
const deleteRemedio = (index) =>{
    const dbRemedio = readRemedio()
    dbRemedio.splice(index, 1)
    setLocalStorage(dbRemedio)
}

const updateRemedio = (index, Remedio) => {
    const dbRemedio = readRemedio()
    dbRemedio[index] = Remedio
    setLocalStorage(dbRemedio)
}

const readRemedio = () => getLocalStorage()

const createRemedio = (Remedio) => {
    const dbRemedio = getLocalStorage()
    dbRemedio.push (Remedio)
    setLocalStorage(dbRemedio)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o usuário

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nomedoMedicamento').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Remedio'
}

const saveRemedio = () => {
    if (isValidFields()) {
        const Remedio = {
            nomeDoMedicamento: document.getElementById('nomeDoMedicamento').value,
            SacheOuCapsula: document.getElementById ('SacheOuCapsula').value,
            Gramas: document.getElementById('Gramas').value,
            GramasTotal: document.getElementById(' GramasTotal').value,
            CRF: document.getElementById('CRF')
        }
        const index = document.getElementById('nomeDoMedicamento').dataset.index
        if(index == 'new'){
            createRemedio(Remedio)
            updateTable()
            closeModal()
        }else{
            updateRemedio(index, Remedio)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (Remedio, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${Remedio.nomeDoMedicamento}</td>
        <td>${Remedio.SacheOuCapsula}</td>
        <td>${Remedio.Gramas}</td>
        <td>${Remedio.GramasTotal}</td>
        <td>${Remedio.CRF}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}" >Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableRemedio>tbody').appendChild(newRow)
}
const clearTable = () => {
    const rows = document.querySelectorAll('#tableRemedio>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const updateTable = () => {
    const dbRemedio = readRemedio()
    clearTable()
    dbRemedio.forEach(createRow)
}
const fillFields = (Remedio) => {
    document.getElementById('nomeDoMedicamento').value = Remedio.nomeDoMedicamento
    document.getElementById('SacheOuCapsula').value = Remedio.SacheOuCapsula
    document.getElementById('Gramas').value = Remedio.Gramas
    document.getElementById('GramasTotal').value = Remedio.GramasTotal
    document.getElementById('CRF').value = Remedio.CRF
    document.getElementById('nomeDoMedicamento').dataset.index = Remedio.index
}

const editRemedio = (index) => {
    const Remedio = readRemedio()[index]
    Remedio.index = index
    fillFields(Remedio)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${Remedio.nomeDoMedicamento}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit'){
            editRemedio(index)
        }else{
            const Remedio = readRemedio()[index]
            const response = confirm(`Deseja realmente excluir? ${Remedio.nomeDoMedicamento}`)
            if (response) {
                deleteRemedio(index)
                updateTable()
            }  
        }
    }
}

updateTable()

 //Eventos a partir daqui
document.getElementById('cadastrarRemedio')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveRemedio)

document.querySelector('#tableRemedio>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
