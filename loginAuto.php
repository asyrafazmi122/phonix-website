<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbName = "phonix_store";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$input_username = $_POST['username'] ?? '';
$input_password = $_POST['password'] ?? '';

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("SELECT username, password FROM admin WHERE username = ?");
$stmt->bind_param("s", $input_username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Verify password (insecure - just for demonstration)
    // In production, use password_verify() with hashed passwords
    if ($input_password === $row['password']) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $row['username'];
        header("Location: admin_dashboard.html");
        exit();
    } else {
        echo "<script>
                alert('Wrong password. Please try again.');
                window.location.href = 'adminlogin.html';
              </script>";
    }
} else {
    echo "<script>
            alert('Username not found. Please try again.');
            window.location.href = 'adminlogin.html';
          </script>";
}

$stmt->close();
$conn->close();
?>