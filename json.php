<?php
  // P.385 Ajax同期通信テスト

  // 検索用のデータ
  $obj = array(
    'webtech' => array('HTML','CSS','JavaScript'),
    'jQuery' => array('jQuery', 'jQuery UI')
  );

  // レスポンスの生成
  $response = array('response' => array(
    'name' => $_GET['name'],
    'tech' => isset($obj[$_GET['name']]) ? $obj[$_GET['name']] : array()
  ));

  header('Content-Type: application/json');
  print json_encode($response);
?>
