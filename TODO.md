# New Features

This document keeps list of features we want (not yet prioritized).

## Documentation

* examples of running a single tool with a local executor (we have code from the Launcher), helps with development, testing, small-scale running.  Should be part of the dockstore command line.
  * +1 
* examples of how to make workflows in CWL that bring together individual tools, and to scale up analysis using cloud orchestration systems like [Consonance](https://github.com/Consonance/)

## UI

* support for providing paths within git for Dockerfile, Dockstore.cwl, etc
  * +1 this has been requested by UCSC and would allow direct support of tools organized like https://github.com/BD2KGenomics/cgl-docker-lib or https://github.com/common-workflow-language/workflows
* support [Disqus](https://disqus.com/) or something similar to include discussion of tools inline with their pages
* unique, stable URL for each tool/version that can be used in publications (think https://www.dockstore.org/image/quay.io/briandoconnor/dockstore-tool-bamstats not https://www.dockstore.org/search/25)
* allow users to register quay.io images without associated automated builds (will need to manually point at github CWL)
  * +1 requested by UCSC to support the likes of https://quay.io/repository/ucsc_cgl/samtools 
* allow users to register CWL files with simple URLs in addition to the current github.com-based system
  * -1 CWL files should really be versioned as a minimum requirement. Also users being able to register us to hit arbitrary pages and then parsing them sounds like a security nightmare  
* allow users to register Docker image tar files with simple URLs in addition to the current Quay.io-based system
* show a sample command from parsing the CWL
* sharing links, integration with social media
* support DockerHub as a location for hosting Dockstore images
  * seems tricky, API looks completely deprecated https://docs.docker.com/engine/reference/api/docker-io_api/#docker-hub-api , private email communication with their cutomer support confirmed they are not allowing new third party applications at this time ) It feels like as an organization they're turning inward and discouraging collaboration? 
  * naive implementation would be to allow the user to manually enter in a path
* support BitBucket and other Git repositories for Dockerfiles and Dockstore.cwl
  * Bitbucket Cloud (looks relatively simple, documented API here https://confluence.atlassian.com/bitbucket/use-the-bitbucket-cloud-rest-apis-222724129.html oauth and third party applications documented here https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html )  
* support "official" repositories that are created by the author of the tool
* support for community tagging and star ratings for tools
* support for private repositories, groups, sharing settings, etc
* CWL workflow registration in addition to individual tools
* support for better browsing of tools on the site, think faceted browser like the [ICGC DCC Portal](https://dcc.icgc.org), using the tags mentioned in the previous bullet
