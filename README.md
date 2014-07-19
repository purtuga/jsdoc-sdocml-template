About
=====

A [jsdoc3](https://github.com/jsdoc3/jsdoc) template to generate Aptana [SDOCML](https://wiki.appcelerator.org/display/guides2/ScriptDoc+XML+%28SDOCML%29+2.0+Specification) files for Content Assist in the Aptana IDE.

I created this template while researching how to make content assist for JavaScript better in Eclipse and Aptana. You can find a few post on this research over at my blog - [paultavares.wordpress.com](http://paultavares.wordpress.com/).

Usage
=====

Download this repository and extract it to your local computer. Run jsdoc with the `--template` option and provide it the path to the `template` folder.

    jsdoc --template ./jsdoc-sdocml-template/template /your/project/source/folder

The output file will be created in a folder called `out` located in the same directory from where the above command was run



