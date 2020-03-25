
let btn1 = document.querySelector("#btn1");
let table = document.querySelector("#tb");
let nameInput = document.querySelector("#name");
let ageInput = document.querySelector("#age");
let nameInputModal = document.querySelector("#nameInputModal");
let ageInputModal = document.querySelector("#ageInputModal");
let idInputModal = document.querySelector("#idInputModal");
let editButtons
let  deleteButtons 
let modal;


function createTr(name, age,id)
{
    let tr = document.createElement('tr');
    tr.id = 'tr'+id;
    tr.innerHTML = `<tr>
                    <td>${name}</td>
                    <td>${age}</td>
                    <td>${id}</td>
                    <td>
                    <button id="edit-${id}" data-target="modal1" class="btn-floating waves-effect waves-light orange btn modal-trigger"><i class="material-icons">edit</i></button>
   
                    <button id="delete-${id}" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></button>
                    </td>
  
                    </tr>`;
    table.appendChild(tr)
}
async function sendreq(url,options=null){
    let result = await fetch(url, options)
    return result.json()
}

async function getUsers(){
    let res = await sendreq("/api/users");
    for(let i=0;i<res.length;i++)
    {
        createTr(res[i].name, res[i].age,res[i].id)
    }
}
async function getUser(id){
    let res = await sendreq("/api/user/"+id); 
    return res  
}
async function editUserReq(name, age, id){
    let res = await sendreq("/api/users", {
        method:"PUT",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body:JSON.stringify({
            name:name,
            age:age,
            id:id
        })
    })
    table.innerHTML='';
    await getUsers()
    buttons()
    return res

}

async function createUser(){
    let name = nameInput.value;
    let age = ageInput.value;
    let res = await sendreq("/api/createUser",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body:JSON.stringify({
            name:name,
            age:age
        })
    })
    nameInput.value='';
    ageInput.value='';
    createTr(res.name, res.age, res.id)
    buttons()
}
async function deleteUser(e)
{
    let delId = e.target.offsetParent.id   
    let res = await sendreq("/api/users/"+delId,{
        method:"DELETE",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        })
    table.innerHTML='';
    await getUsers()
    buttons()
}
async function editUser(e){
    let editId = e.target.offsetParent.id.split('-')[1];
    console.log(editId);
    let res = await getUser(editId)
    nameInputModal.value = res.name;
    ageInputModal.value = res.age;
    idInputModal.value = res.id;
    modal.open()
    


    
}
async function buttons(){
    editButtons = document.querySelectorAll(".btn-floating.orange")

    for(let i=0;i<editButtons.length;i++)
    {
        editButtons[i].onclick = editUser;
            
        
    }

    deleteButtons = document.querySelectorAll(".btn-floating.red")

    for(let i=0;i<deleteButtons.length;i++)
    {
        deleteButtons[i].onclick = deleteUser
       // deleteButtons[i].addEventListener('click', deleteUser(deleteButtons[i]));
       
        
    }
}

window.onload= function(){
    M.updateTextFields();
    getUsers().then(()=>{
        buttons()
    })
    console.log('load');

     
}
document.addEventListener('DOMContentLoaded', function() {
    let elem = document.querySelector("#modal1");
    const options = {
        onOpenStart:function(){

        },
        onCloseStart:
        async function(e){
            let res = await editUserReq(nameInputModal.value, ageInputModal.value,idInputModal.value)

            console.log(res);
            }
        }
    modal = M.Modal.init(elem, options);
  });

