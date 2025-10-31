// Manejo del checkbox de anónimo
const anonimoCheck = document.getElementById('anonimo');
const datosPersonales = document.getElementById('datosPersonales');

anonimoCheck.addEventListener('change', function() {
    if (this.checked) {
        datosPersonales.style.opacity = '0.5';
        datosPersonales.style.pointerEvents = 'none';
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
    } else {
        datosPersonales.style.opacity = '1';
        datosPersonales.style.pointerEvents = 'auto';
    }
});

// Manejo del formulario
const form = document.getElementById('denunciaForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Recopilar datos
    const esAnonimo = document.getElementById('anonimo').checked;
    const datos = {
        id: 'REP-' + Date.now(),
        fecha_reporte: new Date().toLocaleString('es-CO'),
        anonimo: esAnonimo,
        nombre: esAnonimo ? 'Anónimo' : document.getElementById('nombre').value,
        email: esAnonimo ? '' : document.getElementById('email').value,
        tipo_acoso: document.getElementById('tipoAcoso').value,
        fecha_incidente: document.getElementById('fecha').value,
        lugar: document.getElementById('lugar').value,
        descripcion: document.getElementById('descripcion').value
    };
    
    // Validar
    if (!datos.tipo_acoso || !datos.descripcion) {
        mostrarMensaje('Por favor completa los campos obligatorios', 'error');
        return;
    }
    
    if (datos.descripcion.length < 20) {
        mostrarMensaje('La descripción debe tener al menos 20 caracteres', 'error');
        return;
    }
    
    try {
        // Guardar en JSON mediante PHP
        const response = await fetch('guardar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensaje(
                `✅ Reporte enviado exitosamente.<br>
                ID de seguimiento: <strong>${datos.id}</strong><br>
                Guarda este ID para hacer seguimiento.`,
                'success'
            );
            form.reset();
            
            // Scroll al mensaje
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            mostrarMensaje('❌ Error al enviar el reporte. Intenta nuevamente.', 'error');
        }
    } catch (error) {
        mostrarMensaje('❌ Error de conexión. Verifica tu conexión a internet.', 'error');
    }
});

function mostrarMensaje(texto, tipo) {
    mensaje.innerHTML = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';
    
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 8000);
}

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contador de checklist
const checkboxes = document.querySelectorAll('.check-item input');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const checked = document.querySelectorAll('.check-item input:checked').length;
        
        if (checked >= 2) {
            const alert = document.querySelector('.alert');
            alert.style.background = '#fee2e2';
            alert.style.borderColor = '#ef4444';
            alert.innerHTML = `
                ⚠️ <strong>Has identificado ${checked} señales.</strong><br>
                Considera buscar apoyo. No estás solo/a.
                <a href="#denuncia" style="color: #991b1b; text-decoration: underline; font-weight: bold;">
                    Reportar ahora
                </a>
            `;
        }
    });
});