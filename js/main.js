// Handle anonymous checkbox
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

// Form handling
const form = document.getElementById('denunciaForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect data
    const esAnonimo = document.getElementById('anonimo').checked;
    const datos = {
        id: 'REP-' + Date.now(),
        fecha_reporte: new Date().toLocaleString('en-US'),
        anonimo: esAnonimo,
        nombre: esAnonimo ? 'Anonymous' : document.getElementById('nombre').value,
        email: esAnonimo ? '' : document.getElementById('email').value,
        tipo_acoso: document.getElementById('tipoAcoso').value,
        fecha_incidente: document.getElementById('fecha').value,
        lugar: document.getElementById('lugar').value,
        descripcion: document.getElementById('descripcion').value
    };
    
    // Validate
    if (!datos.tipo_acoso || !datos.descripcion) {
        mostrarMensaje('Please complete the required fields', 'error');
        return;
    }
    
    if (datos.descripcion.length < 20) {
        mostrarMensaje('Description must be at least 20 characters', 'error');
        return;
    }
    
    try {
        // Save to JSON via PHP
        const response = await fetch('save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensaje(
                `✅ Report submitted successfully.<br>
                Tracking ID: <strong>${datos.id}</strong><br>
                Save this ID for follow-up.`,
                'success'
            );
            form.reset();
            
            // Scroll to message
            mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            mostrarMensaje('❌ Error submitting report. Please try again.', 'error');
        }
    } catch (error) {
        mostrarMensaje('❌ Connection error. Check your internet connection.', 'error');
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

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Checklist counter
const checkboxes = document.querySelectorAll('.check-item input');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const checked = document.querySelectorAll('.check-item input:checked').length;
        
        if (checked >= 2) {
            const alert = document.querySelector('.alert');
            alert.style.background = '#fee2e2';
            alert.style.borderColor = '#ef4444';
            alert.innerHTML = `
                ⚠️ <strong>You've identified ${checked} warning signs.</strong><br>
                Consider seeking support. You're not alone.
                <a href="#denuncia" style="color: #991b1b; text-decoration: underline; font-weight: bold;">
                    Report now
                </a>
            `;
        }
    });
});