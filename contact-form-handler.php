<?php
    $name = $_POST['name'];
    $visitor_email = §_POST['email'];
    $message = $_POST['message'];

    $email_from = 'scheifler.tim@web.de';

    $email_subject = "New Form Submission";

    $email_body = "User Name: $name.\n".
        "Email: $visitor_email.\n".
        "Message: $message.\n";

    $to = "tim.scheifler@web.de";

    $headers = "From: $email_from \r\n";

    $headers .="Reply-To: $visitor_email \r\n";

    mail($to,$email_subject,$email_body,$headers);

    header("Location: game.html");
?>