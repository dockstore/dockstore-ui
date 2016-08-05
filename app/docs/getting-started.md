# Getting Started

In this guide we will start with creating a simple Docker-based tool, sharing it through the Dockstore, and calling the container yourself to process some sample data.

## Sign Up for Accounts

Dockstore is powered by [Quay.io](https://quay.io/) and [Docker Hub](https://hub.docker.com/), for storing Docker images, and [GitHub](https://github.com/) and [Bitbucket](https://bitbucket.org/) for storing the build file (`Dockerfile`) and metadata descriptor file (`Dockstore.cwl or Dockstore.wdl`) that are used by this site.  Since the Dockstore does not permanently store your Docker images, your Dockerfile, or your Dockstore.cwl metadata file, you are free to use all the excellent features of Quay.io/Docker Hub and GitHub/Bitbucket.  If you are already using these services then you will appreciate the fact that registering your Docker images on Dockstore is extremely easy and requires very little interruption to the way you work already.  For those of you that use [Docker Hub](https://hub.docker.com/), an extremely popular Docker registry, we are planning on adding enhanced support for features in the near future.  For now, we recommend users of Dockstore sign up for both Quay.io and GitHub/Bitbucket accounts to host their Docker images and build/metadata files respectively.  Partial support for Docker Hub is available, but it requires manual entry of image and tag data on Dockstore. If you are already building your Docker images on Docker Hub automatically it takes just minutes to setup a comparable build on Quay.io.

* [Sign up for an account on GitHub...](https://github.com/) (Required for authentication.)
* [Sign up for an account on Bitbucket...](https://bitbucket.org/) (Optional)
* [Sign up for an account on Quay.io...](https://quay.io/) (Recommended)
* [Sign up for an account on Docker Hub...](https://hub.docker.com/) (Optional if you've established a quay.io account)

## Tool Development Environment 

When going through the onboarding wizard, our various dependencies were introduced. Verify that they are properly installed by opening a terminal and executing the following. You should see very similar output. If there are errors make sure you follow the setup instructions carefully:

    $> java -version
    java version "1.8.0_91"
    Java(TM) SE Runtime Environment (build 1.8.0_91-b14)
    Java HotSpot(TM) 64-Bit Server VM (build 25.91-b14, mixed mode)

    $> docker --version
    Docker version 1.11.1, build 5604cbe

    $> cwltool --version
    /usr/local/bin/cwltool 1.0.20160712154127

    $> dockstore --version
    Dockstore version 0.4-beta.5
    You are running the latest stable version...
    ...
    
In addition to the tools mentioned above you will probably want a editor capable of syntax highlighting Dockerfiles such as [Atom](https://atom.io/).

## Next Steps

Follow the [next tutorial](docs/getting-started-with-docker) to start creating your tool.
