import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, set, update, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7DRQ4XZoKvJWwVfuHTds-b55GCeif_1M",
  authDomain: "todo-backend-41471.firebaseapp.com",
  projectId: "todo-backend-41471",
  storageBucket: "todo-backend-41471.firebasestorage.app",
  messagingSenderId: "99574098749",
  appId: "1:99574098749:web:e7cfe03cba710477e4b354",
  databaseURL: "https://todo-backend-41471-default-rtdb.firebaseio.com/" 
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

(function () {
  /** @type {HTMLFormElement | null} */
  var form = document.getElementById('todo-form');
  /** @type {HTMLInputElement | null} */
  var input = document.getElementById('todo-input');
  /** @type {HTMLUListElement | null} */
  var list = document.getElementById('todo-list');

  /** @typedef {{ id: string, text: string, completed: boolean }} Todo */

  /** @type {Todo[]} */
  var todos = loadTodos();
  /** @type {'all'|'active'|'completed'} */
  var currentFilter = 'all';

  /** Toolbar elements */
  var filtersEl = document.getElementById('filters');
  var leftCountEl = document.getElementById('left-count');
  var clearCompletedBtn = document.getElementById('clear-completed');
  var clearAllBtn = document.getElementById('clear-all');

  /** DnD state */
  var draggingId = null;

  function saveTodos() {
    try {
      localStorage.setItem('todos:v1', JSON.stringify(todos));
    } catch (err) {
      // ignore storage errors
    }
  }

  function loadTodos() {
    try {
      var raw = localStorage.getItem('todos:v1');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function render() {
    if (!list) return;
    list.innerHTML = '';
    var visible = getVisibleTodos();
    updateToolbarMeta();

    visible.forEach(function (todo) {
      var li = document.createElement('li');
      li.className = 'todo__item';
      li.dataset.id = todo.id;
      if (currentFilter === 'all') {
        li.setAttribute('draggable', 'true');
      }

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo__checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', '완료');

      var textSpan = document.createElement('span');
      textSpan.className = 'todo__text' + (todo.completed ? ' todo__text--done' : '');
      textSpan.textContent = todo.text;

      var actions = document.createElement('div');
      actions.className = 'todo__actions';

      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn--subtle';
      editBtn.textContent = '수정';

      var deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn--danger';
      deleteBtn.textContent = '삭제';

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function getVisibleTodos() {
    if (currentFilter === 'active') return todos.filter(function (t) { return !t.completed; });
    if (currentFilter === 'completed') return todos.filter(function (t) { return t.completed; });
    return todos.slice();
  }

  function updateToolbarMeta() {
    if (!leftCountEl) return;
    var left = todos.filter(function (t) { return !t.completed; }).length;
    leftCountEl.textContent = left + '개 남음';
  }

  async function addTodo(text) {
    var trimmed = (text || '').trim();
    if (!trimmed) return;
    try {
      var listRef = ref(db, 'todos');
      var newRef = push(listRef);
      await set(newRef, { text: trimmed, completed: false, createdAt: Date.now() });
      var newId = newRef.key || generateId();
      todos.unshift({ id: newId, text: trimmed, completed: false });
      saveTodos();
      render();
    } catch (err) {
      console.error('Firebase add failed', err);
      alert('추가에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  async function updateTodo(id, updates) {
    if (!id) return;
    var payload = {};
    if (Object.prototype.hasOwnProperty.call(updates, 'text')) payload.text = updates.text;
    if (Object.prototype.hasOwnProperty.call(updates, 'completed')) payload.completed = updates.completed;
    try {
      await update(ref(db, 'todos/' + id), payload);
      var changed = false;
      todos = todos.map(function (t) {
        if (t.id === id) {
          changed = true;
          return Object.assign({}, t, updates);
        }
        return t;
      });
      if (changed) {
        saveTodos();
        render();
      }
    } catch (err) {
      console.error('Firebase update failed', err);
      alert('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  async function removeTodo(id) {
    if (!id) return;
    try {
      await remove(ref(db, 'todos/' + id));
      var next = todos.filter(function (t) { return t.id !== id; });
      if (next.length !== todos.length) {
        todos = next;
        saveTodos();
        render();
      }
    } catch (err) {
      console.error('Firebase delete failed', err);
      alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  function beginEdit(li) {
    if (!li) return;
    var id = li.dataset.id || '';
    var todo = todos.find(function (t) { return t.id === id; });
    if (!todo) return;

    li.classList.add('todo__item--editing');
    li.innerHTML = '';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', '완료');

    var editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo__edit-input';
    editInput.value = todo.text;
    editInput.setAttribute('aria-label', '할일 수정');

    var actions = document.createElement('div');
    actions.className = 'todo__actions';

    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--primary';
    saveBtn.textContent = '저장';

    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn';
    cancelBtn.textContent = '취소';

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    li.appendChild(checkbox);
    li.appendChild(editInput);
    li.appendChild(actions);

    setTimeout(function () { editInput.focus(); editInput.select(); }, 0);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input) return;
      addTodo(input.value);
      input.value = '';
      input.focus();
    });
  }

  if (list) {
    // Delete / Edit buttons
    list.addEventListener('click', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      var li = target.closest('li');
      if (!li) return;
      var id = li.dataset.id || '';

      if (target.matches('.btn.btn--danger')) {
        removeTodo(id);
        return;
      }

      if (target.matches('.btn.btn--subtle')) {
        beginEdit(li);
        return;
      }
    });

    list.addEventListener('change', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      var li = target.closest('li');
      if (!li) return;
      var id = li.dataset.id || '';
      if (target.matches('.todo__checkbox')) {
        updateTodo(id, { completed: target.checked });
      }
    });

    list.addEventListener('keydown', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.classList.contains('todo__edit-input')) return;
      var li = target.closest('li');
      if (!li) return;
      var id = li.dataset.id || '';
      if (e.key === 'Enter') {
        var value = target.value.trim();
        if (value) updateTodo(id, { text: value });
      } else if (e.key === 'Escape') {
        render();
      }
    });

    list.addEventListener('click', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      var li = target.closest('li');
      if (!li) return;
      var id = li.dataset.id || '';

      if (target.textContent === '저장') {
        var inputEl = li.querySelector('.todo__edit-input');
        var value = inputEl && 'value' in inputEl ? String(/** @type {any} */(inputEl).value).trim() : '';
        if (value) updateTodo(id, { text: value });
      }
      if (target.textContent === '취소') {
        render();
      }
    });

    // Drag and Drop (only in 'all' view)
    list.addEventListener('dragstart', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      var li = target.closest('li');
      if (!li) return;
      if (currentFilter !== 'all') return;
      draggingId = li.dataset.id || null;
      li.classList.add('dragging');
      e.dataTransfer && e.dataTransfer.setData('text/plain', draggingId || '');
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    });

    list.addEventListener('dragover', function (e) {
      if (currentFilter !== 'all') return;
      e.preventDefault();
      var afterEl = getDragAfterElement(list, e.clientY);
      clearDropTargets();
      if (afterEl == null) {
        // dropping at end
        var last = list.lastElementChild;
        if (last) last.classList.add('drop-target');
      } else {
        afterEl.classList.add('drop-target');
      }
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    });

    list.addEventListener('drop', function (e) {
      if (currentFilter !== 'all') return;
      e.preventDefault();
      if (!draggingId) return;
      var afterEl = getDragAfterElement(list, e.clientY);
      reorderTodosByDrop(draggingId, afterEl ? afterEl.dataset.id || null : null);
      draggingId = null;
      clearDropTargets();
      render();
    });

    list.addEventListener('dragend', function (e) {
      var target = e.target;
      if (target instanceof HTMLElement) target.classList.remove('dragging');
      draggingId = null;
      clearDropTargets();
    });
  }

  render();

  // Filters
  if (filtersEl) {
    filtersEl.addEventListener('click', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      var btn = target.closest('.filter-btn');
      if (!btn) return;
      var filter = btn.getAttribute('data-filter');
      if (filter === 'all' || filter === 'active' || filter === 'completed') {
        currentFilter = filter;
        updateActiveFilterButton(filter);
        render();
      }
    });
  }

  function updateActiveFilterButton(filter) {
    if (!filtersEl) return;
    var buttons = filtersEl.querySelectorAll('.filter-btn');
    buttons.forEach(function (b) {
      var isActive = b.getAttribute('data-filter') === filter;
      if (isActive) {
        b.classList.add('is-active');
        b.setAttribute('aria-selected', 'true');
      } else {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Bulk actions
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', function () {
      var next = todos.filter(function (t) { return !t.completed; });
      if (next.length !== todos.length) {
        todos = next;
        saveTodos();
        render();
      }
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function () {
      if (todos.length === 0) return;
      todos = [];
      saveTodos();
      render();
    });
  }

  // Helpers for DnD
  function getDragAfterElement(container, y) {
    var items = [].slice.call(container.querySelectorAll('.todo__item'))
      .filter(function (el) { return !el.classList.contains('dragging'); });
    var closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    items.forEach(function (child) {
      var box = child.getBoundingClientRect();
      var offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        closest = { offset: offset, element: child };
      }
    });
    return closest.element;
  }

  function clearDropTargets() {
    if (!list) return;
    list.querySelectorAll('.drop-target').forEach(function (el) { el.classList.remove('drop-target'); });
  }

  function reorderTodosByDrop(sourceId, beforeId) {
    if (sourceId === beforeId) return;
    var fromIndex = todos.findIndex(function (t) { return t.id === sourceId; });
    if (fromIndex < 0) return;
    var item = todos[fromIndex];
    var remaining = todos.slice(0, fromIndex).concat(todos.slice(fromIndex + 1));
    var toIndex = beforeId ? remaining.findIndex(function (t) { return t.id === beforeId; }) : remaining.length;
    if (toIndex < 0) toIndex = remaining.length;
    remaining.splice(toIndex, 0, item);
    todos = remaining;
    saveTodos();
  }
})();


