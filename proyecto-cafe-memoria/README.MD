# ☕ Aplicación Web: Efecto del Café en la Memoria

Proyecto de investigación para analizar el efecto del consumo de café en la memoria a corto plazo de estudiantes universitarios.

**Autores:** Sara Rey Moreno y Daniel Felipe Romero Soler  
**Institución:** Corporación Universitaria Minuto de Dios - Villavicencio

---

## 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalado:

1. **Node.js** (versión 16 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **MongoDB** (versión 5.0 o superior)
   - Descarga desde: https://www.mongodb.com/try/download/community
   - O usa MongoDB Atlas (en la nube): https://www.mongodb.com/cloud/atlas

3. **Un editor de código** (recomendado: VS Code)
   - Descarga desde: https://code.visualstudio.com/

---

## 🚀 Instalación Paso a Paso

### Paso 1: Crear la estructura de carpetas

```bash
# Crea la carpeta principal del proyecto
mkdir proyecto-cafe-memoria
cd proyecto-cafe-memoria

# Crea las subcarpetas
mkdir backend
mkdir frontend
```

### Paso 2: Configurar el Backend

```bash
# Entra a la carpeta backend
cd backend

# Crea el archivo package.json
# (copia el contenido del archivo package.json que te proporcioné)

# Instala las dependencias
npm install

# Crea el archivo server.js
# (copia el contenido del archivo server.js que te proporcioné)
```

### Paso 3: Configurar el Frontend

```bash
# Vuelve a la carpeta principal
cd ..

# Entra a la carpeta frontend
cd frontend

# Crea los archivos:
# - index.html (copia el contenido proporcionado)
# - styles.css (copia el contenido proporcionado)
# - app.js (copia el contenido proporcionado)
```

### Paso 4: Iniciar MongoDB

**Opción A: MongoDB Local**
```bash
# En Windows, abre una nueva terminal y ejecuta:
mongod

# En Mac/Linux:
sudo systemctl start mongod
```

**Opción B: MongoDB Atlas (en la nube)**
1. Crea una cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Obtén la cadena de conexión
4. En `server.js`, cambia la línea:
   ```javascript
   mongoose.connect('mongodb://localhost:27017/cafe-memoria'
   ```
   Por tu cadena de conexión:
   ```javascript
   mongoose.connect('TU_CADENA_DE_CONEXION_AQUI'
   ```

### Paso 5: Iniciar el Backend

```bash
# Desde la carpeta backend
cd backend
npm start

# Deberías ver:
# ✅ Conectado a MongoDB
# 🚀 Servidor corriendo en http://localhost:3000
```

### Paso 6: Iniciar el Frontend

**Opción A: Usando Live Server (VS Code)**
1. Instala la extensión "Live Server" en VS Code
2. Abre el archivo `index.html`
3. Click derecho > "Open with Live Server"

**Opción B: Usando Python**
```bash
# Desde la carpeta frontend
cd frontend

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

**Opción C: Abriendo directamente**
- Simplemente abre el archivo `index.html` en tu navegador

---

## 📱 Uso de la Aplicación

1. **Registrar participantes:**
   - Completa el formulario con los datos del participante
   - Selecciona si consumió café o no
   - Ingresa el puntaje obtenido en la prueba de memoria (0-10)
   - Click en "Guardar Participante"

2. **Ver participantes registrados:**
   - La tabla muestra todos los participantes
   - Puedes eliminar participantes individuales

3. **Analizar estadísticas:**
   - Click en "Actualizar Estadísticas"
   - Verás:
     - Media, mediana y moda de cada grupo
     - Desviación estándar
     - Gráficos comparativos
     - Distribución de puntajes

---

## 📊 Funcionalidades

✅ Registro de participantes en MongoDB  
✅ Cálculo automático de media, mediana y moda  
✅ Cálculo de desviación estándar  
✅ Gráfico de barras comparativo  
✅ Gráfico de distribución de puntajes  
✅ Gráfico de pastel de participantes  
✅ Tabla con todos los datos  
✅ Eliminar participantes individuales  

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Asegúrate de que MongoDB esté corriendo
- Verifica la cadena de conexión en `server.js`

### Error: "CORS policy"
- Verifica que el backend esté corriendo en el puerto 3000
- Si cambias el puerto, actualiza `API_URL` en `app.js`

### Los gráficos no se muestran
- Verifica que Chart.js esté cargando (revisa la consola del navegador)
- Asegúrate de tener conexión a internet (Chart.js se carga desde CDN)

### "Port 3000 already in use"
- Cambia el puerto en `server.js`:
  ```javascript
  const PORT = 3001; // Cambia a otro puerto
  ```
- Actualiza también en `app.js`:
  ```javascript
  const API_URL = 'http://localhost:3001/api';
  ```

---

## 📁 Estructura Final del Proyecto

```
proyecto-cafe-memoria/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md
```

---

## 🎯 Próximos Pasos

Una vez que todo funcione, puedes:
- Agregar más participantes
- Exportar los datos a Excel
- Implementar la prueba t de Student
- Generar reportes PDF
- Agregar autenticación de usuarios

---

## 📧 Soporte

Si tienes problemas, verifica:
1. ¿Node.js está instalado? → `node --version`
2. ¿MongoDB está corriendo? → `mongo` (para probarlo)
3. ¿El backend está corriendo? → Abre http://localhost:3000
4. ¿Hay errores en la consola del navegador? → F12 > Console

---

**¡Éxito con tu proyecto de investigación! ☕📊**