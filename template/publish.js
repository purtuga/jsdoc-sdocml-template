/**
 * jsdoc-sdocml-template
 * Generate an sdocml file from the jsdoc parsed source content.
 *
 * Find out more here: https://github.com/purtuga/jsdoc-sdocml-template
 *
 * MIT License
 * 2014 (c) Paul Tavares | http://paultavares.wordpress.com/
 */
var fs      = require( 'jsdoc/fs' ),
    path    = require( 'jsdoc/path' );

// Function below was borrowed from jsdoc's haruki template
// See https://github.com/jsdoc3/jsdoc/tree/master/templates/haruki
function graft(parentNode, childNodes, parentLongname, parentName) {
    childNodes
    .filter(function (element) {
        return (element.memberof === parentLongname);
    })
    .forEach(function (element, index) {
        var i,
            len;

        if (element.kind === 'namespace') {
            if (! parentNode.namespaces) {
                parentNode.namespaces = [];
            }

            var thisNamespace = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            parentNode.namespaces.push(thisNamespace);

            graft(thisNamespace, childNodes, element.longname, element.name);
        }
        else if (element.kind === 'mixin') {
            if (! parentNode.mixins) {
                parentNode.mixins = [];
            }

            var thisMixin = {
                'name': element.name,
                'description': element.description || '',
                'access': element.access || '',
                'virtual': !!element.virtual
            };

            parentNode.mixins.push(thisMixin);

            graft(thisMixin, childNodes, element.longname, element.name);
        }
        else if (element.kind === 'function') {
            if (! parentNode.functions) {
                parentNode.functions = [];
            }

            var thisFunction = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [ ],
                'examples': []
            };

            parentNode.functions.push(thisFunction);

            if (element.returns) {
                thisFunction.returns = {
                    'type': element.returns[0].type? (element.returns[0].type.names.length === 1? element.returns[0].type.names[0] : element.returns[0].type.names) : '',
                    'description': element.returns[0].description || ''
                };
            }

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisFunction.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisFunction.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
        }
        else if (element.kind === 'member') {
            if (! parentNode.properties) {
                parentNode.properties = [];
            }
            parentNode.properties.push({
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'type': element.type? (element.type.names.length === 1? element.type.names[0] : element.type.names) : ''
                // 'type': element.type? (element.type.length === 1? element.type[0] : element.type) : ''
            });
        }

        else if (element.kind === 'event') {
            if (! parentNode.events) {
                parentNode.events = [];
            }

            var thisEvent = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description || '',
                'parameters': [],
                'examples': []
            };

            parentNode.events.push(thisEvent);

            if (element.returns) {
                thisEvent.returns = {
                    'type': element.returns.type? (element.returns.type.names.length === 1? element.returns.type.names[0] : element.returns.type.names) : '',
                    'description': element.returns.description || ''
                };
            }

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisEvent.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisEvent.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
        }
        else if (element.kind === 'class') {
            if (! parentNode.classes) {
                parentNode.classes = [];
            }

            var thisClass = {
                'name': element.name,
                'description': element.classdesc || element.description || '',
                'extends': element.augments || [],
                'access': element.access || '',
                'virtual': !!element.virtual,
                'fires': element.fires || '',
                'constructor': {
                    'name': element.name,
                    'description': element.description || '',
                    'parameters': [
                    ],
                    'examples': []
                }
            };

            parentNode.classes.push(thisClass);

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisClass.constructor.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisClass.constructor.parameters.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }

            graft(thisClass, childNodes, element.longname, element.name);
       }
       else if (element.kind === "module") {

           if (! parentNode.modules) {
                parentNode.modules = [];
            }

            var thisModule = {
                'name': element.name,
                'longname': element.longname || ''
            };

            parentNode.modules.push(thisModule);

            graft(thisModule, childNodes, element.longname, element.name);

       }
    });
}


/**
 * Builds the SDOCML Documentation
 *
 * @param {Object} graftData
 *
 * @return {String}
 *      XML string - the SDOCML document
 */
