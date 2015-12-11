# Getting Started

**The goal for the Dockstore is to bring together tools in Docker containers with a standardized, programmatic method of describing how to call them.**  Coupled with registration at https://www.dockstore.org/, this process makes it much easier to use Docker-based tools to build larger analytical systems.  A typical use case for the sciences is to create complex workflows with multiple tools to process large datasets.  Future tutorials will examine how to scale up using CWL workflows and the [Consonance](https://github.com/Consonance/) cloud orchestration system.

In this guide we will start with creating a simple Docker-based tool, sharing it through the Dockstore, and calling the container yourself to process some sample data.

For more background information on the Dockstore project please see the [About](/docs/about) page.

## Sign Up for Accounts

Dockstore is powered by [Quay.io](https://quay.io/) and [Docker Hub](https://hub.docker.com/), for storing Docker images, and [GitHub](https://github.com/) and [Bitbucket](https://bitbucket.org/) for storing the build file (`Dockerfile`) and metadata descriptor file (`Dockstore.cwl`) that are used by this site.  Since the Dockstore does not store your Docker images, your Dockerfile, or your Dockstore.cwl metadata file, you are free to use all the excellent features of Quay.io/Docker Hub and GitHub/Bitbucket.  If you are already using these services then you will appreciate the fact that registering your Docker images on Dockstore is extremely easy and requires very little interruption to the way you work already.  For those of you that use [Docker Hub](https://hub.docker.com/), an extremely popular Docker registry, we are planning on adding enhanced support for features in the near future.  For now, we recommend users of Dockstore sign up for both Quay.io and GitHub/Bitbucket accounts to host their Docker images and build/metadata files respectively.  Partial support for Docker Hub is available, but it requires manual entry of image and tag data on Dockstore. If you are already building your Docker images on Docker Hub automatically it takes just minutes to setup a comparable build on Quay.io.

* [Sign up for an account on GitHub...](https://github.com/) (Required for authentication.)
* [Sign up for an account on Bitbucket...](https://bitbucket.org/)
* [Sign up for an account on Quay.io...](https://quay.io/)
* [Sign up for an account on Docker Hub...](https://hub.docker.com/)

## Create Your Tool

Docker is a fantastic tool for creating light-weight containers to run your tools.  What this means is it gives you a fast VM-like environment for Linux where you can automatically install dependencies, make configurations, and setup your tool exactly the way you want, as you would on a "normal" Linux host.  You can then quickly and easily share these Docker images with the world using registries like Docker Hub and Quay.io (indexed by Dockstore).  The full details on how to make new Docker images is beyond the scope of this site but the first place to look is in the excellent documentation on Docker's site.  See Docker's [documentation](https://docs.docker.com/), which will walk you through installing Docker on your computer and making your own images.  The goal is to create a Dockerfile for your tool, stored in a supported Git repository.  The steps, at a high level, are:

0. create a new repository on GitHub or Bitbucket
0. create a `Dockerfile` in that repository that conforms to that described in the guide above
0. use the Docker tools to build and test your Docker image
0. use the release process on GitHub or Bitbucket to make distinct release tags, we like the  [HubFlow](https://datasift.github.io/gitflow/) process in our group for managing releases in git
0. setup Quay.io to automatically build your Docker image or manually register public images if you are using Docker Hub

For an example, see the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository on GitHub which we created as an example.  The [README](https://github.com/briandoconnor/dockstore-tool-bamstats/blob/develop/README.md) has more information which you may find helpful.  Here is the Dockerfile for this tool:

![Dockerfile](docs/dockerfile.png)

Read more on the development process at [https://docs.docker.com...](https://docs.docker.com/). For information on building your Docker image on Quay.io we recommend their [tutorial](https://quay.io/tutorial/).

## Describe Your Tool

Now that you have a git repository that includes a `Dockerfile`, you have tested it, and are satisfied that your tool works in Docker, the next step is to create a [CWL tool definition file](http://common-workflow-language.github.io/). This YAML file describes the inputs, outputs, and Docker image dependencies for your tool.

It is recommended that you have the following minimum fields:

    description: <description>
    id: <id>
    label: <label>
    
    dct:creator:
      foaf:name: <name>

Again, we provide an example from the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository:

![Dockstore.cwl](docs/cwl.png)

You can see this tool takes two inputs, a parameter to control memory usage and a BAM file (binary sequence alignment file).  It produces one output, a zip file, that contains various HTML reports that BamStats creates.

The [CWL standard](http://common-workflow-language.github.io/) is continuing to evolve and hopefully we will see new features, like support for [EDAM ontology](http://edamontology.org/page) terms, in future releases.  In the mean time the [Gitter chat](https://gitter.im/common-workflow-language/common-workflow-language) is an active community to help drive the development in positive directions and we recommend tool authors make their voices heard.

## Linking GitHub, Bitbucket and Quay.io

The first step is to log in to the Dockstore which will link your accounts for GitHub, Bitbucket and Quay.io along with providing you the command line tool we will use for most of the tasks in this tutorial.  Make sure you have your GitHub, Bitbucket and/or Quay.io accounts established and follow the onboarding wizard:

https://www.dockstore.org/login

Your link to GitHub is established on login and you will then be prompted to link your other accounts.

![Link accounts](docs/linking1.png)

Linking a supported image repository service (e.g. Quay.io) will automatically trigger a synchronization order to retrieve information about the account's containers

![Refresh containers](docs/linking2.png)

Below, GitHub, BitBucket and Quay.io accounts have been linked, it is necessary for at least the GitHub account be linked in order to perform regular account activities.

![Link accounts completed](docs/linking3.png)

Next, the wizard will instruct you to setup the `dockstore` command line tool after linking your accounts, and upon completetion you will be ready to use Dockstore.

![Link accounts](docs/linking4.png)

## Register Your Tool in Dockstore

Now that you have your `Dockerfile` and `Dockstore.cwl` in GitHub, have setup Quay.io to automatically build your Docker image, and have linked your accounts to Dockstore, it is time to register your tool.

### Web UI Client

In the authenticated Web UI, navigate to 'My Containers' to begin managing Docker images imported through your linked account(s).

![My Containers](docs/register_ui.png)

The left side menu is a list of all image repositories associated with the user, grouped lexicographically by namespace. Words encapsulated in parentheses denotes the toolname. Detailed information and links for each container is located on the 'Info' tab. The 'Labels' tab allows editing of keywords to be associated with a container for efficient searching and grouping. Settings such as the path to the Dockerfile and CWL Descriptor can be modified on a per-tag basis in the 'Versions' tab. The Dockerfile and CWL Descriptor may be viewed in the last two tabs, by the Version tag (corresponding to a Git tag/branch).

A container is not visible on the public 'Containers' listing unless it is published. To publish a container, press the yellow 'Register' button in the top-right corner.

#### Manual Registration of Containers

In certain cases, it is not possible for Dockstore to perquisition every existing container, especially those with unusual project structures. Most notably, Docker Hub images can not be automatically detected by Dockstore. For those images, it is necessary to manually register their details to Dockstore.

Containers can be registered manually from the 'My Containers' page by pressing the 'Add Container' button at the bottom of the right side bar, or any of the '+' buttons in each accordion namespace group. A modal will appear as below:

![Register Container Manual](docs/register_container_manual.png)

The Source Code Repository and Image Registry fields must be filled out, they are in the format `namespace/name` (the two paths may differ). The Dockerfile Path and CWL Descriptor Paths are relative to the root of the Source Code Repository (and must begin with '/'), these will be the default locations to find their corresponding files, unless specified otherwise in the tags. The toolname is an optional 'suffix' appended to the Dockstore path, it allows for two repositories to share the same Git and Image Registry paths; the image registry path and the toolname uniquely distinguishes image repositories in Dockstore.

Upon successful submission and registration of the container, a resynchronization call will be made to fetch all available data from the given sources.

The user will then be taken to the 'Versions' tab of the new container, where tags (corresponding to GitHub/Bitbucket tag names) may be added.

![Versions Grid](docs/version_tags.png)

Press the 'Add Tag' button to begin creating tags for the different versions of the image. The tag creation modal will appear:

![Edit Version Tag Dialogue](docs/tageditor_modal.png)

The fields in the form should correspond to the actual values on GitHub/Bitbucket and Quay.io/Docker Hub in order for the information to be useful to other users. Selecting `Hidden` will prevent the tag from appearing in the public listing of tags for the image.

### CLI Client

The `dockstore` command line has several options.  We recommend you first `dockstore refresh` to ensure the latest GitHub, Bitbucket and Quay.io information is indexed properly.

![command](docs/cmd1_xliu.png)

You can then use `dockstore publish` to see the list of available Docker images you can register with Dockstore. This is for you to publish containers that are auto-detected from Quay.io. The key is that Docker images you wish to register have the following qualities:

0. public
0. at least one valid tag. In order to be valid, a tag has to:
    * be automated from a GitHub or Bitbucket reference
    * have the reference be linked to the `Dockerfile`
    * have the reference be linked a corresponding `Dockstore.cwl`

![command](docs/cmd2.png)

You can see in the above, the tool (identified with `quay.io/briandoconnor/dockstore-tool-bamstats` in Dockstore and Quay.io) was successfully registered and can be seen by anyone on the Dockstore site.

The `dockstore manual_publish` command can be used to manually register a container on Docker Hub. Its usage is outlined in the publish_manual help menu.

![command](docs/cmd3_xliu.png)

## Run Tools

Now that you have a tool registered on Dockstore you may want to call it yourself for your own work. We created the [Launcher](https://github.com/CancerCollaboratory/dockstore-descriptor#dockstore-descriptor) to aid in this process.  In the near future this will be rolled into the `dockstore` command line but for now you can use the Launcher to do several useful things:

0. read a JSON file that describes all the inputs and outputs for a given run of the tool
0. automatically copy inputs from remote URLs if HTTP, FTP, S3 or other remote URLs are specified
0. call the `cwltool` command line to execute your tool using the CWL from the Dockstore and the JSON for inputs/outputs
0. if outputs are specified as remote URLs, copy the results to these locations

Alternatively, you have the option of simply working with any tools that understand CWL. The `dockstore` command line has a simple way to download the CWL file for use with other tools.

## Find Other Tools

You can find tools on the Dockstore website or also through the `dockstore search` command line option.

## Next Steps

You can follow this basic pattern for each of your Docker-based tools.  Once registered, you can send links to your tools on Dockstore to colleagues and use it as a public platform for sharing your tools.  You can also use it in your own work by executing tools using the [Launcher](https://github.com/CancerCollaboratory/dockstore-descriptor#dockstore-descriptor) above.  If you want to scale up analysis with these tools you can use cloud orchestration frameworks like [Consonance](https://github.com/Consonance/) to run many tools in parallel in cloud environments.
