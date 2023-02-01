const form = document.getElementById("form-create-task");
const formFilter = document.getElementById("form-filter-tasks");
const tbodyTasks = document.getElementById("tbody-tasks");

const KEY_LIST_TASK_LOCAL_STORAGE = "tasks";

const tasks = getListTaskLocalStorage();

if (tasks.length > 0) {
	updateViewTable(tasks);
}

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const form = event.target;
	const { title, description } = form.elements;

	tasks.push({
		title: title.value,
		description: description.value,
	});

	title.value = "";
	description.value = "";

	saveTasksLocalStorage();
	updateViewTable(tasks);
});

formFilter.addEventListener("submit", (event) => {
	event.preventDefault();

	const form = event.target;
	const { titleFilter, descriptionFilter } = form.elements;

	const tasksFiltered = filterTasks({
		title: titleFilter.value,
		description: descriptionFilter.value,
	});

	updateViewTable(tasksFiltered);
	
});

function updateViewTable(list) {
	tbodyTasks.innerHTML = "";

	list.forEach((value, index) => {
		const trElement = document.createElement("tr");

		let classIcon = "filter-white-icon";
		if (value.status) {
			const myClass = getClassByStatus(value.status);
			if (myClass) {
				trElement.classList.add(myClass);
				classIcon = "";
			}
		}

		trElement.innerHTML = `
            <td>${index + 1}</td>
            <td>${limitTextSize(value.title, 10)}</td>
            <td>${limitTextSize(value.description, 15)}</td>
            <td>
                <div class="dropdown-center">
                    <img class="dropdown-toggle icon-button ${classIcon}" data-bs-toggle="dropdown" src="./assets/icons/more.svg" alt="icone mais"/>
                    <ul class="dropdown-menu">
						<li><h6 class="dropdown-header">Ações</h6></li>
                        <li><button class="dropdown-item" type="button" onclick="deleteTask(${index})">Excluir</button></li>
						<li><h6 class="dropdown-header">Alterar status</h6></li>
                        <li><button class="btn btn-outline-success btn-status-task" type="button" onclick="updateStatusTask(${index}, 'done')">Concluída</button></li>
                        <li><button class="btn btn-outline-warning btn-status-task" type="button" onclick="updateStatusTask(${index}, 'pending')">Pendente</button></li>
                        <li><button class="btn btn-outline-danger btn-status-task" type="button" onclick="updateStatusTask(${index}, 'canceled')">Cancelada</button></li>
                    </ul>
                </div>
            </td>
        `;

		tbodyTasks.appendChild(trElement);
	});
}

function getClassByStatus(status){
	switch(status){
		case 'done':
			return "table-success";
		case 'pending':
			return "table-warning";
		case 'canceled':
			return "table-danger";
		default:
			return ""
	}
}

function limitTextSize(text, size) {
	if (text.length > size) {
		return text.substring(0, size) + "...";
	}

	return text;
}

function saveTasksLocalStorage() {
	const listTaskString = JSON.stringify(tasks);
	localStorage.setItem(KEY_LIST_TASK_LOCAL_STORAGE, listTaskString);
}

function getListTaskLocalStorage() {
	try {
		const dataLocalStorage = localStorage.getItem(KEY_LIST_TASK_LOCAL_STORAGE);

		if (!dataLocalStorage) {
			throw "sem dados";
		}

		const listTask = JSON.parse(dataLocalStorage);
		return listTask;
	} catch (e) {
		if (e !== "sem dados") {
			alert("não foi possível recuperar sua lista de tarefas :/");
		}
		return [];
	}
}

function deleteTask(index) {
	tasks.splice(index, 1);

	updateViewTable(tasks);
	saveTasksLocalStorage();
}

function updateStatusTask(index, status){
	tasks[index].status = status;
	saveTasksLocalStorage();
	updateViewTable(tasks);
}

function filterTasks({title, description}){
	if(title === "" && description === ""){
		return tasks;
	}

	const newTasks = tasks.filter(task => {
		const descriptionOk = description.length > 0 && task.description.includes(description);
		const titleOk = title.length > 0 && task.title.includes(title);

		return descriptionOk || titleOk;
	});;

	return newTasks;
}