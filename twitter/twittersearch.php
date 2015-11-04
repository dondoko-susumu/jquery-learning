<?php

require "vendor/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

define('CONSUMER_KEY'   , '2yDVTxyAwaVCKqx2rjA80DU0x');
define('CONSUMER_SECRET', 'c6ZKPJ3OAB7mQSLE2CtUrqjv6ZFenLFZRyel5CttF4UzrJ1HJc');
$access_token          =  '300274607-grrV4b58fC6pRvNvhroqQJE2MwWoaiD2yw4VwEHe';
$access_token_secret   =  'd6Bc3MV42po07pWRdxQqDeyXWTG9Fo31VY2j4EiFnSAAX';

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);

//返り値をphp objectではなくarray型にする
$connection->setDecodeJsonAsArray(true);

//$content = $connection->get("account/verify_credentials");
//var_dump($content);
//
$statuses = $connection->get("search/tweets", $_GET);
//var_dump($statuses);

//Array -> json
$json=json_encode($statuses);
//var_dump($json);

header("Content-Type: application/json; charset=utf-8");
echo $json;
