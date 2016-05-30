# Getting Started

In this guide we will start with creating a simple Docker-based tool, sharing it through the Dockstore, and calling the container yourself to process some sample data.

## Sign Up for Accounts

Dockstore is powered by [Quay.io](https://quay.io/) and [Docker Hub](https://hub.docker.com/), for storing Docker images, and [GitHub](https://github.com/) and [Bitbucket](https://bitbucket.org/) for storing the build file (`Dockerfile`) and metadata descriptor file (`Dockstore.cwl or Dockstore.wdl`) that are used by this site.  Since the Dockstore does not permanently store your Docker images, your Dockerfile, or your Dockstore.cwl metadata file, you are free to use all the excellent features of Quay.io/Docker Hub and GitHub/Bitbucket.  If you are already using these services then you will appreciate the fact that registering your Docker images on Dockstore is extremely easy and requires very little interruption to the way you work already.  For those of you that use [Docker Hub](https://hub.docker.com/), an extremely popular Docker registry, we are planning on adding enhanced support for features in the near future.  For now, we recommend users of Dockstore sign up for both Quay.io and GitHub/Bitbucket accounts to host their Docker images and build/metadata files respectively.  Partial support for Docker Hub is available, but it requires manual entry of image and tag data on Dockstore. If you are already building your Docker images on Docker Hub automatically it takes just minutes to setup a comparable build on Quay.io.

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

It is also possible to describe tools via the [WDL language](https://github.com/broadinstitute/wdl). A tool can either be described in WDL-only or can be described with both WDL and CWL.   

A tool can also be described as a one task WDL workflow.

We provide a hello world example as follows:

    task hello {
      String name
    
      command {
        echo 'hello ${name}!'
      }
      output {
        File response = stdout()
      }
    }
    
    workflow test {
      call hello
    }

We are currently monitoring WDL to see how metadata like that provided for CWL will be integrated into WDL.

## [Linking GitHub, Bitbucket and Quay.io](#Linking-services)

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

### Quick Registration via the Web UI 

In the authenticated Web UI, navigate to 'My Containers' to begin managing Docker images imported through your linked account(s). These pages will allow you to quickly register containers that follow a particularly simple format (look below to manual registration for more complex formats). For quick registration, we look through your quay.io images and see if any are setup as [automated builds](https://docs.quay.io/guides/building.html). Using those to track back to your github or bitbucket accounts, we list all pairs of Docker images with git repositories that contain a `Dockstore.cwl` and a `Dockerfile`. When we discover both of these, we create an unregistered entry in the interface below. 

![My Containers](docs/register_ui.png)

The left side menu is a list of all image repositories associated with the user, grouped lexicographically by namespace. Words encapsulated in parentheses denotes the toolname. Detailed information and links for each container is located on the 'Info' tab. The 'Labels' tab allows editing of keywords to be associated with a container for efficient searching and grouping. Settings such as the path to the Dockerfile and CWL Descriptor can be modified on a per-tag basis in the 'Versions' tab. The Dockerfile and CWL/WDL Descriptor may be viewed in the last two tabs, by the Version tag (corresponding to a Git tag/branch).

A container is not visible on the public 'Containers' listing unless it is published. To publish a container, press the yellow 'Register' button in the top-right corner.

#### Manual Registration of Containers

In certain cases, it is not possible for Dockstore to register every existing container, especially those with unusual project structures. Most notably, Docker Hub images can not be automatically detected by Dockstore. The second possibility is that you have multiple CWL documents in a GitHub repository associated with multiple images. For those cases, it is necessary to manually register their details to Dockstore.

Containers can be registered manually from the 'My Containers' page by pressing the 'Add Container' button at the bottom of the right side bar, or any of the '+' buttons in each accordion namespace group. A modal will appear as below:

![Register Container Manual](docs/register_container_manual.png)

The Source Code Repository and Image Registry fields must be filled out, they are in the format `namespace/name` (the two paths may differ). The Dockerfile Path and CWL/WDL Descriptor Paths are relative to the root of the Source Code Repository (and must begin with '/'), these will be the default locations to find their corresponding files, unless specified otherwise in the tags. The toolname is an optional 'suffix' appended to the Dockstore path, it allows for two repositories to share the same Git and Image Registry paths; the image registry path and the toolname uniquely distinguishes image repositories in Dockstore.

Upon successful submission and registration of the container, a resynchronization call will be made to fetch all available data from the given sources. If the image registry is Quay.io, existing version tags will be prepopulated for the Dockstore record.

The user will then be taken to the 'Versions' tab of the new container, where tags (corresponding to GitHub/Bitbucket tag names) may be added.

![Versions Grid](docs/version_tags.png)

Press the 'Add Tag' button to begin creating tags for the different versions of the image. The tag creation modal will appear:

![Edit Version Tag Dialogue](docs/tageditor_modal.png)

The fields in the form should correspond to the actual values on GitHub/Bitbucket and Quay.io/Docker Hub in order for the information to be useful to other users. Selecting `Hidden` will prevent the tag from appearing in the public listing of tags for the image.

### CLI Client

The `dockstore` command line has a couple modes.

    $ dockstore
    
    HELP FOR DOCKSTORE
    ------------------
    See https://www.dockstore.org for more information
    
    Usage: dockstore [mode] [flags] [command] [command parameters]
    
    Modes:
       tool                Puts dockstore into tool mode.
       workflow            Puts dockstore into workflow mode.
    
    ------------------
    
    Flags:
      --help               Print help information
                           Default: false
      --debug              Print debugging information
                           Default: false
      --version            Print dockstore's version
                           Default: false
      --server-metadata    Print metdata describing the dockstore webservice
                           Default: false
      --upgrade            Upgrades to the latest stable release of Dockstore
                           Default: false
      --config <file>      Override config file
                           Default: ~/.dockstore/config
      --script             Will not check Github for newer versions of Dockstore
                           Default: false
    
    ------------------
 
First, we will work in tool mode (`dockstore tool`). We recommend you first `dockstore tool refresh` to ensure the latest GitHub, Bitbucket and Quay.io information is indexed properly.
 
    $ dockstore
    
    HELP FOR DOCKSTORE
    ------------------
    See https://www.dockstore.org for more information
    
    Usage: dockstore tool [flags] [command] [command parameters]
    
    Commands:
    
      list             :  lists all the Tools published by the user
    
      search           :  allows a user to search for all published Tools that match the criteria
    
      publish          :  publish/unpublish a Tool in the dockstore
    
      info             :  print detailed information about a particular published Tool
    
      cwl              :  returns the Common Workflow Language Tool definition for this entry
                          which enables integration with Global Alliance compliant systems
    
      wdl              :  returns the Workflow Descriptor Langauge definition for this Docker image.
    
      refresh          :  updates your list of Tools stored on Dockstore or an individual Tool
    
      label            :  updates labels for an individual Tool
    
      convert          :  utilities that allow you to convert file types
    
      launch           :  launch Tools (locally)
    
      version_tag      :  updates version tags for an individual tool
    
      update_tool      :  updates certain fields of a tool
    
      manual_publish   :  registers a Docker Hub (or manual Quay) tool in the dockstore and then attempt to publish
    
    ------------------
    
    Flags:
      --help               Print help information
                           Default: false
      --debug              Print debugging information
                           Default: false
      --version            Print dockstore's version
                           Default: false
      --server-metadata    Print metdata describing the dockstore webservice
                           Default: false
      --upgrade            Upgrades to the latest stable release of Dockstore
                           Default: false
      --config <file>      Override config file
                           Default: ~/.dockstore/config
      --script             Will not check Github for newer versions of Dockstore
                           Default: false
    
    ------------------


You can then use `dockstore tool publish` to see the list of available Docker images you can register with Dockstore. This is for you to publish containers that are auto-detected from Quay.io. The key is that Docker images you wish to (quick) publish have the following qualities:

0. public
0. at least one valid tag. In order to be valid, a tag has to:
    * be automated from a GitHub or Bitbucket reference
    * have the reference be linked to the `Dockerfile`
    * have the reference be linked a corresponding `Dockstore.cwl`
    
```
    $ dockstore tool publish
    YOUR AVAILABLE CONTAINERS
    ------------------
            NAME                                                         DESCRIPTION                                          Git Repo                                                                   On Dockstore?   Descriptor      Automated   
            quay.io/cancercollaboratory/dockstore-tool-samtools-index    Prints alignments in the specified input alignm...   git@github.com:CancerCollaboratory/dockstore-tool-samtools-index.git       No              
            Yes             Yes       
            quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup    Remove potential PCR duplicates: if multiple re...   git@github.com:CancerCollaboratory/dockstore-tool-samtools-rmdup.git       No              
            Yes             Yes       
            quay.io/cancercollaboratory/dockstore-tool-samtools-sort     Sort alignments by leftmost coordinates, or by ...   git@github.com:CancerCollaboratory/dockstore-tool-samtools-sort.git        No              
            Yes             Yes       
            quay.io/cancercollaboratory/dockstore-tool-samtools-view     Prints alignments in the specified input alignm...   git@github.com:CancerCollaboratory/dockstore-tool-samtools-view.git        No              
            Yes             Yes       
            quay.io/cancercollaboratory/dockstore-tool-snpeff            Annotates and predicts the effects of variants ...   git@github.com:CancerCollaboratory/dockstore-tool-snpeff.git               No              
            Yes             Yes       
    $ dockstore tool publish --entry quay.io/cancercollaboratory/dockstore-tool-snpeff
    Successfully published  quay.io/cancercollaboratory/dockstore-tool-snpeff
```

You can see in the above, the tool (identified with `quay.io/cancercollaboratory/dockstore-tool-snpeff` in Dockstore and Quay.io) was successfully registered and can be seen by anyone on the Dockstore site.

The `dockstore tool manual_publish` command can be used to manually register a container on Docker Hub. Its usage is outlined in the publish_manual help menu. This will allow you to register entries that do not follow the qualities above (non-automated builds and Docker Hub images). 

    $ dockstore tool manual_publish
    
    HELP FOR DOCKSTORE
    ------------------
    See https://www.dockstore.org for more information
    
    Usage: dockstore tool manual_publish --help
           dockstore tool manual_publish [parameters]
    
    Description:
      Manually register an tool in the dockstore. Currently this is used to register entries for images on Docker Hub.
    
    Required parameters:
      --name <name>                Name for the docker container
      --namespace <namespace>      Organization for the docker container
      --git-url <url>              Reference to the git repo holding descriptor(s) and Dockerfile ex: "git@github.com:user/test1.git"
      --git-reference <reference>  Reference to git branch or tag where the CWL and Dockerfile is checked-in
    
    Optional parameters:
      --dockerfile-path <file>     Path for the dockerfile, defaults to /Dockerfile
      --cwl-path <file>            Path for the CWL document, defaults to /Dockstore.cwl
      --wdl-path <file>            Path for the WDL document, defaults to /Dockstore.wdl
      --toolname <toolname>        Name of the tool, can be omitted, defaults to null
      --registry <registry>        Docker registry, can be omitted, defaults to registry.hub.docker.com
      --version-name <version>     Version tag name for Dockerhub containers only, defaults to latest
    
    ------------------

## Find Other Tools

You can find tools on the Dockstore website or also through the `dockstore tool search` command line option.

## Next Steps

You can follow this basic pattern for each of your Docker-based tools.  Once registered, you can send links to your tools on Dockstore to colleagues and use it as a public platform for sharing your tools.  

Read up on background information on the Dockstore project at [About](/docs/about) page.
