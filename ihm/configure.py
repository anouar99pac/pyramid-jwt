# -*- coding: utf-8 -*-
import logging
from pyramid.events import NewRequest
from ihm.routes import add_routes as add_ihm_routes

logger = logging.getLogger('ihm')


def _load_plugin(config, plugin):
    """
    Chargement dynamique des routes et views du plugin.
    On considère que:
        * les routes sont définies dans une fonction add_routes dans
    un fichier routes à la racine du projet du plugin.
        * Le dossier static est aussi à la racine du projet

    """
    logger.debug(u"trying to logging plugin '%s'", plugin)
    static_dir = u'%s:static' % plugin
    static_name = u'static_%s' % plugin
    config.add_static_view(static_name, static_dir, cache_max_age=3600)

    path_routes = u'%s.routes' % plugin
    add_routes = __import__(
        path_routes, globals(), locals(), ['add_routes'], -1).add_routes

    config.include(add_routes)
    config.scan(plugin)
    logger.info(u'plugin %s loaded successfully', plugin)


def configure_app(config, plugins):
    """
    Configuration et chargement dynamiques des views et routes des différents
    plugins
    """
    config.add_static_view('static', 'ihm:static', cache_max_age=3600)
    config.include(add_ihm_routes)
    config.scan()

    for plugin in plugins:
        try:
            __import__(plugin)
        except ImportError:
            logger.error(u'plugin %s unavalaible', plugin)
        else:
            _load_plugin(config, plugin)


def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })

    event.request.add_response_callback(cors_headers)
