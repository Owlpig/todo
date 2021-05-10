/* Todo app javascript */
const submitButton = document.getElementById('form-submit');
const titleInput = document.getElementById('title-input');
const descInput = document.getElementById('desc-input');
const todoList = document.getElementById('todo-list');

const state = window.localStorage.state ? JSON.parse(window.localStorage.state) : { todo: [] };

const storeState = () => {
  window.localStorage.state = JSON.stringify(state);
};

const findCard = (card) => {
  const cardTitle = card.childNodes[1].innerText.toLowerCase();
  const cardDesc = card.childNodes[3].innerText;
  const index = state.todo.findIndex((todo) => todo.title === cardTitle && todo.desc === cardDesc);
  return index;
};

const newTodo = (title, desc, done) => {
  if (done) {
    todoList.innerHTML += `
    <div class="todo-card todo-card--done">
      <h1 class="todo-title">${title}</h1>
      <p class="todo-desc">${desc}</p>
      <button class="delete-todo" type="button">Delete</button></div>`;
  } else {
    todoList.innerHTML += `
    <div class="todo-card">
      <h1 class="todo-title">${title}</h1>
      <p class="todo-desc">${desc}</p>
    </div>`;
  }
};

const toggleDone = (target) => {
  let card = target.parentNode;
  if (target.classList[0] === 'todo-card') {
    card = target;
  }
  const index = findCard(card);

  if (card.classList[1] === 'todo-card--done') {
    card.classList.remove('todo-card--done');
    card.lastChild.remove();
    state.todo[index].done = false;
    storeState();
  } else {
    card.classList.add('todo-card--done');
    card.innerHTML += '<button class="delete-todo" type="button">Delete</button>';
    state.todo[index].done = true;
    storeState();
  }
};

const deleteCard = (btn) => {
  const card = btn.parentNode;
  const index = findCard(card);
  if (index !== -1) {
    state.todo.splice(index, 1);
    storeState();
    card.remove();
  }
};

const renderPage = () => {
  todoList.innerHTML = '';
  state.todo.forEach((todo) => newTodo(todo.title, todo.desc, todo.done));
};

submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  state.todo.push({ title: titleInput.value.toLowerCase(), desc: descInput.value });
  storeState();
  renderPage();
});

todoList.addEventListener('click', (e) => {
  e.preventDefault();
  const { target } = e;
  if (target.className === 'delete-todo') {
    deleteCard(target);
    renderPage();
  } else if (target.className !== 'todo-list') {
    toggleDone(target);
  }
});

renderPage();
