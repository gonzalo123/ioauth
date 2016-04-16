<?php

include __DIR__ . "/../vendor/autoload.php";

use Silex\Application;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

$app = new Application();

$app->register(new SessionServiceProvider());
$app->register(new TwigServiceProvider(), [
    'twig.path' => __DIR__ . '/../views',
]);

$app->get('/', function (Application $app) {
    return $app['twig']->render('home.twig');
});

$app->get('/login', function () use ($app) {
    $username = $app['request']->server->get('PHP_AUTH_USER', false);
    $password = $app['request']->server->get('PHP_AUTH_PW');

    if ('gonzalo' === $username && 'password' === $password) {
        $app['session']->set('user', ['username' => $username]);

        return $app->redirect('/private');
    }

    $response = new Response();
    $response->headers->set('WWW-Authenticate', sprintf('Basic realm="%s"', 'site_login'));
    $response->setStatusCode(401, 'Please sign in.');

    return $response;
});

$app->get('/private', function () use ($app) {
    $user = $app['session']->get('user');
    if (null === $user) {
        throw new AccessDeniedHttpException('Access Denied');
    }

    return $app['twig']->render('private.twig', [
        'username'  => $user['username'],
        'sessionId' => $app['session']->getId()
    ]);
});

$app->run();