# New Features

This document keeps list of features we want (not yet prioritized).

## Documentation

* examples of running a single tool with a local executor (we have code from the Launcher), helps with development, testing, small-scale running.  Should be part of the dockstore command line.
* examples of how to make workflows in CWL that bring together individual tools, and to scale up analysis using cloud orchestration systems like [Consonance](https://github.com/Consonance/)

## UI

* support [Disqus](https://disqus.com/) or something similar to include discussion of tools inline with their pages
* unique, stable URL for each tool/version that can be used in publications (think https://www.dockstore.org/image/quay.io/briandoconnor/dockstore-tool-bamstats not https://www.dockstore.org/search/25)
* allow users to register CWL and Docker image tar files with simple URLs in addition to the current Quay.io-based system
* show a sample command from parsing the CWL
* sharing links, integration with social media
* support DockerHub as a location for hosting Dockstore images
* support BitBucket and other Git repositories for Dockerfiles and Dockstore.cwl
* support "official" repositories that are created by the author of the tool
* support for providing paths within git for Dockerfile, Dockstore.cwl, etc
* support for community tagging and star ratings for tools
* support for private repositories, groups, sharing settings, etc
* CWL workflow registration in addition to individual tools
* support for better browsing of tools on the site, think faceted browser like the [ICGC DCC Portal](https://dcc.icgc.org), using the tags mentioned in the previous bullet


