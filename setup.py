# -*- coding: utf-8 -*-
import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()
with open(os.path.join(here, 'external_requirements.txt')) as f:
    requires = f.readlines()

setup(
    name='ihm',
    version='0.7.10.dev0',
    description='ihm',
    long_description=README + '\n\n' + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='ANOUAR MOKHTARI',
    author_email='',
    url='',
    keywords='web wsgi bfg pylons pyramid',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    test_suite='ihm',
    install_requires=requires,
    entry_points="""\
    [paste.app_factory]
    main = ihm:main
    """,
    message_extractors={'.': [
        ('ihm/**.py', 'lingua_python', None),
        ('ihm/**.pt', 'lingua_xml', None),
        ('ihm/**.html', 'html', None),
        ('ihm/**.py', 'python', None),
        ('ihm/**.js', 'js', None),
    ]},
)
