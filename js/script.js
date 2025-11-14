const form = document.getElementById('task-form');
const taskDesc = document.getElementById('task-desc');
const taskPriority = document.getElementById('task-priority');
const taskCategory = document.getElementById('task-category');
const taskDeadline = document.getElementById('task-deadline');
const taskList = document.getElementById('task-list');

const filterButtons = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');

const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const statHigh = document.getElementById('stat-high');

const themeToggleBtn = document.getElementById('toggle-theme');
const body = document.body;

let tasks = [];
let currentFilter = 'all';

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  const dt = new Date(dateTimeStr);
  const options = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' };
  return dt.toLocaleDateString('id-ID', options) + ', ' + dt.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
}

function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks;

  const todayISO = new Date().toISOString().slice(0, 10);

  switch (currentFilter) {
    case 'active':
      filtered = tasks.filter(t => !t.completed);
      break;
    case 'completed':
      filtered = tasks.filter(t => t.completed);
      break;
    case 'today':
      filtered = tasks.filter(t => t.deadline && t.deadline.slice(0,10) === todayISO);
      break;
    case 'highPriority':
      filtered = tasks.filter(t => t.priority === 'Tinggi');
      break;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    if(task.completed) li.classList.add('completed');

    // Checkbox
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = task.completed;
    cb.setAttribute('aria-label', 'Tandai selesai');
    cb.addEventListener('change', () => {
      task.completed = cb.checked;
      renderTasks();
      updateStats();
    });

    const desc = document.createElement('span');
    desc.className = 'task-desc';
    desc.textContent = task.description;

    const prioritasLabel = document.createElement('span');
    prioritasLabel.className = 'label ' + 
      (task.priority === 'Rendah' ? 'label-prioritas-rendah' :
      task.priority === 'Sedang' ? 'label-prioritas-sedang' :
      'label-prioritas-tinggi');
    prioritasLabel.textContent = task.priority.toLowerCase();

    const categoryLabel = document.createElement('span');
    categoryLabel.className = 'label ' +
      (task.category === 'Pekerjaan' ? 'label-kategori-pekerjaan' :
      task.category === 'Pribadi' ? 'label-kategori-pribadi' :
      task.category === 'Belanja' ? 'label-kategori-belanja' :
      task.category === 'Kesehatan' ? 'label-kategori-kesehatan' :
      'label-kategori-lainnya');
    categoryLabel.textContent = task.category.toLowerCase();

    const deadlineSpan = document.createElement('span');
    deadlineSpan.className = 'task-meta';
    deadlineSpan.textContent = task.deadline ? formatDateTime(task.deadline) : '';

    li.appendChild(cb);
    li.appendChild(desc);
    li.appendChild(prioritasLabel);
    li.appendChild(categoryLabel);
    li.appendChild(deadlineSpan);

    taskList.appendChild(li);
  });
}

function updateStats() {
  statTotal.textContent = tasks.length;
  statActive.textContent = tasks.filter(t => !t.completed).length;
  statCompleted.textContent = tasks.filter(t => t.completed).length;
  statHigh.textContent = tasks.filter(t => t.priority === 'Tinggi').length;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const descVal = taskDesc.value.trim();
  if(!descVal) return alert('Mohon isi deskripsi tugas!');

  const newTask = {
    id: Date.now(),
    description: descVal,
    priority: taskPriority.value,
    category: taskCategory.value,
    deadline: taskDeadline.value ? taskDeadline.value : null,
    completed: false,
  };

  tasks.push(newTask);

  form.reset();
  renderTasks();
  updateStats();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
  updateStats();
});

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    body.classList.add('dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    body.classList.remove('dark');
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }
}

themeToggleBtn.addEventListener('click', () => {
  if(body.classList.contains('dark')) {
    body.classList.remove('dark');
    themeToggleBtn.textContent = '🌙 Dark Mode';
    saveTheme('light');
  } else {
    body.classList.add('dark');
    themeToggleBtn.textContent = '☀️ Light Mode';
    saveTheme('dark');
  }
});

loadTheme();
renderTasks();
updateStats();
