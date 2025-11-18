// URL de la API
const API_URL = 'http://localhost:3000/api';

// Variables globales para los gráficos
let chartComparacion = null;
let chartDistribucion = null;
let chartPastel = null;
let tabActual = 'todos';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarParticipantes();
    cargarEstadisticas();
    
    document.getElementById('formParticipante').addEventListener('submit', guardarParticipante);
});

// Cambiar entre tabs
function cambiarTab(tab) {
    tabActual = tab;
    
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Encontrar el botón correcto y activarlo
    const botones = document.querySelectorAll('.tab-btn');
    if (tab === 'todos') {
        botones[0].classList.add('active');
    } else if (tab === 'cafe') {
        botones[1].classList.add('active');
    } else if (tab === 'sinCafe') {
        botones[2].classList.add('active');
    }
    
    // Actualizar tablas
    document.querySelectorAll('.table-section').forEach(section => {
        section.classList.remove('active');
    });
    
    if (tab === 'todos') {
        document.getElementById('tablaTodos').classList.add('active');
    } else if (tab === 'cafe') {
        document.getElementById('tablaCafe').classList.add('active');
    } else if (tab === 'sinCafe') {
        document.getElementById('tablaSinCafe').classList.add('active');
    }
}

// Guardar nuevo participante
async function guardarParticipante(e) {
    e.preventDefault();
    
    const datos = {
        nombre: document.getElementById('nombre').value,
        edad: parseInt(document.getElementById('edad').value),
        grupo: document.getElementById('grupo').value,
        puntaje: parseFloat(document.getElementById('puntaje').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/participantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Participante registrado exitosamente');
            document.getElementById('formParticipante').reset();
            cargarParticipantes();
            cargarEstadisticas();
        } else {
            alert('❌ Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }
}

// Cargar participantes
async function cargarParticipantes() {
    try {
        const response = await fetch(`${API_URL}/participantes`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            const participantes = result.data;
            
            // Separar por grupos
            const conCafe = participantes.filter(p => p.grupo === 'cafe');
            const sinCafe = participantes.filter(p => p.grupo === 'sin_cafe');
            
            // Llenar tabla de TODOS
            llenarTablaTodos(participantes);
            
            // Llenar tabla CON CAFÉ
            llenarTablaCafe(conCafe);
            
            // Llenar tabla SIN CAFÉ
            llenarTablaSinCafe(sinCafe);
            
            // Actualizar contadores
            document.getElementById('countTodos').textContent = `Total: ${participantes.length}`;
            document.getElementById('countCafe').textContent = `Total: ${conCafe.length}`;
            document.getElementById('countSinCafe').textContent = `Total: ${sinCafe.length}`;
        } else {
            // Si no hay datos, mostrar mensajes vacíos
            document.getElementById('tbodyTodos').innerHTML = 
                '<tr><td colspan="7" class="text-center">No hay participantes registrados</td></tr>';
            document.getElementById('tbodyCafe').innerHTML = 
                '<tr><td colspan="6" class="text-center">No hay participantes en este grupo</td></tr>';
            document.getElementById('tbodySinCafe').innerHTML = 
                '<tr><td colspan="6" class="text-center">No hay participantes en este grupo</td></tr>';
            
            document.getElementById('countTodos').textContent = 'Total: 0';
            document.getElementById('countCafe').textContent = 'Total: 0';
            document.getElementById('countSinCafe').textContent = 'Total: 0';
        }
    } catch (error) {
        console.error('Error al cargar participantes:', error);
        alert('❌ Error al cargar participantes. Verifica que el servidor esté corriendo.');
    }
}

// Llenar tabla de TODOS los participantes
function llenarTablaTodos(participantes) {
    const tbody = document.getElementById('tbodyTodos');
    tbody.innerHTML = '';
    
    participantes.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        tr.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${p.nombre}</td>
            <td>${p.edad}</td>
            <td>
                <span class="badge ${p.grupo === 'cafe' ? 'badge-cafe' : 'badge-sincafe'}">
                    ${p.grupo === 'cafe' ? '☕ Con café' : '🚫 Sin café'}
                </span>
            </td>
            <td><strong style="font-size: 18px; color: var(--primary-color);">${p.puntaje}</strong></td>
            <td>${new Date(p.fechaRegistro).toLocaleDateString()}</td>
            <td>
                <button class="btn-delete" onclick="eliminarParticipante('${p._id}')">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Llenar tabla CON CAFÉ
function llenarTablaCafe(participantes) {
    const tbody = document.getElementById('tbodyCafe');
    tbody.innerHTML = '';
    
    if (participantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay participantes en este grupo</td></tr>';
        return;
    }
    
    participantes.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        tr.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${p.nombre}</td>
            <td>${p.edad}</td>
            <td><strong style="font-size: 18px; color: var(--primary-color);">${p.puntaje}</strong></td>
            <td>${new Date(p.fechaRegistro).toLocaleDateString()}</td>
            <td>
                <button class="btn-delete" onclick="eliminarParticipante('${p._id}')">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Llenar tabla SIN CAFÉ
function llenarTablaSinCafe(participantes) {
    const tbody = document.getElementById('tbodySinCafe');
    tbody.innerHTML = '';
    
    if (participantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay participantes en este grupo</td></tr>';
        return;
    }
    
    participantes.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        tr.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${p.nombre}</td>
            <td>${p.edad}</td>
            <td><strong style="font-size: 18px; color: var(--secondary-color);">${p.puntaje}</strong></td>
            <td>${new Date(p.fechaRegistro).toLocaleDateString()}</td>
            <td>
                <button class="btn-delete" onclick="eliminarParticipante('${p._id}')">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Eliminar participante
async function eliminarParticipante(id) {
    if (!confirm('¿Estás seguro de eliminar este participante?')) return;
    
    try {
        const response = await fetch(`${API_URL}/participantes/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Participante eliminado');
            cargarParticipantes();
            cargarEstadisticas();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar participante');
    }
}

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        const result = await response.json();
        
        if (result.success) {
            const { grupoCafe, grupoSinCafe } = result.data;
            
            if (grupoCafe) {
                document.getElementById('estadisticasCafe').innerHTML = `
                    <p><strong>Participantes:</strong> ${grupoCafe.cantidad}</p>
                    <p><strong>Media:</strong> ${grupoCafe.media}</p>
                    <p><strong>Mediana:</strong> ${grupoCafe.mediana}</p>
                    <p><strong>Moda:</strong> ${grupoCafe.moda.join(', ')}</p>
                    <p><strong>Desv. Estándar:</strong> ${grupoCafe.desviacionEstandar}</p>
                `;
            } else {
                document.getElementById('estadisticasCafe').innerHTML = '<p>No hay datos disponibles</p>';
            }
            
            if (grupoSinCafe) {
                document.getElementById('estadisticasSinCafe').innerHTML = `
                    <p><strong>Participantes:</strong> ${grupoSinCafe.cantidad}</p>
                    <p><strong>Media:</strong> ${grupoSinCafe.media}</p>
                    <p><strong>Mediana:</strong> ${grupoSinCafe.mediana}</p>
                    <p><strong>Moda:</strong> ${grupoSinCafe.moda.join(', ')}</p>
                    <p><strong>Desv. Estándar:</strong> ${grupoSinCafe.desviacionEstandar}</p>
                `;
            } else {
                document.getElementById('estadisticasSinCafe').innerHTML = '<p>No hay datos disponibles</p>';
            }
            
            generarGraficos(grupoCafe, grupoSinCafe);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Generar gráficos
function generarGraficos(grupoCafe, grupoSinCafe) {
    // 1. Gráfico de barras comparativo
    const ctx1 = document.getElementById('chartComparacion').getContext('2d');
    if (chartComparacion) chartComparacion.destroy();
    
    chartComparacion = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Media', 'Mediana', 'Desv. Estándar'],
            datasets: [
                {
                    label: 'Con Café',
                    data: [grupoCafe?.media || 0, grupoCafe?.mediana || 0, grupoCafe?.desviacionEstandar || 0],
                    backgroundColor: 'rgba(107, 68, 35, 0.8)',
                    borderColor: 'rgba(107, 68, 35, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Sin Café',
                    data: [grupoSinCafe?.media || 0, grupoSinCafe?.mediana || 0, grupoSinCafe?.desviacionEstandar || 0],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Comparación de Estadísticas entre Grupos',
                    font: { size: 18, weight: 'bold' }
                },
                legend: {
                    position: 'top',
                    labels: { font: { size: 14 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { font: { size: 12 } }
                },
                x: {
                    ticks: { font: { size: 12 } }
                }
            }
        }
    });
    
    // 2. Gráfico de líneas - Distribución de puntajes
    const ctx2 = document.getElementById('chartDistribucion').getContext('2d');
    if (chartDistribucion) chartDistribucion.destroy();
    
    const labelsCafe = grupoCafe?.puntajes?.map((_, i) => `P${i + 1}`) || [];
    const labelsSinCafe = grupoSinCafe?.puntajes?.map((_, i) => `P${i + 1}`) || [];
    const maxLabels = Math.max(labelsCafe.length, labelsSinCafe.length);
    const labels = Array.from({ length: maxLabels }, (_, i) => `P${i + 1}`);
    
    chartDistribucion = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Con Café',
                    data: grupoCafe?.puntajes || [],
                    borderColor: 'rgba(107, 68, 35, 1)',
                    backgroundColor: 'rgba(107, 68, 35, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgba(107, 68, 35, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Sin Café',
                    data: grupoSinCafe?.puntajes || [],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Distribución de Puntajes por Participante',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'top',
                    labels: { font: { size: 12 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Puntaje',
                        font: { size: 12 }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Participantes',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
    
    // 3. Gráfico de pastel - Distribución de participantes
    const ctx3 = document.getElementById('chartPastel').getContext('2d');
    if (chartPastel) chartPastel.destroy();
    
    chartPastel = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['Con Café', 'Sin Café'],
            datasets: [{
                data: [grupoCafe?.cantidad || 0, grupoSinCafe?.cantidad || 0],
                backgroundColor: [
                    'rgba(107, 68, 35, 0.8)', 
                    'rgba(102, 126, 234, 0.8)'
                ],
                borderColor: [
                    'rgba(107, 68, 35, 1)', 
                    'rgba(102, 126, 234, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { 
                    display: true, 
                    text: 'Distribución de Participantes',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    labels: { 
                        font: { size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });
}