# -*- coding: utf-8 -*-


def add_routes(config):  # pylint: disable=R0915
    """ Configuration des urls
    """
    # broken out of main() so it can be used by unit tests
    #config.add_route('accueil', '/neteven')

    config.add_route('home', '/')

    config.add_route('test','/test-api')

    config.add_route(
        'neteven_json_web_token',
        '/neteven/json-web-token'
    )

    config.add_route(
        'neteven_credentials',
        '/neteven/credentials'
    )
