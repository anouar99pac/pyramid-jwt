# -*- coding: utf-8 -*-

import logging
from pyramid.renderers import get_renderer
from pyramid.events import(
    subscriber,
    BeforeRender,
    # AfterTraversal
)
# from pyramid.security import (
#    authenticated_userid,
# )

logger = logging.getLogger('ihm')


@subscriber(BeforeRender)
def add_base_template(event):
    # Récupération de la version déployée. Au niveau de ihm, on ne sait pas si
    # on est dans webapp ou dans tools donc on essaie d'importer les projets
    # l'un après l'autre
    VERSION = "0.1.0"
    base_iframe = get_renderer(
        'static/templates/base_iframe.pt').implementation()
    event.update({
        'base_iframe': base_iframe,
        'VERSION': VERSION
    })
