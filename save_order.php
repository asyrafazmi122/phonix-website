<?php
header('Content-Type: application/json');

// Database config
$config = [
    'host' => 'localhost',
    'dbname' => 'phonix_store',
    'username' => 'root',
    'password' => ''
];

try {
    // Connect to database
    $conn = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']}",
        $config['username'],
        $config['password']
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception("Invalid input data");
    }

    // Prepare and execute query
    $stmt = $conn->prepare("
        INSERT INTO orders (
            phone_model, quantity, total_price, payment_method,
            customer_name, customer_phone, customer_email
        ) VALUES (
            :phone_model, :quantity, :total_price, :payment_method,
            :customer_name, :customer_phone, :customer_email
        )
    ");
    
    $stmt->execute([
        ':phone_model' => $input['phone_model'],
        ':quantity' => $input['quantity'],
        ':total_price' => $input['total_price'],
        ':payment_method' => $input['payment_method'],
        ':customer_name' => $input['customer_name'],
        ':customer_phone' => $input['customer_phone'],
        ':customer_email' => $input['customer_email']
    ]);

    // Return success
    echo json_encode([
        'success' => true,
        'order_id' => $conn->lastInsertId(),
        'message' => 'Order processed successfully'
    ]);

} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>