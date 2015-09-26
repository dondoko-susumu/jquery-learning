<?php
  if ($_SERVER['REQUEST_METHOD']=='GET'){
    $xml = simplexml_load_string($_GET['xml']);
  } elseif ($_SERVER['REQUEST_METHOD']=='POST'){
    //読み込み専用ストリーム(php://input)からXML形式の文字列を読み込む
    $xml = simplexml_load_file('php://input');
  }else{
    $xml = array();
    $xml['title'] = 'データがありません';
  }

  header('Content-type: application/json');
  print json_encode($xml);

