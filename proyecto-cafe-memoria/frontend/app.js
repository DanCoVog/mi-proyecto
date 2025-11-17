// URL de la API (ajusta si es necesario)
const API_URL = 'http://localhost:3000/api';

// Variables globales para los gráficos
let chartComparacion = null;
let chartDistribucion = null;
let chartPastel = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarParticipantes();
    cargarEstadisticas();
    
    // Evento del formulario
    document.getElementById('formParticipante').addEventListener('submit', guardarParticipante);
});

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
            headers: {
                'Content-Type': 'application/json'
            },
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
            const tbody = document.getElementById('tbodyParticipantes');
            tbody.innerHTML = '';
            
            result.data.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.nombre}</td>
                    <td>${p.edad}</td>
                    <td>${p.grupo === 'cafe' ? '☕ Con café' : '🚫 Sin café'}</td>
                    <td>${p.puntaje}</td>
                    <td>${new Date(p.fechaRegistro).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-delete" onclick="eliminarParticipante('${p._id}')">
                            Eliminar
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            document.getElementById('tbodyParticipantes').innerHTML = 
                '<tr><td colspan="6" class="text-center">No hay participantes registrados</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

// Cargar estadísticas y gráficos
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        const result = await response.json();
        
        if (result.success) {
            const { grupoCafe, grupoSinCafe } = result.data;
            
            // Mostrar estadísticas del grupo con café
            if (grupoCafe) {
                document.getElementById('estadisticasCafe').innerHTML = `
                    <p><strong>Participantes:</strong> ${grupoCafe.cantidad}</p>
                    <p><strong>Media:</strong> ${grupoCafe.media}</p>
                    <p><strong>Mediana:</strong> ${grupoCafe.mediana}</p>
                    <p><strong>Moda:</strong> ${grupoCafe.moda.join(', ')}</p>
                    <p><strong>Desv. Estándar:</strong> ${grupoCafe.desviacionEstandar}</p>
                `;
            }
            
            // Mostrar estadísticas del grupo sin café
            if (grupoSinCafe) {
                document.getElementById('estadisticasSinCafe').innerHTML = `
                    <p><strong>Participantes:</strong> ${grupoSinCafe.cantidad}</p>
                    <p><strong>Media:</strong> ${grupoSinCafe.media}</p>
                    <p><strong>Mediana:</strong> ${grupoSinCafe.mediana}</p>
                    <p><strong>Moda:</strong> ${grupoSinCafe.moda.join(', ')}</p>
                    <p><strong>Desv. Estándar:</strong> ${grupoSinCafe.desviacionEstandar}</p>
                `;
            }
            
            // Generar gráficos
            generarGraficos(grupoCafe, grupoSinCafe);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Generar gráficos con Chart.js
function generarGraficos(grupoCafe, grupoSinCafe) {
    // 1. Gráfico de barras comparativo
    const ctxComparacion = document.getElementById('chartComparacion').getContext('2d');
    
    if (chartComparacion) {
        chartComparacion.destroy();
    }
    
    chartComparacion = new Chart(ctxComparacion, {
        type: 'bar',
        data: {
            labels: ['Media', 'Mediana', 'Desv. Estándar'],
            datasets: [
                {
                    label: 'Con Café',
                    data: [
                        grupoCafe?.media || 0,
                        grupoCafe?.mediana || 0,
                        grupoCafe?.desviacionEstandar || 0
                    ],
                    backgroundColor: 'rgba(107, 68, 35, 0.8)',
                    borderColor: 'rgba(107, 68, 35, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Sin Café',
                    data: [
                        grupoSinCafe?.media || 0,
                        grupoSinCafe?.mediana || 0,
                        grupoSinCafe?.desviacionEstandar || 0
                    ],
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
                    font: { size: 18 }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
    
    // 2. Gráfico de distribución de puntajes
    const ctxDistribucion = document.getElementById('chartDistribucion').getContext('2d');
    
    if (chartDistribucion) {
        chartDistribucion.destroy();
    }
    
    chartDistribucion = new Chart(ctxDistribucion, {
        type: 'line',
        data: {
            labels: grupoCafe?.puntajes || [],
            datasets: [
                {
                    label: 'Con Café',
                    data: grupoCafe?.puntajes || [],
                    borderColor: 'rgba(107, 68, 35, 1)',
                    backgroundColor: 'rgba(107, 68, 35, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Sin Café',
                    data: grupoSinCafe?.puntajes || [],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Puntajes',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
    
    // 3. Gráfico de pastel - cantidad por grupo
    const ctxPastel = document.getElementById('chartPastel').getContext('2d');
    
    if (chartPastel) {
        chartPastel.destroy();
    }
    
    chartPastel = new Chart(ctxPastel, {
        type: 'pie',
        data: {
            labels: ['Con Café', 'Sin Café'],
            datasets: [{
                data: [
                    grupoCafe?.cantidad || 0,
                    grupoSinCafe?.cantidad || 0
                ],
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
                    font: { size: 16 }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}