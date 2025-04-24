<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phonix_store";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->query("SELECT * FROM orders ORDER BY order_date DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert numeric values to proper types
    foreach ($orders as &$order) {
        $order['order_id'] = (int)$order['order_id'];
        $order['quantity'] = (int)$order['quantity'];
        $order['total_price'] = (float)$order['total_price'];
    }

    echo json_encode($orders);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>