function buildDoc(graftData) {

    var i,j,
        doc         = '<?xml version="1.0"?>' + "\n<javascript>",
        classList   = [];

    function cleanTypeExpressions(typeVal) {

        if (!typeVal) {
            return "";
        }

        return String(typeVal)
                .replace(/\.?<.*>/g, '')
                .replace(/[#~\/\\]/g, '.')
                .replace(/.*?\./, '');

    }

    function getClassMethodName(jsdocName) {

        return String(jsdocName)
                .replace(/.*?\./, '')
                .replace(/[#~]/g, '.');

    }

    function escapeXML(xmlString) {

        if ( typeof xmlString !== "string" ) {

            return "";

        }

        return xmlString
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/'/g,"&apos;")
                .replace(/"/g,"&quot;");

    }

    function buildXmlProperties(propList) {

        var propXml = '';

        if (propList) {

            propList.forEach(function(prop){

                propXml += "\n<property name=\"" +
                    prop.name + '" type="' +
                    (cleanTypeExpressions( prop.type ) || 'Object') + '">' +
                    (
                            prop.description
                        ?   "\n<description>" + escapeXML(prop.description) + '</description>'
                        :   ''
                    ) + "\n</property>";

            });

        }

        return propXml;

    }


    function buildReturnTypes(types) {

        if (!types) {

            return "";

        }

        if (!Array.isArray(types)) {

            types = [ types ];

        }

        var xmlString = "\n<return-types>";

        types.forEach(function(thisType){

            xmlString += "\n<return-type type=\"" +
                        cleanTypeExpressions( getClassMethodName(thisType) )  +
                        "\"/>";

        });

        xmlString += "\n</return-types>";

        return xmlString;

    }

    function buildXmlMethods(methodList){

        var methods = '';

        if (methodList) {

            methodList.forEach(function(method){

                methods += "\n<method name=\"" + method.name + '" scope="instance">' +
                        "\n<description>" + escapeXML(method.description) + '</description>' +
                        "\n<parameters>" +
                        buildXmlParameters(method.parameters) +
                        "\n</parameters>" +
                        (
                            method.returns
                            ?   ( buildReturnTypes( method.returns.type ) )
                            :   ""
                        ) +
                        "\n</method>";

            });

        }

        return methods;

    }

    function buildXmlParameters(paramsList) {

        var params = "",
            cleanLongParamTypes = function(paramVal){

                return cleanTypeExpressions(paramVal)
                        .replace(/,/g, '|');

            };

        if (paramsList) {

            paramsList.forEach(function(param){

                params += "\n<parameter name=\"" + param.name + '" type="' +
                        cleanLongParamTypes( getClassMethodName(param.type || 'Object') ) + '" usage="' +
                        (
                                param.optional
                            ?   "optional"
                            :   "required"
                        ) + '">' +
                        (
                            param.description
                            ? "\n<description>" + escapeXML(param.description) + '</description>'
                            : ""
                        ) +
                        "\n</parameter>";

            });

        }

        return params;

    }

    function createClassXml(classObj, namePrepend) {

        if (typeof namePrepend === "undefined") {
            namePrepend = '';
        }

        var className = (namePrepend + classObj.name),
            classNameClean  = cleanTypeExpressions( getClassMethodName(className) ),
            classXml = "\n<class type=\"" + classNameClean + '" superclass="' +
                (   classObj["extends"]
                ?   cleanTypeExpressions(getClassMethodName(classObj["extends"].join(" ")))
                :   "") +
                "\">\n<description>" + escapeXML(classObj.description || "") + '</description>';

        classList.push(classNameClean);

        // CONSTRUCTORS
        if (classObj['constructor']) {

            classXml += "\n<constructors>\n<constructor scope=\"instance\">\n<parameters>" +
                buildXmlParameters(classObj['constructor'].parameters) +
                "\n</parameters>\n<return-types>" +
                    "\n<return-type type=\"" + classNameClean + '"/>' +
                "\n</return-types>" +
                "\n</constructor>\n</constructors>";
        }

        // PROPERTIES
        if (classObj.properties) {

            classXml += "\n<properties>" +
                buildXmlProperties(classObj.properties) + "\n</properties>";

        }

        // METHODS
        if (classObj.functions) {

            classXml += "\n<methods>" + buildXmlMethods(classObj.functions) + "\n</methods>";

        }

        classXml += "\n</class>";

        return classXml;

    } //end: createClassXml()


    if (graftData.classes) {

        for(i=0,j=graftData.classes.length; i<j; i++){

            doc += createClassXml(graftData.classes[i]);

        }

    }

    if (graftData.namespaces) {

        for(i=0,j=graftData.namespaces.length; i<j; i++){

            doc += createClassXml(graftData.namespaces[i]);

        }

        if (graftData.namespaces.classes) {

            for(i=0,j=graftData.namespaces.classes.length; i<j; i++){

                doc += createClassXml(graftData.namespaces.classes[i], graftData.namespaces.name + ".");

            }

        }

    }

    if (graftData.modules) {

        graftData.modules.forEach(function(mod, i){

            if (mod.classes) {

                mod.classes.forEach(function(modClass, ii){

                    doc += createClassXml(modClass, mod.name + ".");

                });

            }

            if (mod.namespaces) {

                mod.namespaces.forEach(function(modNS, ii){

                    doc += createClassXml(modNS, mod.name + ".");

                    if (modNS.classes){

                        modNS.classes.forEach(function(modNsClass, iii){

                            doc += createClassXml(modNsClass, mod.name + "." + modNS.name + ".");

                        });

                    }

                });


            }

        });

    }

    // Add type-maps... This will make class instances also have content assist.
    if (classList.length) {

        doc += "\n<type-maps>";

    }

    for (i=0,j=classList.length; i<j; i++){

        doc += "\n<type-map source-type=\"" + classList[i] +
                '" destination-type="Function&lt;' +
                classList[i] + '&gt;" />';

    }

    if (classList.length) {

        doc += "\n</type-maps>";

    }

    doc += "\n</javascript>";

    return doc;

} //end: buildDoc


/**
    @param {TAFFY} data
    @param {object} opts
 */
exports.publish = function(data, opts) {

    var root = {},
        docs, sdocmlDocument, outputFile;

    // fs.writeFileSync(path.join( opts.destination, "publish.opts.param.txt" ), JSON.stringify(opts), 'utf8' );
    // fs.writeFileSync(path.join( opts.destination, "publish.env.txt" ), JSON.stringify(env), 'utf8' );
    //fs.writeFileSync(path.join( opts.destination, "publish.taffy.db.txt" ), JSON.stringify(docs), 'utf8' );

    data({undocumented: true}).remove();
    docs = data().get(); // <-- an array of Doclet objects

    // fs.writeFileSync(path.join( opts.destination, "publish.taffy.db.txt" ), JSON.stringify(docs), 'utf8' );
    graft(root, docs);

    // fs.writeFileSync(path.join( opts.destination, "publish.graft.data.txt" ), JSON.stringify(root), 'utf8' );

    // Define the ouput file - named the same as the destination folder
    outputFile = path.join( opts.destination, ( path.basename(opts.destination) + ".sdocml" ) );

    // Make sure the file's directory path exists
    fs.mkPath(path.dirname(outputFile));

    // Build the sdocml file and save it to disk
    sdocmlDocument = buildDoc(root);
    fs.writeFileSync(outputFile, sdocmlDocument, 'utf8');

    return;

};
