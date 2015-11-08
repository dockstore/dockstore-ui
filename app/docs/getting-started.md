# Getting Started

**The goal for the Dockstore is to bring together tools in Docker containers with a standardized, programmatic method of describing how to call them.**  Coupled with registration at http://dockstore.org, this process makes it much easier to use Docker-based tools to build larger analytical systems.  A typical use case for the sciences is to create complex workflows with multiple tools to process large datasets.  Future tutorials will examine how to scale up using CWL workflows and the [Consonance](https://github.com/Consonance/) cloud orchestration system.

In this guide we will start with creating a simple Docker-based tool, sharing it through the Dockstore, and calling the container yourself to process some sample data.  

For more background information on the Dockstore project please see the [About](/docs/about) page.

## Sign Up for Accounts

Dockstore is powered by [Quay.io](http://quay.io), for storing Docker images, and [GitHub](http://github.com) for storing the build file (`Dockerfile`) and metadata descriptor file (`Dockstore.cwl`) that are used by this site.  Since the Dockstore does not store your Docker images, your Dockerfile, or your Dockstore.cwl metadata file, you are free to use all the excellent features of Quay.io and GitHub.  If you are already using these services then you will appreciate the fact that registering your Docker images on Dockstore is extremely easy and requires very little interruption to the way you work already.  For those of you that use [DockerHub](https://hub.docker.com/), an extremely popular Docker registry, we are planning on adding support in the near future.  For now, we recommend users of Dockstore sign up for both Quay.io and GitHub accounts to host their Docker images and build/metadata files respectively.  If you are already building your Docker images on DockerHub automatically it takes just minutes to setup a comparable build on Quay.io.

* [Sign up for an account on GitHub...](https://github.com)
* [Sign up for an account on Quay.io...](https://quay.io)

## Create Your Tool

Docker is a fantastic tool for creating light-weight containers to run your tools.  What this means is it gives you a fast VM-like environment for Linux where you can install dependencies, make configurations, and setup your tool exactly the way you want, as you would on a "normal" Linux host.  You can then quickly and easily share these Docker images with the world using registries like DockerHub or Quay.io (and indexed in Dockstore).  The full details on how to make new Docker images is beyond the scope of this site but the first place to look is the excellent documentation on Docker's site.  See Docker's [documentation](https://docs.docker.com/) which will walk you through installing Docker on your computer and making your own images.  The goal is to create a Dockerfile for your tool, stored in Github.  The steps, at a high level, are:

0. create a new repository on GitHub
0. create a `Dockerfile` in that repository that conforms to the guide above
0. use the Docker tools to build and test your Docker image
0. use the release process on GitHub to make distinct release tags, we like the  [HubFlow](https://datasift.github.io/gitflow/) process in our group for managing releases in git
0. setup Quay.io to automatically build your Docker image

For an example, see the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository on GitHub which we created as an example.  The [README](https://github.com/briandoconnor/dockstore-tool-bamstats/blob/develop/README.md) has more information which you may find helpful.  Here is the Dockerfile for this tool:

![Dockerfile](dockerfile.png)

Read more on the development process at [http://docs.docker.com...](https://docs.docker.com/). For information on building your Docker image on Quay.io we recommend their [tutorial](https://quay.io/tutorial/).

## Describe Your Tool

Now that you have a git repository that includes a `Dockerfile`, you have tested it, and are satisfied your tool works in Docker, the next step is to create a [CWL tool definition file](http://common-workflow-language.github.io/). This YAML file describes the inputs, outputs, and Docker image dependencies for your tool.

Again, we provide an example from the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository:

![Dockstore.cwl](cwl.png)

You can see this tool takes two inputs, a parameter to control memory usage and a BAM file (binary sequence alignment file).  It produces one output, a zip file, that contains various HTML reports that BamStats creates.

The [CWL standard](http://common-workflow-language.github.io/) is continuing to evolve and hopefully we will see new features, like support for [EDAM ontology](http://edamontology.org/page) terms, in future releases.  In the mean time the [Gitter chat](https://gitter.im/common-workflow-language/common-workflow-language) is an active community to help drive the development in positive directions and we recommend tool authors make their voices heard.

## Linking GitHub and Quay.io

The first step is to log in to the Dockstore which will link your accounts for GitHub and Quay.io along with providing you the command line tool we will use for most of the tasks in this tutorial.  Make sure you have your GitHub and Quay.io accounts established and follow the onboarding wizard:

https://www.dockstore.org/login

Your link to GitHub is established on login and you will then be prompted to link your Quay.io account.

The wizard will instruct you to setup the `dockstore` command line tool after linking your accounts.

![Link accounts](onboarding.png)

## Register Your Tool in Dockstore

Now that you have your `Dockerfile` and `Dockstore.cwl` in GitHub and have setup Quay.io to automatically build your Docker image it is time to link it to Dockstore.  

## Run Tools

## Find Other Tools

## Next Steps

You can follow this basic pattern for
