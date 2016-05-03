# Workflows

This tutorial walks through the process of registering and sharing more complex workflows which are comprised of multiple tools (registered or not).

## Create Your Workflow

The combination of light-weight Docker containers to run your tools and programmatic descriptors takes us part of the way there. 
However, the next step is to chain together these containers in order to call tools in a particular sequence or in a particular patterm in order to create larger workflows. 
Dockstore provides a few simple tools to share workflows, similar to how Dockstore shares command-line tools. 

The steps to accomplish this task, at a high level, are:

0. create a new repository on GitHub or Bitbucket
0. describe your workflow as either a [CWL workflow](http://www.commonwl.org/draft-3/Workflow.html) or a [WDL workflow](https://github.com/broadinstitute/wdl/blob/develop/SPEC.md#workflow-definition)
0. test your workflow using an environment that supports full CWL workflows or WDL
0. use the release process on GitHub or Bitbucket to make distinct release tags, we like the  [HubFlow](https://datasift.github.io/gitflow/) process in our group for managing releases in git
0. create an entry on Dockstore and then publish it

<!-- insert a good example here -->

## Create Workflow Stubs from GitHub and Bitbucket

The first step is to create a CWL or WDL workflow descriptor for your workflow and then check it into GitHub or Bitbucket in a repo, we recommend the filename `Dockstore.cwl` at the root of your repository for simplicity but anything else with a consistent extension should work as well. 

<!-- this following markdown link/anchor does not seem to work properly -->

The second step is to log in to the Dockstore. Make sure that you properly [link bitbucket](docs/getting-started#Linking-services) to your account if you are using workflows hosted on bitbucket. After successfully linking your GitHub and Bitbucket credentials (if applicable), you will be able to refresh your account on dockstore and list your available repos on GitHub and Bitbucket. 

![My Workflows](docs/workflow_ui.png)

The above image shows the general structure of the UI that you should see after visiting "My Workflows." You can hit "Refresh All Workflows" in order to update information on published workflows or create new stubs for repos that you are about to publish. Workflows are a bit different from tools in that we create a stub entry for all your GitHub repos (and bitbucket repos). You can then promote these to full entries by publishing and editing them. It is only at this point that the Dockstore will reach out and populate information such as available tags and source files. Workflows are handled differently from Tools in this regard since users may often have many more tags and repos on GitHub than Docker images on Quay.io. 

## Register Your Workflow in Dockstore

Now that you have linked your credentials and refreshed, there should be one stub per repo that you are the owner of or have rights to see in GitHub.   

### Quick Registration via the Web UI 

In the authenticated Web UI, navigate to 'My Workflows' to begin managing workflows imported through your linked account(s). These pages will allow you to quickly register workflows that follow a particularly simple format (look below to manual registration for more complex formats). For quick registration, we look through your GitHub and Bitbucket accounts and create a stub for each one. You can publish each repo that you identify as a real workflow in order to get additional information such as available versions.  

![My Containers](docs/register_ui.png)

The left side menu is a list of all image repositories associated with the user, grouped lexicographically by namespace. Words encapsulated in parentheses denotes the toolname. Detailed information and links for each container is located on the 'Info' tab. The 'Labels' tab allows editing of keywords to be associated with a container for efficient searching and grouping. Settings such as the path to the Dockerfile and CWL Descriptor can be modified on a per-tag basis in the 'Versions' tab. The Dockerfile and CWL Descriptor may be viewed in the last two tabs, by the Version tag (corresponding to a Git tag/branch).

A container is not visible on the public 'Containers' listing unless it is published. To publish a container, press the yellow 'Register' button in the top-right corner.

#### Manual Registration of Workflows

In certain cases, it is not possible for Dockstore to perquisition every existing container, especially those with unusual project structures. Most notably, Docker Hub images can not be automatically detected by Dockstore. The second possibility is that you have multiple CWL documents in a GitHub repository associated with multiple images. For those cases, it is necessary to manually register their details to Dockstore.

Containers can be registered manually from the 'My Containers' page by pressing the 'Add Container' button at the bottom of the right side bar, or any of the '+' buttons in each accordion namespace group. A modal will appear as below:

![Register Container Manual](docs/register_container_manual.png)

The Source Code Repository and Image Registry fields must be filled out, they are in the format `namespace/name` (the two paths may differ). The Dockerfile Path and CWL Descriptor Paths are relative to the root of the Source Code Repository (and must begin with '/'), these will be the default locations to find their corresponding files, unless specified otherwise in the tags. The toolname is an optional 'suffix' appended to the Dockstore path, it allows for two repositories to share the same Git and Image Registry paths; the image registry path and the toolname uniquely distinguishes image repositories in Dockstore.

Upon successful submission and registration of the container, a resynchronization call will be made to fetch all available data from the given sources. If the image registry is Quay.io, existing version tags will be prepopulated for the Dockstore record.

The user will then be taken to the 'Versions' tab of the new container, where tags (corresponding to GitHub/Bitbucket tag names) may be added.

![Versions Grid](docs/version_tags.png)

Press the 'Add Tag' button to begin creating tags for the different versions of the image. The tag creation modal will appear:

![Edit Version Tag Dialogue](docs/tageditor_modal.png)

The fields in the form should correspond to the actual values on GitHub/Bitbucket and Quay.io/Docker Hub in order for the information to be useful to other users. Selecting `Hidden` will prevent the tag from appearing in the public listing of tags for the image.

### CLI Client

The `dockstore` command line has several options. When working with workflows, use `dockstore workflow` to get a full list of options. We recommend you first use `dockstore workflow refresh` to ensure the latest GitHub, Bitbucket and Quay.io information is indexed properly.

You can then use `dockstore publish` to see the list of available workflows you can register with Dockstore and then register them. This is for you to publish workflows with the simplest structure. For now, use manual registration if your workflow has a different structure. The key is that workflows you wish to (simply) publish have the following qualities:

0. public
0. at least one valid tag. In order to be valid, a tag has to:
    * have the reference be linked a corresponding `Dockstore.cwl` or `Dockstore.wdl` hosted at the root of the repository 

The `dockstore manual_publish` command can be used to manually register a workflow on Docker Hub. Its usage is outlined in the publish_manual help menu. This will allow you to register entries that do not follow the qualities above (non-automated builds and Docker Hub images). 

## Find Other Workflows

You can find tools on the Dockstore website or also through the `dockstore workflow search` command line option.

## Next Steps

Find out how to launch your tools and workflows at [Launching Tools and Workflows](/docs/launch).
