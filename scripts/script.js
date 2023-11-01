const url = "https://6542be6801b5e279de1f8278.mockapi.io/users/";
const buscar = document.getElementById("btnGet1");
const results = document.getElementById("results");
const getId1 = document.getElementById("inputGet1Id");
const agregar = document.getElementById("btnPost")
const nombreAgregar = document.getElementById("inputPostNombre")
const appellidoAgregar = document.getElementById("inputPostApellido")
const inputDelete = document.getElementById("inputDelete");
const btnDelete = document.getElementById("btnDelete");
const btnModify = document.getElementById("btnPut");
const btnSendChanges = document.getElementById("btnSendChanges");
const inputModifyNombre = document.getElementById("inputPutNombre");
const inputModifyApellido = document.getElementById("inputPutApellido");
const dataModal = new bootstrap.Modal(document.getElementById('dataModal'));

/* ----------------------------------------------------------------------------------------------------
------------------------------------------------BUSCAR------------------------------------------------*/

let userList = [];

async function showUsers(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        userList = data;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

function showUserById(id) {
    const user = userList.find(user => user.id == id);
    if (user) {
        results.innerHTML = "";
        showInfo([user]);
    } else {
        console.error(`No se encontró ningún usuario con ID ${id}`);
    }
}

function showInfo(data) {
    results.innerHTML = "";
    data.forEach(user => {
        const userElement = document.createElement("div");
        userElement.innerHTML = `ID: ${user.id}<br> Nombre: ${user.name}<br> Apellido: ${user.lastname}<br>---------`;
        results.appendChild(userElement);
    });
}

buscar.addEventListener("click", () => {
    const userId = getId1.value;
    if (userId) {
        showUserById(userId);
    } else {
        showInfo(userList);
    }
});

/* ----------------------------------------------------------------------------------------------------
------------------------------------------------AGREGAR----------------------------------------------*/
const user = {
    name: 'Nombre del usuario',
    lastname: 'Apellido del usuario'
};

async function postUser(user) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const newUser = await response.json();
            console.log('Usuario agregado:', newUser);
        } else {
            throw new Error("Error al agregar el usuario");
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('alert-error').classList.add('show');
        document.getElementById('alert-error').textContent = "Ha ocurrido un error al agregar el usuario";
    }
}

agregar.addEventListener("click", () => {
    const nombre = inputPostNombre.value.trim();
    const apellido = inputPostApellido.value.trim();

    if (nombre && apellido) {
        const newUser = {
            name: nombre,
            lastname: apellido
        };

        postUser(newUser);
    } else {
        console.error("Por favor, complete todos los campos");
    }
});

/* ----------------------------------------------------------------------------------------------------
------------------------------------------------ELIMINAR---------------------------------------------*/

btnDelete.addEventListener("click", async () => {
    const idEliminar = inputDelete.value.trim();

    if (idEliminar) {
        try {
            const response = await fetch(`${url}${idEliminar}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`Usuario con ID ${idEliminar} eliminado`);
                showUsers(url);
            } else {
                throw new Error("Error al eliminar el usuario");
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById('alert-error').classList.add('show');
            document.getElementById('alert-error').textContent = "Ha ocurrido un error al eliminar el usuario";
        }
    } else {
        console.error("Por favor, ingrese un ID");
        document.getElementById('alert-error').classList.add('show');
        document.getElementById('alert-error').textContent = "Por favor, ingrese un ID";
    }
});
/* ----------------------------------------------------------------------------------------------------
------------------------------------------------MODIFICAR----------------------------------------------*/
btnModify.addEventListener("click", () => {
    const idModificar = inputPutId.value.trim();
    const user = userList.find(user => user.id == idModificar);

    if (user) {
        inputModifyNombre.value = user.name;
        inputModifyApellido.value = user.lastname;
        btnSendChanges.disabled = false;
        dataModal.show();
    } else {
        console.error(`No se encontró ningún usuario con ID ${idModificar}`);
    }
});

btnSendChanges.addEventListener("click", async () => {
    const idModificar = inputPutId.value.trim();
    const nombre = inputModifyNombre.value.trim();
    const apellido = inputModifyApellido.value.trim();

    if (nombre && apellido) {
        try {
            const response = await fetch(`${url}${idModificar}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: nombre, lastname: apellido })
            });

            if (response.ok) {
                console.log(`Usuario con ID ${idModificar} modificado`);
                showUsers(url);
                dataModal.hide();
                document.getElementById('alert-error').classList.remove('show');
            } else {
                throw new Error("Error al modificar el usuario");
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById('alert-error').classList.add('show');
            document.getElementById('alert-error').textContent = "Ha ocurrido un error al modificar el usuario";
        }
    } else {
        console.error("Por favor, complete todos los campos");
        document.getElementById('alert-error').classList.add('show');
        document.getElementById('alert-error').textContent = "Por favor, complete todos los campos";
    }
});

/* ----------------------------------------------------------------------------------------------------
------------------------------------------------HABILITAR BOTONES-------------------------------------*/
inputPutId.addEventListener('input', toggleButton);
inputDelete.addEventListener('input', toggleButton);
nombreAgregar.addEventListener('input', toggleButton);
appellidoAgregar.addEventListener('input', toggleButton);

function toggleButton() {
    const nombre = nombreAgregar.value.trim();
    const apellido = appellidoAgregar.value.trim();
    const eliminar = inputDelete.value.trim();
    btnPost.disabled = !(nombre && apellido);
    btnDelete.disabled = !eliminar;
    const idModificar = inputPutId.value.trim();
    btnModify.disabled = !idModificar;
}

showUsers(url);
