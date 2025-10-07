class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.isProcessing = false;
        this.elements = this.initElements();
        this.init();
    }

    initElements() {
        return {
            loadingScreen: document.getElementById('loading-screen'),
            app: document.getElementById('app'),
            taskForm: document.getElementById('task-form'),
            taskInput: document.getElementById('task-input'),
            addButton: document.getElementById('add-button'),
            taskList: document.getElementById('task-list'),
            emptyState: document.getElementById('empty-state'),
            filters: document.getElementById('filters'),
            clearButton: document.getElementById('clear-completed'),
            totalTasks: document.getElementById('total-tasks'),
            pendingTasks: document.getElementById('pending-tasks'),
            completedTasks: document.getElementById('completed-tasks'),
            progressFill: document.getElementById('progress-fill'),
            progressPercentage: document.getElementById('progress-percentage'),
            toast: document.getElementById('toast'),
            toastTitle: document.getElementById('toast-title'),
            toastDescription: document.getElementById('toast-description')
        };
    }

    init() {
        this.loadTasks();
        this.bindEvents();
        this.registerServiceWorker();
        this.updateStats();
        this.renderTasks();
        this.updateFilters();
        
        setTimeout(() => {
            this.elements.loadingScreen.classList.add('hidden');
            this.elements.app.classList.remove('hidden');
        }, 1000);
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow-tasks');
        console.log('Datos crudos de localStorage:', saved);
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                console.log('Datos parseados:', parsed);
                
                this.tasks = parsed.map(task => ({
                    ...task,
                    createdAt: new Date(task.createdAt)
                }));
                
                console.log('Tareas cargadas:', this.tasks.map(t => ({id: t.id, text: t.text, completed: t.completed})));
            } catch (e) {
                console.error('Error parseando tareas:', e);
                this.tasks = [];
            }
        } else {
            console.log('No hay tareas guardadas');
            this.tasks = [];
        }
    }

    saveTasks() {
        const dataToSave = JSON.stringify(this.tasks);
        console.log('Guardando en localStorage:', dataToSave);
        localStorage.setItem('taskflow-tasks', dataToSave);
    }

    bindEvents() {
        this.elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        this.elements.filters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.setFilter(e.target.dataset.filter);
            }
        });

        this.elements.clearButton.addEventListener('click', () => {
            this.clearCompleted();
        });

        this.elements.taskInput.addEventListener('input', (e) => {
            this.elements.addButton.disabled = !e.target.value.trim();
        });

        this.elements.taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = taskItem.dataset.id;
            const actionElement = e.target.closest('[data-action]');
            if (!actionElement) return;
            
            const action = actionElement.dataset.action;
            console.log(`Click detectado - Tarea: ${taskId}, Acción: ${action}`);

            if (action === 'toggle') {
                this.toggleTask(taskId);
            } else if (action === 'delete') {
                this.deleteTask(taskId);
            }
        });
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registrado');
            } catch (e) {
                console.log('Error registrando SW:', e);
            }
        }
    }

    addTask() {
        const text = this.elements.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date()
        };

        console.log('Agregando nueva tarea:', task);
        this.tasks.unshift(task);
        
        this.elements.taskInput.value = '';
        this.elements.addButton.disabled = true;
        
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
        this.updateFilters();
        
        this.showToast('Tarea agregada', `"${this.truncate(text)}" agregada`);
    }

    toggleTask(id) {
        if (this.isProcessing) {
            console.log('Procesando otra tarea, ignorando clic en:', id);
            return;
        }
        
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            console.error('Tarea no encontrada:', id);
            return;
        }

        // Bloquear procesamiento
        this.isProcessing = true;
        console.log(`Iniciando toggle para tarea ${id}, estado actual: ${task.completed}`);

        // Cambiar estado
        task.completed = !task.completed;
        console.log(`Nueva estado de tarea ${id}: ${task.completed}`);
        
        // Operaciones síncronas
        this.saveTasks();
        this.updateStats();
        this.renderTasks();
        this.updateFilters();
        
        const message = task.completed ? 'Tarea completada' : 'Tarea pendiente';
        this.showToast(message, this.truncate(task.text));
        this.isProcessing = false;
        console.log(`Toggle completado para tarea ${id}`);
    }

    deleteTask(id) {
        if (confirm('¿Eliminar esta tarea?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.updateFilters();
            this.showToast('Tarea eliminada', 'La tarea ha sido eliminada');
        }
    }

    clearCompleted() {
        const count = this.tasks.filter(t => t.completed).length;
        if (count === 0) return;

        if (confirm(`¿Eliminar ${count} tarea${count > 1 ? 's' : ''} completada${count > 1 ? 's' : ''}?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.updateStats();
            this.renderTasks();
            this.updateFilters();
            this.showToast('Tareas limpiadas', `${count} tarea${count > 1 ? 's' : ''} eliminada${count > 1 ? 's' : ''}`);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.elements.filters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending': return this.tasks.filter(t => !t.completed);
            case 'completed': return this.tasks.filter(t => t.completed);
            default: return this.tasks;
        }
    }

    updateStats() {
        const completed = this.tasks.filter(t => t.completed).length;
        const total = this.tasks.length;
        const percentage = total ? Math.round((completed / total) * 100) : 0;

        this.elements.totalTasks.textContent = total;
        this.elements.pendingTasks.textContent = total - completed;
        this.elements.completedTasks.textContent = completed;
        this.elements.progressFill.style.width = `${percentage}%`;
        this.elements.progressPercentage.textContent = `${percentage}%`;
        this.elements.clearButton.classList.toggle('hidden', completed === 0);
    }

    renderTasks() {
        const filtered = this.getFilteredTasks();
        
        if (filtered.length === 0) {
            this.elements.taskList.classList.add('hidden');
            this.elements.emptyState.classList.remove('hidden');
        } else {
            this.elements.taskList.classList.remove('hidden');
            this.elements.emptyState.classList.add('hidden');
            
            this.elements.taskList.innerHTML = filtered.map(task => {
                console.log(`Renderizando tarea ${task.id}: completed=${task.completed}`);
                return `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-content">
                        <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                        <div class="task-meta">
                            <span class="task-date">${this.formatDate(task.createdAt)}</span>
                        </div>
                    </div>
                    <button class="task-delete" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                `;
            }).join('');
        }
    }

    updateFilters() {
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = this.tasks.length - completed;

        document.getElementById('filter-all-count').textContent = this.tasks.length;
        document.getElementById('filter-pending-count').textContent = pending;
        document.getElementById('filter-completed-count').textContent = completed;
    }

    showToast(title, description) {
        this.elements.toastTitle.textContent = title;
        this.elements.toastDescription.textContent = description;
        this.elements.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.toast.classList.add('hidden');
        }, 3000);
    }

    // Utilidades
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncate(text, length = 30) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    formatDate(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diff === 0) return 'Hoy';
        if (diff === 1) return 'Ayer';
        if (diff < 7) return `Hace ${diff} días`;
        
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
}

// Inicializar cuando esté listo el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});