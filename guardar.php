<?php
header('Content-Type: application/json');

// Directory to save reports
$dir = __DIR__ . '/data/reportes/';

// Create directory if it doesn't exist
if (!file_exists($dir)) {
    mkdir($dir, 0755, true);
}

// Read POST data
$json = file_get_contents('php://input');
$datos = json_decode($json, true);

// Validate basic data
if (!$datos || !isset($datos['id']) || !isset($datos['descripcion'])) {
    echo json_encode(['success' => false, 'error' => 'Incomplete data']);
    exit;
}

// Sanitize data
$reporte = [
    'id' => htmlspecialchars($datos['id']),
    'fecha_reporte' => htmlspecialchars($datos['fecha_reporte']),
    'anonimo' => $datos['anonimo'] ? true : false,
    'nombre' => htmlspecialchars($datos['nombre'] ?? 'Anonymous'),
    'email' => filter_var($datos['email'] ?? '', FILTER_SANITIZE_EMAIL),
    'tipo_acoso' => htmlspecialchars($datos['tipo_acoso']),
    'fecha_incidente' => htmlspecialchars($datos['fecha_incidente'] ?? ''),
    'lugar' => htmlspecialchars($datos['lugar'] ?? ''),
    'descripcion' => htmlspecialchars($datos['descripcion']),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'timestamp' => time()
];

// Save to JSON file
$archivo = $dir . $reporte['id'] . '.json';
$resultado = file_put_contents($archivo, json_encode($reporte, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($resultado !== false) {
    // Simple log
    $log = date('Y-m-d H:i:s') . " - Report saved: " . $reporte['id'] . "\n";
    file_put_contents(__DIR__ . '/data/log.txt', $log, FILE_APPEND);
    
    echo json_encode(['success' => true, 'id' => $reporte['id']]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error saving report']);
}
?>