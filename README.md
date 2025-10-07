# 📝 TaskFlow

Aplicación de gestión de tareas moderna, minimalista y funcional — creada como PWA para ofrecer una experiencia fluida tanto online como offline.

---

## 📋 Tabla de Contenidos
- [Características](#-características)
- [PWA (Progressive Web App)](#-pwa-progressive-web-app)
- [Diseño y UX](#-diseño-y-ux)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [PWA Features](#-pwa-features)
- [Desarrollo](#-desarrollo)
- [Contacto](#-contacto)

---

## ✨ Características

### 🎯 Funcionalidades Principales

✅ **Gestión Completa de Tareas:** Crea, completa y elimina tareas fácilmente  
📊 **Estadísticas en Tiempo Real:** Visualiza tu progreso y productividad  
🔍 **Sistema de Filtros:** Filtra tareas por estado (todas, pendientes, completadas)  
💾 **Persistencia Local:** Tus datos se guardan automáticamente en el navegador  
🌙 **Diseño Moderno:** Interfaz elegante con tema oscuro y efectos glassmorphism  
📱 **Totalmente Responsivo:** Funciona perfectamente en móviles, tablets y escritorio  

---

## 🚀 PWA (Progressive Web App)

📴 **Funciona Offline:** Usa la aplicación sin conexión a internet  
📲 **Instalable:** Agrega TaskFlow a tu pantalla de inicio como una app nativa  
⚡ **Rendimiento Óptimo:** Carga instantánea gracias al Service Worker  
🔔 **Notificaciones:** Sistema de toasts para feedback inmediato  

---

## 🎨 Diseño y UX

🌈 **Gradientes Vibrantes:** Colores modernos y atractivos  
✨ **Animaciones Fluidas:** Transiciones suaves y microinteracciones  
🎭 **Efectos Glassmorphism:** Diseño con cristales y desenfoque  
🖼️ **Iconos de Font Awesome:** Más de 6,000 iconos vectoriales  

---

## 🛠️ Tecnologías

Este proyecto está construido con tecnologías web modernas y estándares:

| Tecnología | Versión | Propósito |
|-------------|----------|------------|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos modernos y animaciones |
| **JavaScript (ES6+)** | - | Lógica de la aplicación |
| **Service Workers** | - | Funcionalidad offline y caché |
| **Web App Manifest** | - | Instalación PWA |
| **LocalStorage API** | - | Persistencia de datos |
| **Font Awesome** | 6.4.0 | Iconografía |
| **Google Fonts (Inter)** | - | Tipografía |

---

## 📥 Instalación

### 🧩 Opción 1: Clonar el Repositorio
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/taskflow.git

# Navegar al directorio
cd taskflow

# Abrir con un servidor local (ejemplo con Python)
python -m http.server 8000

# O con Node.js
npx serve
```

### 📦 Opción 2: Descargar ZIP
1. Descarga el archivo ZIP del repositorio  
2. Extrae los archivos  
3. Abre **index.html** en tu navegador (preferiblemente con un servidor local)

### 📲 Opción 3: Instalación como PWA
1. Visita la aplicación en tu navegador  
2. Busca el botón **"Instalar"** en la barra de direcciones  
3. Confirma la instalación  
4. ¡Listo! TaskFlow aparecerá como una app nativa en tu dispositivo  

---

## 🎯 Uso

### Crear una Tarea
1. Escribe tu tarea en el campo de texto  
2. Presiona **Enter** o haz clic en **"Agregar Tarea"**  
3. Tu tarea aparecerá en la lista  

### Completar una Tarea
- Haz clic en el checkbox a la izquierda de la tarea  
- La tarea se marcará como completada con un tachado  

### Filtrar Tareas
Usa los botones de filtro para ver:
- **Todas:** Muestra todas las tareas  
- **Pendientes:** Solo tareas sin completar  
- **Completadas:** Solo tareas completadas  

### Eliminar Tareas
- **Individual:** Haz clic en el icono de basura al pasar el mouse sobre una tarea  
- **Múltiple:** Usa el botón **"Limpiar completadas"** para eliminar todas las tareas completadas  

---

## 📁 Estructura del Proyecto
```
taskflow/
│
├── index.html               # Página principal
├── manifest.json            # Configuración de la PWA
├── sw.js                    # Service Worker para funcionalidad offline
│
├── css/
│   └── style.css            # Estilos de la aplicación
│
├── js/
│   └── app.js               # Lógica principal
│
├── icons/                   # Iconos de la PWA (varios tamaños)
│   ├── icon-48x48.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-256x256.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
└── README.md                # Este archivo
```

---

## 🔧 PWA Features

### 🧠 Service Worker
El **Service Worker (`sw.js`)** implementa:
- **Cache First Strategy:** Para recursos estáticos  
- **Network First Strategy:** Para el HTML principal  
- **Fallback Offline:** Páginas de respaldo cuando no hay conexión  

### 📱 Manifest
El archivo **manifest.json** define:
- Nombre y descripción de la app  
- Iconos en múltiples tamaños  
- Modo de visualización `standalone`  
- Colores de tema y fondo  
- Orientación predeterminada  

### 💾 LocalStorage
Los datos se persisten localmente usando:

```javascript
// Guardar tareas
localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));

// Cargar tareas
const saved = localStorage.getItem('taskflow-tasks');
const tasks = JSON.parse(saved);
```

---

## 👨‍💻 Desarrollo

### 🧰 Requisitos
- Un navegador moderno (Chrome, Firefox, Safari, Edge)  
- Un servidor local para desarrollo (recomendado)  

### 🎨 Variables CSS Personalizables
Puedes personalizar los colores en **css/style.css**:

```css
:root {
  --primary: #6366f1;   /* Color principal */
  --success: #10b981;   /* Color de éxito */
  --danger: #ef4444;    /* Color de peligro */
  --warning: #f59e0b;   /* Color de advertencia */
  --bg: #0f0f23;        /* Fondo principal */
  --surface: #1a1a2e;   /* Superficie secundaria */
}
```

### 🧩 Estructura de Clases (app.js)
La aplicación usa una clase principal **TaskManager**:

```javascript
class TaskManager {
  constructor()          // Inicialización
  init()                 // Configuración inicial
  loadTasks()            // Cargar desde localStorage
  saveTasks()            // Guardar en localStorage
  addTask()              // Agregar nueva tarea
  toggleTask(id)         // Cambiar estado de tarea
  deleteTask(id)         // Eliminar tarea
  clearCompleted()       // Limpiar completadas
  renderTasks()          // Renderizar UI
  updateStats()          // Actualizar estadísticas
}
```

---

## 📞 Contacto

**Proyecto:** TaskFlow  
**Autor:** Diego Asensio  
**Email:** [dieasensio@gmail.com](mailto:dieasensio@gmail.com)  
**LinkedIn:** [https://www.linkedin.com/in/diego-asensio/](https://www.linkedin.com/in/diego-asensio/)

---
