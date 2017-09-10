# -*- coding: utf-8 -*-
from os.path import dirname, join, isfile
from pyramid.httpexceptions import HTTPNotFound
from pyramid.settings import aslist


def check_request_fields(fields, method='POST'):
    def decorated(view_function):
        def wrapper(request):
            if method == 'POST':
                params = request.POST
            elif method == 'GET':
                params = request.GET

            if not params:
                return HTTPNotFound()

            for field in fields:
                if not (field in params and params[field]):
                    return HTTPNotFound()
            return view_function(request)
        return wrapper
    return decorated


def get_url_if_route_exists(request, route_name):
    if request.registry.introspector.get('routes', route_name):
        url = request.route_url(route_name)
    else:
        url = request.current_route_url()

    return url

def check_if_plugin_exist(request, route_name):
    if request.registry.introspector.get('routes', route_name):
        return True
    else:
        return False 


def include_script_if_exists(request, path):
    path_parts = path.split(':')
    if len(path_parts) != 2:
        raise Exception('Argument path should be : <module name>:<relative path to file>')
    module_name = path_parts[0]
    relative_path = path_parts[1]

    module = get_module_if_plugin_exists(request, module_name)
    if not module:
        return ''

    module_root_path = dirname(module.__file__)
    absolute_path = join(module_root_path, relative_path)
    if isfile(absolute_path):
        output = '<script type="text/javascript" src="'
        output += request.static_url(path)
        output += '"></script>'
    else:
        output = ''

    return output


def include_style_if_exists(request, path):
    path_parts = path.split(':')
    if len(path_parts) != 2:
        raise Exception('Argument path should be : <module name>:<relative path to file>')
    module_name = path_parts[0]
    relative_path = path_parts[1]

    module = get_module_if_plugin_exists(request, module_name)
    if not module:
        return ''

    module_root_path = dirname(module.__file__)
    absolute_path = join(module_root_path, relative_path)
    if isfile(absolute_path):
        output = '<link rel="stylesheet" href="'
        output += request.static_url(path)
        output += '"></link>'
    else:
        output = ''

    return output


def get_module_if_plugin_exists(request, module_name):

    list_modules = aslist(request.registry.settings.get('plugins', []))
    if module_name not in list_modules:
        return None

    try:
        module = __import__(module_name)
    except ImportError:
        return None
    return module


def verify_if_route_exists(request, route_name):
    if request.registry.introspector.get('routes', route_name):
        url = request.route_url(route_name)
        return True
    else:
        url = request.current_route_url()
        return False
