<?php

    $host = "localhost";
    $db_name = "appDatabase";
    $username = "root";
    $password = "password";
    $connection = null;

    try{
    $connection = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

function saveData($email, $password){
    global $connection;
    $query = "INSERT INTO accounts VALUES (NULL,$email,$password);

    $callToDb = $connection->prepare( $query );
    $email=htmlspecialchars(strip_tags($email));
    $password=htmlspecialchars(strip_tags($password));
    $callToDb->bindParam(":email",$email);
    $callToDb->bindParam(":password",$password);

    if($callToDb->execute()){
        return '<h3 style=test-align:center;">We Will get back to you very shortly!</h3>';
    }
}

if( isset($_POST['submit'])){
$email = htmlentities($_POST['email']);
$password = htmlentities($_POST['password']);

$result = saveData($email, $password);
echo $result;
}
else{
echo '<h3 style="test-align:center;">A very detailed error message </h3>';
}

?>

