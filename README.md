
![MIT License][license-image]

# Full-featured nodejs CMS

## Installation

1. install and run [mongodb](https://www.mongodb.org/downloads)
2. install graphicsmagick `brew install ghostscript` and `brew install graphicsmagick`, or [graphicsmagick on windows](http://www.graphicsmagick.org/download.html#download-sites) 
3. download, unzip cms
4. cd inside folder, then `npm install` to download modules
5. run cms with `node debug.js` ,or `node release.js` in production


## Requirements
- nodejs >= 4.0.0
- running mongodb > 2

## Next Steps
1. goto http://localhost:8080/cmsadmin
2. click "sign up" and enter admin email/pass - this will create first admin user
3. log in
4. check config-debug, config-release to setup mailer, or app name (it is used as database name, if there is no database specified)
5. enjoy + check website [nodee.io](https://nodee.io) for more information and documentation

![nodee CMS concept](https://nodee.io/images/page1_jpg.jpg)

[Learn more here](https://nodee.io/docs/cms/concept)

# Nodee CMS – the Concept

Nodee CMS was born to handle almost any data viewing and the editing scenario. Yes, many good content management systems can do this, but it often means developing new plugins, data structures, types of data editors in the administration area, etc… So, here comes new CMS concept, build with modern technologies for modern websites.

## Always see what you are editing
Editing content has to be easy for all content managers. Therefore, onsite (or inline) editing is like a must. We don’t want to go to content pages lists or menu settings forms located somewhere in the admin area, dedicated from the page design. We want to see changes immediately.

## Widgets everywhere
Every template is a widget. Some are used like layouts, some like pages, but can be reused like widgets. If inside template HTML is defined widgets container like `<div e-container=”container_name”>`, widgets can be added by content managers. Or using `<widget template=”widget_template”>` as fixed page partials. Every widget can have attributes. Attributes represent widget settings and can be edited by content managers.

## Templates – “2-way data binding”
Same way as data are rendered, they are parsed and stored. Entire flow has 3 steps: render HTML --> manipulate HTML by content manager (send it back) --> parse, extract data and store in database.
1.    Rendering - Let’s take a look at rendering closer (controller --> mapping --> html):
-    Widget (or template) controller – can manipulate model (model is by default CmsDocument), or directly send response
-    Data mapping – easy mapping via CSS selectors defines how data have to be rendered or injected to HTML template
-    HTML template – plain html, only very few special html tag are used (e.g. layout, widget, ...) 

2.    Editing content: ok, now we have rendered HTML page. So we can go to the content administration area and apply all widget editors on this HTML. As a result, we can change texts, images, lists, etc… Editors are defined by CSS selectors, and, of course, can be extended.

3.    Parsing and Storing data (mapping --> parser --> storing):
-    Mapping - thanks to mapping and HTML separation, we can parse data back (by default, same mapping for rendering and parsing is used, but you can different if parse mapping is defined)
-    Parser – parser is like controller, it can modify data before storing, but cannot change response
-    Storing – after successful parsing, data from “content” property of result object is stored as content of cms document 

## Front-end developers love it
We don’t like auto-generated components like forms, menus, or carousels, because every front-end is unique, has own styles, layouts, javascript, etc... We want freedom when choosing what will be component looks like, what javascript framework will be used, and how will be data loaded (AJAX, or rendered on the server). Instead of build your own widgets directly in the administration area, and reuse them.

## Strong REST API
Of course, API is very useful when we need to migrate content, run some scheduled tasks, or do something from outside. Every user has auto-generated API key. If you want to activate it, just define IPs from which requests are allowed, or simple type “*” to allow any IP. Then you can request all cms resources used by admin area path (/admin/…), of course, have to be allowed by the role of a user.

## Forms like you always wish 
Forms are something like simple data models. Instead of generating HTML forms, they are publishing API, which can be used as rest endpoint when calling from AJAX (e.g. POST JSON /cmsforms/formId), in old fashioned HTML form way with query parameters or hidden inputs, or from internal API as CmsForm model. If you want pair multiple forms data on some key, just decide which property will be pairing key. You can ask visitors questions in multiple steps, or later, and send different emails. Sending emails can be triggered when some form property is defined or updated, etc…

## Customize anything – thanks to total.js
Total.js is full-featured, well designed, and very fast nodejs framework. You can extend or replace anything: serving static files, generating e-tags, authentication, authorization, controller behaviors, etc… It brings nice modularity approach. You can use modules, or whole packages to extend cms functionality.

## Business ready
NodeJS is a serious platform. It really can replace some technologies used today. So, why stop with something like basic cms. Let’s make something ready for real business needs.
Planned features:
-    Content editors roles, permissions, and workflow
-    Content versioning
-    Member areas (define non-public areas on website, which are enabled only for registered members)
-    Full-text search - sync with Elastic


[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
