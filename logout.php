<?php
session_start();
session_unset();
session_destroy();

// Redirect to admin login page
header("Location: adminlogin.html");
exit();
?>