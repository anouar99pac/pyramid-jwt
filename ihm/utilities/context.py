# -*- coding: utf-8 -*-
from pyramid.httpexceptions import HTTPNotFound


def is_webapp():
    """
        are we conneted in WebApp
    """
    try:
        import webapp
    except ImportError:
        return False
    return True


def is_tools():
    """
        are we conneted in Tools
    """
    try:
        import tools
    except ImportError:
        return False
    return True


def denied_tools_views():
    """
        In tools views we must to deny access of url
        in the Production WebApp
    """
    def decorated(view_function):
        def wrapper(request):
            if is_webapp() and not is_tools():
                return HTTPNotFound()
            elif not is_webapp() and not is_tools():
                return HTTPNotFound()

            return view_function(request)
        return wrapper
    return decorated
