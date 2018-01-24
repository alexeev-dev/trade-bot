<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

function signRequest($request) {
  return hash_hmac('sha512', $request, 'da67943fbfdd4fa9b43f3e8f8c0d4c76');
}

function getNonce() {
  return time() - 1000000000;
}

$app->get('/info', function (Request $request, Response $response, array $args) {
  $nonce = getNonce();
  $curl = new Curl\Curl();
  $curl->setHeader('Key', '92CCCF06A999982E166B6F7277C95F3B');
  $curl->setHeader('Sign', signRequest("method=getInfo&nonce=$nonce"));
  $curl->post('https://yobit.net/tapi/', [
    'method' => 'getInfo',
    'nonce' => $nonce
  ]);
  return $response->withHeader('Content-Type', 'application/json')->write($curl->response);
});

$app->get('/trade', function (Request $request, Response $response, array $args) {
  $nonce = getNonce();
  $curl = new Curl\Curl();
  $curl->setHeader('Key', '92CCCF06A999982E166B6F7277C95F3B');
  $curl->setHeader('Sign', signRequest("method=Trade&pair=eth_btc&type=sell&rate=0.09200010&amount=0.004&nonce=$nonce"));
  $curl->post('https://yobit.net/tapi/', [
    'method' => 'Trade',
    'pair' => 'eth_btc',
    'type' => 'sell',
    'rate' => '0.09200010',
    'amount' => '0.004',
    'nonce' => $nonce
  ]);
  return $response->withHeader('Content-Type', 'application/json')->write($curl->response);
});

$app->get('/api/status', function (Request $request, Response $response, array $args) {
  $data = $request->getQueryParams();
  $order = $data['order'];
  $nonce = getNonce();
  $curl = new Curl\Curl();
  $curl->setHeader('Key', '92CCCF06A999982E166B6F7277C95F3B');
  $curl->setHeader('Sign', signRequest("method=OrderInfo&order_id=$order&nonce=$nonce"));
  $curl->post('https://yobit.net/tapi/', [
    'method' => 'OrderInfo',
    'order_id' => $order,
    'nonce' => $nonce
  ]);
  return $response->withHeader('Content-Type', 'application/json')->write($curl->response);
});

$app->post('/api/sell', function (Request $request, Response $response, array $args) {
  $data = $request->getParsedBody();
  $amount = $data['amount'];
  $price = $data['price'];
  $nonce = getNonce();
  $curl = new Curl\Curl();
  $curl->setHeader('Key', '92CCCF06A999982E166B6F7277C95F3B');
  $curl->setHeader('Sign', signRequest("method=Trade&pair=eth_btc&type=sell&rate=$price&amount=$amount&nonce=$nonce"));
  $curl->post('https://yobit.net/tapi/', [
    'method' => 'Trade',
    'pair' => 'eth_btc',
    'type' => 'sell',
    'rate' => $price,
    'amount' => $amount,
    'nonce' => $nonce
  ]);
  if ($curl->error) {
    return $response->withJson([
      'success' => 0,
      'error' => $curl->error_code
    ]);
  } else {
    return $response->withHeader('Content-Type', 'application/json')->write($curl->response);
  }
});

$app->post('/api/buy', function (Request $request, Response $response, array $args) {
  $data = $request->getParsedBody();
  $amount = $data['amount'];
  $price = $data['price'];
  $nonce = getNonce();
  $curl = new Curl\Curl();
  $curl->setHeader('Key', '92CCCF06A999982E166B6F7277C95F3B');
  $curl->setHeader('Sign', signRequest("method=Trade&pair=eth_btc&type=buy&rate=$price&amount=$amount&nonce=$nonce"));
  $curl->post('https://yobit.net/tapi/', [
    'method' => 'Trade',
    'pair' => 'eth_btc',
    'type' => 'buy',
    'rate' => $price,
    'amount' => $amount,
    'nonce' => $nonce
  ]);
  if ($curl->error) {
    return $response->withJson([
      'success' => 0,
      'error' => $curl->error_code
    ]);
  } else {
    return $response->withHeader('Content-Type', 'application/json')->write($curl->response);
  }
});

$app->get('/', function (Request $request, Response $response, array $args) {
  return $this->renderer->render($response, 'index.phtml');
});
