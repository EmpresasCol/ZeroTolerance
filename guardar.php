<?php
header('Content-Type: application/json');

// Directorio para guardar reportes
$dir = __DIR__ . '/data/reportes/';

// Crear directorio si no existe
if (!file_exists($dir)) {
    mkdir($dir, 0755, true);
}

// Leer datos del POST
$json = file_get_contents('php://input');
$datos = json_decode($json, true);

// Validar datos básicos
if (!$datos || !isset($datos['id']) || !isset($datos['descripcion'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

// Sanitizar datos
$reporte = [
    'id' => htmlspecialchars($datos['id']),
    'fecha_reporte' => htmlspecialchars($datos['fecha_reporte']),
    'anonimo' => $datos['anonimo'] ? true : false,
    'nombre' => htmlspecialchars($datos['nombre'] ?? 'Anónimo'),
    'email' => filter_var($datos['email'] ?? '', FILTER_SANITIZE_EMAIL),
    'tipo_acoso' => htmlspecialchars($datos['tipo_acoso']),
    'fecha_incidente' => htmlspecialchars($datos['fecha_incidente'] ?? ''),
    'lugar' => htmlspecialchars($datos['lugar'] ?? ''),
    'descripcion' => htmlspecialchars($datos['descripcion']),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'desconocida',
    'timestamp' => time()
];

// Guardar en archivo JSON
$archivo = $dir . $reporte['id'] . '.json';
$resultado = file_put_contents($archivo, json_encode($reporte, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($resultado !== false) {
    // Log simple
    $log = date('Y-m-d H:i:s') . " - Reporte guardado: " . $reporte['id'] . "\n";
    file_put_contents(__DIR__ . '/data/log.txt', $log, FILE_APPEND);
    
    echo json_encode(['success' => true, 'id' => $reporte['id']]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar']);
}
?>