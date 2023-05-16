<?php 

if($_POST) {
    header('Content-Type: application/json; charset=utf-8');

    $to = 'petar@digitalpresent.mk';
    $subject = "New message from website";

    $body = "Hi,<br> You have new message from website<br><br>";
    
    foreach($_POST as $key=>$value){
        $body .= "<b>". str_replace("_"," ",$key) .":</b> ". $value. "<br>";
    }

    $headers = 'Content-Type: text/html; charset=UTF-8'. "\r\n" .'From: '.$_POST['First_name'].' <'.$_POST['Email'].'>';    


    if(mail( $to, $subject, $body, $headers)) {
        echo json_encode([
            'status' => true,
            'message' => 'Thank you for contacting us!',
        ]);
        die();
    }
    echo json_encode([
        'status' => false,
        'message' => "Something went wrong. Please try again!",
    ]);
    die();
}
die();

