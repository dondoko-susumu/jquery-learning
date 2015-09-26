<?php
  $data = array();
  
  /* GETメソッドで受信したら$_GET
     POSTメソッドで受信したら$_POSTからデータを受け取る */
  $data['name'] = isset($_GET['name']) ? $_GET['name'] : $_POST['name'];
  $data['method'] = $_SERVER['REQUEST_METHOD'];

  if(!isset($data['name']) || $data['name'] == null) $name = '!!no-data!!';

  // WebブラウザにJSON形式でデータを送信
  header('Content-type: application/json');
  print json_encode($data);
?>
