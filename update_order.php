<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phonix_store";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    
    // First approach: Update without recalculating price
    $stmt = $conn->prepare("UPDATE orders SET 
        phone_model = :phone_model,
        quantity = :quantity,
        payment_method = :payment_method,
        customer_name = :customer_name,
        customer_phone = :customer_phone,
        customer_email = :customer_email
        WHERE order_id = :order_id");
    
    $stmt->bindParam(':phone_model', $data['phone_model']);
    $stmt->bindParam(':quantity', $data['quantity'], PDO::PARAM_INT);
    $stmt->bindParam(':payment_method', $data['payment_method']);
    $stmt->bindParam(':customer_name', $data['customer_name']);
    $stmt->bindParam(':customer_phone', $data['customer_phone']);
    $stmt->bindParam(':customer_email', $data['customer_email']);
    $stmt->bindParam(':order_id', $data['order_id'], PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>