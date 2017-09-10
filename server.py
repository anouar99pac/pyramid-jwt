# -*- coding: utf-8 -*-

'''
1. Active a Pyaramid Virtual

2. Install pip install cherrypy

3. Create a new file server.py  It is this file that includes your application package and serves
 it using CherryPy's web server.

4. To start server we execute   python server.py

https://www.digitalocean.com/community/tutorials/how-to-deploy-pyramid-based-python-wsgi-web-applications

'''
# Import CherryPy
import cherrypy

# Import your application as:
from pyramid.paster import get_app

'''
	Here we call the config production.ini
	this app is used after by web Server CherryPy
'''

# here = os.path.abspath(os.path.dirname(__file__))
# we ll use the file Configuration of production.ini in env Prod

app = get_app('pi.ini')


if __name__ == '__main__':

    # Mount the application (or *app*)
    cherrypy.tree.graft(app, "/")

    # Unsubscribe the default server
    cherrypy.server.unsubscribe()

    # Instantiate a new server object
    server = cherrypy._cpserver.Server()

    # Configure the server object
    server.socket_host = "0.0.0.0"
    server.socket_port = 8880
    server.thread_pool = 30

    # For SSL Support
    # server.ssl_module            = 'pyopenssl'
    # server.ssl_certificate       = 'ssl/certificate.crt'
    # server.ssl_private_key       = 'ssl/private.key'
    # server.ssl_certificate_chain = 'ssl/bundle.crt'

    # Subscribe this server
    server.subscribe()

    # Example for a 2nd server (same steps as above):
    # Remember to use a different port

    # server2             = cherrypy._cpserver.Server()

    # server2.socket_host = "0.0.0.0"
    # server2.socket_port = 8080
    # server2.thread_pool = 30
    # server2.subscribe()

    # Start the server engine (Option 1 *and* 2)

    try:
        cherrypy.engine.start()
    except KeyboardInterrupt:
        cherrypy.engine.stop()

    cherrypy.engine.block()
